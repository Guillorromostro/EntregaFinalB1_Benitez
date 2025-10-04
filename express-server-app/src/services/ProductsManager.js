const fs = require('fs');
const path = require('path');

class ProductsManager {
    constructor() {
        this.filePath = path.join(__dirname, '../data/products.json');
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '[]');
        }
    }

    getAllProducts() {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    saveAllProducts(products) {
        fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
    }

    addProduct(product) {
        const products = this.getAllProducts();
        product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        products.push(product);
        this.saveAllProducts(products);
        return product;
    }

    deleteProduct(id) {
        let products = this.getAllProducts();
        products = products.filter(p => p.id != id);
        this.saveAllProducts(products);
    }
}

module.exports = new ProductsManager();