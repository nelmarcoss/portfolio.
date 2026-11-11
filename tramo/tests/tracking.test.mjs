import test from "node:test";
import assert from "node:assert/strict";
import {
  validateTracking,
  normalizeTracking,
  safeSubscription,
  lookup,
} from "../server/tracking.mjs";
import api from "../../netlify/functions/tramo-api.mjs";
test("tracking numbers and carriers are strictly validated", () => {
  assert.throws(() => validateTracking("../../credentials", "auto"));
  assert.throws(() => validateTracking("VALID0001", "unsupported"));
  assert.doesNotThrow(() => validateTracking("VALID-0001", "correos"));
});
test("only carrier coordinates become map locations; checkpoints are chronological", () => {
  const p = normalizeTracking(
    {
      tracking_number: "CODE0001",
      tag: "OutForDelivery",
      checkpoints: [
        {
          checkpoint_time: "2026-11-11T10:00:00Z",
          city: "León",
          message: "En reparto",
          coordinate: { latitude: 42.6, longitude: -5.57 },
        },
        {
          checkpoint_time: "2026-11-10T10:00:00Z",
          city: "Madrid",
          message: "Recogido",
        },
        {
          checkpoint_time: "2026-11-10T11:00:00Z",
          city: "Bad",
          coordinate: { latitude: 100, longitude: 0 },
        },
      ],
    },
    "correos",
  );
  assert.equal(p.status, "delivery");
  assert.equal(p.route.length, 1);
  assert.equal(p.route[0].name, "León");
  assert.equal(p.events[0].title, "En reparto");
  assert.equal(p.eta, null);
});
test("push rejects local and attacker-controlled endpoints", () => {
  const keys = { p256dh: "test", auth: "test" };
  assert.equal(
    safeSubscription({ endpoint: "http://localhost/push", keys }),
    false,
  );
  assert.equal(
    safeSubscription({
      endpoint: "https://fcm.googleapis.com.evil.example/push",
      keys,
    }),
    false,
  );
  assert.equal(
    safeSubscription({
      endpoint: "https://fcm.googleapis.com:8443/push",
      keys,
    }),
    false,
  );
  assert.equal(
    safeSubscription({ endpoint: "https://fcm.googleapis.com/push", keys }),
    true,
  );
  assert.equal(
    safeSubscription({
      endpoint: "https://updates.push.services.mozilla.com/push",
      keys,
    }),
    true,
  );
});
test("missing provider credentials never produce fake tracking data", async () => {
  const old = process.env.TRAMO_AFTERSHIP_API_KEY;
  delete process.env.TRAMO_AFTERSHIP_API_KEY;
  try {
    await assert.rejects(
      lookup("CODE0001", "correos"),
      (e) => e.status === 503,
    );
  } finally {
    if (old) process.env.TRAMO_AFTERSHIP_API_KEY = old;
  }
});
test("API rejects cross-origin writes, malformed JSON, and unsupported methods", async () => {
  assert.equal(
    (
      await api(
        new Request("https://example.com/.netlify/functions/tramo-api/lookup", {
          method: "POST",
          headers: { origin: "https://attacker.example" },
          body: "{}",
        }),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await api(
        new Request("https://example.com/.netlify/functions/tramo-api/lookup", {
          method: "POST",
          body: "not-json",
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await api(
        new Request("https://example.com/.netlify/functions/tramo-api/lookup"),
      )
    ).status,
    405,
  );
});
test("scheduled worker loads and skips all network activity without credentials", async () => {
  const { default: worker } =
    await import("../../netlify/functions/tramo-sync.mjs");
  const response = await worker();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "not_configured" });
});
