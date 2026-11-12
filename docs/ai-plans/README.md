# Banco de memoria: planes asistidos por IA

Este directorio conserva el contexto de producto y las decisiones necesarias para implementar la creación asistida de planes de entrenamiento y nutrición. Está dirigido al equipo y a los agentes que trabajan en el repositorio; **no se envía automáticamente a Groq**.

## Documentos

- [Producto y seguridad](product-and-safety.md): alcance, hechos actuales y límites de uso.
- [Política de contexto del LLM](llm-context-policy.md): cómo seleccionar y reducir el contexto de cada petición.
- [Plan de implementación](implementation-plan.md): fases y criterios de aceptación.
- [Registro de decisiones](decisions.md): decisiones confirmadas, propuestas y cuestiones abiertas.

## Cómo mantenerlo

- Antes de crear o modificar un plan de implementación, presenta el alcance y los documentos afectados, y espera la confirmación explícita del usuario antes de escribir.
- Antes de implementar un cambio de la aplicación, presenta el alcance, los archivos/documentos previstos, los criterios de aceptación y los riesgos relevantes; espera confirmación antes de editar. Tras la aprobación, actualiza la documentación pertinente junto con el código. Si el alcance cambia materialmente, vuelve a pedir aprobación.
- El código es la fuente de verdad del comportamiento que ya está implementado. Estos documentos distinguen ese comportamiento de las propuestas y del trabajo pendiente.
- Actualiza el documento correspondiente cuando cambien el alcance, el flujo de datos, la política del LLM o una decisión técnica.
- Evita copiar código o repetir aquí detalles que cambian con frecuencia. Enlaza a los archivos relevantes y actualiza las referencias si se mueven.
- Los ejemplos deben usar valores ficticios. Nunca registres claves, perfiles reales, prompts con datos de clientes ni respuestas reales del proveedor.
- Antes de cambiar el contexto runtime, revisa [Política de contexto del LLM](llm-context-policy.md) y registra cambios de contrato o seguridad en [Registro de decisiones](decisions.md).
