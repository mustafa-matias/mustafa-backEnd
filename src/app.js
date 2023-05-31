import express from "express";
import handlebars from "express-handlebars";
import __dirname from "../utils.js";
import { Server } from "socket.io";

import routerProducts from "../routes/products.route.js";
import routerCarts from "../routes/carts.route.js";
import viewsRouter from "../routes/views.router.js"

import ProductManager from "./productManager.js";
const productManager = new ProductManager();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


const expressServer = app.listen(8080, () => (console.log('Server puerto 8080')));
const socketServer = new Server(expressServer);

socketServer.on('connection', (socket) => {
    console.log('nueva conexión');
    console.log(socket.id);
    socket.on("newProduct", async (data) => {
        await productManager.addProduct(data.title, data.description, data.price, data.thumbnail, data.code, data.stock, true, data.category);
        socketServer.emit("imprimir", data);
    })
})

app.use(function (req, res, next) {
    req.socketServer = socketServer;
    next();
})

app.use("/api/products/", routerProducts);
app.use("/api/carts/", routerCarts);
app.use("/", viewsRouter);

export default socketServer;





