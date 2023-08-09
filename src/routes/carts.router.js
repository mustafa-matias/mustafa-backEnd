import express from "express";
import { Router } from "express";
const router = Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
import CartController from "../controller/cart.controller.js";

const cartController = new CartController();

router.post('/', async (req, res) => {
    await cartController.addCartController();
    res.send(`Se agrego nuevo Carrito`);
    return
})

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const cartByID = await cartController.getCartByIDController(cid);
    res.send(cartByID);
})

router.get('/', async (req, res) => {
    const carts = await cartController.getCartsController();
    res.send(carts);
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    await cartController.addProductToCartController(cid, pid)
    res.send("Se cargo de forma exitosa")
})

router.delete("/:cid/product/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    await cartController.deleteProductFromCartController(cartId, productId);
    res.send({ status: "success" });
});

router.delete("/:cid", async (req, res) => {
    let cartId = req.params.cid;
    await cartController.deleteAllProductsFromCartController(cartId);
    res.send({ status: "success" });
});

router.put('/:cid', async (req, res) => {
    let cartId = req.params.cid;
    let newProducts = req.body;
    await cartController.actualizarCarritoController(cartId, newProducts);
    res.send({ status: "success" });
});

router.put('/:cid/products/:pid', async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let quantity = req.body.quantity;

    await cartController.actualizarCantidadProducto(cartId, productId, quantity);
    res.send({ status: "success" });
});

export default router;