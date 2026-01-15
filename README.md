# 🚀 IMS - Frontend (Vue 3 + Vite)

Este es el panel de control para el **Sistema de Gestión de Inventarios (IMS) La interfaz ha sido diseñada para optimizar las actividades del área de soporte, permitiendo un control eficiente de repuestos y productos.

## 🛠️ Tecnologías Utilizadas

* **Framework:** [Vue 3](https://vuejs.org/) (Composition API con `<script setup>`)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (v4)
* **HTTP Client:** [Axios](https://axios-http.com/)

## 📋 Requisitos Previos

1. **API Backend:** Tener configurada y corriendo la API de este proyecto: https://github.com/samircornejo/Api-Flask-Inventario
2. **Entorno de Ejecución:** [Node.js](https://nodejs.org/) (Versión 18 o superior)
3. **Gestor de Paquetes:** `npm` o `pnpm`

## 🔧 Instalación y Configuración

1. **Clonar el repositorio:**
    ```bash
    git clone https://github.com/samircornejo/Inventario-Vue.git
    cd frontend-inventario
    ```

2. **Instalar dependencias:**
    ```bash
    npm install
    ```

3. **Configurar la URL de la API:**
    El frontend está configurado por defecto para conectarse a `http://localhost:5000`. Si tu API utiliza un puerto distinto, puedes modificar la `baseURL` en el archivo:
    `src/api.js`

## 🚀 Ejecución en Desarrollo

Para iniciar el servidor de desarrollo con **Hot Module Replacement (HMR)**:

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

## 🏗️ Estructura del Proyecto

src/api.js: Centralización de peticiones HTTP con Axios. Implementa el CRUD completo (GET, POST, PUT, DELETE).

src/App.vue: Componente principal. Gestiona la lógica de estados, renderizado de tablas, validaciones y el sistema de modales.

src/style.css: Configuración de Tailwind CSS v4 y estilos globales personalizados en modo oscuro.

## 📌 Funcionalidades Implementadas

✅ Listado en tiempo real: Conexión síncrona con PostgreSQL a través de Flask.

✅ Gestión de Stock Crítico: Indicadores visuales automáticos (alertas en rojo) para productos con menos de 10 unidades.

✅ Sistema de Modales: Flujo de edición intuitivo que mejora la experiencia de usuario (UX) al evitar recargas innecesarias.

✅ Diseño Premium: Interfaz responsiva adaptada para entornos de trabajo técnicos y soporte.

