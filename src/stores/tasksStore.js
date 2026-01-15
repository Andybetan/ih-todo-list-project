import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  fetchAllTasks,
  createNewTaskAPI,
  deleteTaskAPI,
  updateTaskAPI
} from '@/api/tasksApi'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])

  // 📥 OBTENER TODAS LAS TAREAS
  async function fetchTasks() {
    try {
      const data = await fetchAllTasks()
      tasks.value = data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      tasks.value = []
      throw error
    }
  }

  // ➕ CREAR TAREA
  async function createNewTask(task) {
    try {
      await createNewTaskAPI(task)
      await fetchTasks()
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  // ❌ ELIMINAR TAREA
  async function deleteTask(taskId) {
    try {
      await deleteTaskAPI(taskId)
      await fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  // 🔁 ACTUALIZAR TAREA (title / completed / favorite / priority)
  async function updateTask(taskId, updatedTask) {
    try {
      await updateTaskAPI(taskId, {
        title: updatedTask.title,
        completed: updatedTask.completed,
        favorite: updatedTask.favorite,
        priority: updatedTask.priority
      })
      await fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  // ⭐ TOGGLE FAVORITO
  async function toggleFavorite(taskId, currentFavorite) {
    try {
      await updateTaskAPI(taskId, {
        favorite: !currentFavorite
      })
      await fetchTasks()
    } catch (error) {
      console.error('Error toggling favorite:', error)
      throw error
    }
  }

  // 🎯 CAMBIAR PRIORIDAD
  async function changePriority(taskId, priority) {
    try {
      await updateTaskAPI(taskId, {
        priority: priority
      })
      await fetchTasks()
    } catch (error) {
      console.error('Error changing priority:', error)
      throw error
    }
  }

  return {
    tasks,
    fetchTasks,
    createNewTask,
    deleteTask,
    updateTask,
    toggleFavorite,
    changePriority
  }
})