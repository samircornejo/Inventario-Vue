<script setup>
import { ref, onMounted } from 'vue';
import { getProductos, crearProducto, eliminarProducto, actualizarProducto } from './api';

const productos = ref([]);
const editando = ref(null);
const nuevoProducto = ref({ codigo: '', nombre: '', precio: 0, stock: 0 });

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

onMounted(cargar);
</script>

<template>
  <div class="min-h-screen bg-black text-white p-8 font-sans">
    <div class="max-w-6xl mx-auto">
      
      <header class="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
          <h1 class="text-4xl font-extrabold tracking-tighter text-blue-500">FRAVATEL <span class="text-white">IMS</span></h1>
          <p class="text-gray-400 text-sm">Inventory Management System • v1.0</p>
        </div>
        <div class="text-right">
            <span class="bg-blue-900/30 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-800">SERVIDOR ACTIVO</span>
        </div>
      </header>

      <section class="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl mb-10 backdrop-blur-sm">
        <h2 class="text-lg font-semibold mb-4 text-gray-300">Registrar Nuevo Repuesto</h2>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input v-model="nuevoProducto.codigo" placeholder="Código (ej: P-101)" class="bg-gray-800 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
          <input v-model="nuevoProducto.nombre" placeholder="Nombre del producto" class="bg-gray-800 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2">
          <input v-model="nuevoProducto.precio" type="number" placeholder="Precio" class="bg-gray-800 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
          <button @click="guardar" class="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all active:scale-95">AGREGAR</button>
        </div>
      </section>

      <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <table class="w-full text-left">
          <thead class="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-widest">
            <tr>
              <th class="p-5">Identificador</th>
              <th class="p-5">Descripción</th>
              <th class="p-5 text-center">Precio Unitario</th>
              <th class="p-5 text-center">Stock</th>
              <th class="p-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="p in productos" :key="p.id" class="hover:bg-white/5 transition-colors group">
              <td class="p-5 font-mono text-blue-400 text-sm">{{ p.codigo }}</td>
              <td class="p-5 font-medium">{{ p.nombre }}</td>
              <td class="p-5 text-center">S/. {{ p.precio }}</td>
              <td class="p-5 text-center">
                <span :class="p.stock < 10 ? 'text-red-500 bg-red-500/10 px-3 py-1 rounded-full' : 'text-emerald-400'">
                    {{ p.stock }} uds
                </span>
              </td>
              <td class="p-5 text-right space-x-4">
                <button @click="prepararEdicion(p)" class="text-gray-400 hover:text-yellow-400 transition-colors">EDITAR</button>
                <button @click="borrar(p.id)" class="text-gray-600 hover:text-red-500 transition-colors">ELIMINAR</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="editando" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="bg-gray-900 border border-gray-700 p-8 rounded-3xl max-w-md w-full shadow-3xl">
            <h2 class="text-2xl font-bold mb-6">Editar Producto</h2>
            <div class="space-y-4">
                <div>
                    <label class="text-xs text-gray-400 block mb-1">Nombre</label>
                    <input v-model="editando.nombre" class="w-full bg-gray-800 border-gray-700 rounded-xl p-3 text-white">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs text-gray-400 block mb-1">Precio</label>
                        <input v-model="editando.precio" type="number" class="w-full bg-gray-800 border-gray-700 rounded-xl p-3 text-white">
                    </div>
                    <div>
                        <label class="text-xs text-gray-400 block mb-1">Stock</label>
                        <input v-model="editando.stock" type="number" class="w-full bg-gray-800 border-gray-700 rounded-xl p-3 text-white">
                    </div>
                </div>
            </div>
            <div class="flex gap-3 mt-8">
                <button @click="guardarEdicion" class="flex-1 bg-blue-600 p-3 rounded-xl font-bold hover:bg-blue-500">GUARDAR CAMBIOS</button>
                <button @click="editando = null" class="flex-1 bg-gray-800 p-3 rounded-xl font-bold hover:bg-gray-700">CANCELAR</button>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style>
/* Animaciones */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>