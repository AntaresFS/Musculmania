# Instrucciones para agentes

- Antes de cambiar la generación de planes, consulta `docs/ai-plans/README.md` y los documentos que enlaza.
- Antes de implementar cualquier cambio en la aplicación, o de crear/modificar un plan de implementación, presenta el alcance propuesto, los archivos o documentos que prevés tocar, los criterios de aceptación y los riesgos relevantes; pide confirmación explícita y espera antes de editar.
- Una vez confirmado el alcance, implementa el cambio y actualiza la documentación pertinente en la misma tarea. Si durante el trabajo aparece un cambio material de alcance o una decisión nueva, detente y pide confirmación antes de continuar con esa parte.
- Para solicitudes de explicación, investigación o recomendaciones que no impliquen cambios en código o planes, responde directamente; no conviertas la consulta en una implementación sin permiso.
- Considera el código como la fuente de verdad del comportamiento implementado. El banco de memoria describe intención, límites y trabajo pendiente; actualízalo cuando una decisión o implementación cambie esos hechos.
- Mantén separadas las instrucciones para quienes desarrollan la aplicación y las instrucciones runtime que el backend envía a Groq. La documentación no se añade automáticamente al contexto del modelo.
- No pongas claves, tokens, datos reales de clientes ni respuestas con información personal en el repositorio, prompts de ejemplo, pruebas o registros.
- Para cambios en prompts, contexto enviado, formato de salida o proveedor, documenta la decisión relevante y añade o ajusta pruebas para privacidad, restricciones y validación de la respuesta.
- No presentes contenido generado como aprobado: los planes son borradores que el entrenador revisa antes de usarlos.
- Mantén los cambios acotados y sigue los patrones existentes de React en `frontend/` y Flask en `backend/`.
