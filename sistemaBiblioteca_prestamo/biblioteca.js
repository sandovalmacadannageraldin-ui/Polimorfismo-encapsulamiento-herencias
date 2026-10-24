class Recurso {
    constructor(codigo, titulo) {
        this.codigo = codigo;
        this.titulo = titulo;
        this.disponible = true;
    }

    calcularPlazo() {
        return 0;
    }
}

class LibroImpreso extends Recurso {
    calcularPlazo() {
        return 7;
    }
}

class RecursoDigital extends Recurso {
    calcularPlazo() {
        return 3;
    }
}

let recursos = [];
let prestamos = [];

function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

function buscarRecurso(codigo) {
    return recursos.find(recurso => recurso.codigo === codigo);
}

function registrarRecurso() {
    let codigo = document.getElementById("codigo").value.trim();
    let titulo = document.getElementById("titulo").value.trim();
    let tipo = document.getElementById("tipo").value;

    if (codigo === "" || titulo === "") {
        mostrarMensaje("Error: completa el código y el título.");
        return;
    }

    if (buscarRecurso(codigo)) {
        mostrarMensaje("Error: el código ya está registrado.");
        return;
    }

    let nuevoRecurso;

    if (tipo === "impreso") {
        nuevoRecurso = new LibroImpreso(codigo, titulo);
    } else {
        nuevoRecurso = new RecursoDigital(codigo, titulo);
    }

    recursos.push(nuevoRecurso);

    mostrarMensaje("Recurso registrado correctamente.");
    mostrarRecursos();
}

function mostrarRecursos() {
    let tabla = document.getElementById("tablaRecursos");
    tabla.innerHTML = "";

    for (let i = 0; i < recursos.length; i++) {
        let recurso = recursos[i];
        let tipo = recurso instanceof LibroImpreso
            ? "Libro impreso"
            : "Recurso digital";

        tabla.innerHTML += `
            <tr>
                <td>${recurso.codigo}</td>
                <td>${recurso.titulo}</td>
                <td>${tipo}</td>
                <td>${recurso.disponible ? "Disponible" : "Prestado"}</td>
                <td>${recurso.calcularPlazo()} días</td>
                <td>
                    <button onclick="devolverRecurso('${recurso.codigo}')">
                        Devolver
                    </button>
                </td>
            </tr>
        `;
    }
}

function prestarRecurso() {
    let codigo = document.getElementById("codigoPrestamo").value.trim();
    let usuario = document.getElementById("usuario").value.trim();

    if (codigo === "" || usuario === "") {
        mostrarMensaje("Error: ingresa el código y el nombre del usuario.");
        return;
    }

    let recurso = buscarRecurso(codigo);

    if (!recurso) {
        mostrarMensaje("Error: el recurso no existe.");
        return;
    }

    if (!recurso.disponible) {
        mostrarMensaje("Error: el recurso no está disponible.");
        return;
    }

    let nuevoPrestamo = {
        codigo: recurso.codigo,
        titulo: recurso.titulo,
        usuario: usuario,
        plazo: recurso.calcularPlazo(),
        estado: "Activo"
    };

    prestamos.push(nuevoPrestamo);
    recurso.disponible = false;

    mostrarMensaje("Préstamo realizado correctamente.");
    mostrarRecursos();
    mostrarPrestamos();
}

function mostrarPrestamos() {
    let tabla = document.getElementById("tablaPrestamos");
    tabla.innerHTML = "";

    for (let i = 0; i < prestamos.length; i++) {
        let prestamo = prestamos[i];

        tabla.innerHTML += `
            <tr>
                <td>${prestamo.codigo}</td>
                <td>${prestamo.titulo}</td>
                <td>${prestamo.usuario}</td>
                <td>${prestamo.plazo} días</td>
                <td>${prestamo.estado}</td>
                <td>
                    ${
                        prestamo.estado === "Activo"
                        ? `<button onclick="devolverRecurso('${prestamo.codigo}')">
                            Devolver
                           </button>`
                        : "Sin acciones"
                    }
                </td>
            </tr>
        `;
    }
}

function devolverRecurso(codigo) {
    let recurso = buscarRecurso(codigo);

    if (!recurso) {
        mostrarMensaje("Error: el recurso no existe.");
        return;
    }

    if (recurso.disponible) {
        mostrarMensaje("Error: el recurso no tiene un préstamo activo.");
        return;
    }

    recurso.disponible = true;

    for (let i = prestamos.length - 1; i >= 0; i--) {
        if (
            prestamos[i].codigo === codigo &&
            prestamos[i].estado === "Activo"
        ) {
            prestamos[i].estado = "Devuelto";
            break;
        }
    }

    mostrarMensaje("Recurso devuelto correctamente.");
    mostrarRecursos();
    mostrarPrestamos();
}