const express = require('express');
const path = require('path');
const app = express();

// Aumentar el límite de tamaño para permitir subir fotos desde la PC
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Base de datos temporal en memoria (se guardarán los anuncios mientras el servidor esté activo)
let productosDB = [
    {
        id: 1,
        vendedor: { nombre: "Administrador", correo: "admin@usados.pe", telefono: "999999999" },
        categoria: "Vehículos",
        titulo: "Nissan Frontier de muestra",
        descripcion: "Vehículo en buen estado general.",
        precio: 15000,
        fotos: ["https://images.unsplash.com/photo-1544816155-12df9643f363"]
    }
];

// Ruta para obtener los productos
app.get('/api/productos', (req, res) => {
    let { q, categoria } = req.query;
    let resultados = productosDB;

    if (q) {
        resultados = resultados.filter(p => 
            p.titulo.toLowerCase().includes(q.toLowerCase()) || 
            p.descripcion.toLowerCase().includes(q.toLowerCase())
        );
    }

    if (categoria && categoria !== 'Todos') {
        resultados = resultados.filter(p => p.categoria === categoria);
    }

    res.json(resultados);
});

// Ruta para publicar un nuevo producto
app.post('/api/productos', (req, res) => {
    try {
        const { nombreVendedor, correoVendedor, telefonoVendedor, categoria, titulo, descripcion, precio, fotos } = req.body;

        const nuevoProducto = {
            id: productosDB.length + 1,
            vendedor: {
                nombre: nombreVendedor,
                correo: correoVendedor,
                telefono: telefonoVendedor
            },
            categoria,
            titulo,
            descripcion,
            precio: parseFloat(precio) || 0,
            fotos: fotos && fotos.length > 0 ? fotos : ["https://images.unsplash.com/photo-1544816155-12df9643f363"]
        };

        productosDB.unshift(nuevoProducto); // Agregar al inicio
        res.status(201).json({ mensaje: "¡Anuncio publicado con éxito!" });
    } catch (error) {
        res.status(500).json({ error: "Hubo un error al procesar el servidor." });
    }
});

// Servir la página principal
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});