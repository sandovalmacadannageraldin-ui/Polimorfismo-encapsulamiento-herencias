class Mascota {
    constructor(identificador, nombre, edad) {
        this.identificador = identificador;
        this.nombre = nombre;
        this.edad = edad;
        this.estado = "Disponible";
    }

    describirCuidados() {
        return "Necesita alimento, agua, higiene y atención veterinaria.";
    }
}

class Perro extends Mascota {
    describirCuidados() {
        return "Necesita paseos, alimento, agua y atención veterinaria.";
    }
}

class Gato extends Mascota {
    describirCuidados() {
        return "Necesita alimento, agua, arenero limpio y atención veterinaria.";
    }
}

let mascotas = [];
let solicitudes = [];

function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

function buscarMascota(identificador) {
    return mascotas.find(mascota =>
        mascota.identificador === identificador
    );
}

function registrarMascota() {
    let identificador =
        document.getElementById("identificador").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let edadTexto = document.getElementById("edad").value;
    let tipo = document.getElementById("tipo").value;
    let edad = Number(edadTexto);

    if (identificador === "" || nombre === "" || edadTexto === "") {
        mostrarMensaje("Error: completa todos los datos de la mascota.");
        return;
    }

    if (!Number.isInteger(edad) || edad < 0) {
        mostrarMensaje("Error: la edad debe ser un entero igual o mayor que cero.");
        return;
    }

    if (buscarMascota(identificador)) {
        mostrarMensaje("Error: el identificador ya está registrado.");
        return;
    }

    let mascota;

    if (tipo === "perro") {
        mascota = new Perro(identificador, nombre, edad);
    } else {
        mascota = new Gato(identificador, nombre, edad);
    }

    mascotas.push(mascota);

    mostrarMensaje("Mascota registrada correctamente.");
    mostrarMascotas();
}

function mostrarMascotas() {
    let tabla = document.getElementById("tablaMascotas");
    tabla.innerHTML = "";

    for (let i = 0; i < mascotas.length; i++) {
        let mascota = mascotas[i];
        let tipo = mascota instanceof Perro ? "Perro" : "Gato";

        tabla.innerHTML += `
            <tr>
                <td>${mascota.identificador}</td>
                <td>${mascota.nombre}</td>
                <td>${mascota.edad}</td>
                <td>${tipo}</td>
                <td>${mascota.describirCuidados()}</td>
                <td>${mascota.estado}</td>
                <td>
                    <button onclick="verCuidados('${mascota.identificador}')">
                        Ver cuidados
                    </button>
                </td>
            </tr>
        `;
    }
}

function verCuidados(identificador) {
    let mascota = buscarMascota(identificador);

    if (!mascota) {
        mostrarMensaje("Error: la mascota no existe.");
        return;
    }

    mostrarMensaje(
        "Cuidados de " + mascota.nombre + ": " +
        mascota.describirCuidados()
    );
}

function registrarSolicitud() {
    let numero = document.getElementById("numeroSolicitud").value.trim();
    let adoptante = document.getElementById("adoptante").value.trim();
    let identificador = document.getElementById("idMascota").value.trim();

    if (numero === "" || adoptante === "" || identificador === "") {
        mostrarMensaje("Error: completa todos los datos de la solicitud.");
        return;
    }

    let numeroRepetido = solicitudes.some(solicitud =>
        solicitud.numero === numero
    );

    if (numeroRepetido) {
        mostrarMensaje("Error: el número de solicitud ya existe.");
        return;
    }

    let mascota = buscarMascota(identificador);

    if (!mascota) {
        mostrarMensaje("Error: la mascota no existe.");
        return;
    }

    if (mascota.estado !== "Disponible") {
        mostrarMensaje("Error: esta mascota ya fue adoptada.");
        return;
    }

    let solicitudPendiente = solicitudes.some(solicitud =>
        solicitud.identificador === identificador &&
        solicitud.estado === "Pendiente"
    );

    if (solicitudPendiente) {
        mostrarMensaje("Error: esta mascota ya tiene una solicitud pendiente.");
        return;
    }

    solicitudes.push({
        numero: numero,
        adoptante: adoptante,
        identificador: identificador,
        nombreMascota: mascota.nombre,
        estado: "Pendiente"
    });

    mostrarMensaje("Solicitud registrada correctamente.");
    mostrarSolicitudes();
}

function mostrarSolicitudes() {
    let tabla = document.getElementById("tablaSolicitudes");
    tabla.innerHTML = "";

    for (let i = 0; i < solicitudes.length; i++) {
        let solicitud = solicitudes[i];

        let accion = solicitud.estado === "Pendiente"
            ? `<button onclick="aprobarAdopcion('${solicitud.numero}')">
                Aprobar adopción
               </button>`
            : "Finalizada";

        tabla.innerHTML += `
            <tr>
                <td>${solicitud.numero}</td>
                <td>${solicitud.adoptante}</td>
                <td>${solicitud.nombreMascota}</td>
                <td>${solicitud.estado}</td>
                <td>${accion}</td>
            </tr>
        `;
    }
}

function aprobarAdopcion(numero) {
    let solicitud = solicitudes.find(item => item.numero === numero);

    if (!solicitud) {
        mostrarMensaje("Error: la solicitud no existe.");
        return;
    }

    if (solicitud.estado !== "Pendiente") {
        mostrarMensaje("Error: la solicitud ya fue procesada.");
        return;
    }

    let mascota = buscarMascota(solicitud.identificador);

    if (!mascota || mascota.estado !== "Disponible") {
        mostrarMensaje("Error: la mascota ya no está disponible.");
        return;
    }

    mascota.estado = "Adoptada";
    solicitud.estado = "Aprobada";

    mostrarMensaje(
        "Adopción aprobada. " + mascota.nombre +
        " ahora está adoptada por " + solicitud.adoptante + "."
    );

    mostrarMascotas();
    mostrarSolicitudes();
}