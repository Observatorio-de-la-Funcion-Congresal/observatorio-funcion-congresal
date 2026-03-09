# Observatorio de la Función Congresal

Este proyecto es una plataforma de transparencia política que promueve la participación ciudadana informada en el proceso democrático peruano. Desarrollado con Astro, TailwindCSS y componentes personalizados, el sitio web ofrece información sobre el sistema bicameral, el proceso legislativo y los candidatos al Congreso.

## 🚀 Estructura del Proyecto

Dentro de este proyecto, encontrarás las siguientes carpetas y archivos:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── icons/
│   ├── components
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Nav.astro
│   │   ├── sections/
│   │   └── ui/
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       ├── index.astro
│       ├── bicameralidad.astro
│       └── proceso-legislativo.astro
├── package.json
```

Para más información sobre la estructura de un proyecto Astro, consulta [la guía oficial](https://docs.astro.build/es/basics/project-structure/).

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto, en una terminal:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Instala las dependencias                        |
| `pnpm dev`                 | Inicia el servidor de desarrollo en `localhost:4321` |
| `pnpm build`               | Construye el sitio para producción en `./dist/` |
| `pnpm preview`             | Previsualiza tu sitio construido localmente     |
| `pnpm astro ...`           | Ejecuta comandos CLI como `astro add`, `astro check` |
| `pnpm astro -- --help`     | Obtén ayuda sobre el CLI de Astro               |
