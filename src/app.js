import express from "express";
import handlebars from "express-handlebars";
import __dirname from "../utils.js";
import { Server } from "socket.io";
import config from "./config/config.js";
import cors from "cors";

import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import routerSessions from "./routes/sessions.router.js";
import routerUsers from "./routes/users.router.js"

import ProductController from "./controller/product.controller.js";
const productController = new ProductController();

import ChatController from "./controller/chat.controller.js";
const chatController = new ChatController();

import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import passport from "passport";
import initializeStrategy from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./servicio/middleware/error.middleware.js";
import { addLogger } from "./config/logger.config.js";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addLogger);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json({ limit: '20mb' }));
// app.use(errorMiddleware);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(
  cors({
    origin: "http://localhost:5050",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const expressServer = app.listen(config.port, () =>
  console.log(`Servidor levantado en puerto: ${config.port}`)
);

const connection = mongoose.connect(config.mongoUrl);
app.use(
  session({
    store: new MongoStore({
      mongoUrl: config.mongoUrl,
    }),
    secret: config.mongoSecret,
    resave: true,
    saveUninitialized: true,
  })
);
const socketServer = new Server(expressServer);

app.use(function (req, res, next) {
  req.socketServer = socketServer;
  next();
});

socketServer.on("connection", (socket) => {
  console.log("nueva conexión Socket: ", socket.id);
  socket.on("newProductForm", async (data) => {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
      owner,
    } = data;
    await productController.addProductController({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status: true,
      category,
      owner,
    });
    socketServer.emit("imprimir", data);
  });
  socket.on("newProductRouter", async (data) => {
    socketServer.emit("postNewProduct", data);
  });

  socket.on("message", async (data) => {
    await chatController.addMessageController(data);
    socketServer.emit("mostrarMesajes", data);
  });
  socket.on("autenticación", async (data) => {
    socket.broadcast.emit("newUserAlert", data);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser("palabraSecretaCookie"));
initializeStrategy();
app.use("/", viewsRouter);
app.use("/api/products/", routerProducts);
app.use("/api/carts/", routerCarts);
app.use("/api/sessions/", routerSessions);
app.use("/api/users/", routerUsers);


app.get("/loggerTest", (req, res) => {
  req.logger.debug("error en consola");
  req.logger.info({
    message: "error en file en production y consola en dev",
    fecha: new Date(),
  });
  res.send({ message: "prueba de logger" });
});

export default socketServer;

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación E-Commerce BackEnd",
      description: "Documentación proyecto E-Commerce Curso BackEnd",
    },
  },
  apis: [`${__dirname}/src/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
