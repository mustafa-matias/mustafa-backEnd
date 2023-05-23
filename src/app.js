import express from "express";
import routerProducts from "../routes/products.route.js";
import routerCarts from "../routes/carts.route.js";

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use("/api/products/", routerProducts);
app.use("/api/carts/", routerCarts);

app.listen(8080, () => (console.log('Server puerto 8080')));



