<template>
	<header>
		<div class="wrapper">
			<nav>
				<RouterLink to="/">Home</RouterLink>
				<RouterLink to="/about">About</RouterLink>
				<RouterLink to="/signup">Sign up</RouterLink>
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
	margin-bottom: 5rem;
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
