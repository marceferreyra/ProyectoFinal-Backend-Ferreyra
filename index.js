const express = require('express')
const productRouter = require('./routes/products.routes.js')
const cartRouter = require('./routes/carts.routes.js')
const homeRouter = require(`./routes/home.routes.js`)
const chatRouter = require('./routes/chat.routes.js')
const realTimeProductsRouter = require('./routes/realTimeProducts.routes.js')
const handlebars = require(`express-handlebars`)
const path = require('path')
const http = require(`http`)
const { Server } = require(`socket.io`)
const app = express()
const PORT = 8080
const server = http.createServer(app);
const DataBase = require('./src/dao/db/db.js')
const ChatService = require('./src/dao/db/services/chatService.js')
const session = require ('express-session')
const MongoStore = require ('connect-mongo')
const sessionRouter = require('./routes/sessions.routes.js')
const {initPassport} = require('./src/config/passport.config.js')
const passport = require('passport')



app.use(express.static(__dirname + "/public"))
app.use(express.json());


app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://marceeferreyra:Marce507@coder-backend.osbdrri.mongodb.net/ecommerce'
    }),
    secret: 'secretCoder',
    resave: true,
    saveUninitialized: true
}))

initPassport()
app.use(passport.initialize())
app.use(passport.session())

 

app.use(productRouter);
app.use('/api/carts',cartRouter)
app.use(`/home`, homeRouter);
app.use('/chat', chatRouter);
app.use('/realtimeproducts', realTimeProductsRouter);
app.use('/api/sessions', sessionRouter);


app.engine(`handlebars`, handlebars.engine())
app.set(`view engine`, `handlebars`)
app.set('views', __dirname + '/views')

const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('productAdded', (newProduct) => {
        console.log('Producto agregado:', newProduct);
        io.emit('updateProducts', newProduct);
    });

    socket.on('productDeleted', (productId) => {
        console.log(`Producto con ID ${productId} eliminado`);
        io.emit('updateProducts', { deletedProductId: productId });
    });
});

const chatService = new ChatService(io);
chatService.init();


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    DataBase.connect()
});

