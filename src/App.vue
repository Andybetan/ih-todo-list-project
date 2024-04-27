<template>
	<header>
  <div class="wrapper">
    <nav>
		<RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <!-- Utiliza la directiva v-if para mostrar el enlace "Sign up" solo si el usuario no está en la vista de "Home" ni en la vista de "About" -->
      <RouterLink v-if="$route.name !== 'home' && $route.name !== 'about'" to="/signup">Sign up</RouterLink>
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
