import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config";
export const db = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { flowType: "pkce" },
});
export async function api(path, body) {
  const {
    data: { session },
  } = await db.auth.getSession();
  const r = await fetch("/.netlify/functions/tramo-api/" + path, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  let data;
  try {
    data = await r.json();
  } catch {
    throw new Error("El servicio no está disponible. Inténtalo más tarde.");
  }
  if (!r.ok)
    throw new Error(data.error || "No se ha podido completar la operación.");
  return data;
}
export function result({ data, error }) {
  if (error)
    throw new Error(
      error.code === "23505"
        ? "Ya tienes guardado este envío."
        : "No se han podido guardar los cambios. Inténtalo de nuevo.",
    );
  return data;
}
