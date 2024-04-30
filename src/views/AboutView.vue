<script setup>
</script>

<template>
	<main class="about-container">
	  <h1 class="about-title green">IRON HACK FINAL PROJECT</h1>
	  <p class="about-info">Created by - Andrés Beltran Betancourt</p>
	  <p class="about-info">GitHub repo: <a href="https://github.com/Andybetan/ih-todo-list-project">GitHub repository</a></p>
	  <section class="project-details">
		<h2 class="section-title green">Project details</h2>
		<p class="about-info">Type: Single Page Application</p>
		<p class="about-info">Features: TO-DO app</p>
		<p class="about-info">Functionality: Users can sign-up, sign-in, sign-out, create, read, update, and delete tasks</p>
		<p class="about-info">Backend support: Supabase (open source alternative to Firebase)</p>
		<h2 class="section-title green">Frontend stack</h2>
		<ul class="about-stack">
		  <li class="about-info">Framework: Vue.js</li>
		  <li class="about-info">Build tool: Vite</li>
		  <li class="about-info">Routing: Vue Router</li>
		  <li class="about-info">State management: Pinia</li>
		  <li class="about-info">CSS personalizado: Estilos propios y técnicas de diseño creadas específicamente para el proyecto utilizando reglas de CSS estándar, selectores avanzados, y enfoques de diseño modular.</li>
		</ul>
	  </section>
	</main>
	<footer class="page-footer">
	  <p>&copy; 2024 Iron Hack Final Project. All rights reserved.</p>
	</footer>
  </template>
  
  <style scoped>
  .about-container {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	text-align: center; /* Centro el contenido del contenedor */
	color: #333; /* Nuevo color de texto */
  }
  
  .about-title {
	font-size: 36px;
	font-weight: bold;
	margin: 20px auto; /* Establezco un margen superior e inferior automático para centrar verticalmente */
}
  
  .about-info {
	font-size: 16px;
	line-height: 1.6;
	color: #666;
	margin-bottom: 10px;
  }
  
  .section-title {
	font-size: 24px;
	margin-top: 20px;
  }
  
  .about-stack {
	list-style: none;
	padding: 0;
	margin: 0;
  }

  .github-link {
  display: inline-block;
  padding: 10px 20px;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 20px;
  transition: background-color 0.3s;
}
  
  .page-footer {
	text-align: center;
	padding: 20px;
	width: 100%;
  }

  .page-footer p {
  margin: 0;
  font-size: 14px;
  color: #fdfbfb;
}

.page-footer span {
  color: #555;
  font-weight: bold;
}
  </style>

