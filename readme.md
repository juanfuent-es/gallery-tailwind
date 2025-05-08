# Tailwind Bento Masonry Grid

A responsive, CSS-only masonry layout built with **Tailwind CSS** using `grid`, `aspect-ratio`, and utility classes.  
This layout simulates a bento-style masonry system that adapts to screen size and preserves clean proportions, **without using JavaScript**.

## Instalación

1. Clonar el repositorio
2. Instalar dependencias
3. Ejecutar el proyecto

### Clonar el repositorio

```
git clone https://github.com/bento-grid/gallery-tailwind.git
```

### Instalar dependencias

```
npm install
```

### Ejecutar el proyecto

```
npm run dev
```

## Creación desde cero con Tailwind CSS y vite

```
npm create vite@latest
npm install -D tailwindcss@latest @tailwindcss/vite
npm install tailwindcss @tailwindcss/vite
```

Configure the Vite plugin in your `vite.config.js` file:

```js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

## Recursos adicionales

- [Documentación oficial de Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite)
- [Documentación oficial de Vite](https://vitejs.dev/guide/)