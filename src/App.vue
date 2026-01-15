<script setup>
import { ref, onMounted } from 'vue';
import { getProductos, crearProducto, eliminarProducto, actualizarProducto } from './api';

const productos = ref([]);
const editando = ref(null);
const nuevoProducto = ref({ codigo: '', nombre: '', precio: 0, stock: 0 });
const isDarkMode = ref(true);

const cargar = async () => {
    const res = await getProductos();
    productos.value = res.data;
};

const guardar = async () => {
    if (!nuevoProducto.value.nombre || !nuevoProducto.value.codigo) return alert("Llena los campos");
    await crearProducto(nuevoProducto.value);
    nuevoProducto.value = { codigo: '', nombre: '', precio: 0, stock: 0 };
    cargar();
};

const borrar = async (id) => {
    if (confirm('¿Eliminar este repuesto?')) {
        await eliminarProducto(id);
        cargar();
    }
};

const prepararEdicion = (prod) => {
    editando.value = { ...prod };
};

const guardarEdicion = async () => {
    await actualizarProducto(editando.value.id, editando.value);
    editando.value = null;
    cargar();
};

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDarkMode.value = savedTheme === 'dark';
    }
    cargar();
});
</script>

<template>
  <div :class="isDarkMode ? 'dark-theme' : 'light-theme'">
    <div class="min-h-screen p-8 font-sans transition-colors duration-300">
      <div class="max-w-6xl mx-auto">
        
        <header class="flex justify-between items-center mb-10 border-b pb-6 transition-colors duration-300">
          <div>
            <h1 class="text-4xl font-extrabold tracking-tighter"><span class="text-blue-500">FRAVATEL</span> <span class="theme-text">IMS</span></h1>
            <p class="text-sm opacity-60">Inventory Management System • v1.0</p>
          </div>
          <div class="flex items-center gap-6">
            <!-- Slider de Tema -->
            <div class="flex items-center gap-3">
              <svg v-if="isDarkMode" class="w-5 h-5 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
              <svg v-else class="w-5 h-5 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414-1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z" clip-rule="evenodd"></path>
              </svg>
              <label class="theme-toggle">
                <input type="checkbox" :checked="isDarkMode" @change="toggleTheme" class="sr-only">
                <div class="toggle-slider"></div>
              </label>
            </div>
            <span class="theme-status px-3 py-1 rounded-full border text-xs font-bold">SERVIDOR ACTIVO</span>
          </div>
        </header>

        <section class="section-card mb-10">
          <h2 class="text-lg font-semibold mb-4">Registrar Nuevo Repuesto</h2>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input v-model="nuevoProducto.codigo" placeholder="Código (ej: P-101)" class="input-field">
            <input v-model="nuevoProducto.nombre" placeholder="Nombre del producto" class="input-field md:col-span-2">
            <input v-model="nuevoProducto.precio" type="number" placeholder="Precio" class="input-field">
            <button @click="guardar" class="btn-primary">AGREGAR</button>
          </div>
        </section>

        <div class="table-card">
          <table class="w-full text-left">
            <thead class="table-header">
              <tr>
                <th class="p-5">Identificador</th>
                <th class="p-5">Descripción</th>
                <th class="p-5 text-center">Precio Unitario</th>
                <th class="p-5 text-center">Stock</th>
                <th class="p-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDarkMode ? 'divide-gray-800' : 'divide-gray-300'">
              <tr v-for="p in productos" :key="p.id" class="table-row transition-colors duration-200">
                <td class="p-5 font-mono text-blue-500 text-sm">{{ p.codigo }}</td>
                <td class="p-5 font-medium">{{ p.nombre }}</td>
                <td class="p-5 text-center">S/. {{ p.precio }}</td>
                <td class="p-5 text-center">
                  <span :class="p.stock < 10 ? 'stock-low' : 'stock-ok'">
                      {{ p.stock }} uds
                  </span>
                </td>
                <td class="p-5 text-right space-x-4">
                  <button @click="prepararEdicion(p)" class="btn-action btn-edit">EDITAR</button>
                  <button @click="borrar(p.id)" class="btn-action btn-delete">ELIMINAR</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="editando" class="modal-overlay">
          <div class="modal-card">
              <h2 class="text-2xl font-bold mb-6">Editar Producto</h2>
              <div class="space-y-4">
                  <div>
                      <label class="text-xs opacity-60 block mb-1">Nombre</label>
                      <input v-model="editando.nombre" class="input-field w-full">
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                      <div>
                          <label class="text-xs opacity-60 block mb-1">Precio</label>
                          <input v-model="editando.precio" type="number" class="input-field w-full">
                      </div>
                      <div>
                          <label class="text-xs opacity-60 block mb-1">Stock</label>
                          <input v-model="editando.stock" type="number" class="input-field w-full">
                      </div>
                  </div>
              </div>
              <div class="flex gap-3 mt-8">
                  <button @click="guardarEdicion" class="btn-primary flex-1 p-3 rounded-xl">GUARDAR CAMBIOS</button>
                  <button @click="editando = null" class="btn-secondary flex-1 p-3 rounded-xl">CANCELAR</button>
              </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Variables de tema */
:root {
  --primary-color: #3b82f6;
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --bg-primary: #000000;
  --bg-secondary: #111827;
  --bg-tertiary: #1f2937;
  --border-color: #374151;
}

.light-theme {
  --primary-color: #3b82f6;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --border-color: #e5e7eb;
}

.dark-theme {
  --primary-color: #3b82f6;
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --bg-primary: #000000;
  --bg-secondary: #111827;
  --bg-tertiary: #1f2937;
  --border-color: #374151;
}

/* Tema oscuro (por defecto) */
.dark-theme {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.light-theme {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* Header */
header {
  border-color: var(--border-color);
  color: var(--text-primary);
}

.theme-text {
  color: var(--text-primary);
}

.theme-status {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-color: var(--border-color);
}

/* Slider de tema */
.theme-toggle {
  position: relative;
  display: inline-flex;
  cursor: pointer;
  width: 50px;
  height: 26px;
}

.toggle-slider {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--border-color);
  border-radius: 13px;
  transition: all 0.3s ease;
  border: 2px solid var(--border-color);
}

.toggle-slider::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background-color: var(--text-primary);
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
}

input:checked + .toggle-slider {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

input:checked + .toggle-slider::after {
  transform: translateX(24px);
}

/* Tarjetas */
.section-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 1rem;
  backdrop-filter: blur(4px);
}

.section-card h2 {
  color: var(--text-secondary);
}

.table-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.table-header {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-row {
  color: var(--text-primary);
  border-color: var(--border-color);
}

.table-row:hover {
  background-color: var(--bg-tertiary);
}

/* Inputs */
.input-field {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: var(--text-primary);
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  ring: 2px solid #3b82f6;
  border-color: #3b82f6;
}

.input-field::placeholder {
  color: var(--text-secondary);
}

/* Botones */
.btn-primary {
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  border-radius: 0.5rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary:active {
  transform: scale(0.95);
}

.btn-secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  font-weight: bold;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.btn-action {
  transition: color 0.2s;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-edit {
  color: var(--text-secondary);
}

.btn-edit:hover {
  color: #fbbf24;
}

.btn-delete {
  color: var(--text-secondary);
}

.btn-delete:hover {
  color: #ef4444;
}

/* Stock */
.stock-low {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.stock-ok {
  color: #10b981;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}

.modal-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 2rem;
  border-radius: 1.5rem;
  max-width: 28rem;
  width: 100%;
  color: var(--text-primary);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Animaciones */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>