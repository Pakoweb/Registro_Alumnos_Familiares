# Proyecto: Registro de Alumnos y Familiares

Este es un proyecto escolar que consiste en un formulario web avanzado para la inscripción de alumnos. Permite registrar datos personales, familiares (padres/tutores), ubicación, trayectoria académica e información médica.

## Características

- **Diseño Profesional**: Utiliza **Bootstrap 5** para una interfaz limpia y responsiva.
- **Datos Dinámicos**: Las opciones de los desplegables (idiomas, niveles, países, ciudades, etc.) se cargan automáticamente desde un archivo `opciones.json`.
- **Formulario Inteligente**:
  - Permite añadir o quitar familiares de forma dinámica.
  - Selección de ubicación en cascada (al elegir un País, se filtran sus Ciudades, y luego sus Poblaciones).
- **Validación Robusta**:
  - Comprobación de campos obligatorios.
  - Validación real de NIF/NIE mediante el algoritmo de la letra.
  - Validación de formato de Código Postal.
- **Resumen Final**: Antes de "enviar", se muestra una ventana modal con todos los datos recogidos para su revisión.
- **Arquitectura de Código**: Implementado usando el patrón **Builder** y prototipos de JavaScript para una mejor organización.

## Estructura del Proyecto

```text
Registro_Alumnos_Familiares/
├── index.html          # Estructura principal del formulario
├── css/
│   └── styles.css      # Estilos personalizados y diseño
├── js/
│   └── app.js          # Lógica de programación, validaciones y DOM
├── data/
│   └── opciones.json   # Base de datos local con las opciones del formulario
└── README.md           # Este archivo informativo
```

## Requisitos para su ejecución

Para que el proyecto funcione correctamente (especialmente la carga del archivo JSON), **no se puede abrir el archivo `index.html` directamente haciendo doble clic**. 

Es necesario usar un **servidor web local**. Algunas opciones:
1. **XAMPP/WAMP**: Colocar la carpeta del proyecto dentro de `htdocs` y acceder vía `localhost`.
2. **VS Code (Live Server)**: Si usas Visual Studio Code, instala la extensión "Live Server" y pulsa "Go Live".

## Tecnologías utilizadas

- HTML5 / CSS3
- JavaScript (ES6+)
- Bootstrap 5 (Framework de diseño)
- JSON (Almacenamiento de datos)

---

