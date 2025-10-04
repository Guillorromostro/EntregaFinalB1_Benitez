const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const productService = require('./services/productService');
const viewsRouter = require('./routes/views.router');
const methodOverride = require('method-override');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8081;
const MONGO_URI = 'mongodb://localhost:27017/entrega2benitez';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Configuración de Handlebars
const hbs = exphbs.create({
    helpers: {
        eq: (a, b) => a == b,
        gt: (a, b) => a > b,
        lt: (a, b) => a < b
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Rutas de la API y vistas
app.use('/api/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/', viewsRouter);

// Lógica de Socket.io para productos en tiempo real
io.on('connection', (socket) => {
    socket.emit('products', productService.getAllProducts());

    socket.on('addProduct', (product) => {
        productService.addProduct(product);
        io.emit('products', productService.getAllProducts());
    });

    socket.on('deleteProduct', (id) => {
        productService.deleteProduct(id);
        io.emit('products', productService.getAllProducts());
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

