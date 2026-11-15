# Indexación de NMC Labs y sus proyectos

Las páginas públicas de NMC Labs, Platto, Atlas, Tramo, el nuevo Estanque Azul y Tinyspace tienen títulos descriptivos, descripción, URL canónica, robots.txt, sitemap y metadatos de Open Graph y Twitter. Los datos estructurados describen proyectos reales; la granja se identifica como ficticia. No se añaden reseñas, ofertas comerciales ni direcciones inventadas a los datos estructurados; los precios de la tienda Tinyspace se identifican como demostración.

Las demos y pantallas de cuenta de Platto, Atlas y Tramo, y la compra simulada de Tinyspace, llevan `noindex`. Las rutas privadas quedan fuera de los sitemaps. La autenticación sigue controlando el acceso; `robots.txt` no es una medida de privacidad.

## Google Search Console: paso del propietario

La publicación del código no verifica automáticamente la propiedad en Search Console ni envía sitemaps a Google. Estos pasos requieren la cuenta de Google del propietario y acceso al proveedor DNS.

1. Entra con tu cuenta en https://search.google.com/search-console y añade una propiedad de tipo **Dominio** con el valor `nmclabs.dev` (sin https ni rutas). Esta propiedad cubre también todos sus subdominios.
2. Añade en tu proveedor DNS el registro TXT de verificación que indique Google y pulsa **Verificar**. Utiliza el valor exacto que muestre tu cuenta.
3. En **Sitemaps**, envía estas seis direcciones:

- https://nmclabs.dev/sitemap.xml
- https://platto.nmclabs.dev/sitemap.xml
- https://atlas.nmclabs.dev/sitemap.xml
- https://tramo.nmclabs.dev/sitemap.xml
- https://granja.nmclabs.dev/sitemap.xml
- https://tiny.nmclabs.dev/sitemap.xml

4. En **Inspección de URLs**, revisa cada página principal y solicita su indexación. Google limita las solicitudes y decide si indexa cada URL.

Revisa después **Indexación → Páginas** y **Rendimiento** para distinguir URLs descubiertas, rastreadas, indexadas y consultas que ya generan impresiones. Los cambios pueden tardar días o semanas; publicar un sitemap no garantiza posiciones.

## Mantenimiento

Usa siempre los dominios de producción en las canónicas y en los enlaces públicos de GitHub y LinkedIn. Al añadir una página pública, incluye solo su URL canónica en el sitemap de su propio dominio. No añadas al sitemap cuentas, enlaces con tokens, demos ni URLs de Netlify o localhost.

Tramo genera HTML de inicio legible sin JavaScript y shells de cuenta/demo con `noindex` en el postbuild. Sus metadatos también se actualizan al navegar dentro de la aplicación. Los scripts JSON-LD de las webs estáticas tienen hashes explícitos en su política CSP.

Tinyspace publica treinta fichas de producto con enlaces HTML rastreables, además de tienda, planificador, empresas y proyecto. El checkout demo queda fuera del índice. El Estanque Azul publica nueve páginas indexables: una portada editorial de presentación y un configurador separado con contenido y canónica propios. La duración se calcula según las experiencias y la comida. Ambas webs generan sus metadatos y hashes CSP en el build; no presentan ofertas o reservas comerciales ficticias en los datos estructurados.

## Comprobación después de enviar los sitemaps

El estado «Correcto» indica que Google ha podido leer el sitemap; las páginas descubiertas no equivalen a páginas indexadas o posicionadas. A fecha de esta versión, los sitemaps públicos contienen:

| Sitio | URLs públicas en el sitemap |
| --- | ---: |
| NMC Labs | 3 |
| Platto | 3 |
| Atlas | 1 |
| Tramo | 1 |
| El Estanque Azul | 9 |
| Tinyspace | 34 |

Las pantallas privadas y demos excluidas no deben añadirse para aumentar esas cifras. Si Search Console muestra cifras anteriores, necesita volver a leer y procesar el sitemap. No es necesario borrar la propiedad o los sitemaps enviados.

Si falta Tinyspace, envía `https://tiny.nmclabs.dev/sitemap.xml` en la propiedad de dominio ya verificada. Para las páginas principales que no aparecen, usa **Inspección de URLs → Probar URL publicada → Solicitar indexación**. Consulta después el motivo concreto de «Indexación de páginas»: descubierta sin indexar, rastreada sin indexar, duplicada o bloqueada requieren diagnósticos distintos. Repetir solicitudes no acelera el rastreo.

Cada web dispone de un favicon PNG cuadrado de 96×96, un ICO multirresolución y un icono Apple, accesibles sin autenticación. Las versiones SVG se conservan para navegadores. El favicon de Tramo reproduce el mismo símbolo de ruta que su logo. Google debe volver a rastrear la portada y los iconos; su aparición y el plazo no se pueden garantizar.

Referencias oficiales: [solicitar un nuevo rastreo](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=es) y [favicons en los resultados](https://developers.google.com/search/docs/appearance/favicon-in-search?hl=es).

## Skullscape · Rediseño 2026

Dominio: https://audio.nmclabs.dev/. Enviar https://audio.nmclabs.dev/sitemap.xml en Search Console: incluye nueve URLs públicas, entre ellas las fichas de S1, S2 y PRO. La bolsa y la compra demo llevan `noindex` y quedan fuera del sitemap. El caso de evolución está en https://nmclabs.dev/proyectos/skullscape.
