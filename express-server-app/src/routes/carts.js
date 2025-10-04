const express = require('express');
const router = express.Router();

// Importar el controlador y el servicio de carrito
const CartController = require('../controllers/cartController');
const cartService = require('../services/cartService');

const cartController = new CartController(cartService);

// Ruta para crear un nuevo carrito
router.post('/', cartController.createCart);

// Ruta para listar todos los productos en un carrito especificado (con populate)
router.get('/:cid', cartController.getCartProducts);

// Ruta para eliminar un producto del carrito
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart.bind(cartController));

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cid/product/:pid', cartController.updateProductInCart);

// Ruta para agregar un producto a un carrito especificado
router.post('/:cid/products/:pid', cartController.addProductToCart.bind(cartController));

// Ruta para actualizar todos los productos del carrito
router.put('/:cid', cartController.updateAllProductsInCart);

// Ruta para eliminar todos los productos del carrito
router.delete('/:cid', cartController.deleteAllProductsFromCart);

module.exports = router;