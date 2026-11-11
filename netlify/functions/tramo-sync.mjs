import { createClient } from "@supabase/supabase-js";
import * as webpush from "web-push";
import { createHash } from "node:crypto";
import { SUPABASE_URL } from "../../tramo/src/config.js";
import {
  lookup,
  labels,
  safeSubscription,
} from "../../tramo/server/tracking.mjs";
function check({ data, error }) {
  if (error) throw error;
  return data;
}
export default async function () {
  if (
    !process.env.TRAMO_AFTERSHIP_API_KEY ||
    !process.env.TRAMO_SUPABASE_SECRET_KEY
  )
    return new Response(JSON.stringify({ status: "not_configured" }), {
      status: 200,
    });
  const started = Date.now(),
    deadline = AbortSignal.timeout(24000),
    remaining = () => 24000 - (Date.now() - started);
  const admin = createClient(
    SUPABASE_URL,
    process.env.TRAMO_SUPABASE_SECRET_KEY,
    {
      auth: { persistSession: false },
      global: {
        fetch: (url, options = {}) =>
          fetch(url, {
            ...options,
            signal: options.signal
              ? AbortSignal.any([options.signal, deadline])
              : deadline,
          }),
      },
    },
  );
  let updated = 0,
    failed = 0,
    sent = 0;
  try {
    const packages = check(
      await admin
        .from("packages")
        .select("*")
        .neq("status", "delivered")
        .order("updated_at", { ascending: true, nullsFirst: true })
        .limit(15),
    );
    for (const p of packages) {
      if (remaining() < 12000) break;
      try {
        const next = await lookup(p.tracking_number, p.carrier, {
          signal: deadline,
          timeoutMs: 4000,
        });
        const fingerprint = createHash("sha256")
          .update(
            JSON.stringify({
              status: next.status,
              event: next.events[0] || null,
            }),
          )
          .digest("hex");
        // Persist the outbox before the snapshot: a failed snapshot update is safe to retry.
        if (next.status !== p.status) {
          const { error } = await admin
            .from("notification_outbox")
            .upsert(
              {
                package_id: p.id,
                user_id: p.user_id,
                status: next.status,
                fingerprint,
              },
              { onConflict: "package_id,fingerprint", ignoreDuplicates: true },
            );
          if (error) throw error;
        }
        check(await admin.from("packages").update(next).eq("id", p.id));
        updated++;
      } catch {
        failed++;
      }
    }
    const pending = check(
      await admin
        .from("notification_outbox")
        .select("*,packages(alias)")
        .or("email_sent.eq.false,push_sent.eq.false")
        .order("created_at")
        .limit(40),
    );
    const pushReady =
      process.env.TRAMO_VAPID_PUBLIC_KEY &&
      process.env.TRAMO_VAPID_PRIVATE_KEY &&
      process.env.TRAMO_VAPID_SUBJECT;
    if (pushReady)
      webpush.setVapidDetails(
        process.env.TRAMO_VAPID_SUBJECT,
        process.env.TRAMO_VAPID_PUBLIC_KEY,
        process.env.TRAMO_VAPID_PRIVATE_KEY,
      );
    for (const row of pending) {
      if (remaining() < 4000) break;
      try {
        const prefs = check(
          await admin
            .from("notification_preferences")
            .select("*")
            .eq("user_id", row.user_id)
            .maybeSingle(),
        );
        if (!prefs?.events.includes(row.status)) {
          check(
            await admin
              .from("notification_outbox")
              .update({ email_sent: true, push_sent: true })
              .eq("id", row.id),
          );
          continue;
        }
        const title = `${row.packages.alias}: ${labels[row.status] || "Nuevo movimiento"}`;
        if (!row.email_sent) {
          if (!prefs.email_enabled) {
            check(
              await admin
                .from("notification_outbox")
                .update({ email_sent: true })
                .eq("id", row.id),
            );
          } else if (
            process.env.TRAMO_RESEND_API_KEY &&
            process.env.TRAMO_MAIL_FROM
          ) {
            const { data, error } = await admin.auth.admin.getUserById(
              row.user_id,
            );
            if (error) throw error;
            if (data.user?.email) {
              const r = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.TRAMO_RESEND_API_KEY}`,
                  "Content-Type": "application/json",
                  "Idempotency-Key": `tramo-${row.id}`,
                },
                body: JSON.stringify({
                  from: process.env.TRAMO_MAIL_FROM,
                  to: [data.user.email],
                  subject: title,
                  text: `${title}\n\nConsulta sus movimientos en https://nelmarcos.netlify.app/tramo/app\n\nPuedes cambiar tus preferencias de avisos en Tramo.`,
                }),
                signal: AbortSignal.any([deadline, AbortSignal.timeout(4000)]),
              });
              if (!r.ok) throw new Error("Mail delivery failed");
              check(
                await admin
                  .from("notification_outbox")
                  .update({ email_sent: true })
                  .eq("id", row.id),
              );
              sent++;
            }
          }
        }
        if (!row.push_sent && pushReady) {
          const subscriptions = check(
            await admin
              .from("push_subscriptions")
              .select("*")
              .eq("user_id", row.user_id),
          );
          let retry = false;
          for (const s of subscriptions) {
            if (remaining() < 3000) {
              retry = true;
              break;
            }
            if (!safeSubscription(s.subscription)) {
              check(
                await admin.from("push_subscriptions").delete().eq("id", s.id),
              );
              continue;
            }
            try {
              await webpush.sendNotification(
                s.subscription,
                JSON.stringify({
                  title: "Novedades en Tramo",
                  body: title,
                  tag: `tramo-${row.id}`,
                }),
                { timeout: 2500 },
              );
              sent++;
            } catch (e) {
              if ([404, 410].includes(e.statusCode))
                check(
                  await admin
                    .from("push_subscriptions")
                    .delete()
                    .eq("id", s.id),
                );
              else retry = true;
            }
          }
          if (!retry)
            check(
              await admin
                .from("notification_outbox")
                .update({ push_sent: true })
                .eq("id", row.id),
            );
        }
      } catch {
        failed++;
      }
    }
    return Response.json({ updated, failed, sent });
  } catch {
    return Response.json({ error: "sync_failed" }, { status: 500 });
  }
}
export const config = { schedule: "*/30 * * * *" };
