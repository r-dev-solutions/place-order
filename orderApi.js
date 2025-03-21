require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Endpoint to create a new order
app.post('/orders', (req, res) => {
    const { email, telefono, nombre, apellido, direccion, ciudad, departamento, metodoPago, producto, stock, talla, precio, total } = req.body;
    
    const newOrder = {
        email,
        telefono,
        nombre,
        apellido,
        direccion,
        ciudad,
        departamento,
        metodoPago,
        producto,
        stock,
        talla,
        precio,
        total
    };

    console.log('Order created:', newOrder);
    res.status(201).send(newOrder);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});