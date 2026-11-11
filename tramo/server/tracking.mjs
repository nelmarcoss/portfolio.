const endpoint = "https://api.aftership.com/tracking/2026-07";
export const carrierCodes = [
  "correos",
  "correos-express",
  "seur",
  "mrw",
  "dhl",
  "ups",
  "gls",
  "fedex",
];
export const labels = {
  pending: "Pendiente",
  transit: "En camino",
  delivery: "En reparto",
  delivered: "Entregado",
  exception: "Incidencia",
};
export class PublicError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export function validateTracking(number, carrier) {
  if (typeof number !== "string" || !/^[a-zA-Z0-9-]{5,80}$/.test(number))
    throw new PublicError(
      "Revisa el número de seguimiento. Usa entre 5 y 80 letras, números o guiones.",
    );
  if (carrier !== "auto" && !carrierCodes.includes(carrier))
    throw new PublicError("Selecciona una compañía compatible.");
}
function dateLabel(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value).slice(0, 70)
    : date.toLocaleString("es-ES", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Madrid",
      });
}
export function normalizeTracking(t, carrier) {
  const status =
    {
      Pending: "pending",
      InfoReceived: "pending",
      InTransit: "transit",
      OutForDelivery: "delivery",
      AvailableForPickup: "delivery",
      Delivered: "delivered",
      AttemptFail: "exception",
      Exception: "exception",
      Expired: "exception",
    }[t.tag] || "pending";
  const checkpoints = [...(t.checkpoints || [])].sort(
    (a, b) => new Date(a.checkpoint_time) - new Date(b.checkpoint_time),
  );
  const eta =
    t.latest_estimated_delivery?.datetime ||
    t.courier_estimated_delivery_date?.estimated_delivery_date ||
    t.aftership_estimated_delivery_date?.estimated_delivery_date;
  const route = checkpoints
    .filter(
      (c) =>
        Number.isFinite(c.coordinate?.latitude) &&
        Number.isFinite(c.coordinate?.longitude) &&
        Math.abs(c.coordinate.latitude) <= 90 &&
        Math.abs(c.coordinate.longitude) <= 180,
    )
    .map((c) => ({
      name: c.city || c.location || "Ubicación del transportista",
      lat: c.coordinate.latitude,
      lng: c.coordinate.longitude,
    }))
    .filter((p, i, a) => !i || p.lat !== a[i - 1].lat || p.lng !== a[i - 1].lng)
    .slice(-20);
  return {
    tracking_number: t.tracking_number,
    carrier: carrier === "auto" ? t.slug : carrier,
    status,
    eta: eta ? dateLabel(eta) : null,
    events: checkpoints
      .slice(-50)
      .reverse()
      .map((c) => ({
        date: dateLabel(c.checkpoint_time),
        title: String(c.message || c.subtag_message || labels[status]).slice(
          0,
          300,
        ),
        location: String(c.location || c.city || "").slice(0, 150),
      })),
    route,
    updated_at: new Date().toISOString(),
  };
}
async function provider(path, options = {}) {
  const { timeoutMs, ...fetchOptions } = options;
  const r = await fetch(endpoint + path, {
    ...fetchOptions,
    headers: {
      "as-api-key": process.env.TRAMO_AFTERSHIP_API_KEY,
      "Content-Type": "application/json",
    },
    signal: options.signal
      ? AbortSignal.any([
          options.signal,
          AbortSignal.timeout(options.timeoutMs || 12000),
        ])
      : AbortSignal.timeout(options.timeoutMs || 12000),
  });
  let data;
  try {
    data = await r.json();
  } catch {
    throw new PublicError("El transportista no responde en este momento.", 502);
  }
  if (!r.ok || data.meta?.code >= 400)
    throw new PublicError(
      r.status === 429
        ? "El servicio está ocupado. Vuelve a intentarlo en unos minutos."
        : "No se ha encontrado información. Revisa el código y la compañía.",
      r.status === 429 ? 429 : 422,
    );
  return data.data;
}
export async function lookup(number, carrier, options = {}) {
  validateTracking(number, carrier);
  if (!process.env.TRAMO_AFTERSHIP_API_KEY)
    throw new PublicError(
      "El seguimiento real está en preparación. Puedes explorar la demo o guardar tus paquetes.",
      503,
    );
  const query = new URLSearchParams({
    tracking_numbers: number,
    ...(carrier !== "auto" ? { slug: carrier } : {}),
  });
  const existing = await provider("/trackings?" + query, options);
  let t = existing.trackings?.find(
    (t) =>
      t.tracking_number === number &&
      (carrier === "auto" || t.slug === carrier),
  );
  if (!t)
    t = await provider("/trackings", {
      ...options,
      method: "POST",
      body: JSON.stringify({
        tracking_number: number,
        ...(carrier !== "auto" ? { slug: carrier } : {}),
        language: "es",
      }),
    });
  return normalizeTracking(t, carrier);
}
export function safeSubscription(s) {
  if (
    !s ||
    typeof s.endpoint !== "string" ||
    s.endpoint.length > 2048 ||
    typeof s.keys?.p256dh !== "string" ||
    typeof s.keys?.auth !== "string" ||
    s.keys.p256dh.length > 256 ||
    s.keys.auth.length > 256
  )
    return false;
  try {
    const u = new URL(s.endpoint);
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      (!u.port || u.port === "443") &&
      [
        "fcm.googleapis.com",
        "updates.push.services.mozilla.com",
        "web.push.apple.com",
        "wns.windows.com",
        "notify.windows.com",
      ].some((h) => u.hostname === h || u.hostname.endsWith("." + h))
    );
  } catch {
    return false;
  }
}
