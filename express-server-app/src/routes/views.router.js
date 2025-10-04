const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const CartController = require('../controllers/cartController');
const cartService = require('../services/cartService');
const cartController = new CartController(cartService);

// Vista de carrito específico
router.get('/carts/:cid', cartController.getCartProducts.bind(cartController));

// Vista de producto individual
router.get('/products/:pid', (req, res) => {
    const product = productService.getAllProducts().products.find(p => p.id == req.params.pid);
    if (!product) {
        return res.status(404).send('Producto no encontrado');
    }
    res.render('product', { product });
});

router.get('/', (req, res) => {
    const { page, limit, category, available, sort } = req.query;
    const result = productService.getAllProducts({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        category,
        available,
        sort
    });
    res.render('home', {
        products: result.products,
        page: result.page,
        totalPages: result.totalPages,
        limit: result.limit,
        category,
        available,
        sort
    });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;