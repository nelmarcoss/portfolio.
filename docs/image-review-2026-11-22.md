# Revisión de imágenes · 22 de noviembre de 2026

Se revisaron los 18 repositorios de `nelmarcoss`, incluido el perfil personal, los productos y las tres webs originales.

## Resultado

- 618 archivos de imagen originales comprobados: todos se pueden decodificar; los SVG son XML válido y sus imágenes incrustadas no tienen referencias sin resolver.
- 501 rutas de imágenes publicadas comprobadas en los 17 dominios web, con respuesta de imagen correcta. La ruta original con un espacio en `comedero gallinas.jpeg` se comprobó codificada en la URL.
- 175 referencias de imagen o enlaces a vistas previas en los README: 148 URL públicas distintas, todas descargadas y comprobadas como imágenes.
- Los 18 README renderizados por la API de GitHub contienen direcciones HTTPS para sus imágenes. Se eliminaron las fuentes relativas de sus bloques `picture`.
- 87 copias públicas de presentación, identificadas por su contenido, verificadas byte a byte contra sus originales. El inventario está en `docs/readme-images.json`; la compilación rechaza una copia ausente o con una huella diferente.

Las portadas principales de los productos usan las variantes comerciales claras y oscuras del portfolio. Las capturas detalladas mantienen su contenido y disponen de direcciones públicas estables; no necesitan credenciales ni URL firmadas de un repositorio privado. No se publica código adicional de esos proyectos.

## Repositorios

| Repositorio | Resultado |
| --- | --- |
| nmclabs-estancia | README e imágenes comprobados |
| nmclabs-amano | README e imágenes comprobados |
| nmclabs-puntual | README e imágenes comprobados |
| nmclabs-nodo | Publicación, README e imágenes comprobados |
| nmclabs-apunto | README e imágenes comprobados |
| nelmarcoss | Perfil actualizado con nodo; imágenes comprobadas |
| portfolio. | nodo añadido; portadas y vistas previas comprobadas |
| nmclabs-29n | README e imágenes comprobados |
| El-Estanque-Azul | README e imágenes originales comprobados |
| Tramo | README e imágenes comprobados |
| tinyspace. | README e imágenes originales comprobados |
| SkullScape. | README e imágenes originales comprobados |
| nmclabs-skullscape | README e imágenes comprobados |
| nmclabs-estanqueazul | README e imágenes comprobados |
| nmclabs-tinyspace | README e imágenes comprobados |
| Platto | README e imágenes comprobados |
| atlas | README e imágenes comprobados |
| nmclabs-gtacountdown | README e imágenes comprobados |

## nodo

`https://nodo.nmclabs.dev/` sirve la compilación validada: 21 páginas y recursos, incluido el worker de hashes. Pasan las 13 pruebas de herramientas e interfaz. Se comprobaron favicon, sitemap, robots, `noindex` de privacidad y la CSP que bloquea conexiones de las herramientas.

El portfolio incorpora su portada comercial adaptativa, enlace en pestaña nueva e idea cerrada inicialmente. El perfil personal de GitHub también lo incluye.

## Alcance de la comprobación

Comprobación de archivos, integridad, respuestas HTTP, HTML renderizado por GitHub y pruebas automáticas de nodo. No se realizó una revisión visual con un navegador real en este entorno. La disponibilidad comprobada corresponde a la fecha de esta revisión.
