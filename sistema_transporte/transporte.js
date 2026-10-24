class Vehiculo {
    constructor(identificador, capacidad) {
        this.identificador = identificador;
        this.capacidad = capacidad;
        this.estado = "Disponible";
    }

    calcularCosto(distancia) {
        return 0;
    }

    describirDesplazamiento() {
        return "El vehículo está realizando un viaje.";
    }
}

class Automovil extends Vehiculo {
    calcularCosto(distancia) {
        return distancia * 3000;
    }

    describirDesplazamiento() {
        return "El automóvil se desplaza por carretera.";
    }
}

class Motocicleta extends Vehiculo {
    calcularCosto(distancia) {
        return distancia * 1500;
    }

    describirDesplazamiento() {
        return "La motocicleta se desplaza por carretera.";
    }
}

class Bicicleta extends Vehiculo {
    calcularCosto(distancia) {
        return distancia * 500;
    }

    describirDesplazamiento() {
        return "La bicicleta se desplaza mediante pedaleo.";
    }
}

let vehiculos = [];
let viajes = [];

function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

function buscarVehiculo(identificador) {
    return vehiculos.find(
        vehiculo => vehiculo.identificador === identificador
    );
}

function registrarVehiculo() {
    let identificador =
        document.getElementById("identificador").value.trim();

    let tipo = document.getElementById("tipo").value;

    let capacidadTexto =
        document.getElementById("capacidad").value;

    let capacidad = Number(capacidadTexto);

    if (identificador === "" || capacidadTexto === "") {
        mostrarMensaje("Error: completa todos los campos.");
        return;
    }

    if (!Number.isInteger(capacidad) || capacidad <= 0) {
        mostrarMensaje("Error: la capacidad debe ser un entero mayor que cero.");
        return;
    }

    if (buscarVehiculo(identificador)) {
        mostrarMensaje("Error: el identificador ya está registrado.");
        return;
    }

    let nuevoVehiculo;

    if (tipo === "automovil") {
        nuevoVehiculo = new Automovil(identificador, capacidad);
    } else if (tipo === "motocicleta") {
        nuevoVehiculo = new Motocicleta(identificador, capacidad);
    } else {
        nuevoVehiculo = new Bicicleta(identificador, capacidad);
    }

    vehiculos.push(nuevoVehiculo);

    mostrarMensaje("Vehículo registrado correctamente.");
    mostrarVehiculos();
}

function mostrarVehiculos() {
    let tabla = document.getElementById("tablaVehiculos");
    tabla.innerHTML = "";

    for (let i = 0; i < vehiculos.length; i++) {
        let vehiculo = vehiculos[i];

        let tipo = vehiculo.constructor.name;

        tabla.innerHTML += `
            <tr>
                <td>${vehiculo.identificador}</td>
                <td>${tipo}</td>
                <td>${vehiculo.capacidad}</td>
                <td>${vehiculo.estado}</td>
                <td>
                    <button onclick="finalizarViaje('${vehiculo.identificador}')">
                        Liberar vehículo
                    </button>
                </td>
            </tr>
        `;
    }
}

function registrarViaje() {
    let identificador =
        document.getElementById("idViaje").value.trim();

    let distanciaTexto =
        document.getElementById("distancia").value;

    let distancia = Number(distanciaTexto);

    if (identificador === "" || distanciaTexto === "") {
        mostrarMensaje("Error: ingresa el vehículo y la distancia.");
        return;
    }

    if (!Number.isFinite(distancia) || distancia <= 0) {
        mostrarMensaje("Error: la distancia debe ser mayor que cero.");
        return;
    }

    let vehiculo = buscarVehiculo(identificador);

    if (!vehiculo) {
        mostrarMensaje("Error: el vehículo no existe.");
        return;
    }

    if (vehiculo.estado === "Ocupado") {
        mostrarMensaje("Error: el vehículo ya está ocupado.");
        return;
    }

    let costo = vehiculo.calcularCosto(distancia);

    if (!Number.isFinite(costo) || costo < 0) {
        mostrarMensaje("Error: el costo del viaje no puede ser negativo.");
        return;
    }

    let nuevoViaje = {
        identificador: vehiculo.identificador,
        tipo: vehiculo.constructor.name,
        distancia: distancia,
        costo: costo,
        estado: "En curso"
    };

    viajes.push(nuevoViaje);
    vehiculo.estado = "Ocupado";

    mostrarMensaje(vehiculo.describirDesplazamiento());
    mostrarVehiculos();
    mostrarViajes();
}

function mostrarViajes() {
    let tabla = document.getElementById("tablaViajes");
    tabla.innerHTML = "";

    for (let i = 0; i < viajes.length; i++) {
        let viaje = viajes[i];

        tabla.innerHTML += `
            <tr>
                <td>${viaje.identificador}</td>
                <td>${viaje.tipo}</td>
                <td>${viaje.distancia} km</td>
                <td>$${viaje.costo.toFixed(2)}</td>
                <td>${viaje.estado}</td>
            </tr>
        `;
    }
}

function finalizarViaje(identificador) {
    let vehiculo = buscarVehiculo(identificador);

    if (!vehiculo) {
        mostrarMensaje("Error: el vehículo no existe.");
        return;
    }

    if (vehiculo.estado === "Disponible") {
        mostrarMensaje("El vehículo ya está disponible.");
        return;
    }

    vehiculo.estado = "Disponible";

    for (let i = viajes.length - 1; i >= 0; i--) {
        if (
            viajes[i].identificador === identificador &&
            viajes[i].estado === "En curso"
        ) {
            viajes[i].estado = "Finalizado";
            break;
        }
    }

    mostrarMensaje("Viaje finalizado. Vehículo disponible.");
    mostrarVehiculos();
    mostrarViajes();
}