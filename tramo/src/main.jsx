import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Package,
  Search,
  Plus,
  ChevronRight,
  Check,
  Truck,
  MapPin,
  Bell,
  LayoutGrid,
  Settings,
  LogOut,
  X,
  Clock,
  ExternalLink,
  Mail,
  ShieldCheck,
  Route,
  Menu,
  Archive,
  Copy,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
  Box,
  CheckCheck,
} from "lucide-react";
import { db, api, result } from "./api";
import { carriers, states, demoPackages } from "./data";
import "./style.css";
const BASE = "/tramo/";
const carrierName = (c) => carriers.find((x) => x[0] === c)?.[1] || c;
const getView = () => {
  const v =
    location.pathname.replace(/^\/tramo\/?/, "").split("/")[0] || "home";
  return ["home", "demo", "app", "acceder", "recuperar"].includes(v)
    ? v
    : "home";
};
function App() {
  const [view, setView] = useState(getView),
    [session, setSession] = useState(null),
    [loaded, setLoaded] = useState(false),
    [toast, setToast] = useState(""),
    [dialog, setDialog] = useState(null),
    [lookup, setLookup] = useState(null),
    [busy, setBusy] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [items, setItems] = useState(() => {
      try {
        return JSON.parse(sessionStorage.getItem("tramo-demo")) || demoPackages;
      } catch {
        return demoPackages;
      }
    }),
    [realItems, setRealItems] = useState([]),
    [prefs, setPrefs] = useState({
      email_enabled: false,
      events: ["delivery", "delivered", "exception"],
    }),
    [demoPrefs, setDemoPrefs] = useState({
      email_enabled: true,
      events: ["delivery", "delivered", "exception"],
    }),
    [cap, setCap] = useState({ tracking: false, email: false, push: false }),
    [authMode, setAuthMode] = useState("login");
  const demo = view === "demo",
    [tab, setTab] = useState("packages"),
    [filter, setFilter] = useState("active"),
    [q, setQ] = useState(""),
    [selected, setSelected] = useState(null),
    [mobileNav, setMobileNav] = useState(false);
  const notify = (m) => {
    setToast(m);
  };
  const navigate = (v) => {
    history.pushState({}, "", BASE + (v === "home" ? "" : v));
    setView(v);
    setDialog(null);
    setLookup(null);
    setMobileNav(false);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    const pop = () => setView(getView());
    addEventListener("popstate", pop);
    db.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoaded(true);
    });
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_, s) => {
      setSession(s);
      setLoaded(true);
    });
    api("capabilities")
      .then(setCap)
      .catch(() => {});
    if ("serviceWorker" in navigator)
      navigator.serviceWorker
        .register(BASE + "sw.js", { scope: BASE })
        .catch(() => {});
    return () => {
      removeEventListener("popstate", pop);
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    document.title =
      view === "demo"
        ? "Demo — Tramo"
        : view === "app"
          ? "Mis paquetes — Tramo"
          : view === "acceder"
            ? "Tu cuenta — Tramo"
            : "Tramo — Tus paquetes, en cada tramo";
  }, [view]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 5500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    sessionStorage.setItem("tramo-demo", JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    if (view === "app" && loaded && !session) navigate("acceder");
  }, [view, loaded, session]);
  useEffect(() => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker
        .getRegistration(BASE)
        .then((r) => r?.pushManager?.getSubscription())
        .then((s) => setPushEnabled(!!s));
    if (session) {
      loadPackages();
      db.from("notification_preferences")
        .select("*")
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) notify("No se han podido cargar las preferencias.");
          else if (data) setPrefs(data);
        });
    }
  }, [session?.user.id]);
  async function loadPackages() {
    const { data, error } = await db
      .from("packages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) notify("No se han podido cargar tus paquetes.");
    else setRealItems(data || []);
  }
  const packages = demo ? items : realItems,
    preferences = demo ? demoPrefs : prefs;
  function enterAuth(mode = "login") {
    setAuthMode(mode);
    navigate("acceder");
  }
  async function searchTracking(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      code = String(f.get("tracking") || "").trim();
    if (!code) return;
    setBusy(true);
    setLookup(null);
    try {
      const p = await api("lookup", {
        tracking_number: code,
        carrier: f.get("carrier"),
      });
      setLookup(p);
    } catch (e) {
      notify(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function auth(e) {
    e.preventDefault();
    setBusy(true);
    const f = new FormData(e.currentTarget),
      email = f.get("email"),
      password = f.get("password");
    try {
      let response;
      if (authMode === "reset") {
        response = await db.auth.resetPasswordForEmail(email, {
          redirectTo: location.origin + BASE + "recuperar",
        });
        if (response.error) throw response.error;
        notify(
          "Si existe una cuenta con ese correo, recibirás las instrucciones.",
        );
        return;
      }
      if (authMode === "signup") {
        response = await db.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: location.origin + BASE + "app" },
        });
      } else {
        response = await db.auth.signInWithPassword({ email, password });
      }
      if (response.error) throw response.error;
      if (response.data.session) {
        navigate("app");
        const pending = sessionStorage.getItem("tramo-pending");
        if (pending) {
          sessionStorage.removeItem("tramo-pending");
          setDialog({ type: "add", code: pending });
        }
      } else
        notify(
          "Revisa tu correo para confirmar la cuenta y vuelve a iniciar sesión.",
        );
    } catch (e) {
      notify(
        e.message.includes("Invalid login")
          ? "Correo o contraseña incorrectos."
          : e.message,
      );
    } finally {
      setBusy(false);
    }
  }
  async function addPackage(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      code = String(f.get("tracking") || "").trim(),
      alias = String(f.get("alias") || "").trim(),
      carrier = f.get("carrier");
    setBusy(true);
    try {
      if (demo) {
        const p = {
          ...structuredClone(demoPackages[1]),
          id: crypto.randomUUID(),
          alias,
          tracking_number: code,
          carrier,
          shop: "Añadido en la demo",
        };
        setItems((old) => [p, ...old]);
        setSelected(p.id);
        notify("Paquete de ejemplo añadido. Sus eventos son ficticios.");
      } else {
        result(
          await db
            .from("packages")
            .insert({
              user_id: session.user.id,
              alias,
              carrier,
              tracking_number: code,
            }),
        );
        await loadPackages();
        notify(
          "Paquete guardado. El seguimiento se actualizará al conectar el proveedor.",
        );
      }
      setDialog(null);
    } catch (e) {
      notify(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(p) {
    try {
      if (demo) setItems((old) => old.filter((x) => x.id !== p.id));
      else {
        result(await db.from("packages").delete().eq("id", p.id));
        await loadPackages();
      }
      setSelected(null);
      setDialog(null);
      notify("Paquete eliminado.");
    } catch (e) {
      notify(e.message);
    }
  }
  async function savePrefs(next) {
    if (demo) {
      setDemoPrefs(next);
      notify("Preferencias de ejemplo guardadas. La demo no envía avisos.");
      return;
    }
    try {
      result(
        await db
          .from("notification_preferences")
          .upsert({
            user_id: session.user.id,
            email_enabled: next.email_enabled,
            events: next.events,
          }),
      );
      setPrefs(next);
      notify("Preferencias guardadas.");
    } catch (e) {
      notify(e.message);
    }
  }
  async function enablePush() {
    if (demo) {
      notify(
        "Ejemplo: recibirías avisos al cambiar el estado. La demo no solicita permisos ni envía notificaciones.",
      );
      return;
    }
    if (!cap.push) {
      notify("Las notificaciones web están pendientes de activación.");
      return;
    }
    try {
      if (!("PushManager" in window))
        throw new Error(
          "Este navegador no admite notificaciones push. En iPhone, instala Tramo en la pantalla de inicio.",
        );
      const permission = await Notification.requestPermission();
      if (permission !== "granted")
        throw new Error(
          "Puedes permitir las notificaciones desde los ajustes del navegador.",
        );
      const reg = await navigator.serviceWorker.ready;
      const bytes = Uint8Array.from(
        atob(cap.vapidPublicKey.replace(/-/g, "+").replace(/_/g, "/")),
        (c) => c.charCodeAt(0),
      );
      const sub =
        (await reg.pushManager.getSubscription()) ||
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: bytes,
        }));
      await api("push", { subscription: sub.toJSON() });
      setPushEnabled(true);
      notify("Notificaciones activadas en este dispositivo.");
    } catch (e) {
      notify(e.message);
    }
  }
  async function disablePush() {
    if (!("serviceWorker" in navigator)) return;
    try {
      const reg = await navigator.serviceWorker.getRegistration(BASE),
        sub = await reg?.pushManager.getSubscription();
      if (sub) {
        if (session)
          result(
            await db
              .from("push_subscriptions")
              .delete()
              .eq("endpoint", sub.endpoint),
          );
        await sub.unsubscribe();
      }
      setPushEnabled(false);
      notify("Notificaciones desactivadas en este dispositivo.");
    } catch (e) {
      notify(e.message);
      throw e;
    }
  }
  async function logout() {
    try {
      await disablePush();
      const { error } = await db.auth.signOut();
      if (error) throw error;
      setRealItems([]);
      navigate("home");
    } catch {
      notify("No se ha podido cerrar la sesión. Inténtalo de nuevo.");
    }
  }
  const Logo = ({ light = false }) => (
    <a
      className={"logo " + (light ? "light" : "")}
      href={BASE}
      onClick={(e) => {
        e.preventDefault();
        navigate("home");
      }}
    >
      <span className="logo-mark">
        <Route size={23} />
      </span>
      tramo<span className="logo-dot">.</span>
    </a>
  );
  const Cta = ({ children, onClick, secondary = false, ...props }) => (
    <button
      className={secondary ? "button secondary" : "button"}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
  const Status = ({ status }) => (
    <span className={"status " + status}>
      <span />
      {states[status] || "Pendiente"}
    </span>
  );
  function PackageDetail({ p, preview = false }) {
    return (
      <div className={"detail " + (preview ? "preview-detail" : "")}>
        <div className="detail-heading">
          <span className="eyebrow">
            {preview ? "ASÍ SE VE UN ENVÍO" : "DETALLE DEL ENVÍO"}
          </span>
          {!preview && (
            <button
              className="icon-button"
              aria-label="Cerrar detalle"
              onClick={() => setSelected(null)}
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="detail-title">
          <div className="package-icon">
            <Package size={25} />
          </div>
          <div>
            <h2>{p.alias}</h2>
            <p>{p.shop || carrierName(p.carrier)}</p>
          </div>
          <Status status={p.status} />
        </div>
        <div className="eta">
          <span>
            {p.status === "delivered" ? "YA ESTÁ CONTIGO" : "ENTREGA ESTIMADA"}
          </span>
          <strong>{p.eta || "Aún sin fecha estimada"}</strong>
          <small>
            {demo || preview
              ? "Datos de demostración"
              : p.updated_at
                ? "Última consulta: " +
                  new Date(p.updated_at).toLocaleString("es-ES")
                : "Esperando información del transportista"}
          </small>
        </div>
        <div className="progress-track">
          {["pending", "transit", "delivery", "delivered"].map((s, i) => (
            <div
              key={s}
              className={
                ["pending", "transit", "delivery", "delivered"].indexOf(
                  p.status,
                ) >= i
                  ? "done"
                  : ""
              }
            >
              <span>{i === 3 ? <Check size={13} /> : null}</span>
              <small>
                {["Recogido", "En camino", "En reparto", "Entregado"][i]}
              </small>
            </div>
          ))}
        </div>
        <RouteMap points={p.route || []} demo={demo || preview} />
        <div className="timeline">
          <h3>Cada paso cuenta</h3>
          {p.events?.length ? (
            p.events.map((ev, i) => (
              <div className={"event " + (i === 0 ? "latest" : "")} key={i}>
                <span className="event-dot" />
                <div>
                  <small>{ev.date}</small>
                  <strong>{ev.title}</strong>
                  <p>{ev.location}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="muted">
              Todavía no hay movimientos. Aparecerán aquí cuando el
              transportista los comunique.
            </p>
          )}
        </div>
        <div className="tracking-code">
          <span>
            {carrierName(p.carrier)} · {p.tracking_number}
          </span>
          <button
            className="icon-button"
            aria-label="Copiar número de seguimiento"
            onClick={() =>
              navigator.clipboard
                .writeText(p.tracking_number)
                .then(() => notify("Número copiado."))
                .catch(() => notify("No se ha podido copiar."))
            }
          >
            <Copy size={16} />
          </button>
        </div>
        {!preview && (
          <button
            className="text-button danger"
            onClick={() => setDialog({ type: "delete", p })}
          >
            <Trash2 size={15} />
            Eliminar paquete
          </button>
        )}
      </div>
    );
  }
  function RouteMap({ points, demo: illustrative }) {
    const [expanded, setExpanded] = useState(false);
    if (!points.length)
      return (
        <div className="map-unavailable">
          <MapPin size={19} />
          <p>
            El transportista no ha facilitado una ubicación para este envío.
          </p>
        </div>
      );
    const last = points.at(-1);
    return (
      <div className="route-map">
        <div className="map-caption">
          <span>
            <MapPin size={14} />
            Último punto: {last.name}
          </span>
          <span>
            {illustrative ? "RECORRIDO FICTICIO" : "ÚLTIMA UBICACIÓN"}
          </span>
        </div>
        {!illustrative && (
          <iframe
            className="live-map"
            title="Última ubicación facilitada por el transportista"
            loading="lazy"
            referrerPolicy="no-referrer"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${last.lng - 0.15}%2C${last.lat - 0.1}%2C${last.lng + 0.15}%2C${last.lat + 0.1}&layer=mapnik&marker=${last.lat}%2C${last.lng}`}
          />
        )}
        <svg
          className={illustrative ? "map-svg" : "sr-only"}
          viewBox="0 0 540 220"
          role="img"
          aria-label={
            "Recorrido " +
            (illustrative ? "ficticio " : "") +
            points.map((p) => p.name).join(", ")
          }
        >
          <defs>
            <pattern
              id="grid"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 36 0 L 0 0 0 36"
                fill="none"
                stroke="#dce0d8"
                strokeWidth=".7"
              />
            </pattern>
          </defs>
          <rect width="540" height="220" fill="#eef0e8" />
          <rect width="540" height="220" fill="url(#grid)" />
          <path
            d="M0 160 110 125 175 145 230 95 310 110 365 60 470 80 540 30M0 70 90 82 160 40 270 52 340 15M165 220 220 170 310 180 380 140 460 155 540 120"
            fill="none"
            stroke="#fff"
            strokeWidth="10"
          />
          <path
            d="M0 190 100 170 160 100 250 120 340 75 540 95"
            stroke="#c7d9de"
            strokeWidth="4"
            fill="none"
          />
          {points.map((p, i) => {
            const x = 90 + (i * 340) / Math.max(points.length - 1, 1),
              y = 170 - (i * 110) / Math.max(points.length - 1, 1);
            return (
              <g key={i}>
                {i > 0 && (
                  <path
                    d={`M ${90 + ((i - 1) * 340) / (points.length - 1)} ${170 - ((i - 1) * 110) / (points.length - 1)} L ${x} ${y}`}
                    stroke="#e76736"
                    strokeWidth="3"
                    strokeDasharray="5 5"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={i === points.length - 1 ? 9 : 5}
                  fill={i === points.length - 1 ? "#e76736" : "#fff"}
                  stroke="#e76736"
                  strokeWidth="3"
                />
                <text
                  x={x}
                  y={y + 27}
                  textAnchor="middle"
                  fill="#314146"
                  fontSize="12"
                  fontFamily="sans-serif"
                >
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>
        <button className="map-link" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Ocultar coordenadas" : "Ver ubicaciones"}
          <ChevronRight size={14} />
        </button>
        {expanded && (
          <div className="coordinates">
            {points.map((p, i) => (
              <a
                key={i}
                href={`https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=10/${p.lat}/${p.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                {p.name} · {p.lat}, {p.lng}
                <ExternalLink size={12} />
              </a>
            ))}
            <small>
              {illustrative
                ? "Esquema ficticio del recorrido."
                : "Últimas ubicaciones del transportista. Sin posición en directo."}
            </small>
          </div>
        )}
      </div>
    );
  }
  function TrackingForm({ compact = false }) {
    return (
      <form
        className={"tracking-form " + (compact ? "compact" : "")}
        onSubmit={searchTracking}
      >
        <label>
          <span className="sr-only">Número de seguimiento</span>
          <Search size={20} />
          <input
            name="tracking"
            aria-label="Número de seguimiento"
            placeholder="Introduce tu número de seguimiento"
            required
            minLength={5}
            maxLength={80}
            pattern="[a-zA-Z0-9-]+"
          />
        </label>
        <select name="carrier" aria-label="Transportista">
          <option value="auto">Detectar compañía</option>
          {carriers.map(([v, n]) => (
            <option value={v} key={v}>
              {n}
            </option>
          ))}
        </select>
        <button className="button" disabled={busy}>
          {busy ? (
            "Consultando…"
          ) : (
            <>
              Seguir paquete
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    );
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      {view === "home" ? (
        <>
          <header className="site-header wrap">
            <Logo />
            <nav aria-label="Principal">
              <a href="#como-funciona">Cómo funciona</a>
              <a href="#todo-en-su-sitio">Por qué Tramo</a>
              <button className="nav-demo" onClick={() => navigate("demo")}>
                Explorar demo
                <ArrowUpRight size={15} />
              </button>
            </nav>
            <button
              className="header-login"
              onClick={() => (session ? navigate("app") : enterAuth())}
            >
              {" "}
              {session ? "Mis paquetes" : "Iniciar sesión"}
              <ArrowRight size={16} />
            </button>
          </header>
          <main id="main">
            <section className="hero wrap">
              <div className="hero-copy">
                <p className="eyebrow">
                  <span className="tiny-line" />
                  MENOS PESTAÑAS. MÁS TRANQUILIDAD.
                </p>
                <h1>
                  Tus paquetes,
                  <br />
                  en cada <span className="serif">tramo.</span>
                </h1>
                <p className="hero-description">
                  Desde el primer movimiento hasta el timbre de casa. Todos tus
                  envíos, en un lugar que lo pone fácil.
                </p>
                <div className="hero-actions">
                  <Cta onClick={() => enterAuth("signup")}>
                    Empieza tu recorrido
                    <ArrowUpRight size={19} />
                  </Cta>
                  <button
                    className="text-button"
                    onClick={() => navigate("demo")}
                  >
                    Prueba la demo
                    <ArrowRight size={18} />
                  </button>
                </div>
                <p className="hero-note">
                  <Check size={14} />
                  Consulta sin cuenta · Guarda tus envíos al registrarte
                </p>
              </div>
              <div className="hero-art">
                <div className="art-topline">
                  <span>DE UN LUGAR A OTRO.</span>
                  <span>TODO CONECTADO.</span>
                </div>
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="floating-label">
                  <span className="pulse-dot" />
                  Tu próxima entrega, más cerca.
                </div>
                <div className="hero-parcel">
                  <div className="parcel-top" />
                  <div className="parcel-front">
                    <div className="parcel-tape" />
                    <Route size={64} />
                    <div className="parcel-label">
                      <span>DE: ALGÚN LUGAR</span>
                      <strong>PARA: TI.</strong>
                      <div className="barcode" />
                    </div>
                  </div>
                  <div className="parcel-side" />
                </div>
                <div className="delivery-float">
                  <span className="float-icon">
                    <Truck size={21} />
                  </span>
                  <div>
                    <small>CASA DEL LIBRO · EJEMPLO</small>
                    <strong>Hoy está en reparto</strong>
                  </div>
                  <Check size={17} />
                </div>
                <div className="art-bottomline">
                  <span>01 — RECOGIDO</span>
                  <span className="dotted-line" />
                  <span>04 — CONTIGO</span>
                </div>
              </div>
            </section>
            <section
              className="quick-section wrap"
              aria-labelledby="quick-title"
            >
              <div>
                <p className="eyebrow">¿ESPERANDO ALGO?</p>
                <h2 id="quick-title">Sigue su camino.</h2>
                <p>Una consulta rápida. Sin iniciar sesión.</p>
              </div>
              <div className="quick-input">
                <TrackingForm />
                <p className="input-note">
                  Correos, SEUR, DHL y más, según la cobertura del proveedor.
                  {!cap.tracking && " Conexión de seguimiento en preparación."}
                </p>
              </div>
            </section>
            <div className="carrier-strip wrap">
              <span>
                CADA COMPAÑÍA.
                <br />
                <strong>UN MISMO LUGAR.</strong>
              </span>
              <div>
                {["Correos", "DHL", "SEUR", "GLS", "UPS"].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
              <small>Cobertura según integración</small>
            </div>
            <section className="overview wrap" id="como-funciona">
              <div className="section-title">
                <div>
                  <p className="eyebrow">DEL «¿DÓNDE ESTÁ?» AL «YA LLEGÓ»</p>
                  <h2>
                    La espera, un poco
                    <br />
                    más <span className="serif">sencilla.</span>
                  </h2>
                </div>
                <p>
                  Los pequeños detalles que necesitas.
                  <br />
                  Sin perderte entre códigos y compañías.
                </p>
              </div>
              <div className="overview-grid">
                <div className="feature-list">
                  {[
                    [
                      Package,
                      "01",
                      "Todos juntos, por fin.",
                      "Añade un envío, ponle un nombre y encuentra cada paquete en tu panel personal.",
                    ],
                    [
                      MapPin,
                      "02",
                      "Sigue cada movimiento.",
                      "Un historial claro y las ubicaciones que comparta el transportista, sin inventar posiciones.",
                    ],
                    [
                      Bell,
                      "03",
                      "Te avisamos cuando cuenta.",
                      "En reparto, entregado o con alguna incidencia. Elige qué recibir por correo y en tu navegador.",
                    ],
                  ].map(([Icon, n, title, text]) => (
                    <div className="feature" key={n}>
                      <span className="feature-number">{n}</span>
                      <div>
                        <Icon size={23} />
                        <h3>{title}</h3>
                        <p>{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="preview-shell">
                  <div className="preview-top">
                    <span className="live-dot" />
                    UNA VISTA PREVIA DE TU PANEL<span>DEMO</span>
                  </div>
                  <PackageDetail p={demoPackages[0]} preview />
                </div>
              </div>
            </section>
            <section className="calm-section" id="todo-en-su-sitio">
              <div className="wrap calm-grid">
                <div>
                  <p className="eyebrow">HECHO PARA EL DÍA A DÍA</p>
                  <h2>
                    Lo que viene.
                    <br />
                    Lo que importa.
                    <br />
                    <span className="serif">Todo en su sitio.</span>
                  </h2>
                </div>
                <div className="calm-facts">
                  <article>
                    <ShieldCheck />
                    <h3>Tu espacio es tuyo.</h3>
                    <p>
                      Tu cuenta guarda tus paquetes y tus preferencias. Tú
                      decides qué añadir y qué eliminar.
                    </p>
                  </article>
                  <article>
                    <SlidersHorizontal />
                    <h3>Avisos a tu manera.</h3>
                    <p>
                      Elige los eventos y los canales. Recibe los cambios que te
                      interesan.
                    </p>
                  </article>
                  <article>
                    <Box />
                    <h3>Del móvil al escritorio.</h3>
                    <p>
                      Un panel que se adapta a ti. Añade Tramo a tu pantalla de
                      inicio para tenerlo a mano.
                    </p>
                  </article>
                </div>
              </div>
            </section>
            <section className="faq wrap">
              <div>
                <p className="eyebrow">ANTES DE EMPEZAR</p>
                <h2>Por si te lo preguntas.</h2>
              </div>
              <div>
                {[
                  [
                    "¿Necesito crear una cuenta?",
                    "Puedes consultar un envío sin registrarte. La cuenta te permite guardar paquetes y configurar tus avisos. La demo se puede explorar sin cuenta.",
                  ],
                  [
                    "¿El mapa muestra al repartidor en directo?",
                    "Mostramos los puntos del recorrido cuando el transportista proporciona ubicaciones. La posición en directo solo estará disponible si la compañía permite integrarla.",
                  ],
                  [
                    "¿Qué puedo probar en la demo?",
                    "Un panel con paquetes ficticios, filtros, historial, un recorrido ilustrativo y preferencias de avisos. No consulta transportistas ni envía notificaciones reales.",
                  ],
                  [
                    "¿Cómo funcionan las notificaciones web?",
                    "Necesitan tu permiso y un navegador compatible. En algunos móviles, como iPhone, debes instalar primero la web en la pantalla de inicio.",
                  ],
                ].map(([title, text]) => (
                  <details key={title}>
                    <summary>
                      {title}
                      <Plus size={18} />
                    </summary>
                    <p>{text}</p>
                  </details>
                ))}
              </div>
            </section>
            <section className="bottom-cta wrap">
              <p className="eyebrow">EL SIGUIENTE TRAMO EMPIEZA AQUÍ.</p>
              <h2>
                Deja de buscar.
                <br />
                <span className="serif">Empieza a esperar mejor.</span>
              </h2>
              <Cta onClick={() => navigate("demo")}>
                Entra a la demo
                <ArrowUpRight size={19} />
              </Cta>
              <small>
                Sin registro. Sin paquetes reales. Con todo por explorar.
              </small>
            </section>
          </main>
          <footer className="site-footer wrap">
            <Logo />
            <span>
              Una idea de{" "}
              <a href="/">
                Nel Marcos
                <ArrowUpRight size={13} />
              </a>
            </span>
            <div>
              <button onClick={() => setDialog({ type: "privacy" })}>
                Privacidad
              </button>
              <a href="/">
                Volver al portfolio
                <ArrowUpRight size={14} />
              </a>
            </div>
          </footer>
        </>
      ) : view === "acceder" || view === "recuperar" ? (
        <div className="auth-layout">
          <aside>
            <Logo light />
            <div>
              <p className="eyebrow">UN LUGAR PARA LO QUE VIENE</p>
              <h1>
                Cada paquete.
                <br />
                Cada paso.
                <br />
                <span className="serif">Tu espacio.</span>
              </h1>
              <p>Reúne tus envíos y sigue su recorrido con tranquilidad.</p>
              <div className="auth-route">
                <span />
                <i />
                <span />
                <i />
                <span>
                  <Package size={20} />
                </span>
              </div>
            </div>
            <a href="/">
              Un proyecto de Nel Marcos
              <ArrowUpRight size={16} />
            </a>
          </aside>
          <main id="main" className="auth-main">
            <button
              className="text-button auth-back"
              onClick={() => navigate("home")}
            >
              <ArrowLeft size={16} />
              Volver a Tramo
            </button>
            <div className="auth-form">
              <p className="eyebrow">TU PRÓXIMA ENTREGA EMPIEZA AQUÍ</p>
              <h2>
                {view === "recuperar"
                  ? "Nueva contraseña"
                  : authMode === "signup"
                    ? "Hazle sitio a tus paquetes."
                    : authMode === "reset"
                      ? "Recupera tu cuenta."
                      : "Qué bien verte de nuevo."}
              </h2>
              <p>
                {authMode === "signup"
                  ? "Crea tu cuenta y empieza a guardar tus envíos."
                  : "Entra a tu espacio personal de Tramo."}
              </p>
              {view === "recuperar" ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setBusy(true);
                    const { error } = await db.auth.updateUser({
                      password: new FormData(e.currentTarget).get("password"),
                    });
                    setBusy(false);
                    if (error) notify(error.message);
                    else {
                      notify("Contraseña actualizada.");
                      navigate("app");
                    }
                  }}
                >
                  <label>
                    Nueva contraseña
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={10}
                      autoComplete="new-password"
                    />
                  </label>
                  <button className="button" disabled={busy}>
                    Guardar contraseña
                    <ArrowRight size={18} />
                  </button>
                </form>
              ) : (
                <form onSubmit={auth}>
                  <label>
                    Correo electrónico
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="tu@correo.com"
                    />
                  </label>
                  {authMode !== "reset" && (
                    <label>
                      Contraseña
                      <input
                        name="password"
                        type="password"
                        required
                        minLength={authMode === "signup" ? 10 : 1}
                        autoComplete={
                          authMode === "signup"
                            ? "new-password"
                            : "current-password"
                        }
                        placeholder={
                          authMode === "signup"
                            ? "Al menos 10 caracteres"
                            : "Tu contraseña"
                        }
                      />
                    </label>
                  )}
                  {authMode === "login" && (
                    <button
                      type="button"
                      className="text-button forgot"
                      onClick={() => setAuthMode("reset")}
                    >
                      He olvidado mi contraseña
                    </button>
                  )}
                  <button className="button" disabled={busy}>
                    {busy
                      ? "Un momento…"
                      : authMode === "signup"
                        ? "Crear cuenta"
                        : authMode === "reset"
                          ? "Enviar instrucciones"
                          : "Iniciar sesión"}
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}
              <p className="auth-switch">
                {authMode === "signup"
                  ? "¿Ya tienes cuenta?"
                  : "¿Aún no tienes cuenta?"}{" "}
                <button
                  onClick={() =>
                    setAuthMode(authMode === "signup" ? "login" : "signup")
                  }
                >
                  {authMode === "signup" ? "Inicia sesión" : "Crea tu cuenta"}
                </button>
              </p>
              <div className="auth-demo">
                <span>¿Solo estás echando un vistazo?</span>
                <button
                  className="text-button"
                  onClick={() => navigate("demo")}
                >
                  Explora la demo sin registrarte
                  <ArrowUpRight size={16} />
                </button>
              </div>
              <p className="legal-note">
                Al usar Tramo se aplica nuestra{" "}
                <button onClick={() => setDialog({ type: "privacy" })}>
                  información de privacidad
                </button>
                .
              </p>
            </div>
          </main>
        </div>
      ) : (
        <div className="dashboard">
          <aside className={"sidebar " + (mobileNav ? "mobile-open" : "")}>
            <Logo />
            <button
              className="mobile-close icon-button"
              aria-label="Cerrar menú"
              onClick={() => setMobileNav(false)}
            >
              <X />
            </button>
            <span className="sidebar-caption">TU ESPACIO</span>
            <nav aria-label="Panel personal">
              {[
                [LayoutGrid, "packages", "Mis paquetes"],
                [Bell, "notifications", "Notificaciones"],
                [Settings, "settings", "Ajustes"],
              ].map(([Icon, key, title]) => (
                <button
                  key={key}
                  className={tab === key ? "active" : ""}
                  onClick={() => {
                    setTab(key);
                    setMobileNav(false);
                    setSelected(null);
                  }}
                >
                  <Icon size={19} />
                  {title}
                  {key === "packages" && (
                    <span>
                      {packages.filter((p) => p.status !== "delivered").length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="sidebar-message">
                <Route size={25} />
                <strong>Todo sigue su camino.</strong>
                <p>Aquí encontrarás cada nuevo movimiento.</p>
              </div>
              <button className="text-button" onClick={() => navigate("home")}>
                <ArrowLeft size={16} />
                Volver al inicio
              </button>
              <div className="profile">
                <span className="avatar">
                  {demo ? "D" : session?.user.email?.[0]?.toUpperCase() || "T"}
                </span>
                <div>
                  <strong>
                    {demo ? "Explorando Tramo" : session?.user.email}
                  </strong>
                  <small>
                    {demo ? "Espacio de demostración" : "Cuenta personal"}
                  </small>
                </div>
                {!demo && (
                  <button
                    className="icon-button"
                    aria-label="Cerrar sesión"
                    onClick={logout}
                  >
                    <LogOut size={17} />
                  </button>
                )}
              </div>
            </div>
          </aside>
          <div className="dashboard-content">
            <header className="dashboard-top">
              <button
                className="icon-button menu-toggle"
                aria-label="Abrir menú"
                onClick={() => setMobileNav(true)}
              >
                <Menu />
              </button>
              <span>
                Mi espacio
                <ChevronRight size={13} />
                <strong>
                  {tab === "packages"
                    ? "Mis paquetes"
                    : tab === "notifications"
                      ? "Notificaciones"
                      : "Ajustes"}
                </strong>
              </span>
              <div>
                <span className="today">
                  {demo
                    ? "Miércoles, 11 de noviembre"
                    : new Intl.DateTimeFormat("es-ES", {
                        day: "numeric",
                        month: "long",
                      }).format(new Date())}
                </span>
                <button
                  className="icon-button"
                  aria-label="Abrir notificaciones"
                  onClick={() => setTab("notifications")}
                >
                  <Bell size={18} />
                </button>
              </div>
            </header>
            {demo && (
              <div className="demo-banner">
                <span>
                  <span className="pulse-dot" />
                  <strong>Estás en la demo.</strong> Los paquetes y movimientos
                  son ficticios.
                </span>
                <button onClick={() => enterAuth("signup")}>
                  Crea tu espacio
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
            <main id="main" className="dashboard-main">
              {tab === "packages" ? (
                <>
                  <div className="page-heading">
                    <div>
                      <p className="eyebrow">CADA ENVÍO, BAJO CONTROL</p>
                      <h1>
                        Lo que está por llegar<span>.</span>
                      </h1>
                      <p>Un vistazo y ya sabes por dónde va todo.</p>
                    </div>
                    <Cta onClick={() => setDialog({ type: "add" })}>
                      <Plus size={18} />
                      Añadir paquete
                    </Cta>
                  </div>
                  <div className="stats">
                    {[
                      [
                        Package,
                        "En camino",
                        packages.filter((p) =>
                          ["pending", "transit"].includes(p.status),
                        ).length,
                        "orange",
                      ],
                      [
                        Truck,
                        "En reparto",
                        packages.filter((p) => p.status === "delivery").length,
                        "green",
                      ],
                      [
                        CheckCheck,
                        "Entregados",
                        packages.filter((p) => p.status === "delivered").length,
                        "blue",
                      ],
                    ].map(([Icon, name, count, color]) => (
                      <button
                        className="stat"
                        key={name}
                        onClick={() =>
                          setFilter(
                            name === "Entregados"
                              ? "delivered"
                              : name === "En reparto"
                                ? "delivery"
                                : "transit",
                          )
                        }
                      >
                        <span className={"stat-icon " + color}>
                          <Icon size={21} />
                        </span>
                        <div>
                          <span>{name}</span>
                          <strong>{String(count).padStart(2, "0")}</strong>
                        </div>
                        <ArrowUpRight size={16} />
                      </button>
                    ))}
                  </div>
                  <div className="package-toolbar">
                    <div className="tabs">
                      {[
                        ["active", "En curso"],
                        ["delivered", "Entregados"],
                        ["all", "Todos"],
                      ].map(([key, name]) => (
                        <button
                          className={filter === key ? "active" : ""}
                          key={key}
                          onClick={() => setFilter(key)}
                        >
                          {name}
                          {key === "active" && (
                            <span>
                              {
                                packages.filter((p) => p.status !== "delivered")
                                  .length
                              }
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <label className="list-search">
                      <Search size={17} />
                      <input
                        aria-label="Buscar en mis paquetes"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Buscar paquete…"
                      />
                    </label>
                  </div>
                  <div
                    className={
                      "packages-layout " + (selected ? "has-detail" : "")
                    }
                  >
                    <div className="package-list">
                      {packages
                        .filter(
                          (p) =>
                            (filter === "all" ||
                              (filter === "active" &&
                                p.status !== "delivered") ||
                              (filter === "transit" &&
                                ["pending", "transit"].includes(p.status)) ||
                              p.status === filter) &&
                            [p.alias, p.shop, p.carrier, p.tracking_number]
                              .join(" ")
                              .toLowerCase()
                              .includes(q.toLowerCase()),
                        )
                        .map((p) => (
                          <button
                            className={
                              "package-card " +
                              (selected === p.id ? "selected" : "")
                            }
                            onClick={() => setSelected(p.id)}
                            key={p.id}
                          >
                            <div className={"carrier-logo " + p.carrier}>
                              {carrierName(p.carrier).slice(0, 3).toUpperCase()}
                            </div>
                            <div className="package-card-info">
                              <div>
                                <span className="package-shop">
                                  {p.shop || carrierName(p.carrier)}
                                </span>
                                <Status status={p.status} />
                              </div>
                              <h2>{p.alias}</h2>
                              <p>
                                {p.events?.[0]?.title ||
                                  "Esperando el primer movimiento"}
                              </p>
                              <div className="package-card-bottom">
                                <span>
                                  <Clock size={13} />
                                  {p.eta || "Fecha por confirmar"}
                                </span>
                                <span>
                                  Ver recorrido
                                  <ChevronRight size={15} />
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      {packages.filter(
                        (p) =>
                          (filter === "all" ||
                            (filter === "active" && p.status !== "delivered") ||
                            (filter === "transit" &&
                              ["pending", "transit"].includes(p.status)) ||
                            p.status === filter) &&
                          [p.alias, p.shop, p.carrier, p.tracking_number]
                            .join(" ")
                            .toLowerCase()
                            .includes(q.toLowerCase()),
                      ).length === 0 && (
                        <div className="empty-state">
                          <Package size={40} />
                          <h2>
                            {packages.length
                              ? "No hay paquetes con este filtro."
                              : "Tu próximo paquete empieza aquí."}
                          </h2>
                          <p>
                            {packages.length
                              ? "Prueba otra búsqueda o revisa todos tus envíos."
                              : "Añade tu primer número de seguimiento para guardarlo."}
                          </p>
                          <Cta
                            secondary
                            onClick={() =>
                              packages.length
                                ? (setFilter("all"), setQ(""))
                                : setDialog({ type: "add" })
                            }
                          >
                            {packages.length ? "Ver todos" : "Añadir paquete"}
                          </Cta>
                        </div>
                      )}
                      <div className="list-footnote">
                        <ShieldCheck size={15} />
                        {demo
                          ? "Este espacio de prueba se guarda solo durante esta sesión."
                          : "Solo tú puedes acceder a tus paquetes."}
                        {demo && (
                          <button
                            onClick={() => {
                              setItems(demoPackages);
                              setSelected(null);
                              notify("Demo restablecida.");
                            }}
                          >
                            Restablecer demo
                          </button>
                        )}
                      </div>
                    </div>
                    {selected && packages.find((p) => p.id === selected) ? (
                      <PackageDetail
                        p={packages.find((p) => p.id === selected)}
                      />
                    ) : (
                      <div className="dashboard-note">
                        <div className="note-route">
                          <span />
                          <i />
                          <span />
                          <i />
                          <span>
                            <Package size={24} />
                          </span>
                        </div>
                        <p className="eyebrow">CADA PASO, MÁS CERCA</p>
                        <h2>
                          Detrás de cada paquete,
                          <br />
                          algo que <span className="serif">esperas.</span>
                        </h2>
                        <p>
                          Selecciona un envío para descubrir su recorrido y
                          todos sus movimientos.
                        </p>
                        <span className="note-bottom">
                          DE UN LUGAR A OTRO. HASTA TI.
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : tab === "notifications" ? (
                <>
                  <div className="page-heading">
                    <div>
                      <p className="eyebrow">LO IMPORTANTE, A TIEMPO</p>
                      <h1>
                        Avisos a tu manera<span>.</span>
                      </h1>
                      <p>Elige cuándo y cómo quieres saber de tus paquetes.</p>
                    </div>
                  </div>
                  <div className="settings-grid">
                    <section className="settings-card">
                      <Mail />
                      <h2>Por correo electrónico</h2>
                      <p>
                        Recibe novedades en{" "}
                        {demo ? "tu@correo.com" : session?.user.email}.
                      </p>
                      <label className="toggle-row">
                        Avisos por correo
                        <input
                          type="checkbox"
                          role="switch"
                          checked={preferences.email_enabled}
                          onChange={(e) =>
                            savePrefs({
                              ...preferences,
                              email_enabled: e.target.checked,
                            })
                          }
                        />
                      </label>
                      {!demo && !cap.email && (
                        <p className="service-note">
                          Preferencia guardable. Envíos pendientes de conectar
                          Resend y verificar el remitente.
                        </p>
                      )}
                      <h3>Quiero enterarme cuando…</h3>
                      {[
                        ["delivery", "Mi paquete esté en reparto"],
                        ["delivered", "Se haya entregado"],
                        ["exception", "Haya una incidencia"],
                        ["transit", "Siga avanzando"],
                      ].map(([key, label]) => (
                        <label className="check-row" key={key}>
                          <input
                            type="checkbox"
                            checked={preferences.events.includes(key)}
                            onChange={(e) =>
                              savePrefs({
                                ...preferences,
                                events: e.target.checked
                                  ? [...preferences.events, key]
                                  : preferences.events.filter((x) => x !== key),
                              })
                            }
                          />
                          {label}
                        </label>
                      ))}
                    </section>
                    <section className="settings-card">
                      <Bell />
                      <h2>En este dispositivo</h2>
                      <p>
                        Recibe notificaciones aunque no tengas Tramo abierto.
                        Necesitamos tu permiso y un navegador compatible.
                      </p>
                      <Cta
                        secondary
                        onClick={
                          pushEnabled && !demo
                            ? () => disablePush().catch(() => {})
                            : enablePush
                        }
                      >
                        {pushEnabled && !demo
                          ? "Desactivar notificaciones"
                          : "Activar notificaciones"}
                        <Bell size={16} />
                      </Cta>
                      <small>
                        {demo
                          ? "En la demo solo se muestra un ejemplo."
                          : "Puedes revocar el permiso en los ajustes del navegador."}
                      </small>
                      <div className="notification-example">
                        <span className="eyebrow">EJEMPLO DE AVISO</span>
                        <div>
                          <span className="logo-mark">
                            <Route size={18} />
                          </span>
                          <strong>
                            Tu paquete está en reparto
                            <small>Algo para perderse · Correos</small>
                          </strong>
                          <span>ahora</span>
                        </div>
                      </div>
                    </section>
                  </div>
                </>
              ) : (
                <>
                  <div className="page-heading">
                    <div>
                      <p className="eyebrow">COMO A TI TE GUSTA</p>
                      <h1>
                        Tu cuenta, tu espacio<span>.</span>
                      </h1>
                      <p>Las pequeñas cosas que hacen Tramo tuyo.</p>
                    </div>
                  </div>
                  <section className="settings-card account-card">
                    <h2>Cuenta personal</h2>
                    <label>
                      Correo electrónico
                      <input
                        value={
                          demo
                            ? "demo@tramo.ejemplo"
                            : session?.user.email || ""
                        }
                        disabled
                      />
                    </label>
                    <p>
                      {demo
                        ? "Esta es una cuenta ficticia para explorar Tramo."
                        : "Tus envíos se guardan en tu cuenta y puedes eliminarlos desde cada paquete."}
                    </p>
                    <button
                      className="text-button"
                      onClick={() => setTab("notifications")}
                    >
                      Configurar notificaciones
                      <ArrowRight size={17} />
                    </button>
                    <hr />
                    <h3>Tramo, más a mano</h3>
                    <p>
                      Usa la opción «Instalar aplicación» o «Añadir a pantalla
                      de inicio» de tu navegador.
                    </p>
                    <hr />
                    <button
                      className="text-button"
                      onClick={() => setDialog({ type: "privacy" })}
                    >
                      Privacidad y uso de datos
                      <ArrowUpRight size={16} />
                    </button>
                    {demo && (
                      <Cta onClick={() => enterAuth("signup")}>
                        Crear mi cuenta real
                        <ArrowRight size={16} />
                      </Cta>
                    )}
                  </section>
                </>
              )}
            </main>
            <footer className="dashboard-footer">
              <span>
                tramo. <span>Tus paquetes, en cada tramo.</span>
              </span>
              <a href="/">
                Hecho por Nel Marcos
                <ArrowUpRight size={13} />
              </a>
            </footer>
          </div>
        </div>
      )}
      {dialog && (
        <Modal close={() => setDialog(null)}>
          {dialog.type === "add" ? (
            <>
              <p className="eyebrow">UN NUEVO RECORRIDO</p>
              <h2>Añade un paquete.</h2>
              <p>
                {demo
                  ? "Prueba con cualquier código. Crearemos un envío ficticio."
                  : "Guarda tu envío para tenerlo siempre a mano."}
              </p>
              <form onSubmit={addPackage}>
                <label>
                  ¿Cómo lo llamamos?
                  <input
                    autoFocus
                    name="alias"
                    required
                    maxLength={80}
                    placeholder="Por ejemplo, mis nuevas zapatillas"
                  />
                </label>
                <label>
                  Número de seguimiento
                  <input
                    name="tracking"
                    defaultValue={dialog.code || ""}
                    required
                    minLength={5}
                    maxLength={80}
                    pattern="[a-zA-Z0-9-]+"
                    placeholder="Código facilitado por la compañía"
                  />
                </label>
                <label>
                  Compañía
                  <select name="carrier" required>
                    {carriers.map(([v, n]) => (
                      <option value={v} key={v}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="button" disabled={busy}>
                  {busy ? "Guardando…" : "Guardar paquete"}
                  <Plus size={18} />
                </button>
              </form>
            </>
          ) : dialog.type === "delete" ? (
            <>
              <h2>¿Eliminar este paquete?</h2>
              <p>
                Se eliminará «{dialog.p.alias}» de tu espacio. Esta acción no se
                puede deshacer.
              </p>
              <Cta onClick={() => remove(dialog.p)}>Eliminar paquete</Cta>
            </>
          ) : (
            <>
              <p className="eyebrow">PRIVACIDAD</p>
              <h2>Tu espacio, con claridad.</h2>
              <p>
                Tramo es un proyecto de Nel Marcos. Las cuentas y los paquetes
                se almacenan en un proyecto independiente de Supabase, en la
                Unión Europea. Cada usuario accede únicamente a sus propios
                datos.
              </p>
              <p>
                Guardamos tu correo, los envíos que añadas, tus preferencias y,
                si activas las notificaciones, la suscripción de tu navegador.
                Los números de seguimiento se comparten con el proveedor de
                seguimiento cuando la integración esté activa. Los avisos por
                correo se procesarán mediante Resend cuando esté configurado.
              </p>
              <p>
                La demo usa datos ficticios en el almacenamiento de sesión del
                navegador. Tu sesión de acceso se conserva en este dispositivo
                hasta que cierres sesión. No incorporamos analítica ni
                publicidad.
              </p>
              <p>
                Puedes eliminar cada paquete desde su detalle. Para solicitar la
                eliminación de tu cuenta y los datos asociados, escribe a{" "}
                <a href="mailto:nelmarcos@icloud.com">nelmarcos@icloud.com</a>.
              </p>
            </>
          )}
        </Modal>
      )}
      {lookup && (
        <Modal close={() => setLookup(null)}>
          <PackageDetail
            p={{ ...lookup, alias: lookup.alias || "Tu envío" }}
            preview
          />
          <Cta
            onClick={() => {
              sessionStorage.setItem("tramo-pending", lookup.tracking_number);
              if (session) {
                const code = lookup.tracking_number;
                setLookup(null);
                navigate("app");
                setDialog({ type: "add", code });
              } else enterAuth("signup");
            }}
          >
            Guardar en mis paquetes
            <Plus size={17} />
          </Cta>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <span>{toast}</span>
          <button
            className="icon-button"
            aria-label="Cerrar aviso"
            onClick={() => setToast("")}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </>
  );
}
function Modal({ children, close }) {
  useEffect(() => {
    const old = document.activeElement;
    const el = document.querySelector(".modal");
    const focusables = () =>
      [...el.querySelectorAll("button,input,select,a[href]")].filter(
        (x) => !x.disabled,
      );
    focusables()[0]?.focus();
    const key = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const list = focusables(),
          first = list[0],
          last = list.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = overflow;
      old?.focus();
    };
  }, []);
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Tramo"
      >
        <button
          className="icon-button modal-close"
          onClick={close}
          aria-label="Cerrar ventana"
        >
          <X />
        </button>
        {children}
      </section>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
