import { Router } from "express";
const router = Router();
import ProductManager from "../src/daos/mongoDb/productManager.class.js";
const productManager = new ProductManager();
import { productsModel } from "../src/daos/mongoDb/models/products.model.js";
import { cartModel } from "../src/daos/mongoDb/models/carts.model.js";

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', {products});
})

router.get('/products', async (req, res) => {
    let page = parseInt(req.query.page);
    if(!page) page=1;

    let products = await productsModel.paginate({},{page,limit:5,lean:true})
    products.prevLink = products.hasPrevPage?`http://localhost:8080/products?page=${products.prevPage}`:'';
    products.nextLink = products.hasNextPage?`http://localhost:8080/products?page=${products.nextPage}`:'';
    products.isValid= !(page<=0||page>products.totalPages);

    console.log(products)

    res.render('products', {products});
})

router.get('/product/:pid', async (req, res) => {
    let pid = req.params.pid;
    let product = await productsModel.findOne({ _id: pid }).lean();
    res.render('product', product)
})

router.get('/carts/:cid', async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartModel.findOne({_id: cid}).populate('products.product').lean();
    res.render('cart', cart)
})

router.get('/realTimeProducts', async(req, res)=>{
    const products = await productManager.getProducts();
    res.render('realTimeProducts',{products})
})

router.get('/chat',(req,res)=>{
    res.render('chat');
})

router.post('')

export default router;
