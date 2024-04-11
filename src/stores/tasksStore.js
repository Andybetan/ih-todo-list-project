import { ref } from "vue";
import { defineStore } from "pinia";
import { createTask, fetchAllTasks } from "@/api/tasksApi";

export const useTasksStore = defineStore("tasks", () => {
  // State
  const tasks = ref([]);

  // Getters

  // Actions
  async function fetchTasks() {
    try {
      //call the API
      const data = await fetchAllTasks();
      console.log(data);
      // Update the state
      tasks.value = fetchAllTasks();
    } catch (error) {
      console.error(error);
    }
  }

  async function createNewTask(task) {
    try {
      //call to the API
      await createTask(task);
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
    createTask,
  };
});
