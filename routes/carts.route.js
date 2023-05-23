import express from "express";
import { Router } from "express";
const router = Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json())
import CartManager from "../src/cartManager.js";
import ProductManager from "../src/productManager.js";

const productManager = new ProductManager();
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
        res.send(cartByID.products);
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    await cartManager.addProductToCart(cid, pid);
    const productById = await productManager.getProductByid(pid);
    const cartById = await cartManager.getCartByID(cid);

    if (!cartById) {
        res.send(`No existe el carrito N°${cid}`)
        return
    }
    if (!productById) {
        res.send(`No existe el producto N°${pid}`)
        return
    }
    res.send("Se cargo de forma exitosa")
})

export default router;
