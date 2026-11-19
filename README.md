# NMC Labs — Sistemas y proyectos digitales

**Un proyecto de [NMC Labs](https://nmclabs.dev/) · 2026.**

**[Visitar la web](https://nmclabs.dev/) · [NMC Labs](https://nmclabs.dev/)**

## Vista previa

[![Vista previa de NMC Labs](docs/images/preview.png)](https://nmclabs.dev/)

Captura de la versión mantenida en este repositorio.

[![Vista previa en modo oscuro](docs/images/preview-dark.png)](https://nmclabs.dev/)

## Qué es

Mi espacio para desarrollar aplicaciones, explorar ideas y compartir mi evolución desde las primeras webs hasta proyectos propios.

## Qué incluye

- platto, Puntual, amano, atlas y tramo como proyectos destacados, con año y contexto.
- amano: inventario de equipos de empresa, custodia, préstamos, mantenimiento y etiquetas QR en una demo completa.
- Puntual: presentación comercial y demo conectada de reservas y agenda para barberías y peluquerías.
- GTA VI · Cuenta atrás conserva la espera original con simulación histórica, portada de paisajes, recuerdos descargables y cronología regional; PC figura por confirmar. GTA VI y 29N son herramientas de actualidad. El especial electoral reúne sondeos con fuentes, candidaturas, cuatro elecciones, provincias y pactómetro.
- Originales de SkullScape (2023), tinyspace (2022) y El Estanque Azul (2021).
- La nueva granja, Tinyspace y Skullscape (2026), junto a sus originales y con sus casos de estudio.
- Portadas comerciales de marca, sin puntos decorativos: carta, patrimonio, ruta, agenda, mobiliario, granja, auriculares y actualidad.
- Botones de proyecto unificados: mismo cuadro, color y tamaño en destacados, actualidad y evolución.
- Diseño adaptable, tema automático y navegación por teclado.

![Puntual: reservas y agenda para negocios](proyectos/showcase-puntual.png?v=3)

## Alcance y límites

Es un portfolio público. No muestra los datos privados de atlas ni de tramo La nueva granja, Tinyspace y Skullscape se pueden visitar; sus repositorios son privados. El contacto abre la aplicación de correo del visitante.

## Tecnología

HTML, CSS y JavaScript sin dependencias de ejecución. Node.js 22 para construir.

## Desarrollo y comprobación

```sh
node --check portfolio.js
node build.mjs
```

El contenido principal permanece accesible sin JavaScript. Los scripts añaden la adaptación al idioma del navegador y las mejoras de interacción.

## Publicación

La portada es la única página indexable del portfolio; los casos de evolución conservan sus enlaces y llevan `noindex`. Incluye SEO orgánico: títulos descriptivos, canónicas, vistas previas al compartir, datos estructurados, `robots.txt` y `sitemap.xml`. Las pantallas de cuenta y demos no forman parte del sitemap y llevan `noindex` cuando existen. [Guía de verificación en Search Console](docs/seo.md).

Netlify construye `main` con `node build.mjs` y publica `dist/`. Dominio: https://nmclabs.dev/. Cada aplicación se aloja de forma independiente.

## Estructura

- `index.html`, `estilos.css`, `portfolio.js`: web del portfolio.
- `proyectos/`: portadas y casos de estudio de El Estanque Azul, Tinyspace y Skullscape
- `docs/images/`: capturas para la documentación.
- `build.mjs`, `netlify.toml`: construcción y publicación.

## Autoría

Creado por **Nel**, detrás de [NMC Labs](https://nmclabs.dev/). [Perfil de GitHub](https://github.com/nelmarcoss) · [LinkedIn](https://www.linkedin.com/in/nelmarcos/).

Contacto público: [info@nmclabs.dev](mailto:info@nmclabs.dev).

Las tarjetas de platto, atlas, tramo, GTA VI y 29N explican la idea, el reto y la decisión de diseño de cada proyecto en un desplegable cerrado al entrar.

## Idioma del sistema

La interfaz detecta los idiomas preferidos del navegador: español o inglés, con inglés como alternativa si no hay coincidencia. La traducción se incluye en los archivos de la web, sin servicios externos. Los valores de formularios y los registros no se modifican. Las URL, los datos guardados y la versión española para buscadores se mantienen.

## Portadas según el sistema

Las 13 portadas de proyectos comparten una composición de marca y producto, con ilustraciones independientes para modo claro y oscuro. `<picture>` selecciona la variante del sistema y responde a cambios de apariencia. Los proyectos originales conservan sus capturas reales dentro del mismo marco.

Para regenerarlas: `npm ci`, `npm run covers` y `npm run build`. Los archivos finales se versionan para no regenerar imágenes durante cada despliegue.

## Entorno de desarrollo

Usamos Node.js **22.23.5** y npm **11.21.3**, fijados también en Netlify. Antes de instalar:

```sh
nvm use
npm install --global npm@11.21.3
npm ci
npm test
npm run build
```

npm 12 queda pendiente de compatibilidad: su nueva restricción de dependencias remotas bloquea una dependencia opcional de Tailwind en Atlas. Mantenemos la última versión de npm 11 sin desactivar esa protección. Las dependencias se guardan con versiones exactas; se oculta el aviso genérico de actualización de npm, pero la auditoría sigue activa. Revisión del 19 de noviembre de 2026: pruebas, compilación y auditoría completadas sin avisos de vulnerabilidades conocidas.
