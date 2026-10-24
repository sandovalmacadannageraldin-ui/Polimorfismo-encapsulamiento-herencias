
class Servicio {
    constructor(codigo, descripcion, tarifaBase) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.tarifaBase = tarifaBase;
    }

    calcularCosto() {
        return this.tarifaBase;
    }
}

class Electricidad extends Servicio {
    calcularCosto() {
        return this.tarifaBase + 10000;
    }
}

class Plomeria extends Servicio {
    calcularCosto() {
        return this.tarifaBase + 8000;
    }
}

class Mantenimiento extends Servicio {
    calcularCosto() {
        return this.tarifaBase + 5000;
    }
}

let servicios = [];
let ordenes = [];

function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

function buscarServicio(codigo) {
    return servicios.find(servicio => servicio.codigo === codigo);
}

function registrarServicio() {
    let codigo = document.getElementById("codigo").value.trim();
    let descripcion = document.getElementById("descripcion").value.trim();
    let tarifaTexto = document.getElementById("tarifa").value;
    let tipo = document.getElementById("tipo").value;

    let tarifa = Number(tarifaTexto);

    if (codigo === "" || descripcion === "" || tarifaTexto === "") {
        mostrarMensaje("Error: completa todos los campos del servicio.");
        return;
    }

    if (!Number.isFinite(tarifa) || tarifa < 0) {
        mostrarMensaje("Error: la tarifa no puede ser negativa.");
        return;
    }

    if (buscarServicio(codigo)) {
        mostrarMensaje("Error: el código del servicio ya existe.");
        return;
    }

    let nuevoServicio;

    if (tipo === "electricidad") {
        nuevoServicio = new Electricidad(codigo, descripcion, tarifa);
    } else if (tipo === "plomeria") {
        nuevoServicio = new Plomeria(codigo, descripcion, tarifa);
    } else {
        nuevoServicio = new Mantenimiento(codigo, descripcion, tarifa);
    }

    servicios.push(nuevoServicio);

    mostrarMensaje("Servicio registrado correctamente.");
    mostrarServicios();
}

function mostrarServicios() {
    let tabla = document.getElementById("tablaServicios");
    tabla.innerHTML = "";

    for (let i = 0; i < servicios.length; i++) {
        let servicio = servicios[i];

        tabla.innerHTML += `
            <tr>
                <td>${servicio.codigo}</td>
                <td>${servicio.descripcion}</td>
                <td>${servicio.constructor.name}</td>
                <td>$${servicio.tarifaBase.toFixed(2)}</td>
                <td>$${servicio.calcularCosto().toFixed(2)}</td>
            </tr>
        `;
    }
}

function crearOrden() {
    let numero = document.getElementById("numeroOrden").value.trim();
    let cliente = document.getElementById("cliente").value.trim();
    let codigo = document.getElementById("codigoOrden").value.trim();

    if (numero === "" || cliente === "" || codigo === "") {
        mostrarMensaje("Error: completa todos los datos de la orden.");
        return;
    }

    let servicio = buscarServicio(codigo);

    if (!servicio) {
        mostrarMensaje("Error: el servicio no existe.");
        return;
    }

    let ordenRepetida = ordenes.some(orden => orden.numero === numero);

    if (ordenRepetida) {
        mostrarMensaje("Error: el número de orden ya existe.");
        return;
    }

    let nuevaOrden = {
        numero: numero,
        cliente: cliente,
        codigoServicio: servicio.codigo,
        descripcion: servicio.descripcion,
        tipo: servicio.constructor.name,
        costo: servicio.calcularCosto(),
        estado: "Pendiente"
    };

    ordenes.push(nuevaOrden);

    mostrarMensaje("Orden de trabajo creada correctamente.");
    mostrarOrdenes();
}

function mostrarOrdenes() {
    let tabla = document.getElementById("tablaOrdenes");
    tabla.innerHTML = "";

    for (let i = 0; i < ordenes.length; i++) {
        let orden = ordenes[i];

        tabla.innerHTML += `
            <tr>
                <td>${orden.numero}</td>
                <td>${orden.cliente}</td>
                <td>${orden.descripcion}</td>
                <td>${orden.tipo}</td>
                <td>$${orden.costo.toFixed(2)}</td>
                <td>${orden.estado}</td>
            </tr>
        `;
    }
}