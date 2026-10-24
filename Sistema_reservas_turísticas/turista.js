class Reserva {
    constructor(codigo, cliente, fecha, precio) {
        this.codigo = codigo;
        this.cliente = cliente;
        this.fecha = fecha;
        this.precio = precio;
        this.estado = "Activa";
    }

    calcularCosto() {
        return this.precio;
    }

    calcularCargoCancelacion() {
        return 0;
    }
}

class ReservaHotel extends Reserva {
    calcularCosto() {
        return this.precio * 1.10;
    }

    calcularCargoCancelacion() {
        return this.precio * 0.10;
    }
}

class RecorridoTuristico extends Reserva {
    calcularCosto() {
        return this.precio * 1.20;
    }

    calcularCargoCancelacion() {
        return this.precio * 0.20;
    }
}

let reservas = [];

let cuposHotel = 10;
let cuposTour = 5;

function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

function buscarReserva(codigo) {
    return reservas.find(reserva => reserva.codigo === codigo);
}

function actualizarDisponibilidad() {
    document.getElementById("disponibilidad").textContent =
        "Habitaciones de hotel disponibles: " + cuposHotel +
        " | Cupos para recorridos turísticos: " + cuposTour;
}

function registrarReserva() {
    let codigo = document.getElementById("codigo").value.trim();
    let cliente = document.getElementById("cliente").value.trim();
    let fecha = document.getElementById("fecha").value;
    let precioTexto = document.getElementById("precio").value;
    let tipo = document.getElementById("tipo").value;

    let precio = Number(precioTexto);

    if (codigo === "" || cliente === "" ||
        fecha === "" || precioTexto === "") {
        mostrarMensaje("Error: completa todos los campos.");
        return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
        mostrarMensaje("Error: el precio debe ser mayor que cero.");
        return;
    }

    let fechaReserva = new Date(fecha + "T00:00:00");
    let hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (Number.isNaN(fechaReserva.getTime()) || fechaReserva < hoy) {
        mostrarMensaje("Error: la fecha no puede estar en el pasado.");
        return;
    }

    if (buscarReserva(codigo)) {
        mostrarMensaje("Error: el código de reserva ya existe.");
        return;
    }

    if (tipo === "hotel" && cuposHotel <= 0) {
        mostrarMensaje("Error: no hay habitaciones disponibles.");
        return;
    }

    if (tipo === "tour" && cuposTour <= 0) {
        mostrarMensaje("Error: no hay cupos para el recorrido.");
        return;
    }

    let nuevaReserva;

    if (tipo === "hotel") {
        nuevaReserva = new ReservaHotel(
            codigo, cliente, fecha, precio
        );
        cuposHotel--;
    } else {
        nuevaReserva = new RecorridoTuristico(
            codigo, cliente, fecha, precio
        );
        cuposTour--;
    }

    reservas.push(nuevaReserva);

    mostrarMensaje("Reserva registrada correctamente.");
    mostrarReservas();
    actualizarDisponibilidad();
}

function mostrarReservas() {
    let tabla = document.getElementById("tablaReservas");
    tabla.innerHTML = "";

    for (let i = 0; i < reservas.length; i++) {
        let reserva = reservas[i];

        let tipo = reserva instanceof ReservaHotel
            ? "Habitación de hotel"
            : "Recorrido turístico";

        let boton = reserva.estado === "Activa"
            ? `<button onclick="cancelarReserva('${reserva.codigo}')">
                Cancelar
               </button>`
            : "Sin acciones";

        tabla.innerHTML += `
            <tr>
                <td>${reserva.codigo}</td>
                <td>${reserva.cliente}</td>
                <td>${reserva.fecha}</td>
                <td>${tipo}</td>
                <td>$${reserva.precio.toFixed(2)}</td>
                <td>$${reserva.calcularCosto().toFixed(2)}</td>
                <td>${reserva.estado}</td>
                <td>${boton}</td>
            </tr>
        `;
    }
}

function consultarReserva() {
    let codigo = document.getElementById("codigoConsulta").value.trim();
    let resultado = document.getElementById("resultadoConsulta");

    if (codigo === "") {
        resultado.textContent = "Error: escribe un código de reserva.";
        return;
    }

    let reserva = buscarReserva(codigo);

    if (!reserva) {
        resultado.textContent = "Error: la reserva no existe.";
        return;
    }

    resultado.textContent =
        "Cliente: " + reserva.cliente +
        " | Fecha: " + reserva.fecha +
        " | Estado: " + reserva.estado +
        " | Costo final: $" + reserva.calcularCosto().toFixed(2);
}

function cancelarReserva(codigo) {
    let reserva = buscarReserva(codigo);

    if (!reserva) {
        mostrarMensaje("Error: la reserva no existe.");
        return;
    }

    if (reserva.estado === "Cancelada") {
        mostrarMensaje("Error: esta reserva ya fue cancelada.");
        return;
    }

    let cargo = reserva.calcularCargoCancelacion();

    if (reserva instanceof ReservaHotel) {
        cuposHotel++;
    } else {
        cuposTour++;
    }

    reserva.estado = "Cancelada";

    mostrarMensaje(
        "Reserva cancelada. Cargo de cancelación: $" +
        cargo.toFixed(2)
    );

    mostrarReservas();
    actualizarDisponibilidad();
}

actualizarDisponibilidad();