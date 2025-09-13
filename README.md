# 🤖 Simulador de Autómatas Finitos Deterministas (AFD)

Una aplicación web interactiva desarrollada en React para simular el comportamiento de Autómatas Finitos Deterministas, permitiendo crear, evaluar y gestionar AFDs de manera visual e intuitiva.

## 🎯 Características Principales

### ✨ Funcionalidades Core

- **Creación de AFD**: Interfaz intuitiva para definir estados, alfabeto, transiciones y estados de aceptación
- **Evaluación de Cadenas**: Procesamiento paso a paso con visualización detallada del recorrido
- **Generación Automática**: Obtención de las primeras 10 cadenas válidas del lenguaje
- **Persistencia**: Guardar y cargar configuraciones de autómatas en formato JSON

### 🎨 Interfaz y Experiencia

- **Diseño Moderno**: Interfaz responsiva con gradientes y animaciones suaves
- **Navegación por Pestañas**: Organización clara de funcionalidades
- **Validación en Tiempo Real**: Retroalimentación inmediata sobre errores
- **Visualización Clara**: Estados de éxito/error con códigos de colores

## 🚀 Tecnologías Utilizadas

- **React 18+** - Biblioteca principal de UI
- **Lucide React** - Iconografía moderna
- **Vite** - Herramienta de desarrollo y construcción
- **ESLint** - Linting de código JavaScript/React

## 📋 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** >= 16.0.0 ([Descargar aquí](https://nodejs.org/))
- **npm** >= 8.0.0 (incluido con Node.js)

Para verificar las versiones instaladas:

```bash
node --version
npm --version
```

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/fredylopez01/afd-simulator.git
cd afd-simulator
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 📦 Scripts Disponibles

| Comando            | Descripción                                         |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Inicia el servidor de desarrollo                    |
| `npm run build`    | Construye la aplicación para producción             |
| `npm run preview`  | Previsualiza la construcción de producción          |
| `npm run lint`     | Ejecuta el linter de código                         |
| `npm run lint:fix` | Ejecuta el linter y corrige errores automáticamente |

## 🏗️ Construcción para Producción

### Generar build de producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

### Previsualizar build localmente

```bash
npm run preview
```

### Despliegue

Los archivos de la carpeta `dist/` pueden ser servidos desde cualquier servidor web estático:

- **Netlify**: Arrastra la carpeta `dist/` al dashboard
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Configura el workflow de GitHub Actions
- **Apache/Nginx**: Copia el contenido de `dist/` al directorio web

## 📚 Guía de Uso

### 1. Crear un AFD

1. Ve a la pestaña **"Crear AFD"**
2. Define los **estados** (ej: q0, q1, q2)
3. Especifica el **alfabeto** (ej: 0, 1)
4. Selecciona el **estado inicial**
5. Define los **estados de aceptación**
6. Agrega las **transiciones** una por una
7. Haz clic en **"Crear AFD"**

### 2. Evaluar Cadenas

1. Ve a la pestaña **"Evaluar Cadenas"**
2. Ingresa la cadena a evaluar
3. Observa el proceso paso a paso
4. Verifica si la cadena es aceptada o rechazada

### 3. Generar Cadenas del Lenguaje

1. Ve a la pestaña **"Generar Cadenas"**
2. Haz clic en **"Generar Primeras 10 Cadenas"**
3. Visualiza las cadenas ordenadas por longitud

### 4. Gestión de Archivos

1. Ve a la pestaña **"Archivos"**
2. **Guardar**: Descarga la configuración actual en JSON
3. **Cargar**: Importa una configuración previamente guardada

## 🧩 Arquitectura de Componentes

### Componentes Principales

- **App**: Componente raíz y manejo del estado global
- **TabNavigation**: Sistema de navegación por pestañas
- **AFDCreator**: Formulario de creación de autómatas
- **StringEvaluator**: Evaluación y visualización paso a paso
- **StringGenerator**: Generación automática de cadenas
- **FileManager**: Operaciones de guardado y carga

### Hooks Personalizados

- **useAFD**: Lógica central del autómata
- **useFileOperations**: Manejo de archivos JSON
- **useValidation**: Validaciones de entrada

### Servicios

- **AFDEngine**: Motor de procesamiento del autómata
- **StringGenerator**: Algoritmos de generación de cadenas
- **FileUtils**: Utilidades para operaciones de archivo

## 🐛 Solución de Problemas

### Error: "Command not found"

```bash
# Reinstalar Node.js desde nodejs.org
# Verificar PATH del sistema
echo $PATH
```

### Error: "Module not found"

```bash
# Limpiar caché e instalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de puerto ocupado

```bash
# Cambiar puerto manualmente
npm run dev -- --port 3000
```

### Problemas de memoria en construcción

```bash
# Aumentar límite de memoria de Node
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Estándares de Código

- Usar ESLint para mantener consistencia
- Seguir convenciones de nombres de React
- Documentar funciones complejas
- Escribir tests para nueva funcionalidad

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autores

**Fredy López**

- GitHub: [@fredylopez01](https://github.com/fredylopez01)
- Email: lopezdazafredy@gmail.com

**Hugo Vergara**

- GitHub: [@HugoAVS](https://github.com/HugoAVS)
- Email: hugo.vergara@uptc.edu.co

## 🙏 Agradecimientos

- Proyecto desarrollado como parte de la asignatura Lenguajes formales.
- Inspirado en los conceptos de autómatas finitos deterministas
- UI/UX inspirado en herramientas modernas de desarrollo

---

## 📊 Estado del Proyecto

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**¿Encontraste un bug o tienes una sugerencia?**
Abre un [issue](https://github.com/fredylopez01/afd-simulator/issues) y ayúdanos a mejorar el proyecto.
