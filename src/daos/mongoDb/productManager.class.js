import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

export default class ProductManager {
    connection = mongoose.connect('mongodb+srv://mustafa-matias:8XjhYJrr7ajSjjg2@cluster0.3l5b4gw.mongodb.net/?retryWrites=true&w=majority');

    getProducts = async () => {
        let products = await productsModel.find().lean();
        return products;
    }

    addProduct = async (product) => {
        let result = await productsModel.create(product);
        return result;
    }

    getProductByid = async (id) => {
        try {
            let product = await productsModel.findOne({ _id: id });
            return product;
        } catch (error) {
            console.log(`No se encontró el ${id} requerido`);
        }
    }

    deleteProductByid = async (id) => {
        try {
            let product = await productsModel.deleteOne({ _id: id });
            return product;
        } catch (error) {
            console.log(`No se encontró el ${id} requerido para ser eliminado`);
        }
    }

    updateProduct = async (id, update) => {
        try {
            let product = await productsModel.updateOne({ _id: id }, { $set: update });
            return product;
        } catch (error) {
            console.log(`No se encontró el ${id} requerido para ser actualizado`);
        }
    }
}

