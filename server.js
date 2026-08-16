const express = require('express');
const app = express();

// ESTA LÍNEA ES LA CLAVE PARA QUE ENCUENTRE EL INDEX.HTML:
app.use(express.static(__dirname)); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ... (tus rutas de productos GET, POST, DELETE van aquí abajo) ...

// 1. DECLARACIÓN GLOBAL: El arreglo donde se guardan los productos
let productos = [
    {
        id: 1,
        categoria: "Vehículos",
        titulo: "Nissan Frontier de muestra",
        descripcion: "Vehículo en buen estado general.",
        precio: 15000.00,
        fotos: ["https://images.unsplash.com/photo-1544816155-12df9643f363"]
    }
];

// Configuración de middlewares esenciales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// (Opcional si tu HTML está en la misma carpeta del servidor)
app.use(express.static('public')); 


// 2. RUTA PARA OBTENER LOS PRODUCTOS (GET)
app.get('/api/productos', (req, res) => {
    res.json(productos);
});


// 3. RUTA PARA CREAR/PUBLICAR UN PRODUCTO (POST)
app.post('/api/productos', (req, res) => {
    const nuevoProducto = {
        id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
        categoria: req.body.categoria,
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        precio: parseFloat(req.body.precio) || 0,
        fotos: req.body.fotos || []
    };
    
    productos.push(nuevoProducto);
    res.json({ mensaje: "¡Producto publicado exitosamente!" });
});


// 4. RUTA PARA ELIMINAR EL PRODUCTO (DELETE)
app.delete('/api/productos/:id', (req, res) => {
    const idProducto = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === idProducto);
    
    if (index !== -1) {
        productos.splice(index, 1); // Lo borra del arreglo global
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