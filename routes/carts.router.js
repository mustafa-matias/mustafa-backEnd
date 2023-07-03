import express from "express";
import { Router } from "express";
const router = Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

import CartManager from "../src/daos/mongoDb/cartManager.class.js";
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    await cartManager.addCart();
    res.send(`Se agrego nuevo Carrito`);
    return
})

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const cartByID = await cartManager.getCartByID(cid);
    if (!cartByID) {
        res.send(`El id N°${cid} no existe! `)
    } else {
        res.send(cartByID);
    }
})

router.get('/', async (req, res) => {
    const carts = await cartManager.getCarts();
    if (!carts) {
        res.send(`No se encontraron carritos!`)
        return
    } else {
        res.send(carts);
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    await cartManager.addProductToCart(cid, pid)
    res.send("Se cargo de forma exitosa")
})

router.delete("/:cid/product/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    await cartManager.deleteProductFromCart(cartId, productId);
    res.send({ status: "success" });
});

router.delete("/:cid", async (req, res) => {
    let cartId = req.params.cid;
    await cartManager.deleteAllProductsFromCart(cartId);
    res.send({ status: "success" });
});

router.put('/:cid', async (req, res) => {
    let cartId = req.params.cid;
    let newProducts = req.body;
    await cartManager.actualizarCarrito(cartId, newProducts);
    res.send({ status: "success" });
});

router.put('/:cid/products/:pid', async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let quantity = req.body.quantity;


    await cartManager.actualizarCantidadProducto(cartId, productId, quantity);
    res.send({ status: "success" });
});

export default router;
