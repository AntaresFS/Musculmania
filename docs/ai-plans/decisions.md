# Registro de decisiones

Registrar decisiones que afecten el producto, la seguridad, los datos enviados al proveedor o el diseño de la integración. Usar estados **Propuesta**, **Confirmada** o **Reemplazada**; no convertir una recomendación en requisito confirmado sin validarla.

## Confirmadas

### DEC-001: el MVP contempla un único entrenador

- **Estado:** Confirmada por el alcance actual.
- **Consecuencia:** la separación de clientes por entrenador no forma parte del MVP inicial.
- **Requisito de escalabilidad:** antes de admitir varios entrenadores, asociar cada cliente y plan a su entrenador y filtrar las rutas por esa relación. Actualmente, `/api/trainer/users` devuelve todos los clientes de rol `user`.

### DEC-002: todo plan generado requiere revisión del entrenador

- **Estado:** Confirmada.
- **Consecuencia:** la salida del LLM se trata como borrador; no se presenta como aprobada ni se publica automáticamente.

## Pendientes de confirmar

### DEC-003: persistencia de los planes

- **Estado:** Propuesta pendiente.
- **Pregunta:** ¿el MVP conserva borradores en base de datos o solo los devuelve para revisión durante la sesión?
- **Implicación:** persistir requiere definir propiedad, acceso, ciclo de vida, versionado y eliminación de datos.

### DEC-004: campos del cliente enviados a Groq

- **Estado:** Pendiente de revisión de producto, privacidad y términos del proveedor.
- **Pregunta:** además del objetivo y nivel, ¿se enviarán alergias/preferencias de nutrición u otros datos? ¿Con qué base y retención?
- **Regla hasta decidir:** minimización; excluir identificadores directos y no transmitir perfiles reales de salud.

### DEC-005: contrato de salida y cálculos

- **Estado:** Pendiente.
- **Pregunta:** definir el esquema por tipo de plan, unidades, límites y qué cálculos debe realizar lógica determinista y verificable.

## Plantilla para nuevas decisiones

### DEC-NNN: título breve

- **Estado:** Propuesta / Confirmada / Reemplazada.
- **Fecha:** YYYY-MM-DD.
- **Contexto:**
- **Decisión:**
- **Consecuencias:**
