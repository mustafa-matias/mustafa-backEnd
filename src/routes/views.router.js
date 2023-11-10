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
import { calcularTotalProductosCarrrito } from "../../utils.js";
import config from "../config/config.js";

router.get("/products", async (req, res) => {
  let page = parseInt(req.query.page);
  let usuario = req.session.user;
  req.logger.info({ message: `pagination: ${page}`, fecha: new Date() });

  if (!page) page = 1;
  let products = await productsModel.paginate(
    {},
    { page, limit: 8, lean: true }
  );

  products.prevLink = products.hasPrevPage
    ? `http://localhost:8080/products?page=${products.prevPage}`
    : "";
  products.nextLink = products.hasNextPage
    ? `http://localhost:8080/products?page=${products.nextPage}`
    : "";
  products.isValid = !(page <= 0 || page > products.totalPages);

  res.render("products", { products, title: "Products", usuario });
});

router.get("/products/realTimeProducts", isPremium, async (req, res) => {
  let usuario = req.session.user;
  let email = req.session.user.email;
  if (email === config.adminEmail) {
    email = "admin";
  }
  try {
    const products = await productController.getProductsController();
    const userProducts = products.filter(
      (product) => product.owner === email
    );
    res.render("realTimeProducts", {
      usuario, email,
      userProducts,
      title: "Real Time Products",
    });
  } catch (error) {
    console.error(error);
    req.logger.error({ message: `${error}`, fecha: new Date() });
  }
});

router.get("/products/:pid", async (req, res, next) => {
  const usuario = req.session.user;
  let pid = req.params.pid;
  req.logger.info({ message: `id: ${pid}`, fecha: new Date() });
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
  let usuario = req.session.user;
  try {
    const cart = await cartModel
      .findOne({ _id: cid })
      .populate("products.product")
      .lean();
    const totalProductos = calcularTotalProductosCarrrito(cart);
    res.render("cart", { title: "Cart", cart, totalProductos, usuario });
  } catch (error) {
    next(error);
    req.logger.error({ message: `${error}`, fecha: new Date() });
    return;
  }
});

router.get("/purchase", async (req, res, next) => {
  let usuario = req.session.user;
  res.render("purchase", { title: "Compra", usuario });
});

router.get("/chat", isUser, (req, res) => {
  let usuario = req.session.user;
  res.render("chat", { title: "Chat", usuario });
});

router.get("/sessions/register", (req, res) => {
  let usuario = req.session.user;
  res.render("register", { title: "Register", usuario });
});

router.get("/sessions/login", (req, res) => {
  let usuario = req.session.user;
  res.render("login", { title: "login", usuario });
});

router.get("/sessions/forgotPassword", (req, res) => {
  let usuario = req.session.user;
  res.render("forgotPassword", { title: "Forgot Password", usuario });
});

router.get("/sessions/resetPassword/:token", (req, res) => {
  let usuario = req.session.user;
  res.render("resetPassword", { title: "Reset Password", usuario });
});

router.get("/users/premium/:uid", (req, res) => {
  let usuario = req.session.user;
  res.render("userPremium", { title: "Usuario Premium", usuario });
});

router.get("/users/:uid/documents", (req, res) => {
  let usuario = req.session.user;
  res.render("addDocuments", { title: "Add Documents", usuario });
});

export default router;
