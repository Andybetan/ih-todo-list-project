<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const user = ref('')
const password = ref('')

const signIn = () => {
	userStore.signIn(user.value, password.value)
}
</script>

<template>
  <main class="signin-container">
    <h1 class="signin-title">Sign In</h1>
    <form class="signin-form" @submit.prevent="signIn">
      <div class="form-group">
        <label for="username" class="form-label">Username:</label>
        <input type="email" id="username" class="form-input" v-model="user" required @input="validateEmail" />
        <span v-if="emailError" class="error-message">Invalid email address</span>
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" class="form-input" v-model="password" required />
      </div>
      <button type="submit" class="signin-btn">Sign In</button>
    </form>
  </main>
</template>

  
  <style scoped>

.signin-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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
  background-color: #2d7acc; 
}

.error-message {
  color: #ff0000; /* Color rojo para el mensaje de error */
  font-size: 0.8rem; /* Tamaño de fuente más pequeño para el mensaje de error */
}
</style>