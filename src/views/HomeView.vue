<script setup>
  import { useTasksStore } from '@/stores/tasksStore'
  import { storeToRefs } from 'pinia'
  import { onMounted, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/userStore'
  
  const router = useRouter()
  const tasksStore = useTasksStore()
  const { tasks } = storeToRefs(tasksStore)
  const taskTitle = ref('')
  const editingTaskId = ref(null)
  const userStore = useUserStore()
  const showPriorityMenu = ref({})
  
  // ➕ CREAR TAREA
  const addTask = async () => {
    if (!taskTitle.value.trim()) return
  
    try {
      const task = {
        title: taskTitle.value.trim(),
        completed: false,
        favorite: false,
        priority: 'normal'
      }
    
      await tasksStore.createNewTask(task)
      taskTitle.value = ''
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Error al crear la tarea: ' + (error.message || 'Verifica que las columnas favorite y priority existan en la base de datos'))
    }
  }
  
  // ❌ ELIMINAR
  const deleteTask = async (taskId) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      await tasksStore.deleteTask(taskId)
    }
  }
  
  // ✅ ACTUALIZAR (checkbox + edición)
  const updateTask = async (task) => {
    await tasksStore.updateTask(task.id, {
      title: task.title,
      completed: task.completed,
      favorite: task.favorite || false,
      priority: task.priority || 'normal'
    })
  }
  
  // ✏️ EDITAR
  const editTask = (task) => {
    editingTaskId.value = task.id
  }
  
  const saveEditedTask = async (task) => {
    await updateTask(task)
    editingTaskId.value = null
  }
  
  // ⭐ TOGGLE FAVORITO
  const toggleFavorite = async (task) => {
    try {
      const currentFavorite = task.favorite === true || task.favorite === 1
      await tasksStore.toggleFavorite(task.id, currentFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Error al cambiar favorito: ' + (error.message || 'Verifica que la columna favorite exista en la base de datos'))
    }
  }
  
  // 🎯 CAMBIAR PRIORIDAD
  const changePriority = async (task, priority) => {
    try {
      await tasksStore.changePriority(task.id, priority)
      showPriorityMenu.value[task.id] = false
    } catch (error) {
      console.error('Error changing priority:', error)
      alert('Error al cambiar prioridad: ' + (error.message || 'Verifica que la columna priority exista en la base de datos'))
      showPriorityMenu.value[task.id] = false
    }
  }
  
  // 🚪 LOGOUT
  const signOut = async () => {
    await userStore.logout()
    router.push({ name: 'signin' })
  }
  
  // 📥 CARGAR TAREAS
  onMounted(async () => {
    await tasksStore.fetchTasks()
    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.priority-dropdown')) {
        showPriorityMenu.value = {}
      }
    })
  })
  
  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4444'
      case 'normal': return '#42b883'
      case 'low': return '#888'
      default: return '#42b883'
    }
  }
  
  // Obtener emoji de prioridad
  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'normal': return '🟢'
      case 'low': return '⚪'
      default: return '🟢'
    }
  }
</script>

<template>
  <main class="todo-list-container">
    <h1 class="todo-list-title">To-do list</h1>

    <div class="input-container">
      <input
        type="text"
        v-model="taskTitle"
        placeholder="Enter task title"
        class="task-input"
        @keydown.enter="addTask"
      />
      <button class="create-task-btn" @click="addTask">
        Create
      </button>
    </div>

    <section class="tasks-section">
      <div class="task-count-container">
        <span class="task-count">Total tasks: {{ tasks.length }}</span>
        <span class="completed-count">
          Completed: {{ tasks.filter(t => t.completed).length }}
        </span>
      </div>

      <ul class="tasks-list">
        <li v-for="task in tasks" :key="task.id" class="task-card" :class="{ 'completed': task.completed, 'favorite': task.favorite, 'menu-open': showPriorityMenu[task.id] }">
          <div class="task-content">
            <!-- Checkbox separado -->
            <div class="checkbox-container">
              <input
                type="checkbox"
                :id="`checkbox-${task.id}`"
                v-model="task.completed"
                @change="updateTask(task)"
                class="task-checkbox"
              />
            </div>

            <!-- Contenido de la tarea -->
            <div class="task-main-content">
              <span
                v-if="task.id !== editingTaskId"
                :class="{ 'completed-task': task.completed }"
                class="task-title"
                @dblclick="editTask(task)"
              >
                {{ task.title }}
              </span>

              <input
                v-else
                type="text"
                v-model="task.title"
                @keydown.enter.prevent="saveEditedTask(task)"
                @blur="saveEditedTask(task)"
                class="task-edit-input"
                @click.stop
              />
            </div>
          </div>

          <!-- Acciones de la tarea -->
          <div class="task-actions">
            <!-- Badge de prioridad (solo visual, no clickeable) -->
            <div 
              class="priority-badge"
              :class="`priority-${task.priority || 'normal'}`"
              :title="`Priority: ${(task.priority || 'normal').toUpperCase()}`"
            >
              <span class="priority-dot"></span>
              <span class="priority-text">{{ (task.priority || 'normal').charAt(0).toUpperCase() }}</span>
            </div>

            <!-- Botón de favorito -->
            <button 
              @click="toggleFavorite(task)" 
              class="action-btn favorite-btn"
              :class="{ 'active': task.favorite === true || task.favorite === 1 }"
              :title="(task.favorite === true || task.favorite === 1) ? 'Remove from favorites' : 'Add to favorites'"
            >
              <span class="star-icon">{{ (task.favorite === true || task.favorite === 1) ? '★' : '☆' }}</span>
            </button>

            <!-- Selector de prioridad -->
            <div class="priority-dropdown">
              <button 
                @click="showPriorityMenu[task.id] = !showPriorityMenu[task.id]"
                class="action-btn priority-btn"
                title="Change priority"
              >
                🎯
              </button>
              <transition name="fade">
                <div v-if="showPriorityMenu[task.id]" class="priority-menu" @click.stop>
                  <div class="priority-menu-header">Priority</div>
                  <button @click="changePriority(task, 'high')" class="priority-option high" :class="{ 'selected': (task.priority || 'normal') === 'high' }">
                    <span class="priority-emoji">🔴</span>
                    <span>High</span>
                  </button>
                  <button @click="changePriority(task, 'normal')" class="priority-option normal" :class="{ 'selected': (task.priority || 'normal') === 'normal' }">
                    <span class="priority-emoji">🟢</span>
                    <span>Normal</span>
                  </button>
                  <button @click="changePriority(task, 'low')" class="priority-option low" :class="{ 'selected': (task.priority || 'normal') === 'low' }">
                    <span class="priority-emoji">⚪</span>
                    <span>Low</span>
                  </button>
                </div>
              </transition>
            </div>

            <!-- Botón de editar -->
            <button @click.stop="editTask(task)" class="action-btn edit-btn" title="Edit task">
              ✏️
            </button>

            <!-- Botón de eliminar -->
            <button @click.stop="deleteTask(task.id)" class="action-btn delete-btn" title="Delete task">
              🗑️
            </button>
          </div>
        </li>
      </ul>
    </section>

    <button class="signout-btn" @click="signOut">Sign Out</button>

    <section class="user-info">
      <p v-if="userStore.user" class="custom-animation">
        Welcome, {{ userStore.user.email }}
      </p>
    </section>
  </main>
</template>

<style scoped>
.todo-list-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  min-width: 300px;
}

.todo-list-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
}

.task-input {
  flex: 1;
  max-width: 500px;
  height: 45px;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.task-input:focus {
  outline: none;
  border-color: #42b883;
}

.create-task-btn {
  height: 45px;
  padding: 12px 24px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.create-task-btn:hover {
  background-color: #35a372;
}

.tasks-section {
  margin-top: 40px;
}

.task-count-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 10px;
}

.task-count, .completed-count {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

.task-card {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: visible;
  z-index: 1;
}

.task-card.menu-open {
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(135deg, #42b883 0%, #35a372 100%);
  transition: width 0.3s ease;
  z-index: 0;
  border-radius: 16px 0 0 16px;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: #d0d0d0;
}

.task-card:hover::before {
  width: 4px;
}

.task-card.favorite {
  border-left: 4px solid #ffd700;
  background: linear-gradient(to right, #fffbf0 0%, white 15%);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.15);
}

.task-card.favorite::before {
  width: 4px;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
}

.task-card.completed {
  opacity: 0.65;
  background-color: #fafafa;
}

.task-card.completed .task-title {
  color: #999;
}

.task-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
  padding-right: 12px;
  position: relative;
  z-index: 1;
}

.checkbox-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-checkbox {
  width: 22px;
  height: 22px;
  cursor: pointer;
  accent-color: #42b883;
  border-radius: 4px;
  transition: transform 0.2s;
}

.task-checkbox:hover {
  transform: scale(1.1);
}

.task-main-content {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.task-title {
  flex: 1;
  font-size: 16px;
  color: #333;
  cursor: text;
  word-break: break-word;
  line-height: 1.5;
  padding: 4px 0;
}

.task-title:hover {
  color: #42b883;
}

.completed-task {
  text-decoration: line-through;
  color: #999;
}

.task-edit-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #42b883;
  border-radius: 6px;
  font-size: 16px;
  min-width: 200px;
}

.task-edit-input:focus {
  outline: none;
  border-color: #35a372;
}

.task-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

/* Badge de prioridad */
.priority-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s;
}

.priority-badge.priority-high {
  background-color: #ffe6e6;
  color: #cc0000;
}

.priority-badge.priority-normal {
  background-color: #e6f7ed;
  color: #006633;
}

.priority-badge.priority-low {
  background-color: #f0f0f0;
  color: #666;
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.priority-badge.priority-high .priority-dot {
  background-color: #cc0000;
}

.priority-badge.priority-normal .priority-dot {
  background-color: #006633;
}

.priority-badge.priority-low .priority-dot {
  background-color: #666;
}

.priority-text {
  font-size: 10px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #666;
}

.action-btn:hover {
  background-color: #f0f0f0;
  transform: scale(1.1);
}

.favorite-btn {
  color: #ffa500;
}

.favorite-btn .star-icon {
  font-size: 20px;
  transition: all 0.2s;
}

.favorite-btn.active {
  color: #ffd700;
}

.favorite-btn.active .star-icon {
  filter: drop-shadow(0 0 2px #ffd700);
  transform: scale(1.1);
}

.priority-dropdown {
  position: relative;
  z-index: 10;
}

.priority-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 10001;
  min-width: 150px;
  overflow: visible;
  padding: 4px 0;
  margin-top: 4px;
}

.priority-menu-header {
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #999;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 4px;
}

.priority-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  color: #333;
  font-weight: 500;
}

.priority-option:hover {
  background-color: #f8f8f8;
}

.priority-option.selected {
  background-color: #f0f8ff;
  font-weight: 600;
}

.priority-option.high:hover,
.priority-option.high.selected {
  background-color: #ffe6e6;
  color: #cc0000;
}

.priority-option.normal:hover,
.priority-option.normal.selected {
  background-color: #e6f7ed;
  color: #006633;
}

.priority-option.low:hover,
.priority-option.low.selected {
  background-color: #f5f5f5;
  color: #666;
}

.priority-emoji {
  font-size: 16px;
}

.delete-btn:hover {
  background-color: #ffe6e6;
  color: #ff4444;
}

.edit-btn:hover {
  background-color: #e6f3ff;
  color: #4285f4;
}

.signout-btn {
  margin-top: 40px;
  padding: 12px 24px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.signout-btn:hover {
  background-color: #35a372;
}

.user-info {
  margin-top: 20px;
  text-align: center;
}

.custom-animation {
  animation: slideIn 1.5s ease;
  color: #666;
  font-size: 14px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animación del menú */
.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Cerrar menú de prioridad al hacer clic fuera */
@media (max-width: 768px) {
  .task-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .task-content {
    width: 100%;
    padding-right: 0;
  }

  .task-actions {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .priority-menu {
    right: 0;
    left: auto;
  }
}
</style>
