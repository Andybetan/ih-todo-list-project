import { ref } from "vue";
import { defineStore } from "pinia";
import { createNewTask, fetchAllTasks } from "@/api/tasksApi";

export const useTasksStore = defineStore("tasks", () => {
  // State
  const tasks = ref([]);

  // Getters

  // Actions
  async function fetchTasks() {
    try {
      // Llama a la API
      const data = await fetchAllTasks();
      // Actualiza el estado con los datos de la respuesta
      tasks.value = data;
    } catch (error) {
      console.error(error);
    }
  }

  async function createNewTask(task) {
    try {
      //call to the API
      await createNewTask(task);
    } catch (err) {
      console.error(err);
    }
  }

  return {
    // State
    tasks,
    // Getters
    // Actions
    fetchTasks,
    createNewTask,
  };
});
