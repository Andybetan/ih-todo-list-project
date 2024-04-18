<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  
  const router = useRouter();
  const userStore = useUserStore();
  
  const username = ref('');
  const password = ref('');
  const confirm = ref('');
  const email = ref('');
  const emailError = ref(false);
  const passwordMismatch = ref(false); // Agregamos una variable para controlar si las contraseñas no coinciden
  
  const handleSubmit = async () => {
    // Verificar si las contraseñas coinciden
    if (password.value !== confirm.value) {
      passwordMismatch.value = true; // Mostrar mensaje de error si las contraseñas no coinciden
      return; // Detener la ejecución del método si las contraseñas no coinciden
    }
    
    if (!emailError.value) {
      await userStore.signUp(email.value, username.value, password.value);
      router.push({ name: 'home' }); // Redirigir al usuario a la página HomeView
    }
  };
  
  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailError.value = !regex.test(email.value);
  };
</script>

<template>
  <main class="signup-container">
    <h1 class="signup-title">Sign Up</h1>
    <form class="signup-form" @submit.prevent="handleSubmit">
      <!-- Agregar un campo de correo electrónico -->
      <div class="form-group">
        <label for="email" class="form-label">Email:</label>
        <input type="email" id="email" class="form-input" v-model="email" required @input="validateEmail" />
        <span v-if="emailError" class="error-message">Invalid email address</span>
      </div>
      <!-- Agregar un campo de contraseña -->
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" class="form-input" v-model="password" required />
      </div>
      <!-- Agregar un campo de confirmación de contraseña -->
      <div class="form-group">
        <label for="confirm" class="form-label">Confirm Password:</label>
        <input type="password" id="confirm" class="form-input" v-model="confirm" required />
        <span v-if="passwordMismatch" class="error-message">Passwords do not match</span>
      </div>
      <!-- Agregar el botón "Sign Up" -->
      <button type="submit" class="signup-btn">Sign Up</button>
      <!-- Agregar el botón "Sign In" que lleva a la vista de inicio de sesión -->
      <router-link to="/signin" class="signup-btn centered-text" style="background-color: hsla(160, 100%, 37%, 1);">Sign In</router-link>
    </form>
  </main>
</template>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.signup-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.signup-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem; /* Espacio en blanco uniforme entre grupos */
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
  text-align: center !important; /* Alineación del texto centrada */
}

.centered-text {
  text-align: center;
}

.signup-btn {
  padding: 0.5rem;
  font-size: 1rem;
  background-color: var(--vt-c-black);
  color: var(--vt-c-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.signup-btn:hover {
  background-color: #2d7acc;
}

.error-message {
  color: #ff0000;
  font-size: 0.8rem;
}
</style>