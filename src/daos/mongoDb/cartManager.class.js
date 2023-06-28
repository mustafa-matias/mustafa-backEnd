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
        const item = cart.products.find(e=>e.product._id.toString() == pid);
        if(item){
            item.quantity += 1;
        }else{
            cart.products.push({product: product,quantity: 1});
        }
        await cart.save();
        return;
    }
    async deleteProductFromCart(cid, pid) {
        const cart = await this.getCartByID(cid);
        cart.products.pull(pid);
        await cart.save();
        return;
    }
    async deleteAllProductsFromCart(cid) {
        const cart = await this.getCartByID(cid);
        cart.products = [];
        await cart.save();
        return;
    }

    actualizarCarrito = async (cid, newProducts) => {
        let cart = await this.getCartByID(cid);
        cart.products = [];

        newProducts.forEach(product => {
            cart.products.push({ product: product });
        });

        await cart.save();
        return;
    }

    actualizarCarrito = async (cid, newProducts) => {
        let cart = await this.getCartByID(cid);
        cart.products = [];

        newProducts.forEach(product => {
            cart.products.push({ product: product });
        });

        await cart.save();
        return;
    }

    actualizarCantidadProducto = async (cartId, productId, quantity)=>{
        let cart = await this.getCartByID(cartId);

        if(cart){
            let product = cart.products.find(e => e._id.toString() == productId);
            product.quantity = quantity
        }

        cart.save();
        return
    }

}