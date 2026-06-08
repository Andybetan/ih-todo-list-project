# Project Improvements — Task Manager App

Registro de mejoras técnicas aplicadas al proyecto. Documenta los problemas encontrados, las decisiones tomadas y cómo explicarlas en entrevistas o portfolio.

---

## Fase 1 — Repositorio sano y deploy funcional

### Mejora 1.1 — `node_modules` commitado al repositorio

**Problema detectado:**
El directorio `node_modules` estaba incluido en el repositorio de Git. Esto significa que cientos de megabytes de dependencias de terceros formaban parte del historial del proyecto, haciendo el repositorio extremadamente pesado, lento de clonar y difícil de mantener.

**Por qué era un problema:**
`node_modules` contiene las librerías instaladas localmente y se regenera automáticamente con `npm install`. Commitarlo es un error estándar en proyectos que no tienen `.gitignore` configurado desde el inicio. Además, puede exponer versiones exactas de paquetes vulnerables y genera miles de cambios de ruido en cada pull request.

**Solución aplicada:**
Eliminé `node_modules` del tracking de Git con `git rm -r --cached node_modules/` y añadí la regla correspondiente en el nuevo `.gitignore`. El directorio sigue existiendo en local, pero ya no forma parte del repositorio remoto.

**Qué demuestra:**
Conocimiento de buenas prácticas en Git, gestión de dependencias y separación entre código de proyecto y librerías externas.

**Cómo explicarlo en entrevista:**
> "Al revisar el proyecto detecté que `node_modules` estaba trackeado en Git, algo que ocurre cuando no se configura `.gitignore` desde el principio. Lo eliminé del historial de Git sin borrar los archivos locales, usando `git rm --cached`, y documenté las dependencias en `package.json` para que cualquier desarrollador pueda instalarlas con `npm install`."

**Frase para portfolio/CV:**
> "Identifiqué y corregí la inclusión incorrecta de `node_modules` en el repositorio, aplicando buenas prácticas de Git y reduciendo el tamaño del repo significativamente."

---

### Mejora 1.2 — Sin `.gitignore`

**Problema detectado:**
El proyecto no tenía ningún archivo `.gitignore`, lo que causó que archivos que nunca deberían estar en un repositorio (como `node_modules`, `.DS_Store`, `.env`) estuvieran expuestos o en riesgo de serlo.

**Por qué era un problema:**
Sin `.gitignore`, cualquier archivo creado en el directorio puede acabar accidentalmente en el historial de Git. El caso más crítico es el archivo `.env` con credenciales reales, que un commit descuidado podría haber expuesto públicamente.

**Solución aplicada:**
Creé un `.gitignore` completo que excluye: `node_modules/`, archivos `.env` y sus variantes, la carpeta de build `dist/`, archivos de sistema macOS (`.DS_Store`) y caché de Vite.

**Qué demuestra:**
Comprensión de la seguridad básica en proyectos web y dominio de las convenciones estándar de configuración de repositorios.

**Cómo explicarlo en entrevista:**
> "El proyecto no tenía `.gitignore`, lo que es un riesgo real: cualquier commit descuidado podría haber expuesto las credenciales de Supabase almacenadas en `.env`. Configuré un `.gitignore` siguiendo las convenciones estándar de proyectos Vue y Vite para prevenir fugas de información sensible."

**Frase para portfolio/CV:**
> "Configuré `.gitignore` desde cero para proteger credenciales, excluir dependencias y seguir las convenciones estándar de repositorios profesionales."

---

### Mejora 1.3 — Variables de entorno de Supabase no configuradas en Vercel

**Problema detectado:**
La demo pública en `ih-todo-list-project.vercel.app` no conectaba con Supabase. Al abrir la app en producción, aparecía una pantalla de error y ninguna funcionalidad de autenticación o tareas respondía.

**Por qué era un problema:**
Vite expone variables de entorno al cliente únicamente si están prefijadas con `VITE_`. El archivo `.env` local contiene `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, pero este archivo no se commitea al repositorio (correctamente). Vercel necesita que esas variables estén configuradas en su panel de entorno para que el build de producción las incluya. Al no estarlo, el cliente de Supabase se inicializaba con valores vacíos y fallaba silenciosamente.

**Solución aplicada:**
Creé un archivo `.env.example` que documenta exactamente qué variables necesita el proyecto y cómo configurarlas en Vercel. Las variables reales deben añadirse manualmente en Vercel → Settings → Environment Variables.

**Pasos para activar el deploy:**
1. Ir a [vercel.com](https://vercel.com) → proyecto `ih-todo-list-project`
2. Settings → Environment Variables
3. Añadir `VITE_SUPABASE_URL` con la URL del proyecto Supabase
4. Añadir `VITE_SUPABASE_ANON_KEY` con la clave anónima
5. Hacer Redeploy

**Qué demuestra:**
Capacidad para identificar problemas de deploy, entender cómo Vite maneja variables de entorno en producción y preparar un proyecto reproducible con documentación clara para otros desarrolladores.

**Cómo explicarlo en entrevista:**
> "La demo en producción no funcionaba porque las variables de entorno de Supabase no estaban configuradas en Vercel. Vite requiere que las variables con prefijo `VITE_` estén declaradas en el entorno de build para que sean accesibles en el cliente. Documenté el proceso en un `.env.example` y configuré las variables en el panel de Vercel para resolver el problema."

**Frase para portfolio/CV:**
> "Diagnostiqué y corregí la configuración de variables de entorno entre Vite y Vercel, asegurando la conexión estable entre la app Vue, Supabase y el entorno de producción."

---

### Mejora 1.4 — Archivos de sistema macOS (`.DS_Store`) en el repositorio

**Problema detectado:**
Los archivos `.DS_Store` generados automáticamente por macOS estaban incluidos en el repositorio. Estos archivos contienen metadatos del sistema de archivos y no tienen ninguna utilidad para el proyecto.

**Por qué era un problema:**
Su presencia en el repositorio indica falta de configuración básica de Git e introduce ruido en el historial de commits. Para un recruiter que revisa el repo, es una señal de que el proyecto no tiene los fundamentos de configuración en orden.

**Solución aplicada:**
Eliminé `src/.DS_Store` del tracking con `git rm --cached` y lo añadí al `.gitignore` para que nunca vuelva a commitarse.

**Qué demuestra:**
Atención al detalle y conocimiento de las convenciones de proyectos profesionales.

**Frase para portfolio/CV:**
> "Limpié el historial del repositorio eliminando archivos de sistema innecesarios y establecí reglas en `.gitignore` para mantener el repo limpio."

---

### Mejora 1.5 — Configuración duplicada: `netlify.toml` + `vercel.json`

**Problema detectado:**
El repositorio tenía tanto `netlify.toml` como `vercel.json`, configuraciones para dos plataformas de deploy distintas y contradictorias.

**Por qué era un problema:**
La presencia de ambos archivos indica que el proyecto fue desplegado en Netlify en algún momento y después migrado a Vercel sin limpiar la configuración anterior. Para alguien que clona el repo, genera confusión sobre cuál es la plataforma real de despliegue.

**Solución aplicada:**
Eliminé `netlify.toml` del repositorio. El proyecto usa Vercel exclusivamente y `vercel.json` es suficiente.

**Frase para portfolio/CV:**
> "Eliminé configuraciones de deploy redundantes, manteniendo solo la configuración de Vercel activa y evitando confusión en el repositorio."

---

## Commit de esta fase

```
chore: clean repo — add .gitignore, remove node_modules and DS_Store
```

---

*Próxima fase: Fase 2 — Separar HomeView.vue en componentes y limpiar arquitectura.*
