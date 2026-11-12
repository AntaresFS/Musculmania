# Política de contexto del LLM

Esta política describe cómo construir cada petición runtime a Groq. No implica que los documentos de este banco de memoria se envíen al modelo.

## Composición de la petición

1. **Instrucciones estables:** rol y límites de seguridad, reglas del tipo de plan seleccionado y contrato de salida. Mantenerlas versionadas en el backend, separadas de los datos del cliente.
2. **Datos de la generación:** tipo de plan, objetivo escrito por el entrenador y los campos mínimos pertinentes del cliente.
3. **Salida acotada:** pedir únicamente el plan necesario en un formato estructurado validable. No solicitar ni almacenar razonamiento interno del modelo.

El servidor debe construir explícitamente una lista permitida de campos por tipo de plan; no serializar el objeto completo del usuario.

## Selección y minimización de datos

- **Siempre que sea necesario:** nivel registrado y objetivo del entrenador. No enviar datos cuyo valor o pertinencia no se haya establecido.
- **Nutrición:** alergias y preferencias alimentarias solo si están disponibles y son necesarias. Las restricciones por alergia deben conservarse claramente como restricciones, no resumirse como una preferencia.
- **Entrenamiento:** nivel y restricciones de entrenamiento solo si existen y se ha aprobado su uso. No inventar disponibilidad semanal, equipamiento, lesiones ni experiencia a partir de otros campos.
- **Excluir:** nombre, apellidos, email, teléfono, dirección, contraseña, identificadores internos y cualquier otro dato que no aporte a ese plan.
- **Progreso y actividad:** las medidas de progreso y los días de entrenamiento podrían ser relevantes, pero no forman parte del contrato inicial. No incluirlos hasta decidir finalidad, vigencia, minimización y tratamiento de esos datos.
- No combinar registros históricos indiscriminadamente. Si un dato temporal se incorpora en una fase futura, enviar solo el resumen estrictamente necesario con su fecha, y descartar datos obsoletos o contradictorios.
- Si faltan datos clave, pedir aclaración al entrenador o devolver advertencias explícitas en el borrador. No rellenar huecos con supuestos.

## Eficiencia y fiabilidad

- Una generación debe usar una llamada al LLM siempre que alcance la calidad requerida. No añadir cadenas de llamadas ni enviar historial conversacional por defecto.
- Limitar la longitud del objetivo y el tamaño de la respuesta; fijar un máximo de salida apropiado para el modelo configurado. No depender de valores o capacidades no confirmados para la cuenta/modelo de Groq.
- No llamar al proveedor al renderizar la página ni al cambiar de sección: solo tras una acción explícita de generación o regeneración.
- Usar una única respuesta estructurada, con versión de esquema. Validar campos, tipos, tamaños, secciones requeridas y restricciones de seguridad antes de presentarla.
- Si solo se modifica una sección, considerar regenerar esa sección en lugar de repetir el plan entero, siempre que el contrato y la UX lo permitan.
- No reintentar de forma ilimitada. Distinguir errores de validación, timeout y cuota (`429`); mostrar un error claro y permitir una nueva acción explícita.
- No asumir que el proveedor ofrece caché de prompts ni almacenar en caché contenido por cliente. Evaluar cualquier caché con medidas de privacidad, invalidación y claves seguras antes de implementarla.
- Registrar métricas técnicas mínimas (latencia, modelo, estado y tokens/coste si están disponibles), nunca prompts ni perfiles personales completos.

## Responsabilidades del backend y frontend

- El frontend envía solo la selección y el objetivo mediante el cliente HTTP autenticado existente; la API key y las instrucciones privadas permanecen en Flask.
- El backend valida tipo y tamaño del input, autentica y autoriza al entrenador, recupera el cliente autorizado, construye el contexto permitido, llama al proveedor y valida la respuesta.
- El frontend presenta la respuesta como borrador editable, muestra advertencias y errores, y no comunica éxito hasta recibir y validar una respuesta.
- Mantener cualquier instrucción runtime en código versionado y probarla con casos ficticios. Este documento guía esas instrucciones, pero no debe concatenarse entero a cada petición.
