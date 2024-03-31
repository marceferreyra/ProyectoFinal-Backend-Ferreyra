const productService = require('../services/productService');

exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        const plainProducts = products.map(product => product.toObject({ getters: true }));
        const user = req.session.user;
        const cartId = user ? user.cartId : null; 
        
        res.render('products', { products: plainProducts, user, cartId }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos desde MongoDB.' });
    }
};

exports.getProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productService.getProductById(productId);
        
        if (product) {    
            const user = req.session.user;
           
            const plainProduct = product.toObject({ getters: true }); 
          
            res.render('productDetail', { product: plainProduct, user }); 
        } else {
            const errorResponse = {
                status: 'error',
                error: `No se encontró ningún producto con el ID ${productId}`,
            };
            res.status(404).json(errorResponse);
        }
    } catch (error) {
        console.error(error);
        const errorResponse = {
            status: 'error',
            error: 'Error al obtener el producto desde MongoDB.',
        };
        res.status(500).json(errorResponse);
    }
};

exports.addProduct = async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;
    try {
        const result = await productService.addProduct(title, description, price, thumbnail, code, stock, status, category);

        if (result.error) {
            res.status(400).json({ error: result.error });
        } else {
            res.status(201).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al agregar un producto en MongoDB.' });
    }
};

exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await productService.deleteProduct(productId);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar un producto desde MongoDB.' });
    }
};

exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    try {
        const result = await productService.updateProduct(productId, updatedProduct);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar un producto en MongoDB.' });
    }
};
