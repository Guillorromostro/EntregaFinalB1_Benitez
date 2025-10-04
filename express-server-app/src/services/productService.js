const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

class ProductService {
    // Cargar productos desde el archivo
    loadProducts() {
        if (fs.existsSync(productsFilePath)) {
            const data = fs.readFileSync(productsFilePath);
            return JSON.parse(data);
        }
        return [];
    }

    // Guardar productos en el archivo
    saveProducts(products) {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    }

    // Obtener todos los productos con paginación, filtro y orden
    getAllProducts({ page = 1, limit = 10, category, available, sort } = {}) {
        let products = this.loadProducts();
        // Filtrar por categoría
        if (category) {
            products = products.filter(p => p.category === category);
        }
        // Filtrar por disponibilidad
        if (available !== undefined) {
            if (available === 'true' || available === true) {
                products = products.filter(p => p.status === 'disponible' && p.stock > 0);
            } else {
                products = products.filter(p => p.status !== 'disponible' || p.stock <= 0);
            }
        }
        // Ordenar por precio
        if (sort === 'asc') {
            products = products.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            products = products.sort((a, b) => b.price - a.price);
        }
        // Paginación
        const total = products.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginated = products.slice(start, end);
        return {
            products: paginated,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        };
    }

    // Agregar un producto with validaciones
    addProduct(product) {
        try {
            const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
            for (const field of requiredFields) {
                if (!(field in product)) {
                    throw new Error(`Falta el campo: ${field}`);
                }
            }
            if (typeof product.price !== 'number' || product.price < 0) {
                throw new Error('El precio debe ser un número positivo');
            }
            if (typeof product.stock !== 'number' || product.stock < 0) {
                throw new Error('El stock debe ser un número positivo');
            }
            if (!['disponible', 'no disponible'].includes(product.status)) {
                throw new Error('El status debe ser "disponible" o "no disponible"');
            }
            const products = this.loadProducts();
            const lastId = products.length > 0 ? Math.max(...products.map(p => Number(p.id))) : 0;
            const newProduct = {
                id: (lastId + 1).toString(),
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: product.status,
                stock: product.stock,
                category: product.category,
                thumbnails: Array.isArray(product.thumbnails) ? product.thumbnails : []
            };
            products.push(newProduct);
            this.saveProducts(products);
            return newProduct;
        } catch (error) {
            // Captura errores fatales y evita reinicio del servidor
            throw error;
        }
    }

    // Actualizar un producto con validaciones
    updateProduct(id, updatedProduct) {
        try {
            const products = this.loadProducts();
            const index = products.findIndex(product => product.id == id);
            if (index === -1) {
                return null;
            }
            // Validaciones
            if ('price' in updatedProduct && (typeof updatedProduct.price !== 'number' || updatedProduct.price < 0)) {
                throw new Error('El precio debe ser un número positivo');
            }
            if ('stock' in updatedProduct && (typeof updatedProduct.stock !== 'number' || updatedProduct.stock < 0)) {
                throw new Error('El stock debe ser un número positivo');
            }
            if ('status' in updatedProduct && !['disponible', 'no disponible'].includes(updatedProduct.status)) {
                throw new Error('El status debe ser "disponible" o "no disponible"');
            }
            products[index] = { ...products[index], ...updatedProduct };
            this.saveProducts(products);
            return products[index];
        } catch (error) {
            throw error;
        }
    }

    // Eliminar un producto por ID
    deleteProduct(id) {
        let products = this.loadProducts();
        const index = products.findIndex(product => product.id == id);
        if (index !== -1) {
            const deletedProduct = products.splice(index, 1);
            this.saveProducts(products);
            return deletedProduct[0];
        }
        return null;
    }

    // Obtener un producto por ID
    getProductById(id) {
        const products = this.loadProducts();
        return products.find(p => p.id == id || p.id == Number(id));
    }
}

const ProductsManager = new ProductService();

module.exports = {
    getAllProducts: (options) => ProductsManager.getAllProducts(options),
    addProduct: (product) => ProductsManager.addProduct(product),
    deleteProduct: (id) => ProductsManager.deleteProduct(id),
    getProductById: (id) => ProductsManager.getProductById(id)
};