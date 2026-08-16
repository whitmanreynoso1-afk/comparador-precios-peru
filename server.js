const express = require('express');
const cors = require('cors');
const path = require('path'); // <-- Importante: módulo para rutas
const app = express();
const PORT = process.env.PORT || 3000; // <-- Importante: usar el puerto que asigna Render

app.use(cors());
app.use(express.json());

// <-- ESTO ES LO QUE FALTABA: Decirle al servidor que muestre tu index.html
app.use(express.static(path.join(__dirname)));

// Base de datos de ejemplo para la búsqueda
const inventarioGlobalInternet = [
    { nombre: "Apple iPhone 15 128GB Negro", tiendas: [{ nombre: "AliExpress", precio: 3299.00 }, { nombre: "Mercado Libre", precio: 3699.00 }, { nombre: "Falabella", precio: 3899.00 }] },
    { nombre: "Zapatillas Nike Air Max Excee", tiendas: [{ nombre: "Pandabuy", precio: 180.00 }, { nombre: "Mercado Libre", precio: 289.00 }, { nombre: "Oechsle", precio: 319.00 }] },
    { nombre: "Laptop Lenovo IdeaPad 3 Ryzen 5", tiendas: [{ nombre: "Importadora China", precio: 1850.00 }, { nombre: "Ripley", precio: 2199.00 }, { nombre: "Coolbox", precio: 2299.00 }] },
    { nombre: "Xiaomi Redmi Note 13 Pro", tiendas: [{ nombre: "AliExpress", precio: 890.00 }, { nombre: "Mercado Libre", precio: 1150.00 }] }
];

// Endpoint que procesa la búsqueda en vivo
app.get('/api/buscar', (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase().trim() : "";
    if (!query) {
        return res.json(inventarioGlobalInternet);
    }
    const resultados = inventarioGlobalInternet.filter(item => 
        item.nombre.toLowerCase().includes(query)
    );
    res.json(resultados);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});