import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import ProductManager from "./productManager.class.js";

export default class CartManager {
    connection = mongoose.connect('mongodb+srv://mustafa-matias:8XjhYJrr7ajSjjg2@cluster0.3l5b4gw.mongodb.net/?retryWrites=true&w=majority');

    productManager = new ProductManager();

    getCarts = async () => {
        const carts = await cartModel.find();
        return carts;
    }

    addCart = async () => {
        const cart = await cartModel.create({products: []});
        return cart;
    }

    getCartByID = async (id) => {
        const cart = await cartModel.findOne({_id: id}).populate('products.product');
        return cart;
    }

    addProductToCart = async (cid, pid) => {
        let product = await this.productManager.getProductByid(pid);
        const cart = await this.getCartByID(cid);
        cart.products.push({product: product});
        await cart.save();
        return;
    }
}

