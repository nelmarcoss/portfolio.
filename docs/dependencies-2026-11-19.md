# Actualización completa · 19 de noviembre de 2026

Esta revisión sustituye la decisión provisional de mantener npm 11 de la revisión anterior. Se actualizan los once proyectos con Node a Node **26.13.1 LTS** y npm **12.2.3**. Se excluyen las versiones previas, incluida Node 27 alfa.

## Cambios de compatibilidad

- Tailwind y su plugin PostCSS pasan a 4.3.5: la instalación funciona con la restricción de descargas remotas de npm 12 intacta.
- TypeScript pasa a 7.0.2. Next usa su CLI nativa; las pruebas aisladas de Atlas pasan de la API JavaScript eliminada a esbuild.
- tsx pasa a 4.23.15, compatible con esbuild 0.28.2. Se retiran las sustituciones transitivas anteriores que ya no hacen falta.
- Los scripts de instalación de esbuild se autorizan por versión exacta; el aviso opcional de core-js se deniega explícitamente. No se habilitan scripts de dependencias globalmente.
- Se actualizan Netlify, las versiones locales y los flujos de integración existentes. Se reactivan los avisos de actualización de npm.
- Supabase ya está en su última versión estable: SDK 2.119.1 y SSR 0.12.7. No se cambian esquemas, permisos ni datos de producción.

## Dependencias directas

Versiones contrastadas con `latest` en el registro oficial npm:

| Paquete | Versión estable |
| --- | --- |
| @base-ui/react | 1.9.0 |
| @cloudflare/workers-types | 5.20261119.1 |
| @hookform/resolvers | 7.0.7 |
| @playwright/test | 1.65.1 |
| @shadcn/react | 0.3.1 |
| @supabase/ssr | 0.12.7 |
| @supabase/supabase-js | 2.119.1 |
| @tailwindcss/postcss | 4.3.5 |
| @types/node | 26.6.6 |
| @types/qrcode | 1.5.6 |
| @types/react | 19.3.0 |
| @types/react-dom | 19.3.0 |
| class-variance-authority | 0.7.1 |
| clsx | 2.1.1 |
| cmdk | 1.1.1 |
| date-fns | 4.4.0 |
| embla-carousel-react | 8.6.0 |
| esbuild | 0.28.2 |
| fflate | 0.8.3 |
| heic-to | 1.6.7 |
| input-otp | 1.5.0 |
| jspdf | 4.2.1 |
| lucide-react | 1.76.0 |
| next | 16.4.6 |
| next-themes | 0.4.6 |
| npm | 12.2.3 |
| prettier | 3.10.1 |
| qrcode | 1.5.4 |
| radix-ui | 1.8.1 |
| react | 19.3.1 |
| react-day-picker | 10.0.2 |
| react-dom | 19.3.1 |
| react-hook-form | 7.92.0 |
| react-resizable-panels | 4.24.1 |
| recharts | 3.11.0 |
| server-only | 0.0.1 |
| sharp | 0.35.5 |
| sonner | 2.0.8 |
| tailwind-merge | 3.7.0 |
| tailwindcss | 4.3.5 |
| tsx | 4.23.15 |
| tw-animate-css | 1.4.0 |
| typescript | 7.0.2 |
| vaul | 1.1.2 |
| vite | 8.3.8 |
| web-push | 4.0.0 |
| zod | 4.6.7 |

## Automatización

Las acciones de GitHub se actualizan a checkout v7.0.1 y setup-node v7.1.0, fijadas por SHA de sus etiquetas oficiales. Se conservan permisos, frecuencia y condiciones de ejecución de los flujos.

## Validación

En los once proyectos: instalación limpia con `npm ci`, pruebas, compilación y auditoría. `npm outdated --json` no informa de paquetes directos atrasados y `npm audit` no notifica vulnerabilidades conocidas. Las comprobaciones específicas disponibles también pasan. Se han probado las portadas en Chromium y WebKit, a tamaño móvil y escritorio, en claro y oscuro. Los recorridos de inventario/QR/CSV de amano y de reservas/caja de puntual pasan en ambos motores.

Los runtimes de funciones de producción los gestiona Netlify según las versiones admitidas por AWS Lambda; la versión fijada aquí corresponde al entorno de compilación y desarrollo.
