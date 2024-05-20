const config = require('./src/config/config.js');
const express = require('express');
const productRouter = require('./src/routes/products.routes.js');
const cartRouter = require('./src/routes/carts.routes.js');
const chatRouter = require('./src/routes/chat.routes.js');
const realTimeProductsRouter = require('./src/routes/realTimeProducts.routes.js');
const sessionRouter = require('./src/routes/sessions.routes.js');
const mailRouter = require('./src/config/mail.js');
const userRouter = require(`./src/routes/users.routes.js`)
const mockingRouter = require('./src/routes/mocking.routes.js');
const loggerTestRouter = require('./src/routes/loggerTests.routes.js');
const handlebars = require(`express-handlebars`);
const path = require('path');
const http = require(`http`);
const { Server } = require(`socket.io`);

const app = express();
const HOST = config.host;
const PORT = config.port;
const server = http.createServer(app);
const DataBase = require('./src/dao/db/db.js');
const ChatService = require('./src/dao/db/services/chatService.js');
const session = require ('express-session');
const MongoStore = require ('connect-mongo');
const bodyParser = require('body-parser');
const { initPassport } = require('./src/config/passport.config.js');
const passport = require('passport');
const loggerMiddleware = require('./src/config/logger.js');

app.use(express.static(__dirname + "/src/public"));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.dbUrl
    }),
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}));

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(loggerMiddleware);

app.use(productRouter);
app.use('/api/carts',cartRouter);
app.use('/chat', chatRouter);
app.use('/realtimeproducts', realTimeProductsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/mail', mailRouter);
app.use(`/api/users`, userRouter)
app.use(mockingRouter);
app.use(loggerTestRouter);

app.engine(`handlebars`, handlebars.engine());
app.set(`view engine`, `handlebars`);
app.set('views', __dirname + '/src/views');

const io = new Server(server, {
    cors: {
        origin: `http://${HOST}:${PORT}`,
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
    console.log(`Server running on port ${config.port}`);
    DataBase.connect();
});
