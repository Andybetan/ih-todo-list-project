import { ref } from "vue";
import { defineStore } from "pinia";
import {
  createNewTaskAPI,
  fetchAllTasks,
  deleteTaskAPI,
  updateTaskAPI,
} from "@/api/tasksApi";

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref([]);

  async function fetchTasks() {
    try {
      const data = await fetchAllTasks();
      tasks.value = data;
    } catch (error) {
      console.error(error);
    }
  }

  async function createNewTask(task) {
    try {
      await createNewTaskAPI(task);
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteTask(taskId) {
    try {
      await deleteTaskAPI(taskId);
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateTask(taskId, updatedTask) {
    try {
      await updateTaskAPI(taskId, updatedTask);
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleFavorite(taskId, isFavorite) {
    try {
      const updatedTask = { is_favorite: isFavorite };
      await updateTask(taskId, updatedTask);
    } catch (err) {
      console.error(err);
    }
  }

  return {
    tasks,
    fetchTasks,
    createNewTask,
    deleteTask,
    updateTask,
    toggleFavorite,
  };
});
