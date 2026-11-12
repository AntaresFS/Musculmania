# Producto y seguridad

## Objetivo del producto

Permitir que el entrenador genere un borrador de un plan de entrenamiento o nutrición adaptado al objetivo y a las necesidades relevantes del cliente. El entrenador debe poder revisar y editar el borrador; la generación no lo publica ni lo aprueba automáticamente.

## Estado actual verificado

- La pantalla de creación está en `frontend/src/components/TrainerDashboard.jsx`. Permite seleccionar cliente y tipo (`training` o `nutrition`) y muestra un campo de objetivo; el botón de generación está deshabilitado.
- El backend es Flask y sus rutas viven en `backend/app.py`. `roles_required` protege rutas por rol y las rutas `/api/trainer/users` admiten `trainer` y `admin`.
- `GET /api/trainer/users` actualmente devuelve todos los usuarios con rol `user`; el modelo `User` no guarda una relación de propiedad con un entrenador.
- El perfil de usuario contiene nivel, alergias y preferencias alimentarias, además de datos de contacto y dirección. Existen registros de progreso y días de entrenamiento, pero no hay todavía un contrato definido para incluirlos en el contexto de generación.
- No hay integración de Groq, almacenamiento de planes ni esquema de salida de planes implementados. Las dependencias actuales están en `backend/requirements.txt`.

## Límites de producto y seguridad

- El LLM propone y redacta; no diagnostica, prescribe tratamiento ni garantiza resultados o adecuación médica.
- Un plan generado es siempre un borrador. El entrenador revisa y adapta el contenido antes de compartirlo o usarlo.
- Las alergias son restricciones de seguridad para un borrador de nutrición, no preferencias intercambiables. Si la información relevante falta, es ambigua o entra en conflicto, no se debe inventar una solución: se debe solicitar aclaración o marcar el borrador para revisión.
- No se deben inferir edad, estado de salud, lesiones, experiencia, disponibilidad, equipamiento, objetivos cuantitativos u otras características no proporcionadas.
- Enviar a Groq únicamente datos necesarios, minimizados y aprobados para esa generación. Excluir identificadores directos y datos de contacto. No enviar información real de salud hasta revisar los términos y condiciones de privacidad del proveedor y definir una base adecuada para su tratamiento.
- La clave del proveedor solo puede residir en la configuración del backend; no exponerla al navegador ni incluirla en el repositorio.
- Aplicar límites de tamaño y frecuencia, tiempos máximos y manejo visible de errores del proveedor. Una respuesta fallida o inválida nunca debe aparentar una generación exitosa.

## Escalabilidad multi-entrenador

El MVP contempla un solo entrenador. Aun así, antes de abrir el producto a varios entrenadores, cada cliente y cada plan deberán estar asociados a un entrenador, y las consultas y operaciones deberán autorizarse y filtrarse por esa relación. El endpoint actual de clientes no proporciona ese aislamiento.
