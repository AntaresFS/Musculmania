# Mi Boilerplate Full Stack (React + Flask)

Este es un boilerplate para proyectos Full Stack usando React en el frontend y Python (Flask, SQLAlchemy) en el backend, con una base de datos PostgreSQL.

Está diseñado para funcionar de manera óptima y ligeramente diferente en **GitHub Codespaces** y en **VS Code local** gracias a Dev Containers.

---

## Cómo Usarlo

### Opción 1: GitHub Codespaces (Recomendado para la nube)

1.  Sube este código a tu repositorio de GitHub.
2.  Haz clic en el botón verde `<> Code`.
3.  Ve a la pestaña `Codespaces` y haz clic en `Create codespace on main`.
4.  Espera a que el entorno base del contenedor se construya. **En Codespaces, las dependencias de la aplicación (Python y Node.js) no se instalarán automáticamente.**
5.  Una vez que el Codespace esté listo, procede a la sección "Instalación de Dependencias" a continuación.

### Opción 2: VS Code Local (Desarrollo local con Docker)

**Requisitos:**
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.
* Visual Studio Code.
* La extensión [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) de Microsoft.

**Pasos:**
1.  Clona este repositorio.
2.  Abre la carpeta del proyecto en VS Code.
3.  Aparecerá una notificación en la esquina inferior derecha preguntando: "**Reopen in Container**". Haz clic en ella.
4.  VS Code construirá y abrirá el proyecto dentro del contenedor. Esto puede tardar unos minutos la primera vez. **Las dependencias de Python y Node.js se instalarán automáticamente** como parte de este proceso.
5.  ¡Listo! El entorno estará completamente configurado y las dependencias instaladas.

---

## Instalación de Dependencias (Solo Necesario en Codespaces)

Si estás usando **GitHub Codespaces**, deberás instalar las dependencias de la aplicación manualmente después de que el entorno inicie. Hemos provisto scripts sencillos para esto. Si estás en un **VS Code local (Dev Container)**, este paso se realiza automáticamente.

1.  **Da permisos de ejecución a los scripts (solo la primera vez):**
    Abre una terminal en VS Code (Ctrl+Shift+P y busca "New Terminal"). En la raíz de tu proyecto, ejecuta:
    ```bash
    chmod +x install_backend.sh install_frontend.sh install_all.sh
    ```

2.  **Ejecuta los scripts de instalación desde la raíz de tu proyecto:**

    * **Para instalar el backend:**
        ```bash
        ./install_backend.sh
        ```
    * **Para instalar el frontend:**
        ```bash
        ./install_frontend.sh
        ```
    * **O para instalar ambos a la vez (recomendado para la primera configuración manual):**
        ```bash
        ./install_all.sh
        ```

Una vez ejecutados estos comandos (si estás en Codespaces), tus entornos de backend y frontend estarán listos.

---

## Iniciar la Aplicación

Una vez dentro del entorno (Codespaces o Dev Container local) y con las dependencias instaladas:

1.  Abre dos terminales en VS Code (`Terminal > New Terminal`).

2.  **En la primera terminal, inicia el backend:**
    ```bash
    python backend/app.py
    ```

3.  **En la segunda terminal, inicia el frontend:**
    ```bash
    cd frontend
    npm run dev
    ```

4.  Accede a la aplicación a través del puerto del frontend (normalmente `5173`) que VS Code o Codespaces habrán reenviado automáticamente a tu navegador.