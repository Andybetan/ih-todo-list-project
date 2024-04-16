import { ref } from "vue";
import { defineStore } from "pinia";
import { createNewTaskAPI, fetchAllTasks, deleteTaskAPI, updateTaskAPI } from "@/api/tasksApi";

export const useTasksStore = defineStore("tasks", () => {
  // State
  const tasks = ref([]);

  // Actions
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

  return {
    tasks,
    fetchTasks,
    createNewTask,
    deleteTask,
    updateTask,
  };
});