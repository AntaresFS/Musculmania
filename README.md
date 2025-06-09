# Mi Boilerplate Full Stack (React + Flask)

Este es un boilerplate para proyectos Full Stack usando React en el frontend y Python (Flask, SQLAlchemy) en el backend, con una base de datos PostgreSQL.

Está diseñado para funcionar de manera idéntica en **GitHub Codespaces** y en **VS Code local** gracias a Dev Containers.

## Cómo Usarlo

### Opción 1: GitHub Codespaces (Recomendado)

1.  Sube este código a tu repositorio de GitHub.
2.  Haz clic en el botón verde `<> Code`.
3.  Ve a la pestaña `Codespaces` y haz clic en `Create codespace on main`.
4.  Espera a que el entorno se construya. Las dependencias (`pip` y `npm`) se instalarán automáticamente.
5.  ¡Listo! El entorno estará completamente configurado.

### Opción 2: VS Code Local

**Requisitos:**
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.
* Visual Studio Code.
* La extensión [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) de Microsoft.

**Pasos:**
1.  Clona este repositorio.
2.  Abre la carpeta del proyecto en VS Code.
3.  Aparecerá una notificación en la esquina inferior derecha preguntando: "**Reopen in Container**". Haz clic en ella.
4.  VS Code construirá y abrirá el proyecto dentro del contenedor. Esto puede tardar unos minutos la primera vez.

## Iniciar la Aplicación

Una vez dentro del entorno (Codespaces o Dev Container local):

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