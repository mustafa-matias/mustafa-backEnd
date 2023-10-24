import express from "express";
import { Router } from "express";
const router = Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

import ProductController from "../controller/product.controller.js";
const productController = new ProductController();
import isAdmin from "./middlewares/isAdmin.middleware.js";

import { ErrorEnum } from "../servicio/enum/error.enum.js";
import CustomError from "../servicio/error/customError.class.js";
import isPremium from "./middlewares/isPremium.middleware.js";
import isProductUser from "./middlewares/isProductUser.middleware.js";

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

router.post("/realTimeProducts", isPremium, async (req, res) => {
  let newProduct = req.body;
  await productController.addProductController(newProduct);

  req.socketServer.sockets.emit("newProductRouter", newProduct);
  res.send({ status: "success", product: newProduct });
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
    await productController.updateProductController(pid, update);
    const updateProduct = await productController.getProductByidController(pid);
    res.send({ status: `success`, product: updateProduct });
  } catch (error) {
    next(error);
    return;
  }
});

router.delete("/:pid", isProductUser, async (req, res, next) => {
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
    await productController.deleteProductByidController(pid);
    console.log(procuctByID);
    res.send({ status: `success`, product: procuctByID });
  } catch (error) {
    next(error);
    return;
  }
});

export default router;
