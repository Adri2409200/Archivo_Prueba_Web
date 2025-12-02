const productosLicor = [
    { id: 1, nombre: "Whisky Johnnie Walker", precio: 45, categoria: "whisky", imagen: "https://tse2.mm.bing.net/th/id/OIP.A4cvpXOk005jmg0bt4IXxwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 2, nombre: "Ron Bacardí", precio: 18, categoria: "ron", imagen: "https://tse4.mm.bing.net/th/id/OIP.XT215ndmMWoKogD830uQwAHaH6?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 3, nombre: "Vodka Absolut", precio: 24, categoria: "vodka", imagen: "https://tse3.mm.bing.net/th/id/OIP.JYnBscG269Ld-rkD2no4rwHaIe?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 4, nombre: "Whisky Jack Daniels", precio: 32, categoria: "whisky", imagen: "https://tse2.mm.bing.net/th/id/OIP.QhG_ajptpW6YYok39Irk5QHaHa?w=1088&h=1088&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 5, nombre: "Ron Zacapa", precio: 65, categoria: "ron", imagen: "https://tse4.mm.bing.net/th/id/OIP.1ZkPE6XoyjgT0UUk_1r7YQHaE9?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 6, nombre: "Vodka Grey Goose", precio: 39, categoria: "vodka", imagen: "https://tse1.mm.bing.net/th/id/OIP.EuCAzzLog2kqSPzXb_fyugHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3" }
];

let carrito = [];
let total = 0;
let descuentoAplicado = false;

document.addEventListener('DOMContentLoaded', function() {
    cargarProductos('todos');
    setupEventos();
});

function cargarProductos(categoria) {
    const productosGrid = document.getElementById('productosGrid');
    productosGrid.innerHTML = '';
    
    let productosFiltrados = productosLicor;
    
    if (categoria !== 'todos') {
        productosFiltrados = productosLicor.filter(p => p.categoria === categoria);
    }
    
    productosFiltrados.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top card-img-licor" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <span class="badge bg-secondary">${producto.categoria.toUpperCase()}</span>
                    <p class="card-text mt-2">${producto.categoria === 'whisky' ? 'Whisky premium' : producto.categoria === 'ron' ? 'Ron añejo' : 'Vodka premium'}</p>
                    <p class="h4 text-primary">$${producto.precio}</p>
                    <button class="btn btn-licor agregar-carrito" data-id="${producto.id}">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        productosGrid.appendChild(card);
    });
}

function setupEventos() {
    document.getElementById('btnVerProductos').addEventListener('click', function() {
        document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('btnOfertas').addEventListener('click', function() {
        alert('¡Envío gratis en compras mayores a $50!');
    });
    
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const categoria = this.getAttribute('data-categoria');
            cargarProductos(categoria);
        });
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('agregar-carrito')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const producto = productosLicor.find(p => p.id === id);
            
            if (producto) {
                agregarAlCarrito(producto);
                e.target.textContent = '✓ Agregado';
                e.target.classList.add('btn-success');
                
                setTimeout(() => {
                    e.target.textContent = 'Agregar al Carrito';
                    e.target.classList.remove('btn-success');
                }, 1000);
            }
        }
    });
    
    document.getElementById('btnOfertaWhisky').addEventListener('click', function() {
        agregarAlCarrito({ nombre: "Oferta Whisky + Vasos", precio: 45, categoria: "oferta" });
        this.textContent = '✓ Oferta Agregada';
        
        setTimeout(() => {
            this.textContent = 'Agregar Oferta $45';
        }, 1500);
    });
    
    document.getElementById('btnDescuento').addEventListener('click', function() {
        if (carrito.length === 0) {
            alert('Agrega productos al carrito primero');
            return;
        }
        
        if (total >= 100 && !descuentoAplicado) {
            total = total * 0.9; // 10% de descuento
            document.getElementById('totalCarrito').textContent = total.toFixed(2);
            descuentoAplicado = true;
            this.textContent = '✓ Descuento Aplicado';
            alert('¡10% de descuento aplicado!');
        } else if (descuentoAplicado) {
            alert('Ya tienes un descuento aplicado');
        } else {
            alert('Necesitas al menos $100 para el descuento');
        }
    });
    
    document.getElementById('btnVaciar').addEventListener('click', vaciarCarrito);
    
    document.getElementById('btnComprar').addEventListener('click', comprar);
}

function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById('listaCarrito');
    const totalElement = document.getElementById('totalCarrito');
    
    lista.innerHTML = '';
    total = 0;
    
    if (carrito.length === 0) {
        lista.innerHTML = '<li class="list-group-item text-muted">Carrito vacío</li>';
    } else {
        carrito.forEach((item, index) => {
            total += item.precio;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between';
            li.innerHTML = `
                <span>${item.nombre} - $${item.precio}</span>
                <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">X</button>
            `;
            lista.appendChild(li);
        });
    }
    
    totalElement.textContent = total.toFixed(2);
    
    if (descuentoAplicado && total >= 100) {
        total = total * 0.9;
        totalElement.textContent = total.toFixed(2);
    }
}

function eliminarDelCarrito(index) {
    if (confirm('¿Eliminar este producto?')) {
        carrito.splice(index, 1);
        actualizarCarrito();
    }
}

function vaciarCarrito() {
    if (carrito.length === 0) {
        alert('El carrito ya está vacío');
        return;
    }
    
    if (confirm('¿Vaciar todo el carrito?')) {
        carrito = [];
        total = 0;
        descuentoAplicado = false;
        document.getElementById('btnDescuento').textContent = 'Aplicar Descuento';
        actualizarCarrito();
        alert('Carrito vaciado');
    }
}


function comprar() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    let mensaje = '¡Compra Exitosa!\n\n';
    mensaje += 'Tu compra:\n';
    
    carrito.forEach(item => {
        mensaje += `• ${item.nombre} - $${item.precio}\n`;
    });
    
    mensaje += `\nTotal: $${total.toFixed(2)}`;
    
    if (total >= 50) {
        mensaje += '\n\n🎉 ¡Envío gratis incluido!';
    }
    
    mensaje += '\n\nGracias por tu compra. Recibirás un correo con los detalles.';
    
    alert(mensaje);
    
    carrito = [];
    total = 0;
    descuentoAplicado = false;
    document.getElementById('btnDescuento').textContent = 'Aplicar Descuento';
    actualizarCarrito();
}