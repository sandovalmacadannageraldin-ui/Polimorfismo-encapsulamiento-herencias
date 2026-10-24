class Producto {
    #precio;

    constructor(identificador, nombre, precio) {
        this.identificador = identificador;
        this.nombre = nombre;
        this.#precio = precio;
    }

    obtenerPrecio() {
        return this.#precio;
    }

    calcularCostoFinal() {
        return this.#precio;
    }
}

class ProductoFisico extends Producto {
    calcularCostoFinal() {
        return this.obtenerPrecio() + 5000;
    }
}

class ProductoDigital extends Producto {
    calcularCostoFinal() {
        return this.obtenerPrecio();
    }
}

// Arreglos para guardar los productos y el carrito
let productos = [];
let carrito = [];

// Mostrar mensajes en la página
function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

// Buscar un producto por su identificador
function buscarProducto(identificador) {
    return productos.find(
        producto => producto.identificador === identificador
    );
}

// Registrar un producto
function registrarProducto() {
    let identificador = document.getElementById("identificador").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let precioTexto = document.getElementById("precio").value;
    let tipo = document.getElementById("tipo").value;
    let precio = Number(precioTexto);

    // Validar campos vacíos
    if (identificador === "" || nombre === "" || precioTexto === "") {
        mostrarMensaje("Error: completa todos los campos.");
        return;
    }

    // Validar precios negativos y valores no válidos
    if (!Number.isFinite(precio) || precio < 0) {
        mostrarMensaje("Error: el precio no puede ser negativo ni inválido.");
        return;
    }

    // Validar identificadores duplicados
    if (buscarProducto(identificador)) {
        mostrarMensaje("Error: el identificador ya existe.");
        return;
    }

    let nuevoProducto;

    // Crear el objeto según el tipo
    if (tipo === "fisico") {
        nuevoProducto = new ProductoFisico(
            identificador, nombre, precio
        );
    } else if (tipo === "digital") {
        nuevoProducto = new ProductoDigital(
            identificador, nombre, precio
        );
    } else {
        mostrarMensaje("Error: selecciona un tipo de producto válido.");
        return;
    }

    // Guardar el producto en el arreglo
    productos.push(nuevoProducto);

    mostrarMensaje("Producto registrado correctamente.");
    mostrarProductos();
}

// Mostrar los productos en la tabla
function mostrarProductos() {
    let tabla = document.getElementById("tablaProductos");
    tabla.innerHTML = "";

    for (let i = 0; i < productos.length; i++) {
        let producto = productos[i];

        tabla.innerHTML += `
            <tr>
                <td>${producto.identificador}</td>
                <td>${producto.nombre}</td>
                <td>${producto instanceof ProductoFisico ? "Físico" : "Digital"}</td>
                <td>$${producto.obtenerPrecio().toFixed(2)}</td>
                <td>$${producto.calcularCostoFinal().toFixed(2)}</td>
                <td>
                    <button onclick="eliminarProducto('${producto.identificador}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }
}

// Agregar productos al carrito
function agregarCarrito() {
    let identificador = document.getElementById("idCarrito").value.trim();
    let cantidadTexto = document.getElementById("cantidad").value;
    let cantidad = Number(cantidadTexto);

    if (identificador === "" || cantidadTexto === "") {
        mostrarMensaje("Error: ingresa el identificador y la cantidad.");
        return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        mostrarMensaje("Error: la cantidad debe ser mayor que cero y un entero.");
        return;
    }

    let producto = buscarProducto(identificador);

    if (!producto) {
        mostrarMensaje("Error: el producto no existe.");
        return;
    }

    let elemento = carrito.find(
        item => item.producto.identificador === identificador
    );

    if (elemento) {
        elemento.cantidad += cantidad;
    } else {
        carrito.push({
            producto: producto,
            cantidad: cantidad
        });
    }

    mostrarMensaje("Producto agregado al carrito.");
    mostrarCarrito();
}

// Quitar productos del carrito
function quitarCarrito() {
    let identificador = document.getElementById("idCarrito").value.trim();
    let cantidadTexto = document.getElementById("cantidad").value;
    let cantidad = Number(cantidadTexto);

    if (identificador === "" || cantidadTexto === "") {
        mostrarMensaje("Error: ingresa el identificador y la cantidad.");
        return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        mostrarMensaje("Error: la cantidad debe ser mayor que cero y un entero.");
        return;
    }

    let posicion = carrito.findIndex(
        item => item.producto.identificador === identificador
    );

    if (posicion === -1) {
        mostrarMensaje("Error: el producto no está en el carrito.");
        return;
    }

    if (cantidad > carrito[posicion].cantidad) {
        mostrarMensaje("Error: no puedes quitar más unidades de las que hay.");
        return;
    }

    carrito[posicion].cantidad -= cantidad;

    if (carrito[posicion].cantidad === 0) {
        carrito.splice(posicion, 1);
    }

    mostrarMensaje("Producto quitado del carrito.");
    mostrarCarrito();
}

// Mostrar el carrito y calcular el total
function mostrarCarrito() {
    let tabla = document.getElementById("tablaCarrito");
    tabla.innerHTML = "";

    let total = 0;

    for (let i = 0; i < carrito.length; i++) {
        let item = carrito[i];
        let producto = item.producto;

        let subtotal = producto.calcularCostoFinal() * item.cantidad;
        total += subtotal;

        tabla.innerHTML += `
            <tr>
                <td>${producto.identificador}</td>
                <td>${producto.nombre}</td>
                <td>${producto instanceof ProductoFisico ? "Físico" : "Digital"}</td>
                <td>$${producto.calcularCostoFinal().toFixed(2)}</td>
                <td>${item.cantidad}</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
        `;
    }

    document.getElementById("total").textContent =
        "Total: $" + total.toFixed(2);
}

// Eliminar un producto del catálogo
function eliminarProducto(identificador) {
    let estaEnCarrito = carrito.some(
        item => item.producto.identificador === identificador
    );

    if (estaEnCarrito) {
        mostrarMensaje("Error: quita primero el producto del carrito.");
        return;
    }

    let posicion = productos.findIndex(
        producto => producto.identificador === identificador
    );

    if (posicion === -1) {
        mostrarMensaje("Error: el producto no existe.");
        return;
    }

    productos.splice(posicion, 1);

    mostrarMensaje("Producto eliminado correctamente.");
    mostrarProductos();
}