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
import isProductCarUser from "./middlewares/isProductCartUser.js";

router.get("/", async (req, res) => {
  try {
    const carts = await cartController.getCartsController();
    res.send({ status: "success", carts: carts });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/:cid", isCartUser, async (req, res) => {
  const cid = req.params.cid;
  try {
    const cartByID = await cartController.getCartByIDController(cid);
    res.send({ status: "success", cart: cartByID });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const cart = await cartController.addCartController();
    res.send({ status: "success", cart: cart });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post(
  "/:cid/product/:pid",
  isProductCarUser,
  isCartUser,
  async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await cartController.addProductToCartController(cid, pid);
    if (result.error) {
      res.status(400).json({ error: result.error });
    } else {
      res.send({ status: "success", payload: result });
    }
  }
);

router.delete("/:cid/product/:pid", async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;
  try {
    await cartController.deleteProductFromCartController(cartId, productId);
    res.send({ status: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  let cartId = req.params.cid;
  try {
    const cart = await cartController.deleteAllProductsFromCartController(
      cartId
    );
    res.send({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  let cartId = req.params.cid;
  let newProducts = req.body;
  try {
    const cart = await cartController.actualizarCarritoController(
      cartId,
      newProducts
    );
    res.send({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;
  let quantity = req.body.quantity;
  try {
    const result = await cartController.actualizarCantidadProductoController(
      cartId,
      productId,
      quantity
    );
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/:cid/purchase", async (req, res) => {
  const id = req.params.cid;
  const email = req.user.email;
  try {
    const result = await ticketController.addTicketController(id, email);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
