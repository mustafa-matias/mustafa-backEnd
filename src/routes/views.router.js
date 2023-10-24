import express from "express";
import { Router } from "express";
const router = Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

import { productsModel } from "../persistencia/mongoDb/models/products.model.js";
import { cartModel } from "../persistencia/mongoDb/models/carts.model.js";
import ProductController from "../controller/product.controller.js";
const productController = new ProductController();
import isUser from "./middlewares/isUser.middleware.js";
import isCartUser from "./middlewares/isCartUser.middleware.js";
import isPremium from "./middlewares/isPremium.middleware.js";
import {
  calcularTotalProductosCarrrito,
  generateProducts,
} from "../../utils.js";
import compression from "express-compression";
import CustomError from "../servicio/error/customError.class.js";
import { ErrorEnum } from "../servicio/enum/error.enum.js";
import config from "../config/config.js";

router.get("/", async (req, res) => {
  const products = await productController.getProductsController();
  res.render("index", { products, title: "Products" });
});

router.get("/products", async (req, res) => {
  let page = parseInt(req.query.page);
  let usuario = req.session.user;

  req.logger.info({ message: `pagination: ${page}`, fecha: new Date() });

  if (!page) page = 1;
  let products = await productsModel.paginate(
    {},
    { page, limit: 4, lean: true }
  );

  products.prevLink = products.hasPrevPage
    ? `http://localhost:8080/api/products?page=${products.prevPage}`
    : "";
  products.nextLink = products.hasNextPage
    ? `http://localhost:8080/api/products?page=${products.nextPage}`
    : "";
  products.isValid = !(page <= 0 || page > products.totalPages);

  res.render("products", { products, title: "Products", usuario });
});

router.get("/products/:pid", async (req, res, next) => {
  const usuario = req.session.user;
  let pid = req.params.pid;
  req.logger.info({ message: `id: ${pid}`, fecha: new Date() });

  if (pid.length != 24) {
    try {
      throw CustomError.createError({
        name: "incomplete id ",
        cause: `Ivalid id: ${pid}`,
        message: "cannot get product",
        code: ErrorEnum.PARAM_ERROR,
      });
    } catch (error) {
      next(error);
      req.logger.error({ message: `${error}`, fecha: new Date() });
      return;
    }
  }
  try {
    let product = await productsModel.findOne({ _id: pid }).lean();
    res.render("product", { product, title: product.title, usuario });
  } catch (error) {
    next(error);
    req.logger.error({ message: `${error}`, fecha: new Date() });
    return;
  }
});

router.get("/carts/:cid", isCartUser, async (req, res, next) => {
  const cid = req.params.cid;
  if (cid.length != 24) {
    try {
      throw CustomError.createError({
        name: "incomplete id ",
        cause: `Ivalid id: ${cid}`,
        message: "cannot get cart",
        code: ErrorEnum.PARAM_ERROR,
      });
    } catch (error) {
      next(error);
      req.logger.error({ message: `${error}`, fecha: new Date() });
      return;
    }
  }
  try {
    const cart = await cartModel
      .findOne({ _id: cid })
      .populate("products.product")
      .lean();
    const totalProductos = calcularTotalProductosCarrrito(cart);
    res.render("cart", { cart, totalProductos });
  } catch (error) {
    next(error);
    req.logger.error({ message: `${error}`, fecha: new Date() });
    return;
  }
});

router.get("/products/realTimeProducts", isPremium , async (req, res) => {
  let usuario = req.session.user.email;
  if (usuario === config.adminEmail){
    usuario = "admin"
  }
  try {
    const products = await productController.getProductsController();
    console.log(products)
    res.render("realTimeProducts", {usuario, products, title: "Real Time Products" });
  } catch (error) {
    console.error(error);
    req.logger.error({ message: `${error}`, fecha: new Date() });
  }
});

router.get("/chat", isUser, (req, res) => {
  res.render("chat", { title: "Chat" });
});

router.get("/sessions/register", (req, res) => {
  res.render("register", { title: "Register" });
});

router.get("/sessions/login", (req, res) => {
  res.render("login", { title: "login" });
});

router.get("/sessions/forgotPassword", (req, res) => {
  res.render("forgotPassword", { title: "Forgot Password" });
});

router.get("/sessions/resetPassword/:token", (req, res) => {
  res.render("resetPassword", { title: "Reset Password" });
});

router.get("/users/premium/:uid", (req, res) => {
  let usuario = req.session.user;
  res.render("userPremium", { title: "Usuario Premium", usuario });
});

router.get(
  "/api/mockingproducts",
  compression({ brotli: { enabled: true, zlib: {} } }),
  (req, res) => {
    const products = generateProducts(100);
    res.send(products);
  }
);

router.get('/users/:uid/documents',(req, res)=>{
  const userId = req.params.uid;
  res.render("addDocuments",{userId})
})

export default router;
