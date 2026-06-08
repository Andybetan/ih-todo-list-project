<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTasksStore } from '@/stores/tasksStore'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const tasksStore = useTasksStore()
const { success, error } = useToast()
const { confirm } = useConfirm()

const isEditing = ref(false)
const editTitle = ref('')
const showPriorityMenu = ref(false)
const isProcessing = ref(false)

const startEdit = () => {
  editTitle.value = props.task.title
  isEditing.value = true
}

const saveEdit = async () => {
  if (!editTitle.value.trim()) return
  isProcessing.value = true
  try {
    await tasksStore.updateTask(props.task.id, {
      title: editTitle.value.trim(),
      completed: props.task.completed,
      favorite: props.task.favorite || false,
      priority: props.task.priority || 'normal'
    })
    success('Tarea actualizada')
  } catch (err) {
    error('Error al guardar: ' + (err.message || 'Inténtalo de nuevo'))
  } finally {
    isEditing.value = false
    isProcessing.value = false
  }
}

const toggleComplete = async () => {
  isProcessing.value = true
  try {
    await tasksStore.updateTask(props.task.id, {
      title: props.task.title,
      completed: !props.task.completed,
      favorite: props.task.favorite || false,
      priority: props.task.priority || 'normal'
    })
  } catch (err) {
    error('Error al actualizar la tarea')
  } finally {
    isProcessing.value = false
  }
}

const deleteTask = async () => {
  const ok = await confirm('¿Eliminar esta tarea? Esta acción no se puede deshacer.')
  if (!ok) return
  isProcessing.value = true
  try {
    await tasksStore.deleteTask(props.task.id)
    success('Tarea eliminada')
  } catch (err) {
    error('Error al eliminar la tarea')
  } finally {
    isProcessing.value = false
  }
}

const toggleFavorite = async () => {
  isProcessing.value = true
  try {
    const current = props.task.favorite === true || props.task.favorite === 1
    await tasksStore.toggleFavorite(props.task.id, current)
  } catch (err) {
    error('Error al cambiar favorito: ' + (err.message || 'Inténtalo de nuevo'))
  } finally {
    isProcessing.value = false
  }
}

const changePriority = async (priority) => {
  isProcessing.value = true
  try {
    await tasksStore.changePriority(props.task.id, priority)
    showPriorityMenu.value = false
  } catch (err) {
    error('Error al cambiar prioridad: ' + (err.message || 'Inténtalo de nuevo'))
    showPriorityMenu.value = false
  } finally {
    isProcessing.value = false
  }
}

const isFavorite = () => props.task.favorite === true || props.task.favorite === 1

const closeMenuOnOutsideClick = (e) => {
  if (!e.target.closest('.priority-dropdown')) {
    showPriorityMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenuOnOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenuOnOutsideClick)
})
</script>

<template>
  <li
    class="task-card"
    :class="{
      'completed': task.completed,
      'favorite': isFavorite(),
      'menu-open': showPriorityMenu
    }"
  >
    <div class="task-content">
      <div class="checkbox-container">
        <input
          type="checkbox"
          :id="`checkbox-${task.id}`"
          :checked="task.completed"
          @change="toggleComplete"
          class="task-checkbox"
          :disabled="isProcessing"
        />
      </div>

      <div class="task-main-content">
        <span
          v-if="!isEditing"
          :class="{ 'completed-task': task.completed }"
          class="task-title"
          @dblclick="startEdit"
        >
          {{ task.title }}
        </span>

        <input
          v-else
          type="text"
          v-model="editTitle"
          @keydown.enter.prevent="saveEdit"
          @blur="saveEdit"
          class="task-edit-input"
          @click.stop
        />
      </div>
    </div>

    <div class="task-actions" :class="{ 'processing': isProcessing }">
      <div
        class="priority-badge"
        :class="`priority-${task.priority || 'normal'}`"
        :title="`Priority: ${(task.priority || 'normal').toUpperCase()}`"
      >
        <span class="priority-dot"></span>
        <span class="priority-text">{{ (task.priority || 'normal').charAt(0).toUpperCase() }}</span>
      </div>

      <button
        @click="toggleFavorite"
        class="action-btn favorite-btn"
        :class="{ 'active': isFavorite() }"
        :title="isFavorite() ? 'Remove from favorites' : 'Add to favorites'"
        :disabled="isProcessing"
      >
        <span class="star-icon">{{ isFavorite() ? '★' : '☆' }}</span>
      </button>

      <div class="priority-dropdown">
        <button
          @click="showPriorityMenu = !showPriorityMenu"
          class="action-btn priority-btn"
          title="Change priority"
        >
          🎯
        </button>
        <transition name="fade">
          <div v-if="showPriorityMenu" class="priority-menu" @click.stop>
            <div class="priority-menu-header">Priority</div>
            <button @click="changePriority('high')" class="priority-option high" :class="{ 'selected': (task.priority || 'normal') === 'high' }">
              <span class="priority-emoji">🔴</span>
              <span>High</span>
            </button>
            <button @click="changePriority('normal')" class="priority-option normal" :class="{ 'selected': (task.priority || 'normal') === 'normal' }">
              <span class="priority-emoji">🟢</span>
              <span>Normal</span>
            </button>
            <button @click="changePriority('low')" class="priority-option low" :class="{ 'selected': (task.priority || 'normal') === 'low' }">
              <span class="priority-emoji">⚪</span>
              <span>Low</span>
            </button>
          </div>
        </transition>
      </div>

      <button @click.stop="startEdit" class="action-btn edit-btn" title="Edit task" :disabled="isProcessing">
        ✏️
      </button>

      <button @click.stop="deleteTask" class="action-btn delete-btn" title="Delete task" :disabled="isProcessing">
        🗑️
      </button>
    </div>
  </li>
</template>

<style scoped>
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
  transform: translateY(-1px);
  border-color: #d6e3dc;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
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

.priority-badge.priority-high .priority-dot { background-color: #cc0000; }
.priority-badge.priority-normal .priority-dot { background-color: #006633; }
.priority-badge.priority-low .priority-dot { background-color: #666; }

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

.task-actions.processing {
  opacity: 0.5;
  pointer-events: none;
}

.edit-btn:hover {
  background-color: #e6f3ff;
  color: #4285f4;
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
