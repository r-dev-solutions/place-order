require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
        w: 'majority',
        j: true
    }
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Endpoint to retrieve all orders
app.get('/orders', (req, res) => {
    // Assuming you have a model named Order
    Order.find()
        .then(orders => res.status(200).send(orders))
        .catch(err => res.status(500).send('Error retrieving orders'));
});

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

// Endpoint to update an order
app.put('/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const updatedData = req.body;

    // Assuming you have a model named Order
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

    // Assuming you have a model named Order
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