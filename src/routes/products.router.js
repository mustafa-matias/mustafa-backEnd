import express from "express";
import { Router } from "express";
const router = Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json())

import ProductController from "../controller/product.controller.js";
const productController = new ProductController();

router.get('/', async (req, res) => {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    let sort = Number(req.query.sort);
    let filter = req.query.filter;
    let filterValue = req.query.filterValue;

    let products = await productController.getProductsFilterController(limit, page, sort, filter, filterValue);
    res.send(products);
})

router.get('/:pid', async (req, res) => {
    const idParam = req.params.pid
    const procuctByID = await productController.getProductByidController(idParam);
    res.send(procuctByID);
})

router.post('/', async (req, res) => {
    const newProduct = req.body;
    await productController.addProductController(newProduct);

    req.socketServer.sockets.emit('newProductRouter', newProduct)
    res.send(`se agregó ${title}`)
})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const update = req.body;

    const procuctByID = await productController.getProductByidController(pid);
    if (!procuctByID) {
        res.send(`No existe el Id: ${pid} para ser actualizado`);
        return
    }
    if (update.id) {
        res.send(`No puede actualizar la categoria ID`);
        return
    }
    
    await productController.updateProductController(pid, update);
    res.send(`El producto ${procuctByID.title} con ID: ${pid} fue actualizado`);
    return;
}
)

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const procuctByID = await productController.getProductByidController(pid);
    if (!procuctByID) {
        res.send(`No existe el Id: ${pid} para ser elimnado `);
        return
    } else {
        await productController.deleteProductByidController(pid);
        res.send(`El producto ${procuctByID.title} con ID: ${pid} fue eliminado`);
    }
})

export default router;




