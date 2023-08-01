import express from "express";
import { Router } from "express";
const router = Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json())
import ProductManager from "../persistencia/mongoDb/productManager.class.js";
const productManager = new ProductManager();
import { getProductsFilterService } from "../servicio/productManager.service.js";

router.get('/', async (req, res) => {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    let sort = Number(req.query.sort);
    let filter = req.query.filter;
    let filterValue = req.query.filterValue;

    let products = await getProductsFilterService(limit, page, sort, filter, filterValue);

    if (products) {
        products.status = "success";
    }

    res.send(products);
})

router.get('/:pid', async (req, res) => {
    const idParam = req.params.pid
    const procuctByID = await productManager.getProductByid(idParam);
    if (!procuctByID) {
        res.send(`El id N°${idParam} no existe! `)
    } else {
        res.send(procuctByID);
    }
})

router.post('/', async (req, res) => {
    const newProduct = req.body;
    const { title, description, price, thumbnail, code, stock, status, category } = newProduct;

    if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
        res.send(`Debe completar todos los campos`);
        return;
    }

    let products = await productManager.getProducts();
    const aux = await products.find((product) => product.code == code);
    if (aux) {
        res.send(`ya existe el codigo ${code} `);
        return;
    }
    await productManager.addProduct({ title, description, price, thumbnail, code, stock, status, category });

    req.socketServer.sockets.emit('newProductRouter', newProduct)
    res.send(`se agregó ${title}`)
})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const update = req.body;

    const procuctByID = await productManager.getProductByid(pid);
    if (!procuctByID) {
        res.send(`No existe el Id: ${pid} para ser actualizado`);
        return
    }
    if (update.id) {
        res.send(`No puede actualizar la categoria ID`);
        return
    }
    if (update.title || update.description || update.price || update.thumbnail || update.code || update.stock || update.status || update.category) {
        await productManager.updateProduct(pid, update);
        res.send(`El producto ${procuctByID.title} con ID: ${pid} fue actualizado`);
        return;
    } else {
        res.send(`Campo inexiste para ser actualizado`);
    }
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;

    const procuctByID = await productManager.getProductByid(pid);
    if (!procuctByID) {
        res.send(`No existe el Id: ${pid} para ser elimnado `);
        return
    } else {
        await productManager.deleteProductByid(pid);
        res.send(`El producto ${procuctByID.title} con ID: ${pid} fue eliminado`);
    }
})

export default router;




