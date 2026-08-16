const express = require('express');
const app = express();

// Configuración de middlewares y archivos estáticos
app.use(express.static(__dirname)); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Declaración global del arreglo de productos
let productos = [
    {
        id: 1,
        categoria: "Vehículos",
        titulo: "Nissan Frontier de muestra",
        descripcion: "Vehículo en buen estado general.",
        precio: 15000.00,
        nombreVendedor: "Administrador",
        correoVendedor: "admin@usados.pe",
        telefonoVendedor: "977399056",
        fotos: ["https://images.unsplash.com/photo-1544816155-12df9643f363"]
    }
];

// 1. RUTA PARA OBTENER LOS PRODUCTOS (GET) - Oculta teléfonos públicos por seguridad
app.get('/api/productos', (req, res) => {
    const { q, categoria } = req.query;
    let resultados = productos;

    if (categoria && categoria !== 'Todos') {
        resultados = resultados.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
    }

    if (q) {
        const query = q.toLowerCase();
        resultados = resultados.filter(p => p.titulo.toLowerCase().includes(query) || p.descripcion.toLowerCase().includes(query));
    }

    // Excluimos el teléfono de la respuesta pública para protegerlo ante inspección de red
    const productosPublicos = resultados.map(p => ({
        id: p.id,
        categoria: p.categoria,
        titulo: p.titulo,
        descripcion: p.descripcion,
        precio: p.precio,
        fotos: p.fotos
    }));

    res.json(productosPublicos);
});

// 2. RUTA PARA CREAR/PUBLICAR UN PRODUCTO (POST)
app.post('/api/productos', (req, res) => {
    const nuevoProducto = {
        id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
        categoria: req.body.categoria,
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        precio: parseFloat(req.body.precio) || 0,
        nombreVendedor: req.body.nombreVendedor,
        correoVendedor: req.body.correoVendedor,
        telefonoVendedor: req.body.telefonoVendedor,
        fotos: req.body.fotos || []
    };
    
    productos.push(nuevoProducto);
    res.json({ mensaje: "¡Producto publicado exitosamente!" });
});

// 3. RUTA SEGURA PARA VER EL TELÉFONO (Validación interna en el servidor)
app.post('/api/admin/ver-telefono', (req, res) => {
    const { id, clave } = req.body;
    
    if (clave !== "4767") {
        return res.status(401).json({ error: "Clave incorrecta" });
    }

    const producto = productos.find(p => p.id === parseInt(id));
    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ telefono: producto.telefonoVendedor, nombre: producto.nombreVendedor });
});

// 4. RUTA SEGURA PARA ELIMINAR EL PRODUCTO (Validación de clave en la cabecera)
app.delete('/api/productos/:id', (req, res) => {
    const idProducto = parseInt(req.params.id);
    const claveAdmin = req.headers['x-admin-clave'];

    if (claveAdmin !== "4767") {
        return res.status(401).json({ error: "Clave de administrador incorrecta" });
    }

    const index = productos.findIndex(p => p.id === idProducto);
    
    if (index !== -1) {
        productos.splice(index, 1);
        return res.json({ mensaje: "Producto eliminado exitosamente" });
    } else {
        return res.status(404).json({ error: "No se encontró el producto" });
    }
});

// Puerto de escucha en Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});