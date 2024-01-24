const express = require('express');
const productRouter = require('./routes/products.routes.js');
const cartRouter = require('./routes/carts.routes.js');
const homeRouter = require (`./routes/home.routes.js`)
const handlebars = require (`express-handlebars`)
const http = require (`http`)
const {Server} =  require (`socket.io`)
const app = express();
const PORT = 8080;
const server = http.createServer(app)



app.use(express.static(__dirname+"/public"))
app.use(express.json());

app.use(productRouter);
app.use('/api/carts', cartRouter);
app.use(`/home`, homeRouter)

app.engine (`handlebars`, handlebars.engine())
app.set(`view engine`, `handlebars`)
app.set('views', __dirname + '/views')

const io = new Server(server)
io.on(`connection`, (socket)=> {
    console.log (`hola`)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});