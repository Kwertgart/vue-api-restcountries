# Explorador de Países (Vue 3 + REST Countries)

Proyecto de la Unidad 3. Consume la API REST Countries con `fetch()`, guarda los datos en `ref()` y los muestra con `v-for`, `v-if`, `v-model` y `v-bind`.

## Ejecutar en tu computadora

```bash
npm install
npm run dev
```

## Subir a GitHub (con commits durante el desarrollo)

1. En GitHub crea un repositorio **público** llamado `vue-api-restcountries` (sin README).
2. En la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Proyecto base Vue 3 con Vite"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/vue-api-restcountries.git
git push -u origin main
```

Haz commits separados conforme avances (ejemplos):
`git commit -m "Agrega consumo de API con fetch en onMounted"`,
`git commit -m "Agrega filtros con v-model"`,
`git commit -m "Agrega estados de carga y error con v-if"`.

## Publicar en GitHub Pages

```bash
npm run deploy
```

Esto compila el proyecto y sube la carpeta `dist` a la rama `gh-pages`.
Luego en GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `gh-pages` / (root) → Save**.

El sitio queda en: `https://TU_USUARIO.github.io/vue-api-restcountries/`

> Si tu repositorio tiene otro nombre, cambia `base` en `vite.config.js`.

## Enlaces a entregar

- Repositorio: `https://github.com/TU_USUARIO/vue-api-restcountries`
- Sitio publicado: `https://TU_USUARIO.github.io/vue-api-restcountries/`
- PDF de evidencias

## Guion para el PDF de evidencias

Una página por evidencia: título + captura de la interfaz (1 por página) + captura del código (1 por página) + máximo 2 párrafos.
Recuerda: cada captura va en su propia página, así que cada evidencia ocupa 2 páginas (interfaz y código) o más.

| # | Título de la evidencia | Captura de interfaz | Captura de código |
|---|---|---|---|
| 1 | Repositorio en GitHub con el código fuente | Página del repo con archivos y commits | Pestaña "commits" |
| 2 | Sitio publicado en GitHub Pages | Sitio abierto con la URL visible | `vite.config.js` (`base`) |
| 3 | Consumo de API usando `fetch()` | Tarjeta de Canadá cargada | `pedirPrimerPais()` en `App.vue` |
| 4 | Uso de `onMounted()` | Página recién cargada | bloque `onMounted(async () => {...})` |
| 5 | Datos en variable reactiva `ref()` | Lista de países en pantalla | declaraciones `ref(...)` |
| 6 | Uso de `v-for` | Cuadrícula de tarjetas | `<PaisCard v-for=...>` |
| 7 | Uso de `v-if` (estados) | Mensaje "No se encontraron países." (busca algo inexistente) | `v-if / v-else-if / v-else` |
| 8 | Uso de `v-model` (filtro) | Búsqueda "mex" filtrando la lista | `<input v-model="busqueda">` y `computed` |
| 9 | Indicador de carga | "Cargando países..." (en DevTools → Network → *Slow 3G*, recarga) | `<p v-if="cargando">` |
| 10 | Manejo de errores (opcional) | "No fue posible obtener los datos de la API" (DevTools → Network → *Offline*, recarga) | `try / catch` |
| 11 | `v-bind` (opcional) | Bandera mostrada | `:src` y `:alt` en `PaisCard.vue` |
