import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/proyectos', { recursive: true });
for (const file of ['index.html', 'estilos.css', 'portfolio.js']) {
  await cp(file, `dist/${file}`);
}
for (const file of ['favicon2.png', 'skullscape-cover.webp', 'tinyspace-cover.webp', 'estanque-azul-cover.webp']) {
  await cp(`proyectos/${file}`, `dist/proyectos/${file}`);
}
console.log('Portfolio built in dist/');
