# Indexación de NMC Labs y sus proyectos

Las páginas públicas de NMC Labs, Platto, Atlas, Tramo y el nuevo Estanque Azul tienen títulos descriptivos, descripción, URL canónica, robots.txt, sitemap y metadatos de Open Graph y Twitter. Los datos estructurados describen proyectos reales; la granja se identifica como ficticia. No se publican reseñas, precios ni direcciones inventados.

Las demos y pantallas de cuenta de Platto, Atlas y Tramo llevan `noindex`. Las rutas privadas quedan fuera de los sitemaps. La autenticación sigue controlando el acceso; `robots.txt` no es una medida de privacidad.

## Google Search Console: paso del propietario

La publicación del código no verifica automáticamente la propiedad en Search Console ni envía sitemaps a Google. Estos pasos requieren la cuenta de Google del propietario y acceso al proveedor DNS.

1. Entra con tu cuenta en https://search.google.com/search-console y añade una propiedad de tipo **Dominio** con el valor `nmclabs.dev` (sin https ni rutas). Esta propiedad cubre también todos sus subdominios.
2. Añade en tu proveedor DNS el registro TXT de verificación que indique Google y pulsa **Verificar**. Utiliza el valor exacto que muestre tu cuenta.
3. En **Sitemaps**, envía estas cinco direcciones:

- https://nmclabs.dev/sitemap.xml
- https://platto.nmclabs.dev/sitemap.xml
- https://atlas.nmclabs.dev/sitemap.xml
- https://tramo.nmclabs.dev/sitemap.xml
- https://granja.nmclabs.dev/sitemap.xml

4. En **Inspección de URLs**, revisa cada página principal y solicita su indexación. Google limita las solicitudes y decide si indexa cada URL.

Revisa después **Indexación → Páginas** y **Rendimiento** para distinguir URLs descubiertas, rastreadas, indexadas y consultas que ya generan impresiones. Los cambios pueden tardar días o semanas; publicar un sitemap no garantiza posiciones.

## Mantenimiento

Usa siempre los dominios de producción en las canónicas y en los enlaces públicos de GitHub y LinkedIn. Al añadir una página pública, incluye solo su URL canónica en el sitemap de su propio dominio. No añadas al sitemap cuentas, enlaces con tokens, demos ni URLs de Netlify o localhost.

Tramo genera HTML de inicio legible sin JavaScript y shells de cuenta/demo con `noindex` en el postbuild. Sus metadatos también se actualizan al navegar dentro de la aplicación. Los scripts JSON-LD de las webs estáticas tienen hashes explícitos en su política CSP.
