self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data?.json() || {};
  } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title || "Novedades en Tramo", {
      body: data.body || "Tu paquete tiene un nuevo movimiento.",
      icon: "/tramo/icon.svg",
      tag: data.tag || "tramo",
      data: { url: "/tramo/app" },
    }),
  );
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        const win = list.find((c) =>
          new URL(c.url).pathname.startsWith("/tramo"),
        );
        return win ? win.focus() : clients.openWindow("/tramo/app");
      }),
  );
});
