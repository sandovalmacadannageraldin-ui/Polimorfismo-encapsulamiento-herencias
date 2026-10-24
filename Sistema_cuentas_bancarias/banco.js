class Cuenta {
    #saldo;

    constructor(numero, titular, saldo) {
        this.numero = numero;
        this.titular = titular;
        this.#saldo = Number(saldo);
    }

    getSaldo() {
        return this.#saldo;
    }

    consignar(valor) {
        if (!Number.isFinite(valor) || valor <= 0) {
            console.error("Error: la consignación debe ser mayor que cero.");
            return false;
        }

        this.#saldo = this.#saldo + valor;
        return true;
    }

    retirar(valor) {
        if (!Number.isFinite(valor) || valor <= 0) {
            console.error("Error: el retiro debe ser mayor que cero.");
            return false;
        }

        if (valor > this.#saldo) {
            console.error("Error: saldo insuficiente.");
            return false;
        }

        this.#saldo = this.#saldo - valor;
        return true;
    }

    tipoCuenta() {
        return "Cuenta general";
    }
}

//cuenta ahorros

class CuentaAhorros extends Cuenta {

    constructor(numero, titular, saldo) {
        super(numero, titular, saldo);
    }

    retirar(valor) {
        // En ahorros no se permite retirar más del saldo.
        return super.retirar(valor);
    }

    tipoCuenta() {
        return "Ahorros";
    }
}

//corriente

class CuentaCorriente extends Cuenta {

    constructor(numero, titular, saldo) {
        super(numero, titular, saldo);
    }

    retirar(valor) {
        // La cuenta corriente cobra una comisión de $1.000.
        if (!Number.isFinite(valor) || valor <= 0) {
            console.error("Error: el retiro debe ser mayor que cero.");
            return false;
        }

        let totalRetiro = valor + 1000;

        if (totalRetiro > this.getSaldo()) {
            console.error(
                "Error: saldo insuficiente para el retiro y la comisión."
            );
            return false;
        }

        return super.retirar(totalRetiro);
    }

    tipoCuenta() {
        return "Corriente";
    }
}


let arregloCuentas = [];


function mostrarMensaje(texto, error = false) {
    document.getElementById("mensaje").textContent = texto;

    if (error) {
        console.error(texto);
    } else {
        console.log(texto);
    }
}

function registrarCuenta() {

    let numero = document.getElementById("numero").value.trim();
    let titular = document.getElementById("titular").value.trim();
    let saldo = Number(document.getElementById("saldo").value);
    let tipo = document.getElementById("tipo").value;

    if (numero === "" || titular === "") {
        mostrarMensaje("Error: completa el número y el titular.", true);
        return;
    }

    if (document.getElementById("saldo").value.trim() === "" ||
        !Number.isFinite(saldo) || saldo < 0) {
        mostrarMensaje("Error: el saldo inicial no puede ser negativo ni estar vacío.", true);
        return;
    }

    let repetida = arregloCuentas.some(
        cuenta => cuenta.numero === numero
    );

    if (repetida) {
        mostrarMensaje("Error: ya existe una cuenta con ese número.", true);
        return;
    }

    let nuevaCuenta;

    if (tipo === "ahorros") {
        nuevaCuenta = new CuentaAhorros(numero, titular, saldo);
    } else {
        nuevaCuenta = new CuentaCorriente(numero, titular, saldo);
    }

    arregloCuentas.push(nuevaCuenta);

    mostrarMensaje("Cuenta registrada correctamente.");

    actualizarTabla();

    document.getElementById("numero").value = "";
    document.getElementById("titular").value = "";
    document.getElementById("saldo").value = "";
}

function buscarCuenta(numero) {

    let encontrada = arregloCuentas.find(
        cuenta => cuenta.numero === numero
    );

    if (!encontrada) {
        mostrarMensaje("Error: la cuenta no existe.", true);
        return null;
    }

    return encontrada;
}

function consignarDinero() {

    let numero = document.getElementById("numeroOperacion").value.trim();
    let valorTexto = document.getElementById("valor").value;
    let valor = Number(valorTexto);

    let cuenta = buscarCuenta(numero);

    if (cuenta === null) {
        return;
    }

    if (valorTexto.trim() === "" || !Number.isFinite(valor) || valor <= 0) {
        mostrarMensaje("Error: ingresa una consignación mayor que cero.", true);
        return;
    }

    if (cuenta.consignar(valor)) {
        mostrarMensaje("Consignación realizada correctamente.");
        actualizarTabla();
    }
}


function retirarDinero() {

    let numero = document.getElementById("numeroOperacion").value.trim();
    let valorTexto = document.getElementById("valor").value;
    let valor = Number(valorTexto);

    let cuenta = buscarCuenta(numero);

    if (cuenta === null) {
        return;
    }

    if (valorTexto.trim() === "" || !Number.isFinite(valor) || valor <= 0) {
        mostrarMensaje("Error: ingresa un retiro mayor que cero.", true);
        return;
    }

    if (cuenta.retirar(valor)) {
        mostrarMensaje("Retiro realizado correctamente.");
        actualizarTabla();
    }
}

function consultarSaldo() {

    let numero = document.getElementById("numeroOperacion").value.trim();

    let cuenta = buscarCuenta(numero);

    if (cuenta === null) {
        return;
    }

    mostrarMensaje(
        "Titular: " + cuenta.titular +
        " | Tipo: " + cuenta.tipoCuenta() +
        " | Saldo: $" + cuenta.getSaldo().toLocaleString("es-CO")
    );
}


function actualizarTabla() {

    let tabla = document.getElementById("tabla");

    tabla.innerHTML = "";

    for (let i = 0; i < arregloCuentas.length; i = i + 1) {

        tabla.innerHTML += `<tr>
            <td>${arregloCuentas[i].numero}</td>
            <td>${arregloCuentas[i].titular}</td>
            <td>${arregloCuentas[i].tipoCuenta()}</td>
            <td>$${arregloCuentas[i].getSaldo().toLocaleString("es-CO")}</td>
        </tr>`;
    }
}