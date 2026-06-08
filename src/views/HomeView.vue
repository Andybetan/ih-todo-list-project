<script setup>
import { useTasksStore } from '@/stores/tasksStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import AppHeader from '@/components/AppHeader.vue'
import TaskForm from '@/components/TaskForm.vue'
import TaskList from '@/components/TaskList.vue'

const router = useRouter()
const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
const userStore = useUserStore()

const signOut = async () => {
  await userStore.logout()
  router.push({ name: 'signin' })
}

onMounted(async () => {
  await tasksStore.fetchTasks()
})
</script>

<template>
  <main class="todo-list-container">
    <AppHeader />
    <TaskForm />
    <TaskList :tasks="tasks" />

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
  max-width: 800px;
  margin: 0 auto;
  min-width: 300px;
}

.signout-btn {
  margin-top: 40px;
  padding: 12px 24px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.signout-btn:hover {
  background-color: #35a372;
}

.user-info {
  margin-top: 20px;
  text-align: center;
}

.custom-animation {
  animation: slideIn 1.5s ease;
  color: #666;
  font-size: 14px;
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
