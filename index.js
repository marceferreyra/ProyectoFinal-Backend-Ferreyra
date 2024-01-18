const express = require('express');
const productRouter = require('./routes/products.routes.js');
const cartRouter = require('./routes/carts.routes.js');

const app = express();
const PORT = 8080;

app.use(productRouter);
app.use('/api/carts', cartRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});