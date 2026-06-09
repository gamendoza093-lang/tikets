// ─────────────────────────────────────────────
// URL DE LA API LOCAL (PYTHON FLASK)
// ─────────────────────────────────────────────
const API_URL = "http://127.0.0.1:5000/api/tickets";

// ─────────────────────────────────────────────
// 1. LISTA PRINCIPAL (Array de objetos / diccionarios)
// ─────────────────────────────────────────────
let listaTickets = [];   // lista vacía al inicio


// ─────────────────────────────────────────────
// 2. DICCIONARIO DE MARCAS POR TIPO DE MÁQUINA
// ─────────────────────────────────────────────
let marcasPorTipo = { //
    "Laptop": [ //
        "Dell XPS", //
        "HP Pavilion", //
        "Lenovo IdeaPad", //
        "Asus VivoBook", //
        "Acer Aspire", //
        "Apple MacBook", //
        "Samsung Galaxy Book", //
        "MSI Modern", //
        "Otra marca" //
    ], //
    "Escritorio": [ //
        "HP Compaq", //
        "Dell OptiPlex", //
        "Lenovo ThinkCentre", //
        "Asus AIO", //
        "Acer Veriton", //
        "Ensamblado / Genérico", //
        "Apple iMac", //
        "Otra marca" //
    ] //
}; //


// ─────────────────────────────────────────────
// 3. LISTA DE TÉCNICOS
// ─────────────────────────────────────────────
let listaTecnicos = ["Gabriel Mendoza", "Abigail Rojas", "Benjamin Rojas"]; //


// ─────────────────────────────────────────────
// 4. MATRIZ DE ESTADÍSTICAS (Array 2D)
// ─────────────────────────────────────────────
let matrizEstadisticas = [ //
    ["Gabriel Mendoza", 0, 0, 0], //
    ["Abigail Rojas",   0, 0, 0], //
    ["Benjamin Rojas",  0, 0, 0] //
]; //


// ─────────────────────────────────────────────
// Función: actualizarMarcas()
// ─────────────────────────────────────────────
function actualizarMarcas() { //
    let tipoElegido = document.getElementById("tipo-maquina").value; //
    let selectMarca = document.getElementById("marca-dispositivo"); //

    selectMarca.innerHTML = ""; //

    if (tipoElegido === "") { //
        selectMarca.innerHTML = '<option value="">-- Primero elige tipo --</option>'; //
        return; //
    } //

    let opcionVacia = document.createElement("option"); //
    opcionVacia.value = ""; //
    opcionVacia.textContent = "-- Elige una marca --"; //
    selectMarca.appendChild(opcionVacia); //

    let listaMarcas = marcasPorTipo[tipoElegido]; //
    for (let i = 0; i < listaMarcas.length; i++) { //
        let opcion = document.createElement("option"); //
        opcion.value = listaMarcas[i]; //
        opcion.textContent = listaMarcas[i]; //
        selectMarca.appendChild(opcion); //
    } //
} //


// ─────────────────────────────────────────────
// Función: guardarDatos() - API POST
// ─────────────────────────────────────────────
function guardarDatos() {
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(listaTickets)
    })
    .then(response => response.json())
    .then(data => {
        console.log("💾 Sincronización con .txt exitosa:", data.message);
        actualizarEstadisticas();
    })
    .catch(error => {
        console.error("❌ Error al guardar datos en Python:", error);
    });
}


// ─────────────────────────────────────────────
// Función: cargarDatos() - API GET
// ─────────────────────────────────────────────
function cargarDatos() {
    fetch(API_URL)
        .then(response => response.json())
        .then(datos => {
            listaTickets = datos;
            actualizarEstadisticas();
            mostrarTabla();
            console.log("✅ Datos leídos desde el archivo .txt");
        })
        .catch(error => {
            console.error("❌ Error al conectar con el backend:", error);
        });
}


// ─────────────────────────────────────────────
// Función: crearTicket(evento)
// ─────────────────────────────────────────────
function crearTicket(evento) { //
    evento.preventDefault(); //

    let nombreCliente  = document.getElementById("cliente").value; //
    let telefonoCliente = document.getElementById("telefono").value; //
    let tipoMaquina    = document.getElementById("tipo-maquina").value; //
    let marcaMaquina   = document.getElementById("marca-dispositivo").value; //
    let descripEquipo  = document.getElementById("dispositivo").value; //
    let tecnicoAsig    = document.getElementById("tecnico").value; //
    let problema       = document.getElementById("descripcion").value; //

    let nuevoId = "T" + String(Date.now()).slice(-5); //

    let nuevoTicket = { //
        id:          nuevoId, //
        fecha:       new Date().toLocaleDateString("es-ES"), //
        cliente:     nombreCliente, //
        telefono:    telefonoCliente, //
        tipo:        tipoMaquina, //
        marca:       marcaMaquina, //
        dispositivo: descripEquipo, //
        tecnico:     tecnicoAsig, //
        descripcion: problema, //
        estado:      "Pendiente" //
    }; //

    listaTickets.push(nuevoTicket); //

    guardarDatos();
    mostrarTabla(); //

    document.getElementById("formulario-ticket").reset(); //
    document.getElementById("marca-dispositivo").innerHTML = //
        '<option value="">-- Primero elige tipo --</option>'; //

    mostrarSeccion("lista"); //
    alert("✅ Ticket " + nuevoId + " guardado automáticamente en el archivo .txt"); //
}


// ─────────────────────────────────────────────
// Función: mostrarTabla(listaMostrar)
// ─────────────────────────────────────────────
function mostrarTabla(listaMostrar) { //
    if (listaMostrar === undefined) { //
        listaMostrar = listaTickets; //
    } //

    let cuerpo = document.getElementById("cuerpo-tabla"); //
    cuerpo.innerHTML = ""; //

    for (let i = 0; i < listaMostrar.length; i++) { //
        let t = listaMostrar[i]; //

        let fila = document.createElement("tr"); //
        fila.innerHTML = //
            "<td><strong>" + t.id + "</strong></td>" + //
            "<td>" + t.fecha + "</td>" + //
            "<td>" + t.cliente + "</td>" + //
            "<td>" + t.tipo + "</td>" + //
            "<td>" + t.marca + " / " + t.dispositivo + "</td>" + //
            "<td>" + t.tecnico + "</td>" + //
            "<td class='" + obtenerClaseEstado(t.estado) + "'>" + t.estado + "</td>" + //
            "<td><button onclick=\"verDetalle('" + t.id + "')\" class=\"btn-pequeno\">Ver</button></td>"; //

        cuerpo.appendChild(fila); //
    } //
} //


// ─────────────────────────────────────────────
// Función: obtenerClaseEstado(estado)
// ─────────────────────────────────────────────
function obtenerClaseEstado(estado) { //
    if (estado === "Pendiente")  return "estado-pendiente"; //
    if (estado === "En Proceso") return "estado-proceso"; //
    if (estado === "Completado") return "estado-completado"; //
    return ""; //
} //


// ─────────────────────────────────────────────
// Función: filtrarTickets()
// ─────────────────────────────────────────────
function filtrarTickets() { //
    let textoBusqueda = document.getElementById("buscar").value.toLowerCase(); //
    let estadoFiltro  = document.getElementById("filtro-estado").value; //

    let listaFiltrada = []; //

    for (let i = 0; i < listaTickets.length; i++) { //
        let t = listaTickets[i]; //

        let coincideTexto = t.cliente.toLowerCase().includes(textoBusqueda) || //
                            t.dispositivo.toLowerCase().includes(textoBusqueda); //

        let coincideEstado = (estadoFiltro === "") || (t.estado === estadoFiltro); //

        if (coincideTexto && coincideEstado) { //
            listaFiltrada.push(t); //
        } //
    } //

    mostrarTabla(listaFiltrada); //
} //


// ─────────────────────────────────────────────
// Función: actualizarEstadisticas()
// ─────────────────────────────────────────────
function actualizarEstadisticas() { //
    let total      = listaTickets.length; //
    let pendientes = 0; //
    let enProc     = 0; //
    let completados = 0; //

    for (let i = 0; i < listaTickets.length; i++) { //
        if (listaTickets[i].estado === "Pendiente")  pendientes++; //
        if (listaTickets[i].estado === "En Proceso") enProc++; //
        if (listaTickets[i].estado === "Completado") completados++; //
    } //

    document.getElementById("total-tickets").textContent = total; //
    document.getElementById("pendientes").textContent    = pendientes; //
    document.getElementById("en-proceso").textContent    = enProc; //
    document.getElementById("completados").textContent   = completados; //

    for (let f = 0; f < matrizEstadisticas.length; f++) { //
        let nombreTecnico = matrizEstadisticas[f][0]; //

        let pend   = 0; //
        let enProc = 0; //
        let comp   = 0; //

        for (let i = 0; i < listaTickets.length; i++) { //
            let t = listaTickets[i]; //
            if (t.tecnico === nombreTecnico) { //
                if (t.estado === "Pendiente")  pend++; //
                if (t.estado === "En Proceso") enProc++; //
                if (t.estado === "Completado") comp++; //
            } //
        } //

        matrizEstadisticas[f][1] = pend; //
        matrizEstadisticas[f][2] = enProc; //
        matrizEstadisticas[f][3] = comp; //
    } //

    mostrarReporteTecnicos(); //
    mostrarReporteEstados(); //
    mostrarReporteTipos(); //
} //


// ─────────────────────────────────────────────
// Funciones de renderizado de reportes
// ─────────────────────────────────────────────
function mostrarReporteTecnicos() { //
    let html = "<table class='tabla-reporte'>"; //
    html += "<tr><th>Técnico</th><th>⏳ Pendientes</th><th>🔧 En Proceso</th><th>✅ Completados</th></tr>"; //

    for (let f = 0; f < matrizEstadisticas.length; f++) { //
        html += "<tr>"; //
        html += "<td>" + matrizEstadisticas[f][0] + "</td>"; //
        html += "<td class='centro'>" + matrizEstadisticas[f][1] + "</td>"; //
        html += "<td class='centro'>" + matrizEstadisticas[f][2] + "</td>"; //
        html += "<td class='centro'>" + matrizEstadisticas[f][3] + "</td>"; //
        html += "</tr>"; //
    } //

    html += "</table>"; //
    document.getElementById("reporte-tecnicos").innerHTML = html; //
} //

function mostrarReporteEstados() { //
    let contadorEstados = { "Pendiente": 0, "En Proceso": 0, "Completado": 0 }; //

    for (let i = 0; i < listaTickets.length; i++) { //
        let estadoActual = listaTickets[i].estado; //
        contadorEstados[estadoActual]++; //
    } //

    let html = "<table class='tabla-reporte'>"; //
    html += "<tr><th>Estado</th><th>Cantidad</th></tr>"; //
    html += "<tr><td>⏳ Pendiente</td><td class='centro estado-pendiente'>" + contadorEstados["Pendiente"]  + "</td></tr>"; //
    html += "<tr><td>🔧 En Proceso</td><td class='centro estado-proceso'>"  + contadorEstados["En Proceso"] + "</td></tr>"; //
    html += "<tr><td>✅ Completado</td><td class='centro estado-completado'>" + contadorEstados["Completado"] + "</td></tr>"; //
    html += "<tr><td><strong>Total</strong></td><td class='centro'><strong>" + listaTickets.length + "</strong></td></tr>"; //
    html += "</table>"; //

    document.getElementById("reporte-estados").innerHTML = html; //
} //

function mostrarReporteTipos() { //
    let contadorTipos = { "Laptop": 0, "Escritorio": 0 }; //

    for (let i = 0; i < listaTickets.length; i++) { //
        let tipo = listaTickets[i].tipo; //
        if (tipo in contadorTipos) { //
            contadorTipos[tipo]++; //
        } //
    } //

    let html = "<table class='tabla-reporte'>"; //
    html += "<tr><th>Tipo de Máquina</th><th>Cantidad</th></tr>"; //
    html += "<tr><td>💻 Laptop</td><td class='centro'>"     + contadorTipos["Laptop"]     + "</td></tr>"; //
    html += "<tr><td>🖥️ Escritorio</td><td class='centro'>" + contadorTipos["Escritorio"] + "</td></tr>"; //
    html += "</table>"; //

    document.getElementById("reporte-tipos").innerHTML = html; //
} //


// ─────────────────────────────────────────────
// Ventana Modal y Detalles
// ─────────────────────────────────────────────
let ticketActual = null; //

function verDetalle(id) {
    for (let i = 0; i < listaTickets.length; i++) {
        if (listaTickets[i].id === id) {
            ticketActual = listaTickets[i];
            break;
        }
    }
    if (ticketActual === null) return;

    document.getElementById("modal-id").textContent = ticketActual.id;

    // Construir opciones de marcas según el tipo actual
    function opcionesMarcas(tipoActual, marcaActual) {
        let html = "";
        let tipos = Object.keys(marcasPorTipo);
        // Si el tipo no está en el diccionario, agregar la marca actual como opción suelta
        let lista = marcasPorTipo[tipoActual] || [marcaActual];
        for (let i = 0; i < lista.length; i++) {
            html += "<option value='" + lista[i] + "'" +
                    (lista[i] === marcaActual ? " selected" : "") + ">" + lista[i] + "</option>";
        }
        if (!marcasPorTipo[tipoActual] && marcaActual) {
            html = "<option value='" + marcaActual + "' selected>" + marcaActual + "</option>";
        }
        return html;
    }

    // Construir opciones de técnicos
    function opcionesTecnicos(tecnicoActual) {
        let html = "";
        for (let i = 0; i < listaTecnicos.length; i++) {
            html += "<option value='" + listaTecnicos[i] + "'" +
                    (listaTecnicos[i] === tecnicoActual ? " selected" : "") +
                    ">" + listaTecnicos[i] + "</option>";
        }
        // Si el técnico ya no está en la lista activa, igual mostrarlo
        if (!listaTecnicos.includes(tecnicoActual)) {
            html = "<option value='" + tecnicoActual + "' selected>" + tecnicoActual + " (inactivo)</option>" + html;
        }
        return html;
    }

    let estiloInput = "width:100%; padding:8px 10px; background:#1a1a1a; border:1px solid #444;" +
                      "border-radius:5px; color:#fff; font-family:inherit; font-size:0.9rem;" +
                      "margin-top:4px; box-sizing:border-box;";
    let estiloLabel = "display:block; color:#00cc00; font-size:0.8rem; font-weight:bold; margin-top:12px;";

    let html =
        // Fila 1: Cliente + Teléfono
        "<div style='display:grid; grid-template-columns:1fr 1fr; gap:12px;'>" +
            "<div>" +
                "<label style='" + estiloLabel + "'>Cliente</label>" +
                "<input id='edit-cliente' type='text' value='" + ticketActual.cliente.replace(/'/g,"&#39;") + "' style='" + estiloInput + "'>" +
            "</div>" +
            "<div>" +
                "<label style='" + estiloLabel + "'>Teléfono</label>" +
                "<input id='edit-telefono' type='tel' value='" + ticketActual.telefono.replace(/'/g,"&#39;") + "' style='" + estiloInput + "'>" +
            "</div>" +
        "</div>" +

        // Fila 2: Tipo + Marca
        "<div style='display:grid; grid-template-columns:1fr 1fr; gap:12px;'>" +
            "<div>" +
                "<label style='" + estiloLabel + "'>Tipo de Máquina</label>" +
                "<select id='edit-tipo' onchange='actualizarMarcasModal()' style='" + estiloInput + "'>" +
                    "<option value='Laptop'"  + (ticketActual.tipo === "Laptop"     ? " selected" : "") + ">💻 Laptop</option>" +
                    "<option value='Escritorio'" + (ticketActual.tipo === "Escritorio" ? " selected" : "") + ">🖥️ Escritorio</option>" +
                "</select>" +
            "</div>" +
            "<div>" +
                "<label style='" + estiloLabel + "'>Marca / Modelo</label>" +
                "<select id='edit-marca' style='" + estiloInput + "'>" +
                    opcionesMarcas(ticketActual.tipo, ticketActual.marca) +
                "</select>" +
            "</div>" +
        "</div>" +

        // Fila 3: Dispositivo + Técnico
        "<div style='display:grid; grid-template-columns:1fr 1fr; gap:12px;'>" +
            "<div>" +
                "<label style='" + estiloLabel + "'>Descripción del Equipo</label>" +
                "<input id='edit-dispositivo' type='text' value='" + ticketActual.dispositivo.replace(/'/g,"&#39;") + "' style='" + estiloInput + "'>" +
            "</div>" +
            "<div>" +
                "<label style='" + estiloLabel + "'>Técnico Asignado</label>" +
                "<select id='edit-tecnico' style='" + estiloInput + "'>" +
                    opcionesTecnicos(ticketActual.tecnico) +
                "</select>" +
            "</div>" +
        "</div>" +

        // Descripción del problema
        "<label style='" + estiloLabel + "'>Descripción del Problema</label>" +
        "<textarea id='edit-descripcion' rows='4' style='" + estiloInput + " resize:vertical;'>" +
            ticketActual.descripcion +
        "</textarea>" +

        "<hr style='border-color:#333; margin-top:14px;'>";

    document.getElementById("modal-detalle").innerHTML = html;
    document.getElementById("modal-estado").value = ticketActual.estado;
    document.getElementById("modal").classList.remove("oculto");
}

// Actualiza el select de marcas dentro del modal cuando cambia el tipo
function actualizarMarcasModal() {
    let tipo       = document.getElementById("edit-tipo").value;
    let selectMarca = document.getElementById("edit-marca");
    selectMarca.innerHTML = "";
    let lista = marcasPorTipo[tipo] || [];
    for (let i = 0; i < lista.length; i++) {
        let opt = document.createElement("option");
        opt.value       = lista[i];
        opt.textContent = lista[i];
        selectMarca.appendChild(opt);
    }
}

function cerrarModal() {
    document.getElementById("modal").classList.add("oculto");
    ticketActual = null;
}

function guardarCambioEstado() {
    if (ticketActual === null) return;

    // Validar campos obligatorios
    let cliente     = document.getElementById("edit-cliente").value.trim();
    let telefono    = document.getElementById("edit-telefono").value.trim();
    let tipo        = document.getElementById("edit-tipo").value;
    let marca       = document.getElementById("edit-marca").value;
    let dispositivo = document.getElementById("edit-dispositivo").value.trim();
    let tecnico     = document.getElementById("edit-tecnico").value;
    let descripcion = document.getElementById("edit-descripcion").value.trim();
    let estado      = document.getElementById("modal-estado").value;

    if (!cliente || !telefono || !tipo || !marca || !dispositivo || !tecnico || !descripcion) {
        alert("⚠️ Todos los campos son obligatorios.");
        return;
    }

    // Aplicar cambios al ticket
    ticketActual.cliente     = cliente;
    ticketActual.telefono    = telefono;
    ticketActual.tipo        = tipo;
    ticketActual.marca       = marca;
    ticketActual.dispositivo = dispositivo;
    ticketActual.tecnico     = tecnico;
    ticketActual.descripcion = descripcion;
    ticketActual.estado      = estado;

    guardarDatos();
    mostrarTabla();
    cerrarModal();
    alert("✅ Ticket " + ticketActual.id + " actualizado correctamente.");
}


// ─────────────────────────────────────────────
// Gestión de Secciones del Menú Lateral
// ─────────────────────────────────────────────
function mostrarSeccion(nombre) { //
    let secciones = document.querySelectorAll(".seccion"); //
    for (let i = 0; i < secciones.length; i++) { //
        secciones[i].classList.add("oculto"); //
    } //

    document.getElementById("seccion-" + nombre).classList.remove("oculto"); //

    let botones = document.querySelectorAll(".menu-lateral li"); //
    for (let i = 0; i < botones.length; i++) { //
        botones[i].classList.remove("activo"); //
    } //

    if (nombre === "nuevo")    document.getElementById("btn-nuevo").classList.add("activo"); //
    if (nombre === "lista")    document.getElementById("btn-lista").classList.add("activo"); //
    if (nombre === "reportes") document.getElementById("btn-reportes").classList.add("activo"); //

    if (nombre === "reportes") { //
        actualizarEstadisticas(); //
    } //
} //


// ─────────────────────────────────────────────
// Funciones Legacy (Backups Manuales por si acaso)
// ─────────────────────────────────────────────
function exportarTXT() { //
    if (listaTickets.length === 0) { return; } //
    let contenido = "ID|Fecha|Cliente|Telefono|Tipo|Marca|Dispositivo|Tecnico|Descripcion|Estado\n"; //
    for (let i = 0; i < listaTickets.length; i++) { //
        let t = listaTickets[i]; //
        contenido += t.id + "|" + t.fecha + "|" + t.cliente + "|" + t.telefono + "|" + t.tipo + "|" + t.marca + "|" + t.dispositivo + "|" + t.tecnico + "|" + t.descripcion.replace(/\n/g, " ") + "|" + t.estado + "\n"; //
    } //
    let blob = new Blob([contenido], { type: "text/plain" }); //
    let url  = URL.createObjectURL(blob); //
    let enlace = document.createElement("a"); //
    enlace.href = url; //
    enlace.download = "manual_backup_tickets.txt"; //
    enlace.click(); //
}

function importarTXT() {
    alert("💡 El sistema ahora sincroniza con Python en tiempo real.");
}


// ─────────────────────────────────────────────
// GESTIÓN DE TÉCNICOS
// ─────────────────────────────────────────────

/**
 * Sincroniza listaTecnicos y matrizEstadisticas,
 * luego actualiza el <select> del formulario y
 * la lista visual de gestión en Reportes.
 */
function renderizarListaTecnicos() {
    // 1. Actualizar el <select> del formulario de nuevo ticket
    let selectTecnico = document.getElementById("tecnico");
    let valorActual   = selectTecnico.value; // conservar selección si ya había una

    selectTecnico.innerHTML = '<option value="">-- Seleccionar técnico --</option>';
    for (let i = 0; i < listaTecnicos.length; i++) {
        let opcion       = document.createElement("option");
        opcion.value     = listaTecnicos[i];
        opcion.textContent = listaTecnicos[i];
        if (listaTecnicos[i] === valorActual) opcion.selected = true;
        selectTecnico.appendChild(opcion);
    }

    // 2. Reconstruir matrizEstadisticas para que incluya a todos los técnicos actuales
    //    Se conservan los contadores de los que ya existían.
    let nuevaMatriz = [];
    for (let i = 0; i < listaTecnicos.length; i++) {
        let nombre    = listaTecnicos[i];
        let existente = null;

        // Buscar si ya tenía fila en la matriz
        for (let f = 0; f < matrizEstadisticas.length; f++) {
            if (matrizEstadisticas[f][0] === nombre) {
                existente = matrizEstadisticas[f];
                break;
            }
        }

        if (existente) {
            nuevaMatriz.push(existente);      // conservar contadores
        } else {
            nuevaMatriz.push([nombre, 0, 0, 0]); // técnico nuevo → contadores en 0
        }
    }
    matrizEstadisticas = nuevaMatriz;

    // 3. Renderizar la lista de gestión en la sección Reportes
    let ulGestion = document.getElementById("lista-tecnicos-gestion");
    if (!ulGestion) return;

    ulGestion.innerHTML = "";
    for (let i = 0; i < listaTecnicos.length; i++) {
        let nombre = listaTecnicos[i];

        // Contar tickets activos de este técnico
        let ticketsActivos = 0;
        for (let j = 0; j < listaTickets.length; j++) {
            if (listaTickets[j].tecnico === nombre &&
                listaTickets[j].estado  !== "Completado") {
                ticketsActivos++;
            }
        }

        let li = document.createElement("li");
        li.style.cssText = "display:flex; justify-content:space-between; align-items:center;" +
                           "padding:10px 14px; border-bottom:1px solid #2a2a2a;";

        li.innerHTML =
            "<span style='color:#e0e0e0;'>" + nombre +
            "  <small style='color:#888; font-size:0.78rem;'>(" + ticketsActivos + " activo" +
            (ticketsActivos !== 1 ? "s" : "") + ")</small></span>" +
            "<button onclick=\"eliminarTecnico('" + nombre + "')\" " +
            "style='background:#1a1a1a; color:#ff4444; border:1px solid #ff4444;" +
            "padding:5px 12px; border-radius:4px; cursor:pointer; font-family:inherit;" +
            "font-size:0.8rem;' " +
            "title='Eliminar técnico'>✖ Remover</button>";

        ulGestion.appendChild(li);
    }
}


/**
 * Agrega un técnico nuevo a listaTecnicos,
 * actualiza la matriz y refresca la UI.
 */
function agregarNuevoTecnico() {
    let inputNombre = document.getElementById("nuevo-tecnico-nombre");
    let nombre      = inputNombre.value.trim();

    // Validaciones
    if (nombre === "") {
        alert("⚠️ Escribe el nombre del técnico antes de añadir.");
        return;
    }
    if (nombre.length < 3) {
        alert("⚠️ El nombre debe tener al menos 3 caracteres.");
        return;
    }

    // Evitar duplicados (comparación sin distinción de mayúsculas)
    for (let i = 0; i < listaTecnicos.length; i++) {
        if (listaTecnicos[i].toLowerCase() === nombre.toLowerCase()) {
            alert("⚠️ El técnico \"" + nombre + "\" ya existe en la lista.");
            inputNombre.focus();
            return;
        }
    }

    // Agregar y actualizar
    listaTecnicos.push(nombre);
    renderizarListaTecnicos();
    actualizarEstadisticas();

    inputNombre.value = "";
    inputNombre.focus();

    console.log("✅ Técnico añadido:", nombre, "| Total técnicos:", listaTecnicos.length);
}


/**
 * Elimina un técnico de listaTecnicos.
 * Si tiene tickets activos (no Completados), pide confirmación.
 */
function eliminarTecnico(nombre) {
    // Contar tickets activos del técnico
    let ticketsActivos = 0;
    for (let i = 0; i < listaTickets.length; i++) {
        if (listaTickets[i].tecnico === nombre &&
            listaTickets[i].estado  !== "Completado") {
            ticketsActivos++;
        }
    }

    // Advertencia si tiene tickets abiertos
    if (ticketsActivos > 0) {
        let confirmar = confirm(
            "⚠️ " + nombre + " tiene " + ticketsActivos + " ticket(s) activo(s).\n" +
            "¿Seguro que deseas removerlo del sistema?\n\n" +
            "Los tickets existentes conservarán su nombre, pero no podrás asignarle nuevos."
        );
        if (!confirmar) return;
    } else {
        let confirmar = confirm("¿Remover a \"" + nombre + "\" del personal activo?");
        if (!confirmar) return;
    }

    // Eliminar de la lista
    listaTecnicos = listaTecnicos.filter(function(t) { return t !== nombre; });

    renderizarListaTecnicos();
    actualizarEstadisticas();

    console.log("🗑️ Técnico eliminado:", nombre, "| Técnicos restantes:", listaTecnicos.length);
}


// ─────────────────────────────────────────────
// INICIO DEL PROGRAMA
// ─────────────────────────────────────────────
window.onload = function() {
    let opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    document.getElementById("fecha-hoy").textContent =
        new Date().toLocaleDateString("es-ES", opciones);

    // Poblar el select de técnicos desde listaTecnicos
    renderizarListaTecnicos();

    // Cargar datos automáticamente desde Python (.txt)
    cargarDatos();

    // Mostrar sección inicial
    mostrarSeccion("nuevo");
};