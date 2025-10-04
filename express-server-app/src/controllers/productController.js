class ProductController {
    constructor(productService) {
        this.productService = productService;
        this.getAllProducts = this.getAllProducts.bind(this);
        this.getProductById = this.getProductById.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    async getAllProducts(req, res) {
        try {
            const { page, limit, category, available, sort } = req.query;
            const result = this.productService.getAllProducts({
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                category,
                available,
                sort
            });
            const totalPages = result.totalPages;
            const currentPage = result.page;
            const hasPrevPage = currentPage > 1;
            const hasNextPage = currentPage < totalPages;
            const prevPage = hasPrevPage ? currentPage - 1 : null;
            const nextPage = hasNextPage ? currentPage + 1 : null;
            const baseUrl = req.baseUrl + req.path;
            const queryParams = (params) => {
                const q = { ...req.query, ...params };
                return Object.keys(q)
                    .map(k => `${k}=${encodeURIComponent(q[k])}`)
                    .join('&');
            };
            res.status(200).json({
                status: 'success',
                payload: result.products,
                totalPages,
                prevPage,
                nextPage,
                page: currentPage,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `${baseUrl}?${queryParams({ page: prevPage })}` : null,
                nextLink: hasNextPage ? `${baseUrl}?${queryParams({ page: nextPage })}` : null
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async getProductById(req, res) {
        const { pid } = req.params;
        try {
            const product = this.productService.getProductById(pid);
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const createdProduct = this.productService.addProduct(newProduct);
            res.status(201).json(createdProduct);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateProduct(req, res) {
        const { pid } = req.params;
        const updatedProduct = req.body;
        try {
            const product = this.productService.updateProduct(pid, updatedProduct);
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteProduct(req, res) {
        const { pid } = req.params;
        try {
            const deleted = this.productService.deleteProduct(pid);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = ProductController;