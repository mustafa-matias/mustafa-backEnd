import express from "express";
import handlebars from "express-handlebars";
import __dirname from "../utils.js";
import { Server } from "socket.io";

import routerProducts from "../routes/products.router.js";
import routerCarts from "../routes/carts.router.js";
import viewsRouter from "../routes/views.router.js"
import ChatManager from "./daos/mongoDb/chatManager.class.js";
import routerSessions from "../routes/sessions.router.js";

import ProductManager from "./daos/mongoDb/productManager.class.js";
const productManager = new ProductManager();
const chatManager = new ChatManager();

import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import passport from "passport";
import initializeStrategy from "./config/passport.config.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const expressServer = app.listen(8080, () => (console.log('Server puerto 8080')));
const socketServer = new Server(expressServer);

app.use(function (req, res, next) {
    req.socketServer = socketServer;
    next();
})

socketServer.on('connection', (socket) => {
    console.log('nueva conexión');
    console.log(socket.id);
    socket.on("newProductForm", async (data) => {
        const { title, description, price, thumbnail, code, stock, status, category } = data
        await productManager.addProduct({ title, description, price, thumbnail, code, stock, status: true, category });
        socketServer.emit("imprimir", data);
    })
    socket.on("newProductRouter", async (data) => {
        socketServer.emit("postNewProduct", data);
    })
    socket.on("message", async (data) => {
        await chatManager.addMessage(data)
        socketServer.emit("mostrarMesajes", data)

    })
    socket.on('autenticación', async (data) => {
        socket.broadcast.emit('newUserAlert', data)
    })
})

const connection = mongoose.connect('mongodb+srv://mustafa-matias:8XjhYJrr7ajSjjg2@cluster0.3l5b4gw.mongodb.net/?retryWrites=true&w=majority');
app.use(session({
    store: new MongoStore({
        mongoUrl: 'mongodb+srv://mustafa-matias:8XjhYJrr7ajSjjg2@cluster0.3l5b4gw.mongodb.net/?retryWrites=true&w=majority'
    }),
    secret: 'mongoSecret',
    resave: true,
    saveUninitialized: true,
}));

app.use(cookieParser("palabraSecretaCookie"));
initializeStrategy();
app.use(passport.initialize())
app.use("/", viewsRouter);
app.use("/api/products/", routerProducts);
app.use("/api/carts/", routerCarts);
app.use('/api/sessions/', routerSessions);


export default socketServer;





