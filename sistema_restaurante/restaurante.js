class ProductoMenu {
    constructor(codigo, nombre, precio, adicional) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.precio = precio;
        this.adicional = adicional;
        this.disponible = true;
    }

    calcularPrecioFinal() {
        return this.precio;
    }
}

class PlatoPreparado extends ProductoMenu {
    calcularPrecioFinal() {
        return this.precio + this.adicional;
    }
}

class Bebida extends ProductoMenu {
    calcularPrecioFinal() {
        return this.precio + this.adicional;
    }
}

let menu = [];
let pedidos = [];

function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

function buscarProducto(codigo) {
    return menu.find(producto => producto.codigo === codigo);
}

function registrarProducto() {
    let codigo = document.getElementById("codigo").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let precioTexto = document.getElementById("precio").value;
    let adicionalTexto = document.getElementById("adicional").value;
    let tipo = document.getElementById("tipo").value;

    let precio = Number(precioTexto);
    let adicional = Number(adicionalTexto);

    if (codigo === "" || nombre === "" || precioTexto === "" ||
        adicionalTexto === "") {
        mostrarMensaje("Error: completa todos los campos.");
        return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
        mostrarMensaje("Error: el precio debe ser mayor que cero.");
        return;
    }

    if (!Number.isFinite(adicional) || adicional < 0) {
        mostrarMensaje("Error: el adicional no puede ser negativo.");
        return;
    }

    if (buscarProducto(codigo)) {
        mostrarMensaje("Error: el código ya está registrado.");
        return;
    }

    let producto;

    if (tipo === "plato") {
        producto = new PlatoPreparado(
            codigo, nombre, precio, adicional
        );
    } else {
        producto = new Bebida(
            codigo, nombre, precio, adicional
        );
    }

    menu.push(producto);

    mostrarMensaje("Producto registrado correctamente.");
    mostrarMenu();
}

function mostrarMenu() {
    let tabla = document.getElementById("tablaMenu");
    tabla.innerHTML = "";

    for (let i = 0; i < menu.length; i++) {
        let producto = menu[i];
        let tipo = producto instanceof PlatoPreparado
            ? "Plato preparado"
            : "Bebida";

        tabla.innerHTML += `
            <tr>
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>${tipo}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>$${producto.adicional.toFixed(2)}</td>
                <td>${producto.disponible ? "Disponible" : "Agotado"}</td>
                <td>
                    <button onclick="cambiarDisponibilidad('${producto.codigo}')">
                        Cambiar disponibilidad
                    </button>
                </td>
            </tr>
        `;
    }
}

function agregarPedido() {
    let codigo = document.getElementById("codigoPedido").value.trim();
    let cantidadTexto = document.getElementById("cantidad").value;
    let mesaTexto = document.getElementById("mesa").value;

    let cantidad = Number(cantidadTexto);
    let mesa = Number(mesaTexto);

    if (codigo === "" || cantidadTexto === "" || mesaTexto === "") {
        mostrarMensaje("Error: completa los datos del pedido.");
        return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        mostrarMensaje("Error: la cantidad debe ser un entero mayor que cero.");
        return;
    }

    if (!Number.isInteger(mesa) || mesa <= 0) {
        mostrarMensaje("Error: el número de mesa debe ser un entero positivo.");
        return;
    }

    let producto = buscarProducto(codigo);

    if (!producto) {
        mostrarMensaje("Error: el producto no existe en el menú.");
        return;
    }

    if (!producto.disponible) {
        mostrarMensaje("Error: el producto está agotado.");
        return;
    }

    let pedidoExistente = pedidos.find(pedido =>
        pedido.codigo === codigo &&
        pedido.mesa === mesa &&
        pedido.estado === "Pendiente"
    );

    if (pedidoExistente) {
        pedidoExistente.cantidad += cantidad;
    } else {
        pedidos.push({
            codigo: producto.codigo,
            nombre: producto.nombre,
            mesa: mesa,
            cantidad: cantidad,
            precioUnitario: producto.calcularPrecioFinal(),
            estado: "Pendiente"
        });
    }

    mostrarMensaje("Producto agregado al pedido.");
    mostrarPedidos();
}

function mostrarPedidos() {
    let tabla = document.getElementById("tablaPedidos");
    tabla.innerHTML = "";

    for (let i = 0; i < pedidos.length; i++) {
        let pedido = pedidos[i];
        let subtotal = pedido.precioUnitario * pedido.cantidad;

        tabla.innerHTML += `
            <tr>
                <td>${pedido.mesa}</td>
                <td>${pedido.nombre}</td>
                <td>${pedido.cantidad}</td>
                <td>$${pedido.precioUnitario.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>${pedido.estado}</td>
                <td>
                    ${
                        pedido.estado === "Pendiente"
                        ? `<button onclick="eliminarPedido(${i})">
                            Eliminar
                           </button>`
                        : "Pedido cancelado"
                    }
                </td>
            </tr>
        `;
    }
}

function calcularTotalMesa() {
    let mesaTexto = document.getElementById("mesaConsulta").value;
    let mesa = Number(mesaTexto);

    if (mesaTexto === "" || !Number.isInteger(mesa) || mesa <= 0) {
        mostrarMensaje("Error: ingresa un número de mesa válido.");
        return;
    }

    let total = 0;

    for (let i = 0; i < pedidos.length; i++) {
        if (pedidos[i].mesa === mesa &&
            pedidos[i].estado === "Pendiente") {
            total += pedidos[i].precioUnitario * pedidos[i].cantidad;
        }
    }

    document.getElementById("totalMesa").textContent =
        "Total de la mesa " + mesa + ": $" + total.toFixed(2);

    mostrarMensaje("Total calculado correctamente.");
}

function cambiarDisponibilidad(codigo) {
    let producto = buscarProducto(codigo);

    if (!producto) {
        mostrarMensaje("Error: el producto no existe.");
        return;
    }

    producto.disponible = !producto.disponible;

    mostrarMensaje("Disponibilidad actualizada.");
    mostrarMenu();
}

function eliminarPedido(indice) {
    if (indice < 0 || indice >= pedidos.length) {
        mostrarMensaje("Error: el pedido no existe.");
        return;
    }

    if (pedidos[indice].estado !== "Pendiente") {
        mostrarMensaje("Error: el pedido ya fue cancelado.");
        return;
    }

    pedidos[indice].estado = "Cancelado";

    mostrarMensaje("Pedido cancelado correctamente.");
    mostrarPedidos();
}