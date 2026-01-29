/**
 app.js - Lógica del Formulario de Registro

 */

"use strict";

// --- 1. Clases  ---

/**
 * Clase Alumno
 */
function Alumno() {
    this.datosAlumno = {};
    this.familiares = [];
    this.direccionActual = {};
    this.datosAcademicos = {};
    this.infoMedica = {};
}

/**
 * Genera HTML de los datos del alumno
 */
Alumno.prototype.getResumen = function() {
    let familiaresHtml = this.familiares.map((f, index) => `
        <div class="card card-summary">
            <div class="card-body">
                <h6 class="card-subtitle mb-2 text-muted">Familiar #${index + 1}</h6>
                <p><strong>NIF:</strong> ${f.nif} | <strong>Nombre:</strong> ${f.nombre} ${f.apellidos}</p>
                <p><strong>Profesión:</strong> ${f.profesion} | <strong>Ciudad Nac:</strong> ${f.ciudadNacimiento}</p>
                <p><strong>Idiomas:</strong> ${f.idiomas.join(', ')}</p>
            </div>
        </div>
    `).join('');

    return `
        <div class="mb-4">
            <h5>Datos Personales</h5>
            <p><strong>Nombre completo:</strong> ${this.datosAlumno.nombre} ${this.datosAlumno.apellidos}</p>
            <p><strong>NIF:</strong> ${this.datosAlumno.nif}</p>
            <p><strong>Lengua materna:</strong> ${this.datosAlumno.lenguaMaterna}</p>
            <p><strong>Idiomas:</strong> ${this.datosAlumno.idiomas.join(', ')}</p>
        </div>
        <hr>
        <div class="mb-4">
            <h5>Familiares</h5>
            ${familiaresHtml}
        </div>
        <hr>
        <div class="mb-4">
            <h5>Dirección</h5>
            <p>${this.direccionActual.direccion}, ${this.direccionActual.poblacion} (${this.direccionActual.ciudad}), ${this.direccionActual.pais}</p>
            <p><strong>C.P.:</strong> ${this.direccionActual.cp}</p>
        </div>
        <hr>
        <div class="mb-4">
            <h5>Datos Académicos</h5>
            <p><strong>Colegio:</strong> ${this.datosAcademicos.colegio}</p>
            <p><strong>Nivel Alcanzado:</strong> ${this.datosAcademicos.nivelAlcanzado}</p>
            <p><strong>Estudios Solicitados:</strong> ${this.datosAcademicos.nivelSolicitado}</p>
        </div>
        <hr>
        <div class="mb-4">
            <h5>Información Médica</h5>
            <p><strong>Alergias:</strong> ${this.infoMedica.alergias.length > 0 ? this.infoMedica.alergias.join(', ') : 'Ninguna'}</p>
            <p><strong>Medicación:</strong> ${this.infoMedica.medicacion || 'N/A'}</p>
        </div>
    `;
};

/**
 * AlumnoBuilder - Patrón Builder para construir el objeto Alumno
 */
function AlumnoBuilder() {
    this.alumno = new Alumno();
}

AlumnoBuilder.prototype.setDatosPersonales = function(datos) {
    this.alumno.datosAlumno = datos;
    return this;
};

AlumnoBuilder.prototype.addFamiliar = function(familiar) {
    this.alumno.familiares.push(familiar);
    return this;
};

AlumnoBuilder.prototype.setDireccion = function(direccion) {
    this.alumno.direccionActual = direccion;
    return this;
};

AlumnoBuilder.prototype.setDatosAcademicos = function(datos) {
    this.alumno.datosAcademicos = datos;
    return this;
};

AlumnoBuilder.prototype.setInfoMedica = function(info) {
    this.alumno.infoMedica = info;
    return this;
};

AlumnoBuilder.prototype.build = function() {
    return this.alumno;
};


// --- 2. Gestión de Datos y DOM ---

let opcionesData = null;
let familiarCount = 0;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/opciones.json');
        opcionesData = await response.json();
        
        inicializarFormulario();
    } catch (error) {
        console.error("Error cargando opciones.json:", error);
        alert("Error al cargar los datos de configuración.");
    }
});

function inicializarFormulario() {
    // Poblar selects iniciales
    poblarSelect('lenguaAlumno', opcionesData.lenguasMaternas);
    poblarSelect('idiomasAlumno', opcionesData.idiomas);
    poblarSelect('pais', opcionesData.ubicaciones.map(u => u.pais));
    poblarSelect('nivelAlcanzado', opcionesData.nivelesEstudios);
    poblarSelect('nivelSolicitado', opcionesData.nivelesSolicitados);
    poblarSelect('idiomasEstudiados', opcionesData.idiomas);
    poblarSelect('alergias', opcionesData.alergias);

    // Añadir el primer familiar obligatorio
    añadirFamiliar();

    // Eventos de dirección anidada
    document.getElementById('pais').addEventListener('change', actualizarCiudades);
    document.getElementById('ciudad').addEventListener('change', actualizarPoblaciones);

    // Evento Añadir Familiar
    document.getElementById('btnAddFamiliar').addEventListener('click', añadirFamiliar);

    // Evento Submit
    document.getElementById('registroForm').addEventListener('submit', manejarEnvio);

    // Validaciones en tiempo real (opcional pero recomendado por requisitos)
    configurarValidacionesInstantaneas();
}

/**
 * Puebla un select con un array de strings o objetos
 */
function poblarSelect(id, items, placeholder = "Selecciona...") {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Mantener la primera opción si es placeholder
    const currentFirst = el.options[0];
    el.innerHTML = '';
    if (currentFirst && currentFirst.value === "") {
        el.appendChild(currentFirst);
    } else {
        const opt = document.createElement('option');
        opt.value = "";
        opt.textContent = placeholder;
        el.appendChild(opt);
    }

    items.forEach(item => {
        const opt = document.createElement('option');
        opt.value = typeof item === 'string' ? item : (item.nombre || item);
        opt.textContent = opt.value;
        el.appendChild(opt);
    });
}

// --- 3. Lógica de Familiares Dinámicos ---

function añadirFamiliar() {
    const container = document.getElementById('familiaresContainer');
    const index = familiarCount++;
    
    const div = document.createElement('div');
    div.className = 'familiar-block shadow-sm mb-3 position-relative';
    div.id = `familiar-block-${index}`;
    div.innerHTML = `
        <button type="button" class="btn btn-sm btn-outline-danger btn-remove-familiar" 
                onclick="eliminarFamiliar(${index})" ${index === 0 ? 'style="display:none"' : ''}>&times;</button>
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label">Nombre *</label>
                <input type="text" class="form-control fam-nombre" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">Apellidos *</label>
                <input type="text" class="form-control fam-apellidos" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">NIF *</label>
                <input type="text" class="form-control fam-nif" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">Profesión *</label>
                <select class="form-select fam-profesion" required></select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Ciudad Nacimiento *</label>
                <select class="form-select fam-ciudadNac" required></select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Lengua Materna *</label>
                <select class="form-select fam-lengua" required></select>
            </div>
            <div class="col-12">
                <label class="form-label">Idiomas Conocidos *</label>
                <select class="form-select fam-idiomas" multiple required></select>
            </div>
        </div>
    `;
    container.appendChild(div);

    // Poblar los selects del nuevo bloque
    const block = document.getElementById(`familiar-block-${index}`);
    poblarSelectEl(block.querySelector('.fam-profesion'), opcionesData.profesiones);
    poblarSelectEl(block.querySelector('.fam-ciudadNac'), opcionesData.ciudadesNacimiento);
    poblarSelectEl(block.querySelector('.fam-lengua'), opcionesData.lenguasMaternas);
    poblarSelectEl(block.querySelector('.fam-idiomas'), opcionesData.idiomas);

    actualizarVisibilidadBotonesEliminar();
}

function eliminarFamiliar(index) {
    const blocks = document.querySelectorAll('.familiar-block');
    if (blocks.length > 1) {
        document.getElementById(`familiar-block-${index}`).remove();
        actualizarVisibilidadBotonesEliminar();
    }
}

function actualizarVisibilidadBotonesEliminar() {
    const blocks = document.querySelectorAll('.familiar-block');
    const btns = document.querySelectorAll('.btn-remove-familiar');
    btns.forEach(btn => {
        btn.style.display = blocks.length > 1 ? 'block' : 'none';
    });
}

function poblarSelectEl(el, items) {
    const optDefault = document.createElement('option');
    optDefault.value = "";
    optDefault.textContent = "Selecciona...";
    el.appendChild(optDefault);

    items.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        el.appendChild(opt);
    });
}

// --- 4. Selección de Ubicación en Cascada ---

function actualizarCiudades() {
    const paisNombre = this.value;
    const ciudadSelect = document.getElementById('ciudad');
    const poblacionSelect = document.getElementById('poblacion');
    
    ciudadSelect.innerHTML = '<option value="">Selecciona...</option>';
    poblacionSelect.innerHTML = '<option value="">Selecciona ciudad primero...</option>';
    poblacionSelect.disabled = true;

    if (!paisNombre) {
        ciudadSelect.disabled = true;
        return;
    }

    const paisData = opcionesData.ubicaciones.find(u => u.pais === paisNombre);
    if (paisData) {
        paisData.ciudades.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.nombre;
            opt.textContent = c.nombre;
            ciudadSelect.appendChild(opt);
        });
        ciudadSelect.disabled = false;
    }
}

function actualizarPoblaciones() {
    const ciudadNombre = this.value;
    const paisNombre = document.getElementById('pais').value;
    const poblacionSelect = document.getElementById('poblacion');

    poblacionSelect.innerHTML = '<option value="">Selecciona...</option>';

    if (!ciudadNombre) {
        poblacionSelect.disabled = true;
        return;
    }

    const paisData = opcionesData.ubicaciones.find(u => u.pais === paisNombre);
    const ciudadData = paisData.ciudades.find(c => c.nombre === ciudadNombre);

    if (ciudadData) {
        ciudadData.poblaciones.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = p;
            poblacionSelect.appendChild(opt);
        });
        poblacionSelect.disabled = false;
    }
}

// --- 5. Validaciones (Requisito 4) ---

function validarNIF(nif) {
    const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    if (!regex.test(nif)) return false;

    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numero = parseInt(nif.slice(0, 8), 10);
    const letra = nif.slice(8).toUpperCase();
    return letras[numero % 23] === letra;
}

function validarCP(cp) {
    return /^[0-9]{5}$/.test(cp);
}

function configurarValidacionesInstantaneas() {
    const form = document.getElementById('registroForm');
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('blur', () => validarCampo(input));
        input.addEventListener('change', () => validarCampo(input));
    });
}

function validarCampo(input) {
    let isValid = true;
    
    if (input.required) {
        if (input.multiple) {
            // Multiselect
            const selected = Array.from(input.options).filter(opt => opt.selected);
            isValid = selected.length > 0;
        } else {
            isValid = input.value.trim() !== "";
        }
    }

    // Validaciones específicas
    if (isValid && input.id === 'nifAlumno') {
        isValid = validarNIF(input.value);
    }
    if (isValid && input.classList.contains('fam-nif')) {
        isValid = validarNIF(input.value);
    }
    if (isValid && input.id === 'cp') {
        isValid = validarCP(input.value);
    }

    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    }
    return isValid;
}

// --- 6. Manejo del Envío y Builder ---

function manejarEnvio(event) {
    event.preventDefault();
    const form = document.getElementById('registroForm');
    let formValido = true;

    // Validar todos los campos
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!validarCampo(input)) {
            formValido = false;
        }
    });

    if (!formValido) {
        alert("Por favor, revise los errores en el formulario.");
        return;
    }

    // Usar Builder para construir el objeto Alumno
    const builder = new AlumnoBuilder();

    // A. Datos del Alumno
    builder.setDatosPersonales({
        nombre: document.getElementById('nombreAlumno').value,
        apellidos: document.getElementById('apellidosAlumno').value,
        nif: document.getElementById('nifAlumno').value.toUpperCase(),
        lenguaMaterna: document.getElementById('lenguaAlumno').value,
        idiomas: Array.from(document.getElementById('idiomasAlumno').selectedOptions).map(o => o.value)
    });

    // B. Familiares
    document.querySelectorAll('.familiar-block').forEach(block => {
        builder.addFamiliar({
            nombre: block.querySelector('.fam-nombre').value,
            apellidos: block.querySelector('.fam-apellidos').value,
            nif: block.querySelector('.fam-nif').value.toUpperCase(),
            profesion: block.querySelector('.fam-profesion').value,
            ciudadNacimiento: block.querySelector('.fam-ciudadNac').value,
            lenguaMaterna: block.querySelector('.fam-lengua').value,
            idiomas: Array.from(block.querySelector('.fam-idiomas').selectedOptions).map(o => o.value)
        });
    });

    // C. Dirección
    builder.setDireccion({
        pais: document.getElementById('pais').value,
        ciudad: document.getElementById('ciudad').value,
        poblacion: document.getElementById('poblacion').value,
        direccion: document.getElementById('direccion').value,
        cp: document.getElementById('cp').value
    });

    // D. Académicos
    builder.setDatosAcademicos({
        colegio: document.getElementById('colegio').value,
        nivelAlcanzado: document.getElementById('nivelAlcanzado').value,
        idiomasEstudiados: Array.from(document.getElementById('idiomasEstudiados').selectedOptions).map(o => o.value),
        nivelSolicitado: document.getElementById('nivelSolicitado').value
    });

    // E. Médicos
    builder.setInfoMedica({
        alergias: Array.from(document.getElementById('alergias').selectedOptions).map(o => o.value),
        medicacion: document.getElementById('medicacion').value
    });

    const elAlumno = builder.build();

    // Mostrar Resumen en Modal
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = elAlumno.getResumen();
    
    const bootstrapModal = new bootstrap.Modal(document.getElementById('resumenModal'));
    bootstrapModal.show();
}
