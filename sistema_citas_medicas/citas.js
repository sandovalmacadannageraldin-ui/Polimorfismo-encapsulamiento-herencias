class Profesional {
    constructor(identificacion, nombre) {
        this.identificacion = identificacion;
        this.nombre = nombre;
        this.disponibilidad = "Disponible";
    }

    calcularDuracion() {
        return 30;
    }
}

class MedicoGeneral extends Profesional {
    calcularDuracion() {
        return 30;
    }
}

class Especialista extends Profesional {
    calcularDuracion() {
        return 60;
    }
}

let profesionales = [];
let citas = [];

function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

function buscarProfesional(identificacion) {
    return profesionales.find(
        profesional =>
            profesional.identificacion === identificacion
    );
}

function registrarProfesional() {
    let identificacion =
        document.getElementById("identificacion").value.trim();

    let nombre =
        document.getElementById("nombre").value.trim();

    let especialidad =
        document.getElementById("especialidad").value;

    if (identificacion === "" || nombre === "") {
        mostrarMensaje("Error: completa todos los campos.");
        return;
    }

    if (buscarProfesional(identificacion)) {
        mostrarMensaje("Error: la identificación ya está registrada.");
        return;
    }

    let nuevoProfesional;

    if (especialidad === "general") {
        nuevoProfesional = new MedicoGeneral(
            identificacion, nombre
        );
    } else {
        nuevoProfesional = new Especialista(
            identificacion, nombre
        );
    }

    profesionales.push(nuevoProfesional);

    mostrarMensaje("Profesional registrado correctamente.");
    mostrarProfesionales();
}

function mostrarProfesionales() {
    let tabla = document.getElementById("tablaProfesionales");
    tabla.innerHTML = "";

    for (let i = 0; i < profesionales.length; i++) {
        let profesional = profesionales[i];

        let especialidad =
            profesional instanceof MedicoGeneral
                ? "Medicina general"
                : "Especialista";

        tabla.innerHTML += `
            <tr>
                <td>${profesional.identificacion}</td>
                <td>${profesional.nombre}</td>
                <td>${especialidad}</td>
                <td>${profesional.disponibilidad}</td>
            </tr>
        `;
    }
}

function programarCita() {
    let identificacion =
        document.getElementById("idProfesionalCita").value.trim();

    let paciente =
        document.getElementById("paciente").value.trim();

    let fecha =
        document.getElementById("fecha").value;

    let hora =
        document.getElementById("hora").value;

    if (
        identificacion === "" ||
        paciente === "" ||
        fecha === "" ||
        hora === ""
    ) {
        mostrarMensaje("Error: completa todos los datos de la cita.");
        return;
    }

    let profesional = buscarProfesional(identificacion);

    if (!profesional) {
        mostrarMensaje("Error: el profesional no existe.");
        return;
    }

    let fechaSeleccionada = new Date(fecha + "T00:00:00");
    let hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (
        Number.isNaN(fechaSeleccionada.getTime()) ||
        fechaSeleccionada < hoy
    ) {
        mostrarMensaje("Error: la fecha no puede ser inválida ni pasada.");
        return;
    }

    let citaDuplicada = citas.some(cita =>
        cita.identificacion === identificacion &&
        cita.fecha === fecha &&
        cita.hora === hora
    );

    if (citaDuplicada) {
        mostrarMensaje("Error: el profesional ya tiene una cita en ese horario.");
        return;
    }

    let duracion = profesional.calcularDuracion();

    let nuevaCita = {
        identificacion: identificacion,
        nombreProfesional: profesional.nombre,
        especialidad:
            profesional instanceof MedicoGeneral
                ? "Medicina general"
                : "Especialista",
        paciente: paciente,
        fecha: fecha,
        hora: hora,
        duracion: duracion,
        estado: "Programada"
    };

    citas.push(nuevaCita);

    mostrarMensaje("Cita programada correctamente.");
    mostrarCitas();
}

function mostrarCitas() {
    let tabla = document.getElementById("tablaCitas");
    tabla.innerHTML = "";

    for (let i = 0; i < citas.length; i++) {
        let cita = citas[i];

        tabla.innerHTML += `
            <tr>
                <td>${cita.paciente}</td>
                <td>${cita.nombreProfesional}</td>
                <td>${cita.especialidad}</td>
                <td>${cita.fecha}</td>
                <td>${cita.hora}</td>
                <td>${cita.duracion} minutos</td>
                <td>${cita.estado}</td>
            </tr>
        `;
    }
}