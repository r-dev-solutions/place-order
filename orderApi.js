require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

app.use(express.json());
app.use(cors());

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Order API',
            version: '1.0.0',
            description: 'API for managing orders'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`
            }
        ]
    },
    apis: ['./orderApi.js'] // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
    productos: [{
        producto: String,
        stock: Number,
        talla: String,
        precio: Number
    }],
    total: Number,
    precioEnvio: Number,
    promoCode: String,
    descuento: Number,
    banco: String,
    fecha: { type: Date, default: Date.now },
    estado: { type: String, default: 'Orden Procesada' },
    imagenUrl: String // Add the image URL field
}, { collection: 'pedidos' });

const Order = mongoose.model('Order', orderSchema);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/orders', (req, res) => {
    console.log('GET /orders request received'); // Log to check if the request is received
    Order.find()
        .then(orders => res.status(200).send(orders))
        .catch(err => {
            console.error('Error retrieving orders:', err);
            res.status(500).send('Error retrieving orders');
        });
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               direccion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               departamento:
 *                 type: string
 *               metodoPago:
 *                 type: string
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto:
 *                       type: string
 *                     stock:
 *                       type: number
 *                     talla:
 *                       type: string
 *                     precio:
 *                       type: number
 *               total:
 *                 type: number
 *               precioEnvio:
 *                 type: number
 *               promoCode:
 *                 type: string
 *               descuento:
 *                 type: number
 *               banco:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               estado:
 *                 type: string
 *                 default: Orden Procesada
 *     responses:
 *       201:
 *         description: Order created successfully
 */
app.post('/orders', (req, res) => {
    const { email, telefono, nombre, apellido, direccion, ciudad, departamento, metodoPago, productos, total, precioEnvio, promoCode, descuento, banco, fecha, estado, imagenUrl } = req.body;
    
    console.log('Data to be saved:', {
        email,
        telefono,
        nombre,
        apellido,
        direccion,
        ciudad,
        departamento,
        metodoPago,
        productos,
        total,
        precioEnvio,
        promoCode,
        descuento,
        banco,
        fecha,
        estado
    });

    const newOrder = new Order({
        email,
        telefono,
        nombre,
        apellido,
        direccion,
        ciudad,
        departamento,
        metodoPago,
        productos,
        total,
        precioEnvio,
        promoCode,
        descuento,
        banco,
        fecha,
        estado,
        imagenUrl // Add the image URL to the new order
    });

    newOrder.save()
        .then(order => {
            console.log('Order created:', order);
            res.status(201).send(order); // Ensure the response includes all fields
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
