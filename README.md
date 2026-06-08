# Task Manager — Vue 3 + Supabase

Task Manager es una aplicación full-stack de gestión de tareas construida con Vue 3, Pinia y Supabase. Nació como proyecto final de Ironhack y posteriormente fue refactorizada para convertirla en una app más limpia, mantenible y preparada para portfolio, con arquitectura basada en componentes, autenticación con Supabase, Row Level Security, toasts, modal de confirmación, filtros, búsqueda en tiempo real, contadores y estados vacíos contextuales. Está desplegada en Vercel.

**Demo en producción:** https://ih-todo-list-project.vercel.app  
**Repositorio:** https://github.com/Andybetan/ih-todo-list-project

---

## De proyecto de bootcamp a app de portfolio

Este proyecto nació como entrega final del bootcamp de Desarrollo Web de Ironhack. Tras la entrega, continué trabajando en él de forma independiente: reconstruí el backend de Supabase que había caducado, refactoricé la vista monolítica en componentes reutilizables, añadí patrones reales de UX y mejoré la calidad del código en general.

El objetivo no era reescribirlo desde cero, sino tomar código real y funcional y acercarlo progresivamente a un estándar más profesional: mejor arquitectura, mejor experiencia de usuario y documentación honesta de cada decisión tomada en el camino.

---

## Stack técnico

| Tecnología | Rol |
|---|---|
| Vue 3 (Composition API) | Framework de UI |
| Vite | Build tool y servidor de desarrollo |
| Pinia | Gestión de estado |
| Vue Router | Navegación en cliente |
| Supabase | Autenticación (email/contraseña) + base de datos PostgreSQL |
| Vercel | CI/CD y hosting |

---

## Funcionalidades

- **Autenticación** — Registro, inicio y cierre de sesión con Supabase Auth
- **Datos por usuario** — Row Level Security garantiza que cada usuario solo ve sus propias tareas
- **CRUD de tareas** — Crear, leer, actualizar (edición inline con doble clic) y eliminar
- **Favoritos** — Fija tareas al principio de la lista; se ordenan automáticamente
- **Niveles de prioridad** — Alta / Normal / Baja con badges con código de color
- **Orden automático** — Favoritos primero → prioridad → fecha de creación
- **Filtros** — Ver Todas, Pendientes o Completadas
- **Búsqueda** — Búsqueda de texto en tiempo real dentro del filtro activo
- **Contadores** — Total, Pendientes y Completadas, siempre calculados sobre la lista completa
- **Estados vacíos contextuales** — Mensaje e icono SVG únicos según el motivo (sin tareas, sin pendientes, sin completadas, sin resultados)
- **Toasts** — Notificaciones no bloqueantes de éxito y error para cada acción
- **Modal de confirmación** — Modal personalizado que reemplaza el `confirm()` nativo para acciones destructivas
- **Estados de carga** — Spinner al cargar; botones desactivados durante operaciones asíncronas

---

## Arquitectura

Refactorizado desde una vista monolítica de ~750 líneas a una arquitectura basada en componentes:

```
src/
├── views/
│   └── HomeView.vue          # Orquestador: gestiona el estado y los datos computados
├── components/
│   ├── AppHeader.vue         # Título de la app (presentacional, sin estado)
│   ├── TaskForm.vue          # Input para crear tareas
│   ├── TaskFilters.vue       # Pestañas de filtro + buscador
│   ├── TaskList.vue          # Contenedor de la lista + contadores
│   ├── TaskItem.vue          # Card individual con todas sus acciones
│   ├── TaskEmpty.vue         # Estado vacío contextual
│   ├── ToastNotification.vue # Sistema global de toasts (via Teleport)
│   └── ConfirmModal.vue      # Modal de confirmación global (via Teleport)
├── composables/
│   ├── useToast.js           # Estado singleton de toasts compartido por toda la app
│   └── useConfirm.js         # API de confirmación basada en Promises
├── stores/
│   └── tasksStore.js         # Store de Pinia para operaciones sobre tareas
└── api/
    └── tasksApi.js           # Consultas a Supabase y ordenación en cliente
```

`HomeView` gestiona el estado de filtro y búsqueda, calcula la lista filtrada y los contadores, y pasa los datos hacia abajo como props. Los componentes hijos emiten eventos hacia arriba y evitan efectos secundarios donde es posible.

---

## Mejoras técnicas aplicadas

### Fase 1 — Repositorio limpio y deploy en producción
- Añadido `.gitignore`; eliminado `node_modules` del historial de Git
- Creado `.env.example` para documentar las variables de entorno necesarias
- Reconstruido desde cero un backend de Supabase caducado (schema, índices, políticas RLS)
- Diagnosticado y resuelto un fallo en producción: la causa raíz era la caducidad de la infraestructura, no un problema de configuración

### Fase 2 — Refactor a componentes
- División de una vista monolítica de ~750 líneas en 5 componentes de responsabilidad única
- Estado de edición y menú movido al nivel de componente donde corresponde
- Corregido un memory leak: los event listeners del `document` ahora se limpian en `onUnmounted`

### Fase 3 — Mejoras de UX
- Reemplazados todos los `alert()` y `confirm()` nativos por un sistema propio de toasts y modal
- Composables singleton (`useToast`, `useConfirm`) compartidos en toda la app via `<Teleport>`
- Spinner de carga al abrir la app; botones desactivados durante cualquier operación en curso

### Fase 4 — Filtros, búsqueda y contadores
- Pestañas de filtro (Todas / Pendientes / Completadas) con búsqueda de texto en tiempo real
- Contadores calculados sobre la lista completa, independientes del filtro activo
- Estado vacío contextual: icono SVG y mensaje únicos por escenario

### UI polish
- Eliminadas las franjas laterales de color en hover y favorito
- Sustituidas por una sombra suave en hover y fondo cálido + borde suave para favoritos

---

## Instalación local

### Requisitos previos

- Node.js 18+
- Un proyecto de Supabase con la tabla `todos` (schema más abajo)

### Instalación

```bash
git clone https://github.com/Andybetan/ih-todo-list-project.git
cd ih-todo-list-project
npm install
```

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (usa `.env.example` como referencia):

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

> El archivo `.env` está excluido del control de versiones. No subas credenciales reales al repositorio.

### Ejecutar en local

```bash
npm run dev
```

### Schema de base de datos

```sql
CREATE TABLE todos (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users NOT NULL,
  title       text NOT NULL,
  completed   boolean DEFAULT false,
  favorite    boolean DEFAULT false,
  priority    text DEFAULT 'normal',
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Cada usuario solo puede acceder a sus propias tareas
CREATE POLICY "select_own" ON todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own" ON todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own" ON todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own" ON todos FOR DELETE USING (auth.uid() = user_id);
```

---

## Seguridad

- Row Level Security está activado en la tabla `todos` — la propia base de datos aplica el aislamiento por usuario
- La clave anónima de Supabase está diseñada para ser segura en el cliente; las políticas RLS son la capa de seguridad real
- No hay credenciales reales en este repositorio

---

## Qué aprendí

- Vue 3 Composition API, sintaxis `<script setup>` y el modelo mental de estado reactivo
- Cuándo usar props, emits, composables y un store de Pinia — y por qué importa la distinción
- Supabase: flujos de autenticación, Row Level Security y políticas de base de datos
- Cómo Vite expone las variables de entorno al cliente (prefijo `VITE_`) y por qué difieren entre local y producción
- Depuración de un fallo en producción: distinguir un problema de configuración de una caducidad de infraestructura
- Patrones de UX que marcan la diferencia: notificaciones no bloqueantes, estados de carga, estados vacíos contextuales

---

## Posibles próximos pasos

- Modo oscuro
- Fechas límite y recordatorios
- Reordenación por drag & drop
- Mejoras de layout en móvil

---

## Licencia

MIT — © 2026 Andrés Beltrán Betancourt
