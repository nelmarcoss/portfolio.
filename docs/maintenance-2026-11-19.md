# Revisión del 19 de noviembre de 2026

Se han revisado los 15 repositorios: once proyectos con Node y cuatro repositorios estáticos o de perfil. Las webs originales mantienen su diseño y sus años reales.

## Entorno y validación

Node 26.13.1 LTS y npm 12.2.3 fijados en desarrollo, compilación de Netlify y los flujos de integración existentes. Todas las dependencias directas están en su última versión estable y las transitivas se han actualizado dentro de los rangos compatibles. Tailwind 4.3.5 resuelve el bloqueo de npm 12 encontrado en la revisión inicial. TypeScript 7.0.2 sustituye a la versión anterior y las pruebas aisladas de Atlas usan esbuild, conservando sus verificaciones. No se ha relajado la restricción de descargas remotas.

Los runtimes de funciones los administra Netlify según la disponibilidad de AWS Lambda; no se fuerza un runtime que el proveedor no admita.

En los once proyectos se han completado la comprobación de instalación con el lockfile, las pruebas, la compilación y npm audit, sin vulnerabilidades conocidas notificadas. También se han ejecutado las comprobaciones específicas disponibles. Esto no equivale a una auditoría completa de seguridad del código.

## GTA VI

Conserva su identidad de cuenta atrás y añade una simulación histórica separada del tiempo real, portada de paisajes con preferencia persistente, tarjeta de recuerdo con mensaje local y cronología regional basada en las fuentes de lanzamiento documentadas. PC permanece por confirmar. Las nuevas funciones están traducidas a los seis idiomas y comprobadas en Chromium y WebKit.

## Repositorios

README y capturas se revisan para reflejar el producto actual, manteniendo privados los repositorios de aplicaciones. Contacto común: info@nmclabs.dev.

Las descripciones «About» de GitHub quedan pendientes: la conexión rechaza su edición con HTTP 403 por falta de permisos de administración. El contenido de los repositorios sí se puede actualizar.

## Actualización posterior

La decisión provisional sobre npm 11 queda sustituida por la [actualización completa de dependencias](dependencies-2026-11-19.md): Node 26.13.1 LTS, npm 12.2.3, Tailwind 4.3.5 y TypeScript 7.0.2 con sus adaptaciones de compatibilidad.
