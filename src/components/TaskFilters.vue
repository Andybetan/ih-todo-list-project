<script setup>
defineProps({
  activeFilter: { type: String, required: true },
  searchQuery: { type: String, required: true }
})

const emit = defineEmits(['update:activeFilter', 'update:searchQuery'])

const filters = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'completed', label: 'Completadas' }
]
</script>

<template>
  <div class="task-filters">
    <div class="filter-tabs" role="tablist">
      <button
        v-for="f in filters"
        :key="f.key"
        class="filter-tab"
        :class="{ active: activeFilter === f.key }"
        :aria-selected="activeFilter === f.key"
        role="tab"
        @click="emit('update:activeFilter', f.key)"
      >
        {{ f.label }}
      </button>
    </div>

    <div class="search-wrapper">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="text"
        class="search-input"
        placeholder="Buscar tareas..."
        :value="searchQuery"
        @input="emit('update:searchQuery', $event.target.value)"
      />
      <button
        v-if="searchQuery"
        class="search-clear"
        aria-label="Limpiar búsqueda"
        @click="emit('update:searchQuery', '')"
      >
        ×
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.filter-tabs {
  display: flex;
  gap: 6px;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 4px;
}

.filter-tab {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.filter-tab.active {
  background: white;
  color: #42b883;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.filter-tab:hover:not(.active) {
  color: #333;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #aaa;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 36px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.search-input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.search-input::placeholder {
  color: #bbb;
}

.search-clear {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #aaa;
  padding: 0 4px;
  line-height: 1;
  transition: color 0.2s;
}

.search-clear:hover {
  color: #666;
}
</style>
