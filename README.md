# Generador de Equipos con IA

Esta es una guía detallada para poner tu aplicación online y gestionarla, explicada de la forma más sencilla posible.

## Objetivo 1: Poner tu Página Web Online (Gratis)

Sigue estos pasos para que tu aplicación sea una página web real a la que cualquiera pueda acceder.

### Paso 1: Crea un "Almacén" para tu Código en GitHub

GitHub es como una carpeta online donde guardaremos los archivos de tu aplicación.

1.  **Crea una cuenta:** Ve a [GitHub.com](https://github.com/) y regístrate gratis.
2.  **Crea un Repositorio:** Un repositorio es un proyecto.
    *   Haz clic en el botón "New" (Nuevo).
    *   Dale un nombre, por ejemplo: `generador-de-equipos`.
    *   Asegúrate de que sea "Public" (Público).
    *   Haz clic en "Create repository" (Crear repositorio).
3.  **Sube tus archivos:**
    *   Dentro de tu nuevo repositorio, busca un enlace que diga "uploading an existing file" (subir un archivo existente).
    *   Arrastra y suelta **TODOS** los archivos y carpetas de la aplicación aquí.
    *   Espera a que se suban y haz clic en "Commit changes" (Guardar cambios).

¡Listo! Tu código ya está guardado online.

### Paso 2: Convierte tu Código en una Página Web con Netlify

Netlify es un servicio gratuito que leerá tu código de GitHub y lo publicará como una página web.

1.  **Crea una cuenta:** Ve a [Netlify.com](https://www.netlify.com/) y regístrate. **Es muy recomendable que te registres usando tu cuenta de GitHub**.
2.  **Importa tu proyecto:**
    *   Una vez dentro, busca un botón que diga "Add new site" o "Import from Git".
    *   Elige "GitHub" como proveedor.
    *   Busca y selecciona el repositorio que creaste (`generador-de-equipos`).
3.  **Publica la web:**
    *   Netlify te mostrará algunas opciones de configuración. No necesitas cambiar nada.
    *   Simplemente desplázate hacia abajo y haz clic en el botón **"Deploy site"** (Desplegar sitio).

En unos minutos, Netlify te dará una dirección web (ej: `nombre-aleatorio.netlify.app`). ¡Esa es tu aplicación, ya está online!

---

## Objetivo 2: Añadir Personajes de Forma Permanente

Para añadir, eliminar o modificar personajes de forma definitiva, solo necesitas editar un archivo en tu GitHub. La página web se actualizará automáticamente.

### Paso 1: Encuentra tu "Catálogo" de Personajes

1.  Vuelve a tu repositorio en GitHub.
2.  Haz clic en la carpeta `public`.
3.  Haz clic en el archivo `characters.json`. Esta es la lista maestra de todos tus personajes.

### Paso 2: Edita la Lista

1.  Haz clic en el **icono del lápiz (✏️)** en la esquina superior derecha del archivo para empezar a editar.
2.  **Para añadir un personaje:**
    *   Copia un bloque completo de un personaje existente, desde la llave de apertura `{` hasta la llave de cierre `}`.
    *   Pega el bloque al final de la lista.
    *   **IMPORTANTE:** Asegúrate de que todos los bloques de personajes estén separados por una coma `,`. El último personaje de la lista **NO** debe llevar una coma al final.

    **Ejemplo de formato correcto:**
    ```json
    [
      {
        "id": "1",
        "name": "Superman",
        "faccion": "DC",
        "valor": 98,
        "imageUrl": "https://..."
      },
      {
        "id": "nuevo-personaje-unico",
        "name": "Nuevo Personaje",
        "faccion": "Nueva Facción",
        "valor": 85,
        "imageUrl": "https://direccion-de-su-imagen.com/foto.jpg"
      }
    ]
    ```
3.  **Modifica los datos** del nuevo personaje que has pegado.
    *   `"id"`: **Obligatorio.** Debe ser un texto único que no se repita.
    *   `"name"`: El nombre del personaje.
    *   `"faccion"`: Su grupo o facción. Esto es clave para que los filtros funcionen.
    *   `"valor"`: Su nivel (solo el número).
    *   `"imageUrl"`: El enlace directo a una imagen.

### Paso 3: Guarda los Cambios

1.  Cuando termines de editar, ve al final de la página.
2.  Haz clic en el botón verde que dice **"Commit changes"**.

¡Eso es todo! Netlify detectará el cambio y actualizará tu página web en uno o dos minutos. Refresca la página y verás tus nuevos personajes.

---

## Modo Administrador (Para Cambios Temporales)

Si quieres añadir o borrar personajes **solo durante tu visita actual** (los cambios se perderán al recargar), puedes usar el modo administrador.

1.  Abre tu página web.
2.  En la barra de direcciones del navegador, añade lo siguiente al final de la URL: `?admin_key=clave-secreta-para-admin-123`
3.  **Ejemplo:** `https://tu-sitio.netlify.app/?admin_key=clave-secreta-para-admin-123`
4.  Presiona Enter. Ahora verás el formulario para añadir personajes y los botones para eliminar en las tarjetas.
