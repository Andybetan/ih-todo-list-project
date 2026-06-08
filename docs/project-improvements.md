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

---

### Mejora 1.6 — Proyecto Supabase pausado permanentemente: demo rota en producción

**Problema detectado:**
La demo en `ih-todo-list-project.vercel.app` no funcionaba en producción. Al investigar, descubrí que las variables de entorno de Supabase estaban correctamente configuradas en Vercel desde el inicio — ese no era el problema real. El problema era que el proyecto de Supabase asociado (`ulpotzijnprfyjaaadve`) había superado los 90 días de inactividad en el tier gratuito y había sido pausado permanentemente por la plataforma.

**Por qué era un problema:**
Supabase pausa los proyectos gratuitos tras 90 días sin actividad, y a partir de cierto punto ya no permite restaurarlos desde el dashboard. El mensaje que recibí fue explícito: *"Project can no longer be restored through the dashboard"*. Aunque los datos seguían intactos y descargables como backup, el backend estaba efectivamente muerto. Cualquier llamada de autenticación o consulta a la base de datos fallaba silenciosamente.

**Lo que NO era el problema:**
Es importante documentar esto porque el diagnóstico inicial apuntaba a las variables de entorno mal configuradas en Vercel (un error clásico documentado en la Mejora 1.3). Sin embargo, al inspeccionar el panel de Vercel, las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` ya estaban correctamente definidas. La causa raíz era más profunda: la infraestructura de backend había caducado.

**Solución aplicada:**
Creé un nuevo proyecto de Supabase desde cero. Reconstruí el schema completo manualmente mediante una migración SQL que incluye:
- `CREATE TABLE todos` con todos los campos: `id`, `user_id`, `title`, `completed`, `favorite`, `priority`, `created_at`
- Índices de rendimiento sobre `user_id`, `favorite` y `priority`
- Row Level Security activado explícitamente con `ALTER TABLE todos ENABLE ROW LEVEL SECURITY`
- Cuatro políticas RLS para garantizar que cada usuario solo accede a sus propios datos (SELECT, INSERT, UPDATE, DELETE)

Actualicé las variables de entorno en Vercel con las nuevas credenciales (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`) y realicé un redeploy. La demo quedó operativa y conectada al nuevo backend.

**Qué demuestra:**
Capacidad para diagnosticar problemas de infraestructura en producción más allá de los síntomas superficiales, entender el ciclo de vida de los proyectos en plataformas cloud gratuitas, y reconstruir un backend desde cero con las mismas especificaciones técnicas sin pérdida de funcionalidad.

**Cómo explicarlo en entrevista:**
> "La demo en producción no funcionaba, pero el problema no era el que parecía a primera vista. Las variables de entorno en Vercel estaban bien configuradas desde el principio. Al investigar más, detecté que el proyecto de Supabase había sido pausado permanentemente por el tier gratuito tras más de 90 días sin actividad. Analicé el schema existente, reconstruí la base de datos en un nuevo proyecto de Supabase con todos los índices, columnas y políticas de Row Level Security originales, actualicé las credenciales en Vercel y la demo volvió a funcionar."

**Frase para portfolio/CV:**
> "Diagnostiqué y resolví la caída de la demo en producción identificando la caducidad del backend como causa raíz, reconstruyendo el schema de Supabase y actualizando la infraestructura de despliegue en Vercel."

---

## Commit de esta fase

```
chore: clean repo — add .gitignore, remove node_modules, DS_Store and netlify config
fix: rebuild Supabase backend and restore Vercel demo after project expiry
```

---

## Fase 2 — Componentización y separación de responsabilidades

### Mejora 2.1 — HomeView.vue monolítico: toda la app en un único archivo

**Problema detectado:**
`HomeView.vue` concentraba demasiadas responsabilidades en un único archivo de más de 750 líneas: el título de la aplicación, el formulario de creación de tareas, la lista completa, el renderizado de cada tarea individual con todas sus acciones, el estado vacío (ausente), la lógica de logout y el estado local de edición y menús de prioridad. Cualquier cambio en una funcionalidad requería navegar por todo el archivo y afectaba potencialmente a partes no relacionadas.

**Por qué era un problema:**
Una vista monolítica de esta escala es difícil de leer, difícil de mantener y imposible de reutilizar. El estado de la edición en línea y el menú de prioridad estaban gestionados a nivel de vista con objetos indexados por ID de tarea (`showPriorityMenu[task.id]`), lo que añadía complejidad innecesaria a un nivel incorrecto. Además, los event listeners del documento (para cerrar menús al hacer clic fuera) se registraban sin limpiarse nunca, creando memory leaks potenciales.

**Solución aplicada:**
Separé `HomeView.vue` en cinco componentes con responsabilidad única:

- `AppHeader.vue` — título de la aplicación (presentacional, sin estado)
- `TaskForm.vue` — input y botón de creación, con su propia lógica de `addTask`
- `TaskList.vue` — contador de tareas + lista, decide entre `TaskItem` y `TaskEmpty`
- `TaskItem.vue` — tarjeta individual con toda su lógica: edición en línea, toggle completado, favorito, prioridad, eliminación
- `TaskEmpty.vue` — estado vacío cuando no hay tareas (funcionalidad nueva añadida)

`HomeView.vue` quedó reducido a ~50 líneas: solo importa los componentes, carga las tareas en `onMounted` y gestiona el logout.

**Decisiones técnicas relevantes:**
- El estado de edición (`isEditing`, `editTitle`) y el menú de prioridad (`showPriorityMenu`) se movieron dentro de `TaskItem` como estado local reactivo, eliminando la necesidad de objetos indexados por ID en la vista padre.
- Los event listeners de documento para cerrar menús se registran en `onMounted` y se limpian en `onUnmounted` de cada `TaskItem`, corrigiendo el memory leak del código original.
- Los componentes acceden directamente a los stores de Pinia en lugar de recibir handlers como props, siguiendo el patrón ya establecido en el proyecto.
- La prop `task` en `TaskItem` es solo lectura: el checkbox usa `:checked` + `@change` en lugar de `v-model` para evitar mutación de props, y la edición usa un `ref` local (`editTitle`).

**Qué demuestra:**
Capacidad para aplicar separación de responsabilidades, componentización en Vue, comunicación entre componentes mediante props, y mejora de mantenibilidad sin romper funcionalidad existente.

**Cómo explicarlo en entrevista:**
> "Refactoricé una vista monolítica de más de 750 líneas en una arquitectura basada en componentes. Mantuve la misma funcionalidad exacta, pero separé responsabilidades para que el código fuera más escalable, legible y fácil de mantener. Aproveché el refactor para corregir un memory leak en los event listeners del menú de prioridad y para mover el estado local de edición al nivel correcto —dentro del componente que lo necesita— en lugar de gestionarlo en la vista padre."

**Frase para portfolio/CV:**
> "Refactoricé la vista principal de una app Vue/Supabase en componentes reutilizables, mejorando la mantenibilidad y la estructura del proyecto sin alterar la funcionalidad existente."

---

## Commit de esta fase

```
refactor: split HomeView into AppHeader, TaskForm, TaskList, TaskItem, TaskEmpty
```

---

*Próxima fase: Fase 3 — Mejoras de UX: loading states, toasts, empty states y responsive.*

---

## Fase 3 — UX real: loading states, toasts y confirmación modal

### Mejora 3.1 — `alert()` y `confirm()` nativos del navegador

**Problema detectado:**
Todos los errores y confirmaciones de la app usaban `alert()` y `confirm()` nativos del navegador. Estos diálogos son bloqueantes, no se pueden estilizar, rompen la sensación de app web moderna e interrumpen el flujo del usuario con ventanas emergentes del sistema operativo.

**Solución aplicada:**
Creé dos composables singleton que encapsulan el estado global de notificaciones y confirmaciones:

- `src/composables/useToast.js` — gestiona una cola de toasts reactivos compartidos entre todos los componentes. Los toasts desaparecen automáticamente (3s éxito, 4s error).
- `src/composables/useConfirm.js` — expone un método `confirm(mensaje)` que devuelve una Promise. Los componentes hacen `await confirm(...)` exactamente igual que con el `confirm()` nativo, pero la resolución la controla el usuario a través de un modal visual.

Ambos se montan una sola vez en `App.vue` via `<Teleport to="body">`, lo que garantiza que el z-index nunca quede atrapado dentro de contenedores con `overflow: hidden`.

**Componentes creados:**
- `ToastNotification.vue` — renderiza la cola de toasts en la esquina inferior derecha con animación de entrada/salida
- `ConfirmModal.vue` — overlay oscuro con tarjeta centrada, botones "Cancelar" y "Eliminar", cierra al hacer clic fuera

**Qué demuestra:**
Conocimiento del patrón de composables singleton en Vue 3, uso de `<Teleport>` para componentes globales, y diseño de APIs asíncronas con Promises para UX no bloqueante.

---

### Mejora 3.2 — Sin loading state al cargar las tareas

**Problema detectado:**
Al abrir la app, la pantalla aparecía vacía durante el tiempo que tardaba la petición a Supabase. No había ningún indicador de que algo estaba cargando, lo que podía parecer un error.

**Solución aplicada:**
Añadí un `tasksLoading` ref en `HomeView.vue` que se pone a `false` cuando `fetchTasks` completa (con `try/finally`). `TaskList` recibe este estado como prop y muestra un spinner animado con CSS mientras es `true`. Cuando termina, muestra la lista o el estado vacío (`TaskEmpty`).

---

### Mejora 3.3 — Botones activos durante operaciones asíncronas

**Problema detectado:**
Al crear, editar, eliminar o cambiar prioridad/favorito de una tarea, el usuario podía hacer clic múltiples veces mientras la operación estaba en curso, generando peticiones duplicadas.

**Solución aplicada:**
Añadí `isSubmitting` en `TaskForm` y `isProcessing` en `TaskItem`. Durante cualquier operación async, los botones quedan desactivados (`disabled`) y el área de acciones recibe `opacity: 0.5; pointer-events: none`. El botón "Create" también muestra "Creando..." mientras espera.

**Cómo explicarlo en entrevista:**
> "Reemplacé todos los `alert()` y `confirm()` del navegador por un sistema propio de toasts y modales. Usé composables singleton en Vue 3 para compartir el estado entre componentes sin necesidad de un store adicional, y `<Teleport>` para montar los componentes globales directamente en el `body` y evitar problemas de z-index. El modal de confirmación usa una Promise para mantener la misma interfaz asíncrona que el `confirm()` nativo, pero con control visual completo."

**Frase para portfolio/CV:**
> "Implementé un sistema de notificaciones toast y confirmación modal en Vue 3 usando composables singleton y Teleport, reemplazando los diálogos nativos del navegador por una UX moderna y cohesiva."

---

## Commit de esta fase

```
feat: add toast notifications, confirm modal and loading states (Phase 3 UX)
```

---

*Próxima fase: Fase 4 — Features: filtros, búsqueda, contador mejorado, ordenación.*

---

## Fase 4 — Filtros, buscador, contadores y estado vacío contextual

### Mejora 4.1 — Sin filtros: el usuario no podía ver sólo las tareas pendientes o completadas

**Problema detectado:**
La app mostraba todas las tareas juntas, sin posibilidad de filtrar por estado. Un usuario con muchas tareas no tenía forma de enfocarse solo en lo que le quedaba pendiente o revisar lo que ya había terminado.

**Solución aplicada:**
Se creó el componente `TaskFilters.vue` con tres pestañas de filtro: **Todas**, **Pendientes** y **Completadas**. El estado del filtro activo (`activeFilter`) vive en `HomeView.vue` como un `ref`, y el resultado filtrado se calcula con un `computed` (`filteredTasks`). El componente `TaskFilters` es puramente presentacional: recibe el filtro activo como prop y emite el nuevo valor cuando el usuario hace clic, siguiendo el patrón de Vue 3 de flujo de datos unidireccional.

**Componentes modificados o creados:**
- `TaskFilters.vue` (nuevo) — tabs de filtro + buscador
- `HomeView.vue` — añade `activeFilter`, `searchQuery`, `filteredTasks`, contadores y `emptyContext` como computeds

---

### Mejora 4.2 — Sin buscador: imposible encontrar una tarea específica

**Problema detectado:**
No había forma de buscar una tarea por nombre. Con una lista larga, el usuario tenía que hacer scroll y revisar visualmente hasta encontrarla.

**Solución aplicada:**
Se añadió un input de búsqueda en `TaskFilters.vue`. La búsqueda se aplica sobre el conjunto ya filtrado por estado (primero filtra por Todas/Pendientes/Completadas, luego filtra por texto). El buscador usa `toLowerCase().includes()` para búsqueda insensible a mayúsculas. Incluye un botón `×` para limpiar la búsqueda rápidamente que aparece sólo cuando hay texto escrito.

---

### Mejora 4.3 — Contadores genéricos: solo mostraban total y completadas

**Problema detectado:**
`TaskList.vue` calculaba internamente `tasks.length` y `tasks.filter(t => t.completed).length`. Esto era correcto cuando recibía todas las tareas, pero al introducir filtros, los contadores habrían mostrado los totales del subconjunto filtrado, no del total real.

**Solución aplicada:**
Los tres contadores (Total, Pendientes, Completadas) se calculan ahora en `HomeView.vue` sobre el array completo de tareas (`tasks.value`), antes de aplicar cualquier filtro. Se pasan a `TaskList` como props (`totalCount`, `pendingCount`, `completedCount`). Así los contadores siempre reflejan el estado real del usuario, independientemente del filtro o búsqueda activos.

**Decisión técnica relevante:**
Calcular los contadores en `HomeView` (el orquestador) en lugar de en `TaskList` separa claramente las responsabilidades: `TaskList` renderiza lo que le llega, `HomeView` decide qué datos y con qué resumen.

---

### Mejora 4.4 — TaskEmpty genérico: el mismo mensaje para todos los estados vacíos

**Problema detectado:**
`TaskEmpty.vue` mostraba siempre el mismo texto ("No tasks yet. Add your first task above!") sin importar por qué la lista estaba vacía. Si el usuario filtraba por "Completadas" y no tenía ninguna, recibía el mismo mensaje que si no tuviera tareas en absoluto, lo que era confuso y poco informativo.

**Solución aplicada:**
Se rediseñó `TaskEmpty.vue` para recibir una prop `context` con cuatro valores posibles:
- `no-tasks` — no hay tareas en absoluto
- `no-pending` — hay tareas pero ninguna pendiente
- `no-completed` — hay tareas pero ninguna completada
- `no-results` — la búsqueda no devuelve resultados

Cada contexto muestra un **icono SVG inline diferente** y un mensaje propio (título + subtítulo). Los SVGs son propios, sin dependencias externas: un portapapeles, un check en círculo, un reloj de arena y una lupa con X. La lógica del contexto activo (`emptyContext`) es un `computed` en `HomeView` que evalúa la combinación de filtro activo + búsqueda + tareas disponibles.

---

### Mejora 4.5 — Orden automático preservado tras el filtrado

**Problema detectado:**
El orden de las tareas (favoritos primero, luego por prioridad alta/normal/baja, luego por fecha) se calculaba en `tasksApi.js` sobre el array completo. Al introducir filtros de cliente, había riesgo de perder ese orden.

**Solución aplicada:**
El `computed` `filteredTasks` aplica `Array.filter()` sobre el array ya ordenado que devuelve el store. `filter()` preserva el orden original del array fuente, por lo que el orden favorito-prioridad-fecha se mantiene intacto en cualquier combinación de filtro y búsqueda, sin necesidad de reordenar.

---

**Qué demuestra técnicamente:**
- Uso de `computed` en Vue 3 para derivar datos sin duplicar estado
- Separación clara entre datos de origen (store) y datos de vista (filtrados)
- Comunicación padre→hijo con props y hijo→padre con `emit`
- SVGs inline accesibles sin dependencias externas

**Cómo explicarlo en entrevista:**
> "Añadí filtros y búsqueda sin tocar el store ni la API. Todo el filtrado ocurre en un `computed` en el componente orquestador, que recibe las tareas del store ya ordenadas y aplica el filtro de estado y la búsqueda de texto encima. Los contadores se calculan sobre el array original para que siempre reflejen el total real, no el subconjunto filtrado. Separé el componente de filtros como un componente presentacional que solo emite eventos, siguiendo el patrón de Vue 3 de flujo unidireccional."

**Frase para CV/portfolio:**
> "Implementé filtros por estado, buscador de texto y contadores reactivos en Vue 3 usando `computed` y flujo de datos unidireccional, con un estado vacío contextual con iconos SVG que informa al usuario exactamente por qué la lista está vacía."

---

## Commit de esta fase

```
feat: add filters, search, counters and contextual empty state (Phase 4)
```
