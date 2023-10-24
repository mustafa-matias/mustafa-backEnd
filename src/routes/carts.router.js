import express from "express";
import { Router } from "express";
const router = Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
import isCartUser from "./middlewares/isCartUser.middleware.js";
import CartController from "../controller/cart.controller.js";
import TicketController from "../controller/ticket.controller.js";
const cartController = new CartController();
const ticketController = new TicketController();
import CustomError from "../servicio/error/customError.class.js";
import { ErrorEnum } from "../servicio/enum/error.enum.js";
import isProductCarUser from "./middlewares/isProductCartUser.js";

router.get("/", async (req, res) => {
  const carts = await cartController.getCartsController();
  res.send(carts);
});

router.get("/:cid", async (req, res, next) => {
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
    const cartByID = await cartController.getCartByIDController(cid);
    res.send({status: "success", cart: cartByID});
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res) => {
  const cart = await cartController.addCartController();
  res.send({status: "success", cart: cart});
  return;
});

router.post("/:cid/product/:pid", isProductCarUser, isCartUser, async (req, res, next) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  if (cid.length != 24 || pid.length != 24) {
    try {
      throw CustomError.createError({
        name: "incomplete id ",
        cause: `Ivalid id`,
        message: "cannot post product",
        code: ErrorEnum.PARAM_ERROR,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  try {
    const result = await cartController.addProductToCartController(cid, pid);
    res.send({status: 'success', payload: result});
  } catch (error) {
    next(error);
  }
});

router.delete("/:cid/product/:pid", async (req, res, next) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;
  if (cartId.length != 24 || productId.length != 24) {
    try {
      throw CustomError.createError({
        name: "incomplete id ",
        cause: `Ivalid id`,
        message: "cannot delete product",
        code: ErrorEnum.PARAM_ERROR,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  try {
    await cartController.deleteProductFromCartController(cartId, productId);
    res.send({ status: "success" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:cid", async (req, res, next) => {
  let cartId = req.params.cid;
  if (cartId.length != 24) {
    try {
      throw CustomError.createError({
        name: "incomplete id ",
        cause: `Ivalid id: ${cartId}`,
        message: "cannot delete cart",
        code: ErrorEnum.PARAM_ERROR,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  try {
    const cart = await cartController.deleteAllProductsFromCartController(cartId);
    console.log(cart)
    res.send({ status: "success" });
  } catch (error) {
    next(error);
  }
});

router.put("/:cid", async (req, res, next) => {
  let cartId = req.params.cid;
  if (cartId.length != 24) {
    try {
      throw CustomError.createError({
        name: "incomplete id ",
        cause: `Ivalid id: ${cartId}`,
        message: "cannot put cart",
        code: ErrorEnum.PARAM_ERROR,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  let newProducts = req.body;
  try {
    await cartController.actualizarCarritoController(cartId, newProducts);
    res.send({ status: "success" });
  } catch (error) {
    next(error);
  }
});

router.put("/:cid/product/:pid", async (req, res, next) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;
  if (cartId.length != 24 || productId.length != 24) {
    try {
      throw CustomError.createError({
        name: "incomplete id ",
        cause: `Ivalid id`,
        message: "cannot put product",
        code: ErrorEnum.PARAM_ERROR,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  let quantity = req.body.quantity;
  try {
    await cartController.actualizarCantidadProductoController(
      cartId,
      productId,
      quantity
    );
    res.send({ status: "success" });
  } catch (error) {
    next(error);
  }
});

router.post("/:cid/purchase", async (req, res, next) => {
  const id = req.params.cid;
  if (id.length != 24) {
    try {
      throw CustomError.createError({
        name: "incomplete id ",
        cause: `Ivalid id: ${id}`,
        message: "cannot get product",
        code: ErrorEnum.PARAM_ERROR,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  const email = req.user.email;
  try {
    const result = await ticketController.addTicketController(id, email);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

export default router;
