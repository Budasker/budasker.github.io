# Samuel (Budasker) — Portfolio & Technical Writeups

Sitio web personal y repositorio de notas técnicas enfocado en **Ciberseguridad**, **Linux**, **Redes e Infraestructura** y desarrollo en **C++**. Construido sobre **Astro**, diseñado para ofrecer máxima velocidad, accesibilidad, privacidad y adherencia a las mejores prácticas de la industria.

🌐 **Sitio en producción:** [budasker.github.io](https://budasker.github.io)

---

## 🛠️ Stack Tecnológico y Arquitectura

- **Framework:** [Astro](https://astro.build) (Generación de sitios estáticos - SSG, Cero JavaScript por defecto en el cliente).
- **Tipografías:** Auto-alojadas con `@fontsource` (Inter y JetBrains Mono) para evitar peticiones de telemetría a servidores de terceros y mejorar la privacidad del usuario.
- **Estilos:** CSS moderno encapsulado por componente con soporte nativo de variables CSS, gradientes radiales optimizados por GPU y modo oscuro.
- **Tipado:** TypeScript en modo estricto con alias de ruta (`@components/*`, `@layouts/*`, `@data/*`, `@types/*`, `@styles/*`).
- **Despliegue y CI/CD:** GitHub Actions con despliegue automatizado en GitHub Pages siguiendo el principio de menor privilegio (PoLP).

---

## 📂 Estructura del Proyecto

```text
budasker.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD hardening con permisos aislados por job
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── robots.txt            # Reglas de indexación y sitemap
├── src/
│   ├── components/           # Componentes UI encapsulados
│   │   ├── Footer.astro
│   │   ├── Navbar.astro
│   │   └── ProjectCard.astro
│   ├── data/                 # Capa de datos desacoplada y fuertemente tipada
│   │   ├── projects.ts
│   │   ├── siteConfig.ts
│   │   └── skills.ts
│   ├── layouts/              # Plantillas estructurales
│   │   ├── BaseLayout.astro  # Hardening de cabeceras meta, SEO y OpenGraph
│   │   └── WriteupLayout.astro # Vista de artículos técnicos con botón de copiado
│   ├── pages/
│   │   ├── index.astro       # Landing page principal
│   │   └── notas/            # Writeups y artículos en Markdown
│   ├── styles/
│   │   └── global.css        # Variables globales, reset CSS y estilos base
│   └── types/
│       └── portfolio.ts      # Definición de interfaces y tipos TypeScript
├── astro.config.mjs          # Configuración del motor Astro
├── package.json
└── tsconfig.json             # Configuración de compilador y aliases de ruta
```

---

## 🔒 Hardening y Prácticas de Seguridad Implementadas

1. **Principio de Menor Privilegio (PoLP) en CI/CD:** El workflow de GitHub Actions restringe permisos a nivel global a `contents: read`, concediendo `pages: write` e `id-token: write` de forma estricta únicamente al job de despliegue.
2. **Defensa contra Fugas de Binarios y Credenciales:** `.gitignore` configurado para mitigar la adición accidental de paquetes binarios (`.deb`, `.rpm`, `.iso`), archivos de entorno (`.env*`) y artefactos temporales del sistema operativo.
3. **Privacidad y Zero-Tracking:** No se utilizan CDNs externas ni fuentes remotas (Google Fonts); todas las dependencias estáticas se sirven localmente.
4. **Hardening de Cabeceras y Metaetiquetas:** Inclusión de directivas como `referrer: strict-origin-when-cross-origin` y `X-Content-Type-Options: nosniff`.
5. **Mitigación de Layout Thrashing y Sanitización en Copiado:** El script interactivo de copiado en bloques de código utiliza `textContent` en lugar de `innerText` para preservar la estructura exacta del código sin forzar reflows en el navegador.

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en segundo plano (Recomendado)
npx astro dev --background

# Verificar estado y logs del servidor de desarrollo
npx astro dev status
npx astro dev logs

# Detener el servidor de desarrollo
npx astro dev stop

# Compilar para producción (archivos generados en /dist)
npm run build

# Previsualizar la compilación de producción localmente
npm run preview
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
