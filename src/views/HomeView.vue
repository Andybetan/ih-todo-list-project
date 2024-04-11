<script setup>
import { useTasksStore } from '@/stores/tasksStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

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

onMounted(() => {
	tasksStore.fetchTasks();
})
</script>

<template>
	<main class="todo-list-container">
	  <h1 class="todo-list-title">Todo list</h1>
	  <section class="tasks-section">
		<spam class="task-count">tasks: {{ tasks.length }}</spam>
		<ul class="tasks-list">
		  <li v-for="task in tasks" :key="task.id"> 
			{{ task.title }}
		  </li>
		</ul>
	  </section>
	</main>
  </template>
  
  <style scoped>
  /* Estilos para el contenedor principal */
  .todo-list-container {
	background-image: repeating-linear-gradient(45deg, #b3e5fc, #b3e5fc 10px, #81d4fa 10px, #81d4fa 20px); /* Patrón de rayas con tonos de azul claro */
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
  </style>