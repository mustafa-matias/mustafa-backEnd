import express from "express";
import { Router } from "express";
const router = Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

import ProductController from "../controller/product.controller.js";
const productController = new ProductController();
import isAdmin from "./middlewares/isAdmin.middleware.js";

import { ErrorEnum } from "../servicio/enum/error.enum.js";
import CustomError from "../servicio/error/customError.class.js";

router.get("/", async (req, res) => {
  let limit = Number(req.query.limit);
  let page = Number(req.query.page);
  let sort = Number(req.query.sort);
  let filter = req.query.filter;
  let filterValue = req.query.filterValue;

  let products = await productController.getProductsFilterController(
    limit,
    page,
    sort,
    filter,
    filterValue
  );
  res.send(products);
});

router.get("/:pid", async (req, res, next) => {
  const idParam = req.params.pid;
  if (idParam.length != 24) {
    try {
      throw CustomError.createError({
        name: "incomplete id ",
        cause: `Ivalid id: ${idParam}`,
        message: "cannot get product",
        code: ErrorEnum.PARAM_ERROR,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  try {
    const procuctByID = await productController.getProductByidController(
      idParam
    );
    res.send(procuctByID);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAdmin, async (req, res) => {
  console.log(req.body);
  const newProduct = req.body;
  await productController.addProductController(newProduct);

  req.socketServer.sockets.emit("newProductRouter", newProduct);
  res.send(`se agregó ${newProduct.title}`);
});

router.put("/:pid", isAdmin, async (req, res, next) => {
  const pid = req.params.pid;
  if (pid.length != 24) {
    try {
      throw CustomError.createError({
        name: "incomplete id ",
        cause: `Ivalid id: ${pid}`,
        message: "cannot put product",
        code: ErrorEnum.PARAM_ERROR,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  const update = req.body;
  try {
    const procuctByID = await productController.getProductByidController(pid);
  } catch (error) {
    next(error);
    return;
  }

  try {
    await productController.updateProductController(pid, update);
    res.send(`El producto ${procuctByID.title} con ID: ${pid} fue actualizado`);
    return;
  } catch (error) {
    next(error);
    return;
  }
});

router.delete("/:pid", isAdmin, async (req, res, next) => {
  const pid = req.params.pid;
  if (pid.length != 24) {
    try {
      throw CustomError.createError({
        name: "incomplete id ",
        cause: `Ivalid id: ${pid}`,
        message: "cannot delete product",
        code: ErrorEnum.PARAM_ERROR,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  try {
    const procuctByID = await productController.getProductByidController(pid);
  } catch (error) {
    next(error);
    return;
  }
  try {
    await productController.deleteProductByidController(pid);
    res.send(`El producto ${procuctByID.title} con ID: ${pid} fue eliminado`);
  } catch (error) {
    next(error);
    return;
  }
});

export default router;
