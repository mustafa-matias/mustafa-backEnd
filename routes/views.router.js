import { Router } from "express";
const router = Router();
import ProductManager from "../src/daos/mongoDb/productManager.class.js";
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', {products});
})

router.get('/realTimeProducts', async(req, res)=>{
    const products = await productManager.getProducts();
    res.render('realTimeProducts',{products})
})

router.get('/chat',(req,res)=>{
    res.render('chat');
})

export default router;
