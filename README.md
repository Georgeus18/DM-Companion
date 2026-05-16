## Cómo Levantar el Repositorio en Local

Si te has descargado o clonado este repositorio, sigue estos sencillos pasos para probar el proyecto en tu ordenador:

### Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/es/) en tu ordenador (se recomienda cualquier versión superior a la 18).

### Pasos de Instalación

1. **Abre la terminal en la carpeta del proyecto**
   Navega mediante tu consola o terminal hasta el directorio raíz del repositorio que acabas de descargar:
   ```bash
   cd ruta/hacia/DM-Companion
   ```

2. **Instala las dependencias**
   Instala todas las librerías externas que requiere la aplicación (React, Lucide para los iconos, Vite para servir el código, etc.) ejecutando:
   ```bash
   npm install
   ```

3. **Inicia el Servidor de Desarrollo**
   Ejecuta el script que arranca y compila en tiempo real la aplicación:
   ```bash
   npm run dev
   ```

4. **Abre la aplicación en tu navegador**
   Al terminar de arrancar, la consola te mostrará una dirección de red local (por lo general `http://localhost:5173/`). Abre ese enlace con tu navegador web preferido y verás la aplicación en funcionamiento.

*(Nota: Cualquier cambio que hagas en el código en `/src` se recargará automáticamente en el navegador).*

### Generar una versión de Producción
Si en algún momento deseas subir o hospedar la aplicación (por ejemplo en Vercel, Netlify o GitHub Pages), puedes empaquetarla lista para producción utilizando:
```bash
npm run build
```
Esto te generará una carpeta `dist/` totalmente lista para publicar en la web.
