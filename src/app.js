import ProductManager from "./productManager.js";
import express from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    const products = await productManager.getProducts();
    const queryLimit = req.query.limit
    if (queryLimit && queryLimit <= products.length) {
        const productsLimits = await products.slice(0, queryLimit);
        res.send(productsLimits);
    }
    if (queryLimit && queryLimit > products.length) {
        res.send(`No existen ${queryLimit} productos. Solo existen ${products.length} producto/s`);
    }
    if (!queryLimit) {
        res.send(products);
    }
})

app.get('/products/:pid', async (req, res) => {
    const idParam = req.params.pid
    const procuctByID = await productManager.getProductByid(idParam);
    if (!procuctByID) {
        res.send(`El id N°${idParam} no existe! `)
    } else {
        res.send(procuctByID);
    }
})

app.listen(8080, () => (console.log('Server puerto 8080')));


