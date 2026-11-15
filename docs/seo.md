# Indexación de NMC Labs

## Política actual

Solo se promocionan en buscadores cuatro páginas principales:

- https://nmclabs.dev/
- https://atlas.nmclabs.dev/
- https://tramo.nmclabs.dev/
- https://platto.nmclabs.dev/

Cada sitio conserva su sitemap, con una sola URL. Las pantallas privadas y las demos de producto siguen fuera de la indexación. Los textos legales de Platto y los casos de evolución del portfolio llevan `noindex, follow` y quedan fuera de sus sitemaps.

Las nuevas demos de El Estanque Azul (`granja.nmclabs.dev`), Tinyspace (`tiny.nmclabs.dev`) y Skullscape (`audio.nmclabs.dev`), y los originales (`estanque.nmclabs.dev`, `tinyspace.nmclabs.dev`, `skullscape.nmclabs.dev`), permanecen accesibles desde el portfolio, con metadatos sociales y canónicas. Todas sus páginas llevan `noindex, follow`, reforzado con la cabecera `X-Robots-Tag`. No publican sitemaps ni los anuncian en robots.txt.

Se permite el rastreo para que Google pueda leer `noindex`. No añadir `Disallow: /`: impediría procesar la retirada de URLs ya indexadas. Esta política no hace privadas las webs; el acceso al código se gestiona por separado con repositorios privados.

## Search Console: conservar

En la propiedad de dominio `nmclabs.dev`, conservar o enviar:

- https://nmclabs.dev/sitemap.xml
- https://atlas.nmclabs.dev/sitemap.xml
- https://tramo.nmclabs.dev/sitemap.xml
- https://platto.nmclabs.dev/sitemap.xml

Los sitemaps actualizados del portfolio y Platto sustituyen sus listas anteriores: no hace falta borrarlos y crearlos de nuevo. Google deberá volver a procesarlos.

## Search Console: retirar si se enviaron

- https://granja.nmclabs.dev/sitemap.xml
- https://tiny.nmclabs.dev/sitemap.xml
- https://audio.nmclabs.dev/sitemap.xml
- Cualquier sitemap de los originales `estanque`, `tinyspace` o `skullscape`.

En cada entrada: abrir el sitemap y usar el menú de tres puntos → Quitar sitemap. No borrar la propiedad de dominio ni sus registros de verificación DNS, los dominios o los despliegues de las demos.

Quitar un sitemap no elimina por sí solo las páginas de Google. La retirada permanente se consigue cuando Google vuelve a rastrear y lee `noindex`. Para una retirada visible urgente puede usarse Retiradas → Nueva solicitud, seleccionando cuidadosamente el prefijo de la demo; esa ocultación es temporal y complementa `noindex`.

La indexación de las cuatro páginas principales y su posición final siguen dependiendo de Google. Inspección de URLs permite confirmar el estado de cada una. Los cambios pueden tardar días o semanas.

## Contacto

El contacto público de NMC Labs y sus productos es `info@nmclabs.dev`. La bandeja de entrada y los registros de correo se configuran en el proveedor de correo; cambiar los enlaces no crea el buzón.

## Referencias

- https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=es
- https://support.google.com/webmasters/answer/7451001?hl=es
