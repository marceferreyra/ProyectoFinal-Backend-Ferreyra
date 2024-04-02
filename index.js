const express = require('express');
const productRouter = require('./src/routes/products.routes.js');
const cartRouter = require('./src/routes/carts.routes.js');
const homeRouter = require(`./src/routes/home.routes.js`)
const chatRouter = require('./src/routes/chat.routes.js');
const realTimeProductsRouter = require('./src/routes/realTimeProducts.routes.js')
const handlebars = require(`express-handlebars`)
const path = require('path');
const http = require(`http`)
const { Server } = require(`socket.io`)
const app = express();
const PORT = 8080;
const server = http.createServer(app);
const DataBase = require('./src/dao/db/db.js')
const ChatService = require('./src/dao/db/services/chatService.js');
const cookiesRouter = require('./src/routes/cookies.routes.js');
const session = require ('express-session')
const MongoStore = require ('connect-mongo')
const sessionRouter = require('./src/routes/sessions.routes.js')
const bodyParser = require('body-parser');
const {initPassport} = require('./src/config/passport.config.js')
const passport = require('passport');




app.use(express.static(__dirname + "/src/public"))
app.use(express.json());



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
app.use('/cookies', cookiesRouter)
app.use('/api/sessions', sessionRouter);


app.engine(`handlebars`, handlebars.engine())
app.set(`view engine`, `handlebars`)
app.set('views', __dirname + '/src/views')

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

