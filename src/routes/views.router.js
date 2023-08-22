import { Router } from "express";
const router = Router();
import { productsModel } from "../persistencia/mongoDb/models/products.model.js";
import { cartModel } from "../persistencia/mongoDb/models/carts.model.js";
import ProductController from "../controller/product.controller.js";
const productController = new ProductController();
import isUser from "./middlewares/isUser.middleware.js";
import isCartUser from "./middlewares/isCartUser.middleware.js";
import isAdmin from "./middlewares/isAdmin.middleware.js";
import {
  calcularTotalProductosCarrrito,
  generateProducts,
} from "../../utils.js";
import compression from "express-compression";
import CustomError from "../servicio/error/customError.class.js";
import { ErrorEnum } from "../servicio/enum/error.enum.js";
import { generateErrorInfo } from "../servicio/info.js";

router.get("/", async (req, res) => {
  const products = await productController.getProductsController();
  res.render("index", { products, title: "Products" });
});

router.get("/products", async (req, res) => {
  let page = parseInt(req.query.page);
  let usuario = req.session.user;

  if (!page) page = 1;
  let products = await productsModel.paginate(
    {},
    { page, limit: 4, lean: true }
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

router.get("/product/:pid", async (req, res, next) => {
  const usuario = req.session.user;
  let pid = req.params.pid;
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
      return;
    }
  }
  try {
    let product = await productsModel.findOne({ _id: pid }).lean();
    res.render("product", { product, title: product.title, usuario });
  } catch (error) {
    next(error);
    return;
  }
});

router.get("/api/carts/:cid", isCartUser, async (req, res, next) => {
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
      return;
    }
  }
  try {
    const cart = await cartModel
      .findOne({ _id: cid })
      .populate("products.product")
      .lean();
  } catch (error) {
    next(error);
    return;
  }
  const totalProductos = calcularTotalProductosCarrrito(cart);
  res.render("cart", { cart, totalProductos });
});

router.get("/realTimeProducts", isAdmin, async (req, res) => {
  const products = await productController.getProductsController();
  res.render("realTimeProducts", { products, title: "Real Time Products" });
});

router.get("/chat", isUser, (req, res) => {
  res.render("chat", { title: "Chat" });
});

router.get("/api/sessions/register", (req, res) => {
  res.render("register", { title: "Register" });
});

router.get("/api/sessions/login", (req, res) => {
  res.render("login", { title: "login" });
});

router.get(
  "/mockingproducts",
  compression({ brotli: { enabled: true, zlib: {} } }),
  (req, res) => {
    const products = generateProducts(100);
    res.send(products);
  }
);

export default router;
