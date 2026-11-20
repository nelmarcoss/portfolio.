# NMC Labs — Sistemas y proyectos digitales

**Un proyecto de [NMC Labs](https://nmclabs.dev/) · 2026.**

**[Visitar la web](https://nmclabs.dev/) · [NMC Labs](https://nmclabs.dev/)**

## Vista previa

<a href="https://nmclabs.dev/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/preview-dark.png">
    <img src="docs/images/preview.png" width="960" alt="Vista previa de NMC Labs — Sistemas y proyectos digitales">
  </picture>
</a>

[Vista clara](docs/images/preview.png) · [Vista oscura](docs/images/preview-dark.png) · [Vista móvil](docs/images/mobile.png)

## Qué es

Mi espacio para desarrollar aplicaciones, explorar ideas y compartir mi evolución desde las primeras webs hasta proyectos propios.

## Qué incluye

- platto, Puntual, amano, estancia, atlas y tramo como proyectos destacados, con año y contexto.
- estancia: reservas, tipos y cupos, tarifas de temporada, prellegada e informes para hoteles, apartamentos y alojamientos rurales; conexiones con canales explicadas como implantación a preparar.
- amano: inventario de equipos de empresa, custodia, préstamos, mantenimiento y etiquetas QR en una demo completa.
- Puntual: presentación comercial y demo conectada de reservas y agenda para barberías y peluquerías.
- GTA VI · Cuenta atrás conserva la espera original con simulación histórica, portada de paisajes, recuerdos descargables y cronología regional; PC figura por confirmar. GTA VI y 29N son herramientas de actualidad. El especial electoral reúne sondeos con fuentes, candidaturas, cuatro elecciones, provincias y pactómetro.
- Originales de SkullScape (2023), tinyspace (2022) y El Estanque Azul (2021).
- La nueva granja, Tinyspace y Skullscape (2026), junto a sus originales y con sus casos de estudio.
- Portadas comerciales de marca, sin puntos decorativos: carta, patrimonio, ruta, agenda, mobiliario, granja, auriculares y actualidad.
- Botones de proyecto unificados: mismo cuadro, color y tamaño en destacados, actualidad y evolución.
- Diseño adaptable, tema automático y navegación por teclado.

## Alcance y límites

Es un portfolio público. No muestra los datos privados de atlas ni de tramo. La nueva granja, Tinyspace y Skullscape se pueden visitar; sus repositorios son privados. El contacto abre la aplicación de correo del visitante.

## Tecnología

HTML, CSS y JavaScript sin dependencias de ejecución. Node.js 26.13.1 LTS para construir.

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

Las 14 portadas de proyectos comparten una composición de marca y producto, con ilustraciones independientes para modo claro y oscuro. `<picture>` selecciona la variante del sistema y responde a cambios de apariencia. Los proyectos originales conservan sus capturas reales dentro del mismo marco.

Para regenerarlas: `npm ci`, `npm run covers` y `npm run build`. Los archivos finales se versionan para no regenerar imágenes durante cada despliegue.

## Entorno de desarrollo

Usamos Node.js **26.13.1** y npm **12.2.3**, fijados también en Netlify. Antes de instalar:

```sh
nvm use
npm install --global npm@12.2.3
npm ci
npm test
npm run build
```

Todas las dependencias directas se han contrastado con la etiqueta estable `latest` del registro npm. Node 26.13.1 es la versión estable LTS; se excluyen las versiones alfa y beta. El entorno usa npm 12.2.3, lockfiles actualizados y versiones exactas. Se mantienen activas las comprobaciones de auditoría, los avisos de actualización y la restricción de descargas remotas de npm 12.
