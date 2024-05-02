<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();

    const shouldShowHomeLink = computed(() => {
      return route.name !== undefined && !['signin', 'signup'].includes(route.name.toString());
    });

    const shouldShowAboutLink = computed(() => {
      return route.name !== undefined && !['signin', 'signup'].includes(route.name.toString());
    });

    const shouldShowSignupLink = computed(() => {
      return route.name !== undefined && !['signup', 'home', 'about'].includes(route.name.toString());
    });

    return {
      shouldShowHomeLink,
      shouldShowAboutLink,
      shouldShowSignupLink
    };
  }
};
</script>
<template>
	<header>
	  <div class="wrapper">
		<nav>
		  <RouterLink v-if="shouldShowHomeLink" to="/">Home</RouterLink>
		  <RouterLink v-if="shouldShowAboutLink" to="/about">About</RouterLink>
		  <RouterLink v-if="shouldShowSignupLink" to="/signup">Sign up</RouterLink>
		</nav>
	  </div>
	</header>
	
	<RouterView />
  </template>

<style scoped>
header {
	line-height: 1.5;
	max-height: 100vh;
	min-width: 300px;
}

nav {
	width: 100%;
	font-size: 14px;
	text-align: center;
	margin-top: 2rem;
	margin-bottom: 2rem;
}

nav a.router-link-exact-active {
	color: var(--color-text);
}

nav a.router-link-exact-active:hover {
	background-color: transparent;
}

nav a {
	display: inline-block;
	padding: 0 1rem;
	border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
	border: 0;
}
</style>
