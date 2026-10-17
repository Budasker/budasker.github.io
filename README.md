# Samuel (Budasker) — Portfolio, Writeups & Mentorías

> Sitio web personal, blog técnico y plataforma modular de mentorías enfocado en **Ciberseguridad**, **Administración de Sistemas Linux**, **Redes e Infraestructura** y programación a bajo nivel en **C++**.

🌐 **Sitio web:** [budasker.github.io](https://budasker.github.io)

---

## 📌 Acerca del Proyecto

Este repositorio aloja el código fuente de mi portafolio profesional. Está diseñado bajo una estética minimalista de **terminal y ciberseguridad**, priorizando una experiencia de lectura técnica limpia, alto contraste, carga ultrarrápida y diseño responsivo adaptado para celulares, tablets y computadoras de escritorio.

### Secciones Principales
- **Inicio & Perfil:** Resumen profesional, habilidades técnicas clasificadas por área y enlaces de contacto directo.
- **Proyectos Destacados:** Implementaciones reales documentadas con métricas técnicas (OpenWrt con SQM CAKE, integración de módulos DKMS/CUDA en Arch Linux y utilidades CLI en C++).
- **Notas Técnicas & Writeups:** Artículos detallados sobre seguridad inalámbrica, análisis de redes, sistemas operativos y modding a bajo nivel en Android.
- **Programa de Mentorías:** Módulos de formación técnica y laboratorios prácticos paso a paso (ej. Gestión de Memoria Dinámica y Punteros en C++).

---

## 🛠️ Stack Tecnológico

- **Framework:** [Astro](https://astro.build) (Generación Estática - SSG, cero JavaScript en cliente por defecto).
- **Tipografías:** Auto-alojadas localmente con `@fontsource` (`Inter` y `JetBrains Mono`) para garantizar privacidad total sin llamadas a servidores de terceros.
- **Estilos:** CSS moderno encapsulado por componente, variables CSS nativas, paleta oscura de alto contraste y diseño adaptable fluido (Mobile-First).
- **Tipado:** TypeScript en modo estricto con alias de ruta (`@components/*`, `@layouts/*`, `@data/*`, `@types/*`, `@styles/*`).
- **CI/CD:** Pipeline automatizado en GitHub Actions con permisos de menor privilegio (PoLP) para despliegue directo en GitHub Pages.

---

## 📂 Arquitectura del Repositorio

```text
budasker.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline de compilación y despliegue a GitHub Pages
├── public/
│   ├── favicon.svg             # Favicon técnico
│   └── robots.txt              # Reglas de indexación para buscadores
├── src/
│   ├── components/             # Componentes UI encapsulados
│   │   ├── Navbar.astro        # Navegación minimalista con menú móvil responsivo
│   │   ├── Footer.astro        # Pie de página limpio con enlaces
│   │   ├── ProjectCard.astro   # Tarjeta de proyectos con métricas técnicas
│   │   └── MentorshipTrackCard.astro # Tarjeta modular de tracks de mentoría
│   ├── data/                   # Capa de datos tipada (Single Source of Truth)
│   │   ├── projects.ts         # Proyectos auditables
│   │   ├── siteConfig.ts       # Configuración global y enlaces de autor
│   │   └── skills.ts           # Stack y habilidades técnicas
│   ├── layouts/                # Plantillas maestras
│   │   ├── BaseLayout.astro    # Layout base con cabeceras de seguridad y SEO
│   │   └── WriteupLayout.astro # Layout de artículos con botón de copiado de código
│   ├── pages/
│   │   ├── index.astro         # Página de inicio
│   │   ├── notas/              # Artículos y writeups técnicos en Markdown
│   │   └── mentorias/          # Módulos y lecciones de mentorías (autodescubrimiento)
│   ├── styles/
│   │   └── global.css          # Paleta de colores, tipografía y utilidades
│   └── types/
│       └── portfolio.ts        # Interfaces y tipos TypeScript
├── astro.config.mjs            # Configuración del motor Astro
├── package.json
└── tsconfig.json               # Configuración de TypeScript y aliases
```

---

## 🚀 Desarrollo Local

Para clonar y ejecutar el proyecto en tu entorno local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/budasker/budasker.github.io.git
cd budasker.github.io

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo en segundo plano
npx astro dev --background

# Verificar estado y registros del servidor
npx astro dev status
npx astro dev logs

# 4. Compilar para producción (archivos estáticos generados en /dist)
npm run build

# 5. Previsualizar la compilación de producción localmente
npm run preview
```

---

## ✍️ Cómo Publicar Contenido

### Crear una nueva Nota o Writeup
Añade un archivo Markdown en `src/pages/notas/<nombre-de-la-nota>.md` con el siguiente frontmatter:

```markdown
---
layout: ../../layouts/WriteupLayout.astro
title: "Título de la Nota Técnica"
date: "2026-10-17"
category: "Redes & Infraestructura"
description: "Breve resumen técnico del artículo..."
tags: ["Linux", "Redes", "Seguridad"]
backLink: "/#writeups"
backText: "<- Volver a ~/Writeups"
---

# Contenido en Markdown...
```

### Crear un nuevo Módulo de Mentoría (Zero-Config)
Crea una subcarpeta en `src/pages/mentorias/<modulo>/` y añade lecciones numeradas (`01-tema.md`, `02-tema.md`). El sistema detectará la carpeta automáticamente, ordenará las lecciones y las mostrará en el catálogo general sin requerir configuración manual.

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).
