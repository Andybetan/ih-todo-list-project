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
          {{ task.title }}
        </li>
      </ul>
    </section>
    <button class="signout-btn" @click="signOut">Sign Out</button>
  </main>
</template>

<style scoped>
/* Estilos para el contenedor principal */
.todo-list-container {
  background-image: #b3e5fc;
  padding: 20px; /* Espacio alrededor del contenido */
  border-radius: 8px; /* Bordes redondeados */
  text-align: center;
}

/* Estilos para el título "Todo list" */
.todo-list-title {
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px; /* Espacio inferior para separar del contenido siguiente */
}

/* Estilos para el texto "tasks: {{ tasks.length }}" */
.task-count {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  color: #666; /* Color de texto gris */
  margin-bottom: 10px; /* Espacio inferior para separar del contenido siguiente */
}

/* Estilos para la sección de tareas */
.tasks-section {
  margin-top: 20px; /* Espacio superior para separar del título */
}

/* Estilos para la lista de tareas */
.tasks-list {
  list-style: none; /* Quitamos los estilos de viñeta */
  padding: 0; /* Quitamos el relleno predeterminado */
}

.tasks-list li {
  margin-bottom: 10px; /* Espacio entre cada tarea */
}

/* Estilos para el botón de salida */
.signout-btn {
  padding: 10px 20px; /* Espaciado interno del botón */
  font-size: 16px; /* Tamaño de la fuente del botón */
  background-color: hsla(160, 100%, 37%, 1); /* Color de fondo del botón (rojo) */
  color: white; /* Color del texto del botón */
  border: none; /* Quitamos el borde del botón */
  border-radius: 4px; /* Bordes redondeados del botón */
  cursor: pointer; /* Cursor al pasar sobre el botón */
  transition: background-color 0.3s ease; /* Transición suave del color de fondo */
}

.signout-btn:hover {
  background-color: #E64A19; /* Color de fondo del botón al pasar el cursor (rojo más oscuro) */
}
</style>