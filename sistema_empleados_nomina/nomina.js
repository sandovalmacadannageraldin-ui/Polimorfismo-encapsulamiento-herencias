class Empleado {
    constructor(identificacion, nombre, remuneracion) {
        this.identificacion = identificacion;
        this.nombre = nombre;
        this.remuneracion = remuneracion;
    }

    calcularPago() {
        return 0;
    }
}

class EmpleadoPlanta extends Empleado {
    calcularPago() {
        return this.remuneracion;
    }
}

class Contratista extends Empleado {
    constructor(identificacion, nombre, tarifaHora, horas) {
        super(identificacion, nombre, tarifaHora);
        this.horas = horas;
    }

    calcularPago() {
        return this.remuneracion * this.horas;
    }
}

let empleados = [];

function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

function buscarEmpleado(identificacion) {
    return empleados.find(
        empleado => empleado.identificacion === identificacion
    );
}

function registrarEmpleado() {
    let identificacion =
        document.getElementById("identificacion").value.trim();

    let nombre =
        document.getElementById("nombre").value.trim();

    let tipo =
        document.getElementById("tipo").value;

    let remuneracionTexto =
        document.getElementById("remuneracion").value;

    let remuneracion = Number(remuneracionTexto);

    let horasTexto =
        document.getElementById("horas").value;

    let horas = Number(horasTexto);

    if (
        identificacion === "" ||
        nombre === "" ||
        remuneracionTexto === ""
    ) {
        mostrarMensaje("Error: completa todos los campos obligatorios.");
        return;
    }

    if (
        !Number.isFinite(remuneracion) ||
        remuneracion < 0
    ) {
        mostrarMensaje("Error: el salario o la tarifa no pueden ser negativos.");
        return;
    }

    if (buscarEmpleado(identificacion)) {
        mostrarMensaje("Error: la identificación ya está registrada.");
        return;
    }

    let nuevoEmpleado;

    if (tipo === "planta") {
        nuevoEmpleado = new EmpleadoPlanta(
            identificacion,
            nombre,
            remuneracion
        );
    } else {
        if (
            horasTexto === "" ||
            !Number.isFinite(horas) ||
            horas <= 0
        ) {
            mostrarMensaje("Error: las horas deben ser mayores que cero.");
            return;
        }

        nuevoEmpleado = new Contratista(
            identificacion,
            nombre,
            remuneracion,
            horas
        );
    }

    empleados.push(nuevoEmpleado);

    mostrarMensaje("Empleado registrado correctamente.");
    mostrarEmpleados();
}

function mostrarEmpleados() {
    let tabla = document.getElementById("tablaEmpleados");
    tabla.innerHTML = "";

    let total = 0;

    for (let i = 0; i < empleados.length; i++) {
        let empleado = empleados[i];

        let tipo;
        let horas;

        if (empleado instanceof EmpleadoPlanta) {
            tipo = "Planta";
            horas = "No aplica";
        } else {
            tipo = "Contratista";
            horas = empleado.horas;
        }

        let pago = empleado.calcularPago();

        total += pago;

        tabla.innerHTML += `
            <tr>
                <td>${empleado.identificacion}</td>
                <td>${empleado.nombre}</td>
                <td>${tipo}</td>
                <td>$${empleado.remuneracion.toFixed(2)}</td>
                <td>${horas}</td>
                <td>$${pago.toFixed(2)}</td>
                <td>
                    <button onclick="eliminarEmpleado('${empleado.identificacion}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }

    document.getElementById("totalNomina").textContent =
        "Total: $" + total.toFixed(2);
}

function eliminarEmpleado(identificacion) {
    let posicion = empleados.findIndex(
        empleado => empleado.identificacion === identificacion
    );

    if (posicion === -1) {
        mostrarMensaje("Error: el empleado no existe.");
        return;
    }

    empleados.splice(posicion, 1);

    mostrarMensaje("Empleado eliminado correctamente.");
    mostrarEmpleados();
}