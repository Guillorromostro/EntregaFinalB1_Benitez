const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const productService = require('../services/productService');

const productController = new ProductController(productService);

// Ruta para obtener todos los productos
router.get('/', productController.getAllProducts);

// Ruta para obtener un producto por su ID
router.get('/:pid', productController.getProductById);

// Ruta para agregar un nuevo producto
router.post('/', productController.addProduct);

// Ruta para actualizar un producto por su ID
router.put('/:pid', productController.updateProduct);

// Ruta para eliminar un producto por su ID
router.delete('/:pid', productController.deleteProduct);

module.exports = router;

[
  {
    "id": 1,
    "title": "Producto de prueba",
    "description": "Descripción de prueba",
    "code": "ABC123",
    "price": 100,
    "status": "disponible",
    "stock": 10,
    "category": "general",
    "thumbnails": []
  }
]