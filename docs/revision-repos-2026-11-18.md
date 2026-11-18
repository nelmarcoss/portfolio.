# Revisión de repositorios · 18 de noviembre de 2026

## Alcance

Once proyectos nuevos revisados. Las webs originales se conservan como parte del historial.

## Dependencias

| Proyecto | Avisos de npm audit |
| --- | --- |
| portfolio | 0 |
| amano | 0 |
| puntual | 0 |
| atlas | 0 |
| platto | 0 |
| tramo | 0 |
| tiny | 0 |
| granja | 0 |
| audio | 0 |
| gta | 0 |
| 29n | 0 |

La comprobación corresponde a las dependencias fijadas en los lockfiles en esta revisión; no sustituye la revisión de aplicación o infraestructura.

## Cambios

- Atlas: actualizaciones de mantenimiento de Next.js, Supabase, Shadcn y calendario; comando npm test reproducible. Suite TypeScript y aislamiento de servidor: 36 comprobaciones correctas. Retirado el ensayo SQLite obsoleto, que dependía de migraciones Drizzle que ya no existen.
- Platto: corregido un aviso leve en esbuild mediante una versión fijada en la dependencia de desarrollo tsx. Pruebas y compilación correctas.
- Tramo: actualización de mantenimiento del cliente Supabase y Playwright; pruebas y compilación correctas.
- Tinyspace y Granja: lockfiles para sus proyectos sin dependencias externas.
- Portfolio: 13 portadas con variantes claras y oscuras, selección nativa del sistema, recursos y generador documentados.
- amano: perfil de empresa, logotipo completo, cabecera y etiquetas identificadas, portada con material visible y capturas actualizadas.
- Perfil de GitHub: portadas adaptadas a claro y oscuro.

Se conservan las versiones principales y las herramientas estables cuya actualización requeriría revisar una migración. No se modifican esquemas, permisos ni datos de producción.
