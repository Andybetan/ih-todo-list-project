<script setup>
  import { useTasksStore } from '@/stores/tasksStore'
  import { storeToRefs } from 'pinia'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/userStore'
  
  const router = useRouter()
  const tasksStore = useTasksStore()
  const { tasks } = storeToRefs(tasksStore)
  const taskTitle = ref('')
  const editingTaskId = ref(null)
  const userStore = useUserStore()
  
  // ➕ CREAR TAREA
  const addTask = async () => {
    if (!taskTitle.value) return
  
    const task = {
      title: taskTitle.value,
      completed: false
    }
  
    await tasksStore.createNewTask(task)
    await tasksStore.fetchTasks()
    taskTitle.value = ''
  }
  
  // ❌ ELIMINAR
  const deleteTask = async (taskId) => {
    await tasksStore.deleteTask(taskId)
  }
  
  // ✅ ACTUALIZAR (checkbox + edición)
  const updateTask = async (task) => {
    await tasksStore.updateTask(task.id, {
      title: task.title,
      completed: task.completed
    })
  }
  
  // ✏️ EDITAR
  const editTask = (task) => {
    editingTaskId.value = task.id
  }
  
  const saveEditedTask = async (task) => {
    await updateTask(task)
    editingTaskId.value = null
  }
  
  // 🚪 LOGOUT
  const signOut = async () => {
    await userStore.logout()
    router.push({ name: 'signin' })
  }
  
  // 📥 CARGAR TAREAS
  onMounted(async () => {
    await tasksStore.fetchTasks()
  })
  </script>
  
  <template>
    <main class="todo-list-container">
      <h1 class="todo-list-title">To-do list</h1>
  
      <div class="input-container">
        <input
          type="text"
          v-model="taskTitle"
          placeholder="Enter task title"
          class="task-input"
        />
        <button class="create-task-btn" @click="addTask">
          Create
        </button>
      </div>
  
      <section class="tasks-section">
        <span class="task-count">Total tasks: {{ tasks.length }}</span>
  
        <ul class="tasks-list">
          <li v-for="task in tasks" :key="task.id">
            <div class="task-item">
              <div>
                <input
                  type="checkbox"
                  v-model="task.completed"
                  @change="updateTask(task)"
                />
  
                <span
                  v-if="task.id !== editingTaskId"
                  :class="{ 'completed-task': task.completed }"
                >
                  {{ task.title }}
                </span>
  
                <input
                  v-else
                  type="text"
                  v-model="task.title"
                  @keydown.enter.prevent="saveEditedTask(task)"
                  @blur="saveEditedTask(task)"
                  class="task-input"
                />
              </div>
  
              <div>
                <button @click="editTask(task)" class="edit-task-btn">
                  ✏️
                </button>
  
                <button @click="deleteTask(task.id)" class="delete-task-btn">
                  🗑️
                </button>
              </div>
            </div>
          </li>
        </ul>
      </section>
  
      <button class="signout-btn" @click="signOut">Sign Out</button>
  
      <section class="user-info">
        <p v-if="userStore.user" class="custom-animation">
          Welcome, {{ userStore.user.email }}
        </p>
      </section>
    </main>
  </template>
  
  <style scoped>
  .todo-list-container {
    padding: 20px;
    text-align: center;
    min-width: 300px;
  }
  
  .todo-list-title {
    font-size: 36px;
    font-weight: bold;
    color: #666;
    margin-bottom: 20px;
  }
  
  .task-count {
    font-size: 14px;
    color: #666;
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
  }
  
  .input-container {
    display: flex;
    justify-content: center;
  }
  
  .task-input {
    height: 38px;
    padding: 10px;
    border: 1px solid #ccc;
  }
  
  .create-task-btn {
    height: 38px;
    padding: 10px;
    background-color: #42b883;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .completed-task {
    text-decoration: line-through;
  }
  
  .signout-btn {
    margin-top: 80px;
    padding: 10px 20px;
    background-color: #42b883;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .custom-animation {
    animation: slideIn 1.5s ease;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>