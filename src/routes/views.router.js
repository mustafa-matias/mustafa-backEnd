import { Router } from "express";
const router = Router();
import { productsModel } from "../persistencia/mongoDb/models/products.model.js";
import { cartModel } from "../persistencia/mongoDb/models/carts.model.js";
import ProductController from "../controller/product.controller.js";
const productController = new ProductController();
import isUser from "./middlewares/isUser.middleware.js";
import isCartUser from "./middlewares/isCartUser.middleware.js";
import isAdmin from "./middlewares/isAdmin.middleware.js";
import { calcularTotalProductosCarrrito } from "../../utils.js";

router.get('/', async (req, res) => {
    const products = await productController.getProductsController();
    res.render('index', { products, title: 'Products' });
})

router.get('/products', async (req, res) => {
    let page = parseInt(req.query.page);
    let usuario = req.session.user;
    
    if (!page) page = 1;
    let products = await productsModel.paginate({}, { page, limit: 4, lean: true })

    products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}` : '';
    products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}` : '';
    products.isValid = !(page <= 0 || page > products.totalPages);

    res.render('products', { products, title: 'Products', usuario });
})

router.get('/product/:pid', async (req, res) => {
    const usuario = req.session.user;
    let pid = req.params.pid;
    let product = await productsModel.findOne({ _id: pid }).lean();
    res.render('product', { product, title: product.title, usuario })
})

router.get('/api/carts/:cid', isCartUser, async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartModel.findOne({ _id: cid }).populate('products.product').lean();
    const totalProductos = calcularTotalProductosCarrrito(cart);
    res.render('cart', {cart, totalProductos})
})

router.get('/realTimeProducts', isAdmin, async (req, res) => {
    const products = await productController.getProductsController();
    res.render('realTimeProducts', { products, title: 'Real Time Products' })
})

router.get('/chat', isUser, (req, res) => {
    res.render('chat', { title: 'Chat' });
})

router.get('/api/sessions/register', (req, res) => {
    res.render('register', { title: 'Register' });
})

router.get('/api/sessions/login', (req, res) => {
    res.render('login', { title: 'login' });
})

export default router;
