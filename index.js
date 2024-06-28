const config = require('./src/config/config.js');
const express = require('express');
const methodOverride = require('method-override');
const productRouter = require('./src/routes/products.routes.js');
const cartRouter = require('./src/routes/carts.routes.js');
const chatRouter = require('./src/routes/chat.routes.js');
const sessionRouter = require('./src/routes/sessions.routes.js');
const mailRouter = require('./src/config/mail.js');
const userRouter = require(`./src/routes/users.routes.js`)
const paymentRouter = require('./src/routes/payments.routes.js')
const mockingRouter = require('./src/routes/mocking.routes.js');
const loggerTestRouter = require('./src/routes/loggerTests.routes.js');
const viewsRouter = require('./src/routes/views.routes.js')
const exphbs = require('express-handlebars');
const cors = require('cors')
const path = require('path');
const http = require(`http`);
const { Server } = require(`socket.io`);

const app = express();
const HOST = config.host;
const PORT = config.port;
const server = http.createServer(app);
const DataBase = require('./src/dao/db/db.js');
const ChatService = require('./src/dao/db/services/chatService.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const { initPassport } = require('./src/config/passport.config.js');
const passport = require('passport');
const loggerMiddleware = require('./src/config/logger.js');
const swaggerJSDoc = require(`swagger-jsdoc`);
const swaggerUIExpress = require(`swagger-ui-express`)


const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion API Proyecto Final",
            description: "Documentacion API Proyecto Final - Utilizando swagger"
        }

    }, apis: [`./src/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use(`/apidocs`, swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method'));
app.use((req, res, next) => {
    next();
});

app.use(express.static(__dirname + "/src/public"));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

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
app.use('/api/carts', cartRouter);
app.use('/chat', chatRouter);
app.use('/api/sessions', sessionRouter);
app.use('/mail', mailRouter);
app.use(userRouter)
app.use(mockingRouter);
app.use(loggerTestRouter);
app.use(viewsRouter)
app.use('/api/payments', paymentRouter)

const hbs = exphbs.create({
    helpers: {
        eq: function(a, b) {
            return a === b;
        },
        hasDocument: function (documents, name) {
            if (name === 'document') {
                return documents.some(doc => doc.status === 'completado');
            } else {
                return documents.some(doc => doc.name === name && doc.status === 'completado');
            }
        },
        displayName: function(user) {
            if (user.name) {
                return user.name;
            } else {
                return `${user.first_name} ${user.last_name}`;
            }
        }
    }
});

app.engine('handlebars', hbs.engine);
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
        if (newProduct) {
            console.log('Producto agregado:', newProduct);
            io.emit('updateProducts', newProduct);
        } else {
            console.error('Producto agregado es null');
        }
    });

    socket.on('productDeleted', (productId) => {
        if (productId) {
            console.log(`Producto con ID ${productId} eliminado`);
            io.emit('updateProducts', { deletedProductId: productId });
        } else {
            console.error('ID de producto eliminado es null');
        }
    });
});

const chatService = new ChatService(io);
chatService.init();

server.listen(PORT, () => {
    console.log(`Server running on port ${config.port}`);
    DataBase.connect();
});
