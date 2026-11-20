import { cp, mkdir, rm, readdir } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/proyectos', { recursive: true });
for (const file of ['index.html', 'estilos.css', 'portfolio.js', 'robots.txt', 'sitemap.xml', 'social-preview.png', 'profile-preview-light.png', 'profile-preview-dark.png', 'favicon.ico', 'favicon-96.png', 'apple-touch-icon.png']) {
  await cp(file, `dist/${file}`);
}
for (const file of ['estancia-brand.webp', 'showcase-estancia.png', 'amano-brand.webp', 'showcase-amano.png', 'platto-brand.svg', 'atlas-brand.svg', 'tramo-brand.svg', 'puntual-brand.svg', 'tinyspace-brand.svg', 'granja-brand.svg', 'skullscape-brand.svg', 'gtavi-brand.svg', '29n-brand.svg', 'platto-brand.webp', 'atlas-brand.webp', 'tramo-brand.webp', 'puntual-brand.webp', 'tinyspace-brand.webp', 'granja-brand.webp', 'skullscape-brand.webp', 'gtavi-brand.webp', '29n-brand.webp', 'puntual-card.webp', 'showcase-puntual.png', 'gtacountdown-card.webp', '29n-card.webp', 'showcase-gtacountdown.png', 'showcase-29n.png', 'skullscape.html', 'skullscape-original.png', 'skullscape-redesign.png', 'skullscape-configurador.png', 'skullscape-original-card.webp', 'skullscape-redesign-card.webp', 'showcase-skullscape.png', 'tinyspace-original-card.webp', 'tinyspace-redesign-card.webp', 'estanque-original-card.webp', 'estanque-redesign-card.webp', 'favicon2.png', 'skullscape-cover.webp', 'tinyspace-cover.webp', 'estanque-azul-cover.webp', 'estanque-original.webp', 'estanque-azul.html', 'estanque-redesign.png', 'estanque-configurador.png', 'showcase-platto.png', 'showcase-tramo.png', 'showcase-atlas.png', 'showcase-granja.png', 'tinyspace.html', 'tinyspace-redesign.png', 'tinyspace-original.png', 'tinyspace-planner.png', 'showcase-tinyspace.png']) {
  await cp(`proyectos/${file}`, `dist/proyectos/${file}`);
}
console.log('Portfolio built in dist/');

// Interface translations are bundled locally; no translation service is contacted.
for (const file of ["system-language-init.mjs", "system-language.mjs", "interface-en.mjs"]) await cp(file, `dist/${file}`);

// Mode-specific cover files; the browser downloads only its selected variant.
for (const file of await readdir("proyectos")) {
  if (/-(?:brand|original-card)-(?:light|dark)\.webp$/.test(file)) await cp(`proyectos/${file}`, `dist/proyectos/${file}`);
}
