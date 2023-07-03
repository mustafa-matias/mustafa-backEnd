import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

export default class ProductManager {

    getProducts = async () => {
        let products = await productsModel.find().lean();
        return products;
    }

    getProductsFilter = async (limit, page, sort, filter = null, filterValue = null) => {

        let whereOptions = {};

        if (filter != "" && filterValue != "") {
            whereOptions = { [filter]: filterValue };
        }

        let products = await productsModel.paginate(whereOptions, {
            limit: limit, page: page, sort: { price: sort },
        });

        return products;
    }


    addProduct = async (product) => {
        let result = await productsModel.create(product);
        return result;
    }

    getProductByid = async (id) => {
        try {
            const product = await productsModel.findOne({ _id: id });
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

