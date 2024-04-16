<script setup>
import { useTasksStore } from '@/stores/tasksStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tasksStore = useTasksStore();
const { tasks } = storeToRefs(tasksStore);
const taskTitle = ref('')

const _addTask = async () => {
  const task = {
    user_id: '84432307-394d-4dc5-a0d0-fe9da23fe345',
    title: taskTitle.value,
    is_complete: false,
  }
  await tasksStore.createNewTask(task);
  tasksStore.fetchTasks();
  taskTitle.value = '';
};

const deleteTask = async (taskId) => {
  await tasksStore.deleteTask(taskId);
};

const signOut = async () => {
  // la lógica para cerrar sesión
  router.push({ name: 'signin' }); // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
}
</script>

<template>
  <main class="todo-list-container">
    <h1 class="todo-list-title">To-do list</h1>
    <section class="tasks-section">
      <span class="task-count">tasks: {{ tasks.length }}</span>
      <ul class="tasks-list">
        <li v-for="task in tasks" :key="task.id">
          <span>{{ task.title }}</span>
          <button @click="deleteTask(task.id)" class="delete-task-btn">Delete</button>
        </li>
      </ul>
    </section>
    <div class="input-container">
      <input type="text" v-model="taskTitle" placeholder="Enter task title" class="task-input">
      <button class="create-task-btn" @click="_addTask">Create Task</button>
    </div>
    <button class="signout-btn" @click="signOut">Sign Out</button>
  </main>
</template>

<style scoped>
.todo-list-container {
  background-image: #b3e5fc;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.todo-list-title {
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.task-count {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
}

.tasks-section {
  margin-top: 20px;
}

.tasks-list {
  list-style: none;
  padding: 0;
}

.tasks-list li {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-task-btn {
  padding: 6px 10px;
  font-size: 14px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-task-btn:hover {
  background-color: #d32f2f;
}

.input-container {
  display: flex;
  align-items: center;
}

.task-input {
  height: 38px;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px 0 0 4px;
  border: 1px solid #ccc;
}

.create-task-btn {
  height: 38px;
  padding: 10px;
  font-size: 16px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-task-btn:hover {
  background-color: #e64a19;
}

.signout-btn {
  padding: 10px 20px;
  font-size: 16px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signout-btn:hover {
  background-color: #e64a19;
}
</style>