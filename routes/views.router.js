import { Router } from "express";
const router = Router();
import ProductManager from "../src/productManager.js";
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', {products});
})

router.get('/realTimeProducts', async(req, res)=>{
    const products = await productManager.getProducts();
    res.render('realTimeProducts',{products})
})

export default router;
