<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/userStore'
import { useTasksStore } from '@/stores/tasksStore'

const router = useRouter()
const userStore = useUserStore()
const tasksStore = useTasksStore()

const user = ref('')
const password = ref('')
const emailError = ref(false)
const loginError = ref('')

const signIn = async () => {
  loginError.value = ''
  if (!emailError.value) {
    try {
      await userStore.signIn(user.value, password.value)
      await tasksStore.fetchTasks()
      router.push({ name: 'home' })
    } catch (error) {
      loginError.value = error.message || 'Error al iniciar sesión. Verifica tus credenciales.'
      console.error('Error al iniciar sesión:', error)
    }
  }
}

const validateEmail = () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  emailError.value = !regex.test(user.value)
}
</script>

<template>
  <main class="signin-container">
    <h1 class="signin-title green">Welcome</h1>
    <form class="signin-form" @submit.prevent="signIn">
      <div class="form-group">
        <label for="username" class="form-label">Email</label>
        <input type="email" id="username" class="form-input" v-model="user" required @input="validateEmail"
          autocomplete="email" />
        <span v-if="emailError" class="error-message">Invalid email address</span>
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" class="form-input" v-model="password" required
          autocomplete="current-password" />
      </div>
      <span v-if="loginError" class="error-message">{{ loginError }}</span>
      <button type="submit" class="signin-btn">Log In</button>
    </form>
  </main>
</template>

<style scoped>
.signin-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signin-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.signin-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  margin-bottom: 1rem;
  text-align: center;
}

.form-label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
  text-align: center;
  box-sizing: border-box;
}

.signin-btn {
  padding: 0.5rem;
  font-size: 1rem;
  background-color: var(--vt-c-black);
  color: var(--vt-c-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 300px;
}

.signin-btn:hover {
  background-color: #7eb6f1;
}

.error-message {
  color: #f48a8a;
  font-size: 0.8rem;
}
</style>