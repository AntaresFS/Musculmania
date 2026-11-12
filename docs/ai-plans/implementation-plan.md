# Plan de implementación

Este plan documenta trabajo pendiente; no significa que la integración con Groq ya exista. Mantener el estado y los criterios actualizados conforme avance el trabajo.

## Fase 0: decisiones y contrato

- Confirmar qué datos del perfil pueden usarse para cada tipo de plan y qué hacer cuando falten.
- Definir el esquema JSON versionado para planes de entrenamiento y nutrición, las advertencias y los casos que requieren aclaración.
- Decidir si el primer MVP devuelve borradores efímeros o los guarda, y si la edición forma parte de este alcance.
- Verificar términos de privacidad del proveedor y configurar secretos únicamente en el backend.

**Aceptación:** decisiones registradas; contrato documentado; no se incluyen en el contexto datos no aprobados.

## Fase 1: integración segura en Flask

- Añadir configuración del modelo y la clave de Groq al backend y al ejemplo de entorno sin valores secretos.
- Implementar un endpoint de generación autenticado y limitado a `trainer`/`admin`, siguiendo `roles_required`.
- Validar payload, tipo de plan y límites de longitud; obtener únicamente el cliente permitido.
- Crear una capa de proveedor en backend que envíe el contexto mínimo según `llm-context-policy.md`, con timeout y límites explícitos.
- Validar el esquema de respuesta; traducir errores del proveedor y de cuota a respuestas API explícitas y seguras.

**Aceptación:** sin credenciales, inputs inválidos o rol no permitido no se produce una llamada; los datos personales excluidos no aparecen en la petición al proveedor; respuestas inválidas/errores no se devuelven como éxito.

## Fase 2: experiencia de generación

- Conectar el formulario existente de `TrainerDashboard.jsx` con el endpoint usando el cliente API autenticado.
- Gestionar carga, prevención de doble envío, errores, ausencia de datos y advertencias.
- Mostrar el plan como borrador revisable y editable; conservar el objetivo y el tipo seleccionados.
- No guardar ni publicar automáticamente hasta que se haya decidido y diseñado esa persistencia.

**Aceptación:** el entrenador puede generar y revisar un borrador de cada tipo; errores y límites son visibles; no existe aprobación/publicación automática.

## Fase 3: evaluación y endurecimiento

- Añadir pruebas de autorización, validación de input, minimización de contexto, esquema inválido, timeout y `429`.
- Evaluar ejemplos ficticios representativos de objetivos y restricciones, incluidos conflictos y datos insuficientes.
- Revisar costes/cuotas observados y ajustar límites de longitud, salida y frecuencia sin degradar la utilidad.
- Comprobar que logs y errores no filtran prompts, perfiles ni credenciales.

**Aceptación:** pruebas relevantes pasan; la revisión de casos confirma que el modelo no inventa información y que restricciones críticas se conservan; los fallos no aparecen como planes válidos.

## Fuera del MVP / escalabilidad

- Asociar clientes y planes a un entrenador y filtrar/autorizar todas las rutas por esa relación antes de permitir varios entrenadores.
- Definir persistencia, historial, versionado, regeneración parcial y auditoría de planes como decisiones explícitas antes de implementarlos.
- Tratar cálculos cuantitativos como lógica determinista validada, no como hechos que se delegan sin comprobación al LLM.
