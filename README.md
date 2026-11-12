# Nel — Portfolio

Portfolio personal de sistemas y proyectos digitales. Incluye Atlas, Tramo, Platto y los tres proyectos originales: SkullScape, tinyspace y El Estanque Azul.

Platto encabeza los destacados, seguido de Atlas y Tramo; los tres mantienen su formato grande y su ilustración enlaza al proyecto. El símbolo de Nel aparece a la izquierda del nombre. Los destacados muestran su año de inicio (2026), comprobado en Git, e incluyen contexto desplegable, y las primeras webs muestran su año de inicio comprobado en Git: El Estanque Azul (2021), tinyspace (2022) y SkullScape (2023).

El Estanque Azul conserva su enlace original y añade un bloque de evolución con un [caso de estudio](https://nmclabs.dev/proyectos/estanque-azul.html). La reinterpretación tiene su propio repositorio, [nmclabs-estanqueazul](https://github.com/nelmarcoss/nmclabs-estanqueazul); el enlace a su nueva demo se incorporará cuando el despliegue esté verificado.


## Vista previa

![Portfolio de Nel](docs/images/portfolio.png)

## Proyectos incluidos

| Proyecto | Descripción | Demo |
| --- | --- | --- |
| Platto | Carta digital para restaurantes, demo de carnes y bodega, editor y QR permanente. | [Platto](https://platto.nmclabs.dev/) |
| Tramo | Seguimiento de paquetes: presentación, demo y cuenta personal. | [Tramo](https://tramo.nmclabs.dev/) |
| Atlas | Seguimiento privado del patrimonio; presentación pública de la aplicación. | [Atlas](https://atlas.nmclabs.dev/) |
| SkullScape. | Landing de una marca ficticia de auriculares. | [Demo](https://skullscape.nmclabs.dev) |
| tinyspace. | Concepto de web de mobiliario y catálogo. | [Demo](https://tinyspace.nmclabs.dev) |
| El Estanque Azul | Proyecto académico de una granja ficticia. | [Demo](https://estanque.nmclabs.dev) |

## Publicación

- Portfolio: https://nmclabs.dev
- Atlas: https://atlas.nmclabs.dev/ (alojamiento independiente).
- Tramo: https://tramo.nmclabs.dev/ (alojamiento y repositorio independientes).
- Platto: https://platto.nmclabs.dev/ (alojamiento y repositorio independientes). Código en https://github.com/nelmarcoss/Platto.
- Las antiguas rutas `/tramo/*` redirigen al sitio independiente.
- Cada cambio en `main` se publica mediante la conexión existente entre GitHub y Netlify.
- Dominio propio `nmclabs.dev`, con subdominios para cada proyecto y alojamiento en Netlify.

## Desarrollo

El portfolio usa HTML, CSS y JavaScript, sin dependencias de ejecución. Tramo tiene su propio repositorio privado y publicación independiente en Netlify.

```sh
node --check portfolio.js
node build.mjs
```

Netlify usa Node.js 22 y publica únicamente `dist/`. El script de construcción copia solo los archivos públicos necesarios. Las imágenes WebP son versiones optimizadas de los originales conservados en `proyectos/`.

La página del portfolio funciona sin JavaScript; este solo actualiza el año del pie. Tramo, alojado de forma independiente, requiere JavaScript. El tema se adapta a la preferencia del dispositivo. El portfolio no incorpora analítica ni datos financieros de Atlas. Tramo tiene sus propios formularios y sesión. Platto es una presentación comercial estática con demo local, sin cuentas ni conexión a Supabase; las soluciones contratadas se prepararán de forma independiente para cada cliente. El código de Tramo está en https://github.com/nelmarcoss/Tramo y su documentación está en ese repositorio.

## Estructura

- `index.html`: presentación, proyectos, sobre mí y contacto.
- `estilos.css`: diseño adaptable y temas claro y oscuro.
- `portfolio.js`: actualización del año del pie.
- `proyectos/`: imágenes y recursos visuales.
- `build.mjs`: generación de la carpeta pública `dist/`.
- `netlify.toml`: configuración de construcción y publicación.

## Autor

**Nel** · [LinkedIn](https://www.linkedin.com/in/nelmarcos/) · [Contacto](mailto:nelmarcos@icloud.com)

