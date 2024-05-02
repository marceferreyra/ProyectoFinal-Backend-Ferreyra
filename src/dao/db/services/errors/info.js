const EErrors = require('./enumErrors');

const errorInfo = {
    [EErrors.CART_NOT_FOUND]: "El carrito especificado no se encontró.",
    [EErrors.PRODUCT_ADDITION_ERROR]: "Error al agregar un producto al carrito.",
    [EErrors.PRODUCT_QUANTITY_UPDATE_ERROR]: "Error al actualizar la cantidad de un producto en el carrito.",
    [EErrors.CART_CREATION_ERROR]: "Error al crear un nuevo carrito.",
    [EErrors.CART_DELETION_ERROR]: "Error al eliminar un carrito.",
    [EErrors.CART_CLEAR_ERROR]: "Error al vaciar un carrito.",
    [EErrors.PURCHASE_ERROR]: "Error al realizar la compra del carrito.",
    [EErrors.PRODUCT_NOT_FOUND]: "El producto especificado no se encontró.",
    [EErrors.PRODUCT_DELETION_ERROR]: "Error al eliminar un producto.",
    [EErrors.PRODUCT_UPDATE_ERROR]: "Error al actualizar un producto."
};

module.exports = errorInfo;