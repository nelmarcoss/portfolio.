import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "../../tramo/src/config.js";
import {
  lookup,
  PublicError,
  safeSubscription,
} from "../../tramo/server/tracking.mjs";
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export default async function handler(req) {
  try {
    const action = new URL(req.url).pathname.split("/").at(-1);
    if (action === "capabilities" && req.method === "GET")
      return json({
        tracking: !!process.env.TRAMO_AFTERSHIP_API_KEY,
        email: !!(
          process.env.TRAMO_RESEND_API_KEY &&
          process.env.TRAMO_MAIL_FROM &&
          process.env.TRAMO_SUPABASE_SECRET_KEY
        ),
        push: !!(
          process.env.TRAMO_VAPID_PUBLIC_KEY &&
          process.env.TRAMO_VAPID_PRIVATE_KEY &&
          process.env.TRAMO_VAPID_SUBJECT &&
          process.env.TRAMO_SUPABASE_SECRET_KEY
        ),
        vapidPublicKey: process.env.TRAMO_VAPID_PUBLIC_KEY || null,
      });
    if (req.method !== "POST")
      return json({ error: "Método no permitido." }, 405);
    const origin = req.headers.get("origin");
    if (origin && origin !== new URL(req.url).origin)
      throw new PublicError("Origen no permitido.", 403);
    const text = await req.text();
    if (text.length > 10000)
      throw new PublicError("Solicitud demasiado grande.", 413);
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      throw new PublicError("Solicitud no válida.");
    }
    if (action === "lookup")
      return json(await lookup(body.tracking_number, body.carrier || "auto"));
    if (action === "push") {
      if (
        !process.env.TRAMO_SUPABASE_SECRET_KEY ||
        !process.env.TRAMO_VAPID_PRIVATE_KEY
      )
        throw new PublicError(
          "Las notificaciones web están pendientes de activación.",
          503,
        );
      const bearer = req.headers.get("authorization") || "";
      if (!bearer.startsWith("Bearer "))
        throw new PublicError("Inicia sesión para continuar.", 401);
      const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false },
      });
      const {
        data: { user },
        error,
      } = await client.auth.getUser(bearer.slice(7));
      if (error || !user) throw new PublicError("La sesión ha caducado.", 401);
      if (!safeSubscription(body.subscription))
        throw new PublicError("La suscripción de notificaciones no es válida.");
      const admin = createClient(
        SUPABASE_URL,
        process.env.TRAMO_SUPABASE_SECRET_KEY,
        { auth: { persistSession: false } },
      );
      const { data: existing, error: readError } = await admin
        .from("push_subscriptions")
        .select("user_id")
        .eq("endpoint", body.subscription.endpoint)
        .maybeSingle();
      if (readError) throw readError;
      if (existing && existing.user_id !== user.id)
        throw new PublicError(
          "Este navegador tiene una suscripción de otra cuenta. Elimínala en sus ajustes y vuelve a activarla.",
          409,
        );
      const { error: prefError } = await admin
        .from("notification_preferences")
        .upsert(
          { user_id: user.id },
          { onConflict: "user_id", ignoreDuplicates: true },
        );
      if (prefError) throw prefError;
      const { error: saveError } = await admin
        .from("push_subscriptions")
        .upsert(
          {
            user_id: user.id,
            endpoint: body.subscription.endpoint,
            subscription: body.subscription,
          },
          { onConflict: "endpoint" },
        );
      if (saveError) throw saveError;
      return json({ ok: true });
    }
    return json({ error: "Ruta no encontrada." }, 404);
  } catch (e) {
    return json(
      {
        error:
          e instanceof PublicError
            ? e.message
            : "No se ha podido completar la operación. Inténtalo de nuevo.",
      },
      e instanceof PublicError ? e.status : 500,
    );
  }
}
export const config = {
  rateLimit: {
    action: "rate_limit",
    windowLimit: 20,
    windowSize: 60,
    aggregateBy: ["ip"],
  },
};
