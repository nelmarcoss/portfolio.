import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/proyectos', { recursive: true });
for (const file of ['index.html', 'estilos.css', 'portfolio.js', 'robots.txt', 'sitemap.xml', 'social-preview.png', 'favicon.ico', 'favicon-96.png', 'apple-touch-icon.png']) {
  await cp(file, `dist/${file}`);
}
for (const file of ['puntual-card.webp', 'showcase-puntual.png', 'gtacountdown-card.webp', '29n-card.webp', 'showcase-gtacountdown.png', 'showcase-29n.png', 'skullscape.html', 'skullscape-original.png', 'skullscape-redesign.png', 'skullscape-configurador.png', 'skullscape-original-card.webp', 'skullscape-redesign-card.webp', 'showcase-skullscape.png', 'tinyspace-original-card.webp', 'tinyspace-redesign-card.webp', 'estanque-original-card.webp', 'estanque-redesign-card.webp', 'favicon2.png', 'skullscape-cover.webp', 'tinyspace-cover.webp', 'estanque-azul-cover.webp', 'estanque-original.webp', 'estanque-azul.html', 'estanque-redesign.png', 'estanque-configurador.png', 'showcase-platto.png', 'showcase-tramo.png', 'showcase-atlas.png', 'showcase-granja.png', 'tinyspace.html', 'tinyspace-redesign.png', 'tinyspace-original.png', 'tinyspace-planner.png', 'showcase-tinyspace.png']) {
  await cp(`proyectos/${file}`, `dist/proyectos/${file}`);
}
console.log('Portfolio built in dist/');
