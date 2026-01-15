import { ref } from "vue";
import { defineStore } from "pinia";
import { fetchActualUser, createNewUser, logIn, signOut } from "@/api/userApi";

export const useUserStore = defineStore("user", () => {
  const user = ref(undefined);

  async function fetchUser() {
    try {
      user.value = await fetchActualUser();
    } catch (error) {
      if (error.code === "401") {
        user.value = null;
        return;
      }
    }
  }

  async function signUp(email, password) {
    try {
      user.value = await createNewUser(email, password);
    } catch (error) {
      console.error('Error al registrarse:', error);
      throw error;
    }
  }

  async function signIn(email, password) {
    try {
      user.value = await logIn(email, password);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut();
      user.value = null;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  return {
    user,

    fetchUser,
    signUp,
    signIn,
    logout,
  };
});
