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

- Platto, Atlas y Tramo como proyectos destacados, con año y contexto.
- Originales de SkullScape (2023), tinyspace (2022) y El Estanque Azul (2021).
- La nueva granja y Tinyspace (2026), junto a sus originales y con sus casos de estudio.
- Diseño adaptable, tema automático y navegación por teclado.

## Alcance y límites

Es un portfolio público. No muestra los datos privados de Atlas ni de Tramo. La nueva granja y Tinyspace se pueden visitar; sus repositorios son privados. El contacto abre la aplicación de correo del visitante.

## Tecnología

HTML, CSS y JavaScript sin dependencias de ejecución. Node.js 22 para construir.

## Desarrollo y comprobación

```sh
node --check portfolio.js
node build.mjs
```

La página funciona sin JavaScript; el script solo actualiza el año del pie.

## Publicación

Incluye SEO orgánico: títulos descriptivos, canónicas, vistas previas al compartir, datos estructurados, `robots.txt` y `sitemap.xml`. Las pantallas de cuenta y demos no forman parte del sitemap y llevan `noindex` cuando existen. [Guía de verificación en Search Console](docs/seo.md).

Netlify construye `main` con `node build.mjs` y publica `dist/`. Dominio: https://nmclabs.dev/. Cada aplicación se aloja de forma independiente.

## Estructura

- `index.html`, `estilos.css`, `portfolio.js`: web del portfolio.
- `proyectos/`: portadas y casos de estudio de El Estanque Azul y Tinyspace.
- `docs/images/`: capturas para la documentación.
- `build.mjs`, `netlify.toml`: construcción y publicación.

## Autoría

Creado por **Nel**, detrás de [NMC Labs](https://nmclabs.dev/). [Perfil de GitHub](https://github.com/nelmarcoss) · [LinkedIn](https://www.linkedin.com/in/nelmarcos/).
