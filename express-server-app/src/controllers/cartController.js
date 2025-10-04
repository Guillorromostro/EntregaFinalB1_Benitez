class CartController {
    async updateAllProductsInCart(req, res) {
        const cartId = req.params.cid;
        const products = req.body.products;
        try {
            const updatedCart = this.cartService.updateAllProductsInCart(cartId, products);
            if (!updatedCart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteAllProductsFromCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = this.cartService.deleteAllProductsFromCart(cartId);
            if (!updatedCart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    constructor(cartService) {
        this.cartService = cartService;
        this.createCart = this.createCart.bind(this);
        this.getCartProducts = this.getCartProducts.bind(this);
        this.addProductToCart = this.addProductToCart.bind(this);
        this.deleteProductFromCart = this.deleteProductFromCart.bind(this);
        this.updateProductInCart = this.updateProductInCart.bind(this);
    }

    async createCart(req, res) {
        try {
            const newCart = this.cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCartProducts(req, res) {
        const cart = await this.cartService.getCartById(req.params.cid);
        if (!cart) {
            return res.render('cart', { cart: { id: req.params.cid, products: [] }, message: 'Carrito no encontrado' });
        }
        // ...populate y render normal...
        const productService = require('../services/productService');
        const products = cart.products.map(item => {
            const product = productService.getProductById(item.product);
            return product
                ? { product, quantity: item.quantity }
                : null;
        }).filter(p => p !== null);
        res.render('cart', { cart: { id: cart.id, products } });
    }
    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        await this.cartService.deleteProductFromCart(cartId, productId);
        res.redirect(`/carts/${cartId}`);
    }

    async updateProductInCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        try {
            const updatedCart = this.cartService.updateProductInCart(cartId, productId, quantity);
            if (!updatedCart) {
                return res.status(404).json({ message: 'Carrito o producto no encontrado' });
            }
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        await this.cartService.addProductToCart(cartId, productId);
        res.redirect(`/carts/${cartId}`);
    }
}

module.exports = CartController;