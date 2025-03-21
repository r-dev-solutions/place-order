require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    writeConcern: {
        w: 'majority',
        j: true
    }
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Define the Order model
const orderSchema = new mongoose.Schema({
    email: String,
    telefono: String,
    nombre: String,
    apellido: String,
    direccion: String,
    ciudad: String,
    departamento: String,
    metodoPago: String,
    producto: String,
    stock: Number,
    talla: String,
    precio: Number,
    total: Number
}, { collection: 'pedidos' });

const Order = mongoose.model('Order', orderSchema);

// Endpoint to retrieve all orders
app.get('/orders', (req, res) => {
    console.log('GET /orders request received'); // Log to check if the request is received
    Order.find()
        .then(orders => res.status(200).send(orders))
        .catch(err => {
            console.error('Error retrieving orders:', err);
            res.status(500).send('Error retrieving orders');
        });
});

// Endpoint to create a new order
app.post('/orders', (req, res) => {
    const { email, telefono, nombre, apellido, direccion, ciudad, departamento, metodoPago, producto, stock, talla, precio, total } = req.body;
    
    const newOrder = new Order({
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
    });

    newOrder.save()
        .then(order => {
            console.log('Order created:', order);
            res.status(201).send(order);
        })
        .catch(err => {
            console.error('Error creating order:', err);
            res.status(500).send('Error creating order');
        });
});

// Endpoint to update an order
app.put('/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const updatedData = req.body;

    Order.findByIdAndUpdate(orderId, updatedData, { new: true })
        .then(updatedOrder => {
            if (!updatedOrder) {
                return res.status(404).send('Order not found');
            }
            res.status(200).send(updatedOrder);
        })
        .catch(err => res.status(500).send('Error updating order'));
});

// Endpoint to delete an order
app.delete('/orders/:id', (req, res) => {
    const orderId = req.params.id;

    Order.findByIdAndDelete(orderId)
        .then(deletedOrder => {
            if (!deletedOrder) {
                return res.status(404).send('Order not found');
            }
            res.status(200).send('Order deleted successfully');
        })
        .catch(err => res.status(500).send('Error deleting order'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});