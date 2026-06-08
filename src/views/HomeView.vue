<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/tasksStore'
import { useUserStore } from '@/stores/userStore'
import AppHeader from '@/components/AppHeader.vue'
import TaskForm from '@/components/TaskForm.vue'
import TaskFilters from '@/components/TaskFilters.vue'
import TaskList from '@/components/TaskList.vue'

const router = useRouter()
const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
const userStore = useUserStore()
const tasksLoading = ref(true)

const activeFilter = ref('all')
const searchQuery = ref('')

const filteredTasks = computed(() => {
  let result = tasks.value

  if (activeFilter.value === 'pending') {
    result = result.filter(t => !t.completed)
  } else if (activeFilter.value === 'completed') {
    result = result.filter(t => t.completed)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(t => t.title.toLowerCase().includes(q))
  }

  return result
})

const totalCount     = computed(() => tasks.value.length)
const pendingCount   = computed(() => tasks.value.filter(t => !t.completed).length)
const completedCount = computed(() => tasks.value.filter(t => t.completed).length)

const emptyContext = computed(() => {
  if (tasks.value.length === 0) return 'no-tasks'
  if (searchQuery.value.trim() && filteredTasks.value.length === 0) return 'no-results'
  if (activeFilter.value === 'pending'   && filteredTasks.value.length === 0) return 'no-pending'
  if (activeFilter.value === 'completed' && filteredTasks.value.length === 0) return 'no-completed'
  return 'no-tasks'
})

const signOut = async () => {
  await userStore.logout()
  router.push({ name: 'signin' })
}

onMounted(async () => {
  try {
    await tasksStore.fetchTasks()
  } finally {
    tasksLoading.value = false
  }
})
</script>

<template>
  <main class="todo-list-container">
    <AppHeader />
    <TaskForm />
    <TaskFilters
      :active-filter="activeFilter"
      :search-query="searchQuery"
      @update:active-filter="activeFilter = $event"
      @update:search-query="searchQuery = $event"
    />
    <TaskList
      :tasks="filteredTasks"
      :loading="tasksLoading"
      :total-count="totalCount"
      :pending-count="pendingCount"
      :completed-count="completedCount"
      :empty-context="emptyContext"
    />

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
