<script setup>
import { useTasksStore } from '@/stores/tasksStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore'; // Importar el store de usuario

const router = useRouter();
const tasksStore = useTasksStore();
const { tasks } = storeToRefs(tasksStore);
const taskTitle = ref('');
const editingTaskId = ref(null); // Nuevo estado para almacenar el ID de la tarea en modo de edición
const userStore = useUserStore(); // Acceder al store de usuario

const _addTask = async () => {
  try {
    const userId = userStore.user.id;
    const task = {
      user_id: userId,
      title: taskTitle.value,
      is_complete: false,
    };

    await tasksStore.createNewTask(task);
    tasksStore.fetchTasks();

    taskTitle.value = '';
  } catch (error) {
    console.error('Error al crear una nueva tarea:', error);
  }
};

const deleteTask = async (taskId) => {
  await tasksStore.deleteTask(taskId);
};

const updateTask = async (task) => {
  await tasksStore.updateTask(task.id, task);
};

const editTask = async (task) => {
  editingTaskId.value = task.id; // Activar el modo de edición para esta tarea
};

const saveEditedTask = async (task) => {
  await tasksStore.updateTask(task.id, task);
  editingTaskId.value = null; // Desactivar el modo de edición después de guardar
};

const toggleFavorite = async (task) => {
  task.is_favorite = !task.is_favorite; // Cambiar el estado de favorito
  await tasksStore.updateTask(task.id, task);
};

const signOut = async () => {
  await userStore.logout(); // Llama a la función logout del store de usuario
  console.log('Se ha cerrado sesión correctamente.');
  router.push({ name: 'signin' });
};

onMounted(() => {
  tasksStore.fetchTasks();
});


</script>

<template>
  <main class="todo-list-container">
    <h1 class="todo-list-title">To-do list</h1>
    <div class="input-container">
      <input type="text" v-model="taskTitle" placeholder="Enter task title" class="task-input">
      <button class="create-task-btn" @click="_addTask">
        <p id="big">Create Task</p>
        <p id="small">Create</p>
      </button>
    </div>
    <section class="tasks-section">
      <span class="task-count">tasks: {{ tasks.length }}</span>
      <ul class="tasks-list">
        <li v-for="task in tasks" :key="task.id">
          <div class="task-item">
            <div>
              <input type="checkbox" v-model="task.is_complete" @change="updateTask(task)">
              <span :class="{ 'completed-task': task.is_complete, 'favorite-task': task.is_favorite }"
                v-if="task.id !== editingTaskId">{{ task.title }}</span>
              <!-- Campo de entrada para editar la tarea -->
              <input v-else type="text" v-model="task.title" @keydown.enter.prevent="saveEditedTask(task)"
                @blur="saveEditedTask(task)" class="task-input" />
            </div>
            <!-- Botones de editar, eliminar y favoritos -->
            <div>
              <button @click="editTask(task)" class="edit-task-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="24" height="24"
                  viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5v.01" />
                  <path
                    d="M18 6l-2.5 -2.5a1.5 1.5 0 0 0 -2.121 0l-8.378 8.378c-.03 .032 -.063 .062 -.098 .089m-2.088 2.088a1.5 1.5 0 0 0 0 2.121l.5 .5a1.5 1.5 0 0 0 2.121 0l8.378 -8.378c.03 -.032 .062 -.063 .089 -.098m-2.088 2.088l3.5 3.5m-1.317 -1.318l-8.5 -8.5" />
                </svg>
              </button>
              <button @click="deleteTask(task.id)" class="delete-task-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="24"
                  height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12m-9 -3v-1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1" />
                </svg>
              </button>
              <button @click="toggleFavorite(task)" class="favorite-task-btn" :class="{ 'favorite': task.is_favorite }">
                <svg v-if="task.is_favorite" xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-star" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 3l2.23 6.43h6.31l-5.17 3.73 2.32 6.44L12 16.29l-5.68 4.31 2.32-6.44L3.46 9.43h6.31z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-star" width="24"
                  height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 3l2.23 6.43h6.31l-5.17 3.73 2.32 6.44L12 16.29l-5.68 4.31 2.32-6.44L3.46 9.43h6.31z" />
                </svg>
              </button>
            </div>
            <!-- Fin de botones de editar, eliminar y favoritos -->
          </div>
        </li>
      </ul>
    </section>
    <button class="signout-btn" @click="signOut">Sign Out</button>
    <section class="user-info">
      <p v-if="userStore.user">{{ `Welcome, ${userStore.user.email}` }}</p> <!-- Mostrar el correo electrónico en lugar del nombre -->
    </section>
  </main>
</template>

<style scoped>
.todo-list-container {

  padding: 20px;
  border-radius: 8px;
  text-align: center;
  min-width: 300px;
}

.todo-list-title {
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: bold;
  color: #666;
  margin-bottom: 20px;
}

.task-count {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.tasks-section {
  margin-top: 40px;
}

.tasks-list {
  list-style: none;
  padding: 0;
  margin-top: 30px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px;
}

.delete-task-btn,
.edit-task-btn,
.favorite-task-btn {
  padding: 6px 10px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 0;
  color: rgb(250, 251, 252);
  background-color: transparent;
}

.delete-task-btn:hover {
  background-color: rgb(245, 172, 172);
  /* Color rojo para el botón de eliminar */
  color: rgb(237, 86, 86);
}

.edit-task-btn:hover {
  background-color: #c2f9f0;
  /* Color amarillo para el botón de editar */
  color: #5ef6e2;
}

.favorite-task-btn:hover {
  background-color: #eed594;
  /* Color para el botón de favoritos */
  color: #f3bc32;
}

.favorite {
  color: #fbc02d;
  /* color para la estrella */
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin-top: 100px;
}

.signout-btn:hover {
  background-color: #e64a19;
}

.completed-task {
  text-decoration: line-through;
}

.task-item input[type="checkbox"] {
  margin-right: 10px;
}

.user-info {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  color: #666;
  margin-top: 20px;
}
</style>