export const carriers = [
  ["correos", "Correos"],
  ["correos-express", "Correos Express"],
  ["seur", "SEUR"],
  ["mrw", "MRW"],
  ["dhl", "DHL"],
  ["ups", "UPS"],
  ["gls", "GLS"],
  ["fedex", "FedEx"],
];
export const states = {
  pending: "Pendiente",
  transit: "En camino",
  delivery: "En reparto",
  delivered: "Entregado",
  exception: "Incidencia",
};
export const demoPackages = [
  {
    id: "demo-1",
    alias: "Algo para perderse",
    shop: "Casa del Libro",
    tracking_number: "TRAMO000001",
    carrier: "correos",
    status: "delivery",
    eta: "Hoy, de 16:00 a 20:00",
    updated_at: "2026-11-11T11:32:00Z",
    route: [
      { name: "Madrid", lat: 40.42, lng: -3.7 },
      { name: "Valladolid", lat: 41.65, lng: -4.72 },
      { name: "León", lat: 42.6, lng: -5.57 },
    ],
    events: [
      {
        date: "Hoy · 11:32",
        title: "Tu paquete está en reparto",
        location: "León · Unidad de reparto",
      },
      {
        date: "Hoy · 07:18",
        title: "Ha llegado al centro de destino",
        location: "León",
      },
      {
        date: "Ayer · 22:46",
        title: "Sigue su camino",
        location: "Valladolid · Centro logístico",
      },
      { date: "Ayer · 15:10", title: "Paquete recogido", location: "Madrid" },
    ],
  },
  {
    id: "demo-2",
    alias: "Un poco más de música",
    shop: "Audio Studio",
    tracking_number: "TRAMO000002",
    carrier: "dhl",
    status: "transit",
    eta: "Mañana, 12 nov.",
    updated_at: "2026-11-11T09:15:00Z",
    route: [
      { name: "Barcelona", lat: 41.39, lng: 2.17 },
      { name: "Zaragoza", lat: 41.65, lng: -0.89 },
    ],
    events: [
      {
        date: "Hoy · 09:15",
        title: "En tránsito hacia el destino",
        location: "Zaragoza",
      },
      {
        date: "Ayer · 18:40",
        title: "Paquete recogido",
        location: "Barcelona",
      },
    ],
  },
  {
    id: "demo-3",
    alias: "Mi rincón favorito",
    shop: "tinyspace",
    tracking_number: "TRAMO000003",
    carrier: "seur",
    status: "exception",
    eta: "Fecha pendiente de confirmar",
    updated_at: "2026-11-11T08:40:00Z",
    route: [],
    events: [
      {
        date: "Hoy · 08:40",
        title: "Retraso en el centro logístico",
        location: "El transportista actualizará la fecha de entrega.",
      },
      { date: "Ayer · 19:20", title: "Paquete recogido", location: "Valencia" },
    ],
  },
  {
    id: "demo-4",
    alias: "Listas para salir",
    shop: "Weekend",
    tracking_number: "TRAMO000004",
    carrier: "gls",
    status: "delivered",
    eta: "Entregado ayer",
    updated_at: "2026-11-10T12:14:00Z",
    route: [],
    events: [
      {
        date: "Ayer · 12:14",
        title: "Entregado",
        location: "Recibido en destino",
      },
      { date: "Ayer · 08:10", title: "En reparto", location: "León" },
    ],
  },
];
