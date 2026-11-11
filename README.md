# Nel Marcos — Portfolio

Portfolio personal de sistemas y proyectos digitales. Incluye Atlas, Tramo y los tres proyectos originales: SkullScape, tinyspace y El Estanque Azul.

## Proyectos incluidos

| Proyecto | Descripción | Demo |
| --- | --- | --- |
| Tramo | Seguimiento de paquetes: presentación, demo y cuenta personal. | [Tramo](https://nelmarcos.netlify.app/tramo/) |
| Atlas | Seguimiento privado del patrimonio; presentación pública de la aplicación. | [Atlas](https://atlas-nelmarcos.netlify.app/) |
| SkullScape. | Landing de una marca ficticia de auriculares. | [Demo](https://skullscape.netlify.app) |
| tinyspace. | Concepto de web de mobiliario y catálogo. | [Demo](https://tinyyspace.netlify.app) |
| El Estanque Azul | Proyecto académico de una granja ficticia. | [Demo](https://estanqueazul.netlify.app) |

## Publicación

- Portfolio: https://nelmarcos.netlify.app
- Atlas: https://atlas-nelmarcos.netlify.app/ (alojamiento independiente).
- Cada cambio en `main` se publica mediante la conexión existente entre GitHub y Netlify.
- Se utilizan las direcciones gratuitas de Netlify. No hay un dominio propio previsto.

## Desarrollo

El portfolio usa HTML, CSS y JavaScript. Tramo es una aplicación React con Vite, Supabase y funciones de Netlify. Dependencias fijadas y lockfile versionado.

```sh
npm ci
npm test
npm run build
```

Netlify usa Node.js 22 y publica únicamente `dist/`. El script de construcción copia solo los archivos públicos necesarios. Las imágenes WebP son versiones optimizadas de los originales conservados en `proyectos/`.

La página del portfolio funciona sin JavaScript; este solo actualiza el año del pie. Tramo requiere JavaScript. El tema se adapta a la preferencia del dispositivo. El portfolio no incorpora analítica ni datos financieros de Atlas. Tramo tiene sus propios formularios, sesión y almacenamiento independiente. Consulta [la documentación de Tramo](tramo/README.md).

## Estructura

- `index.html`: presentación, proyectos, sobre mí y contacto.
- `estilos.css`: diseño adaptable y temas claro y oscuro.
- `portfolio.js`: actualización del año del pie.
- `proyectos/`: imágenes y recursos visuales.
- `build.mjs`: generación de la carpeta pública `dist/`.
- `tramo/`: aplicación, demo, esquema de datos y pruebas de Tramo.
- `netlify/functions/`: seguimiento, suscripciones push y sincronización programada.
- `netlify.toml`: configuración de construcción y publicación.

## Autor

**Nel Marcos** · [LinkedIn](https://www.linkedin.com/in/nelmarcos/) · [Contacto](mailto:nelmarcos@icloud.com)
