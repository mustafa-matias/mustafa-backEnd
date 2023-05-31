import fs from "fs";
import ProductManager from "./productManager.js";
const productManager = new ProductManager();
import __dirname from "../utils.js";


export default class CartManager {
    constructor() {
        this.path = __dirname + "/file/carts.json";
    }
    getCarts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const carts = JSON.parse(data);
            return carts;
        } else {
            return [];
        }
    }

    addCart = async () => {
        const carts = await this.getCarts();
        let cart = {};

        if (carts.length === 0) {
            cart.id = 1
        } else {
            cart.id = carts[carts.length - 1].id + 1;
        }
        cart.products = [];

        carts.push(cart);

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return carts;
    }

    getCartByID = async (id) => {
        const carts = await this.getCarts();
        const cart = await carts.find((cart) => cart.id == id);
        if (!cart) {
            console.log(`El id: ${id} no existe!`);
            return;
        } else {
            console.log(`El id: ${id}!`);
            return cart;
        }
    }

    addProductToCart = async (cid, pid) => {
        const carts = await this.getCarts();
        const productById = await productManager.getProductByid(pid);
        const cartById = await this.getCartByID(cid);
        const indiceCart = carts.findIndex((cart) => cart.id == cid)

        if (!cartById) {
            console.log(`No existe el carrito N°${cid}`)
            return
        }
        if (!productById) {
            console.log(`No existe el producto N°${pid}`)
            return
        }

        const validacionProducto = await cartById.products.find((p) => p.product == pid);

        if (!validacionProducto) {
            cartById.products.push({ "product": pid, "quantify": 1 });
            carts[indiceCart] = { ...cartById };
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return
        }
        else {
            validacionProducto.quantify += 1;
            carts[indiceCart] = { ...cartById };
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return
        }
    }
}

