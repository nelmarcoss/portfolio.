# Nel Marcos — Portfolio

Portfolio personal de sistemas y proyectos digitales. Incluye Atlas y los tres proyectos originales: SkullScape, tinyspace y El Estanque Azul.

## Publicación

- Portfolio: https://nelmarcos.netlify.app
- Atlas: https://atlas.nelmarcos.chatgpt.site/atlas (alojamiento independiente).
- Cada cambio en `main` se publica mediante la conexión existente entre GitHub y Netlify.
- Se utilizan las direcciones gratuitas de Netlify. No hay un dominio propio previsto.

## Desarrollo

HTML, CSS y JavaScript sin dependencias de ejecución ni gestor de paquetes.

```sh
node --check portfolio.js
node build.mjs
```

Netlify usa Node.js 22 y publica únicamente `dist/`. El script de construcción copia solo los archivos públicos necesarios. Las imágenes WebP son versiones optimizadas de los originales conservados en `proyectos/`.

La web funciona sin JavaScript; este solo actualiza el año del pie. El tema se adapta a la preferencia del dispositivo. No incorpora analítica, formularios, cookies ni datos financieros de Atlas.
