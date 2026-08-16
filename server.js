// Asegúrate de tener esta ruta configurada en tu servidor de Express
app.delete('/api/productos/:id', (req, res) => {
    const idProducto = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === idProducto);
    
    if (index !== -1) {
        productos.splice(index, 1);
        return res.json({ mensaje: "Producto eliminado exitosamente" });
    } else {
        return res.status(404).json({ error: "No se encontró el producto" });
    }
});