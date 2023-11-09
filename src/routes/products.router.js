import express from "express";
import { Router } from "express";
const router = Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
import ProductController from "../controller/product.controller.js";
const productController = new ProductController();
import isAdmin from "./middlewares/isAdmin.middleware.js";
import isPremium from "./middlewares/isPremium.middleware.js";
import isProductUser from "./middlewares/isProductUser.middleware.js";
import compression from "express-compression";
import { generateProducts } from "../../utils.js";

router.get("/", async (req, res) => {
  let limit = Number(req.query.limit);
  let page = Number(req.query.page);
  let sort = Number(req.query.sort);
  let filter = req.query.filter;
  let filterValue = req.query.filterValue;
  try {
    let products = await productController.getProductsFilterController(
      limit,
      page,
      sort,
      filter,
      filterValue
    );
    res.send({ status: "success", payload: products });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.post("/realTimeProducts", isPremium, async (req, res) => {
  let newProduct = req.body;
  const { title, description, price, thumbnail, code, stock, category } =
    newProduct;
  if (
    !title ||
    !description ||
    !price ||
    !thumbnail ||
    !code ||
    !stock ||
    !category
  ) {
    return res
      .status(400)
      .json({ error: "Faltan campos obligatorios en la solicitud" });
  }
  try {
    await productController.addProductController(newProduct);
    req.socketServer.sockets.emit("newProductRouter", newProduct);
    res.send({ status: "success", product: newProduct });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.put("/:pid", isAdmin, async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const update = req.body;
    const result = await productController.updateProductController(pid, update);
    return res.send({ status: `success`, payload: result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.delete("/:pid", isProductUser, async (req, res) => {
  try {
    const pid = req.params.pid;
    await productController.deleteProductByidController(pid);
    res.send({ status: `success` });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.get("/:pid", async (req, res, next) => {
  try {
    const productId = req.params.pid;
    const product = await productController.getProductByidController(productId);
    return res.send({ status: "success", payload: product });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.get(
  "/mockingproducts/:count",
  compression({ brotli: { enabled: true, zlib: {} } }),
  (req, res) => {
    try {
      const count = parseInt(req.params.count, 10);
      if (isNaN(count)) {
        throw new Error("No se ha ingresado un parametro numerico");
      }
      const products = generateProducts(count);
      if (!products) {
        throw new Error("No se pudieron generar los productos");
      }
      res.send({ status: "success", payload: products });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

export default router;
