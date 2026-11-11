# Tramo

Tus paquetes, en cada tramo. Aplicación de seguimiento de Nel, alojada bajo el portfolio existente y versionada en este repositorio.

## Rutas

- `/tramo/`: presentación, consulta rápida, preguntas frecuentes y enlaces a demo/cuenta.
- `/tramo/demo`: demo sin registro. Paquetes y recorridos ficticios; cambios en sessionStorage, sin correos ni solicitud de permisos.
- `/tramo/acceder`: registro, acceso y recuperación de contraseña con Supabase Auth.
- `/tramo/recuperar`: cambio de contraseña tras verificar el enlace de recuperación.
- `/tramo/app`: paquetes privados, historial y preferencias.

El portfolio enlaza siempre a la presentación. Se puede desplegar como aplicación independiente cambiando `base`, rutas y URL de avisos; actualmente comparte la publicación existente de Netlify.

## Desarrollo

```sh
npm ci
npm run dev
npm test
npm run build
```

Vite sirve http://localhost:5173/tramo/. El frontend se genera en `dist/tramo/`; el portfolio permanece en `dist/`. Las funciones necesitan Netlify para ejecutarse; el servidor Vite solo sirve la interfaz. Node >=22.12. No hay código externo servido por CDN.

## Base de datos y cuentas

Proyecto independiente `Tramo`, región París, ref `hhnnrjcjletabezxazwc`. No reutiliza tablas, usuarios ni secretos de Atlas. La configuración pública está en `src/config.js`. `database/schema.sql` corresponde a la migración aplicada `tramo_initial_schema`.

RLS en todas las tablas, índices de propietario, claves foráneas con borrado en cascada y permisos por columna: el cliente puede añadir sus paquetes y eliminar sus datos, pero no modificar estados, ubicaciones ni eventos del proveedor. La bandeja de notificaciones es exclusiva del servidor: RLS sin políticas de cliente es intencionado. La sesión se conserva en el navegador mediante Supabase Auth PKCE. Cada consulta privada se autoriza en Supabase; los endpoints de push verifican el token con `getUser`.

**Configuración necesaria en Supabase Auth > URL Configuration**:

- Site URL: `https://nelmarcos.netlify.app/tramo/app`
- Redirect URLs: `https://nelmarcos.netlify.app/tramo/app` y `https://nelmarcos.netlify.app/tramo/recuperar`
- Para desarrollo, autorizar también `http://localhost:5173/tramo/**`.

La confirmación de correo está activada. Configurar SMTP propio para abrir registros al público: el correo predeterminado de Supabase tiene restricciones de destinatarios y límites estrictos. No se han creado usuarios de prueba ni enviado correos durante la implementación.

## Servicios externos: pendientes de credenciales

Configurar las variables de `.env.example` en Netlify, con ámbito Functions, y volver a desplegar. Nunca introducir secretos en el frontend, el repositorio o el chat.

- `TRAMO_SUPABASE_SECRET_KEY`: clave secreta **del proyecto Tramo**. Necesaria para guardar suscripciones push y la sincronización programada. La clave publicable ya está configurada en el cliente.
- `TRAMO_AFTERSHIP_API_KEY`: API Tracking de AfterShip **2026-07**. El adaptador usa GET `/trackings` y POST `/trackings`, autenticación `as-api-key`. Consultar/crear seguimientos puede consumir créditos del proveedor. Revisar plan y cobertura de los códigos de compañía antes de activarlo. No se ha contratado ningún plan de seguimiento.
- `TRAMO_RESEND_API_KEY` y `TRAMO_MAIL_FROM`: clave de Resend y remitente autorizado/verificado. Los avisos van al correo verificado de la cuenta, exclusivamente para eventos seleccionados. Resend necesita un dominio remitente verificado para enviar a usuarios externos.
- `TRAMO_VAPID_PUBLIC_KEY`, `TRAMO_VAPID_PRIVATE_KEY`, `TRAMO_VAPID_SUBJECT`: claves de Web Push y contacto. Generar una vez con la biblioteca web-push y almacenarlas en Netlify; no versionarlas.

`tramo-api/capabilities` informa al cliente de qué servicios están configurados. Sin credenciales, consulta devuelve 503 con un mensaje explícito; los paquetes y las preferencias sí pueden guardarse en Supabase. La demo siempre permanece aislada.

## Seguimiento y avisos

`tramo-sync` es una función programada cada 30 minutos. Netlify no acepta solicitudes web externas para funciones con `schedule`. Tiene un presupuesto de ejecución de 24 segundos para respetar el límite de 30 segundos de Netlify. Procesa hasta 15 paquetes por ejecución dentro de ese presupuesto, prioriza los que llevan más tiempo sin consultar y hasta 40 avisos pendientes. No se promete tiempo real; la frecuencia efectiva depende de volumen, proveedor y plan de alojamiento. Para mayor volumen, ampliar a una cola por usuario/proveedor.

Solo los cambios de estado generan avisos. La bandeja conserva huellas únicas por envío/evento y reintenta errores; Resend usa una clave de idempotencia por aviso y push una etiqueta estable. No se envían mensajes por abrir la demo ni por cargar el panel. Las preferencias se revisan antes de enviar. Los errores de proveedor no se convierten en estados ficticios.

Web Push verifica endpoints HTTPS de servicios conocidos y la propiedad de cada suscripción. Cerrar sesión elimina la suscripción del dispositivo y la cancela en el navegador. Los endpoints caducados se eliminan. En iOS puede requerirse añadir la app a la pantalla de inicio. La PWA proporciona instalación y push; no ofrece consulta sin conexión.

En datos reales, el mapa OpenStreetMap muestra la última coordenada facilitada; los otros puntos se pueden abrir individualmente. La demo utiliza un esquema ficticio. No se infieren coordenadas de ciudades ni se muestra una posición del repartidor en directo.

## Verificación

Pruebas de validación, rechazo de suscripciones inseguras, normalización de eventos y coordenadas, ausencia de datos falsos y protección de origen del API. Revisión con Chromium en escritorio y móvil: presentación, rutas, filtros, búsqueda, alta/borrado de paquetes de demo, avisos y navegación por teclado. Compilación de producción y sintaxis de funciones verificadas.

Las integraciones de seguimiento, correo y push no pueden verificarse de extremo a extremo hasta configurar sus credenciales. La configuración de redirecciones y SMTP de Supabase debe completarse antes de abrir el registro a terceros.
