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

router.post("/", async (req, res) => {
  await cartController.addCartController();
  res.send(`Se agrego nuevo Carrito`);
  return;
});

router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  if (cid.length != 24) {
    CustomError.createError({
      name: "incomplete id ",
      cause: `Ivalid id: ${cid}`,
      message: "cannot get cart",
      code: ErrorEnum.PARAM_ERROR,
    });
  }
  const cartByID = await cartController.getCartByIDController(cid);
  console.log(cid, cartByID);
  res.send(cartByID);
});

router.get("/", async (req, res) => {
  const carts = await cartController.getCartsController();
  res.send(carts);
});

router.post("/:cid/product/:pid", isCartUser, async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  if (cid.length != 24 || pid.length != 24) {
    CustomError.createError({
      name: "incomplete id ",
      cause: `Ivalid id`,
      message: "cannot post product",
      code: ErrorEnum.PARAM_ERROR,
    });
  }
  await cartController.addProductToCartController(cid, pid);
  res.send("Se cargo de forma exitosa");
});

router.delete("/:cid/product/:pid", async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;
  if (cartId.length != 24 || productId.length != 24) {
    CustomError.createError({
      name: "incomplete id ",
      cause: `Ivalid id`,
      message: "cannot delete product",
      code: ErrorEnum.PARAM_ERROR,
    });
  }
  await cartController.deleteProductFromCartController(cartId, productId);
  res.send({ status: "success" });
});

router.delete("/:cid", async (req, res) => {
  let cartId = req.params.cid;
  if (cartId.length != 24) {
    CustomError.createError({
      name: "incomplete id ",
      cause: `Ivalid id: ${cartId}`,
      message: "cannot delete cart",
      code: ErrorEnum.PARAM_ERROR,
    });
  }
  await cartController.deleteAllProductsFromCartController(cartId);
  res.send({ status: "success" });
});

router.put("/:cid", async (req, res) => {
  let cartId = req.params.cid;
  if (cartId.length != 24) {
    CustomError.createError({
      name: "incomplete id ",
      cause: `Ivalid id: ${cartId}`,
      message: "cannot put cart",
      code: ErrorEnum.PARAM_ERROR,
    });
  }
  let newProducts = req.body;
  await cartController.actualizarCarritoController(cartId, newProducts);
  res.send({ status: "success" });
});

router.put("/:cid/products/:pid", async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;
  if (cartId.length != 24 || productId.length != 24) {
    CustomError.createError({
      name: "incomplete id ",
      cause: `Ivalid id`,
      message: "cannot put product",
      code: ErrorEnum.PARAM_ERROR,
    });
  }
  let quantity = req.body.quantity;

  await cartController.actualizarCantidadProductoController(
    cartId,
    productId,
    quantity
  );
  res.send({ status: "success" });
});

router.post("/:cid/purchase", async (req, res) => {
  const id = req.params.cid;
  if (id.length != 24) {
    CustomError.createError({
      name: "incomplete id ",
      cause: `Ivalid id: ${id}`,
      message: "cannot get product",
      code: ErrorEnum.PARAM_ERROR,
    });
  }

  const email = req.user.email;
  const result = await ticketController.addTicketController(id, email);
  res.send(result);
});

export default router;
