import { ref } from "vue";
import { defineStore } from "pinia";
import { createNewTaskAPI, fetchAllTasks } from "@/api/tasksApi";

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
      // Llama a la función createTask de tu API
      await createNewTaskAPI(task);
      // Después de crear la tarea, actualiza la lista de tareas
      await fetchTasks();
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
