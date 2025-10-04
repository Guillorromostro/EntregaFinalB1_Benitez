const fs = require('fs');
const path = require('path');
const cartsFilePath = path.join(__dirname, '../data/carts.json');

class CartService {
    // Actualizar todos los productos del carrito con un arreglo
    updateAllProductsInCart(cartId, productsArray) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;
        if (!Array.isArray(productsArray)) return null;
        cart.products = productsArray.map(item => ({
            product: item.product.toString(),
            quantity: Number(item.quantity)
        }));
        this.saveCarts();
        return cart;
    }

    // Eliminar todos los productos del carrito
    deleteAllProductsFromCart(cartId) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;
        cart.products = [];
        this.saveCarts();
        return cart;
    }
    // Eliminar un producto del carrito
    deleteProductFromCart(cartId, productId) {
        const carts = this.loadCarts();
        const cart = carts.find(c => c.id == cartId || c.id == Number(cartId));
        if (!cart) return null;
        cart.products = cart.products.filter(p => p.product != productId && p.product != Number(productId));
        // Guardar cambios
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
        return cart;
    }

    // Actualizar la cantidad de un producto en el carrito
    updateProductInCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;
        const prod = cart.products.find(p => p.product == productId);
        if (!prod) return null;
        prod.quantity = Number(quantity);
        this.saveCarts();
        return cart;
    }
    constructor() {
        this.carts = this.loadCarts();
        this.lastId = this.carts.length > 0 ? Math.max(...this.carts.map(c => Number(c.id))) : 0;
    }

    loadCarts() {
        if (!fs.existsSync(cartsFilePath)) return [];
        const data = fs.readFileSync(cartsFilePath, 'utf-8');
        return JSON.parse(data);
    }

    saveCarts() {
        fs.writeFileSync(cartsFilePath, JSON.stringify(this.carts, null, 2));
    }

    createCart() {
        this.lastId += 1;
        const newCart = { id: this.lastId.toString(), products: [] };
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(id) {
        const carts = this.loadCarts();
        return carts.find(c => c.id == id || c.id == Number(id));
    }

    addProductToCart(cartId, productId) {
        const carts = this.loadCarts();
        const cart = carts.find(c => c.id == cartId || c.id == Number(cartId));
        if (!cart) return null;
        const existing = cart.products.find(p => p.product == productId || p.product == Number(productId));
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.products.push({ product: Number(productId), quantity: 1 });
        }
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
        return cart;
    }

    getProductsInCart(cartId) {
        const cart = this.getCartById(cartId);
        return cart ? cart.products : null;
    }
}

const cartManager = new CartService();

module.exports = {
    getCartById: (id) => cartManager.getCartById(id),
    getProductsInCart: (id) => cartManager.getProductsInCart(id),
    deleteProductFromCart: (cartId, productId) => cartManager.deleteProductFromCart(cartId, productId),
    addProductToCart: (cartId, productId) => cartManager.addProductToCart(cartId, productId)
};