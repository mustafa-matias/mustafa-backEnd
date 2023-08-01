import { productsModel } from "./models/products.model.js";

export default class ProductManager {

    getProducts = async () => {
        let products = await productsModel.find().lean();
        return products;
    }

    getProductsFilter = async (limit, page, sort, whereOptions) => {
        let products = await productsModel.paginate(whereOptions, {
            limit, page, sort: { price: sort },
        });
        return products;
    }

    addProduct = async (product) => {
        let result = await productsModel.create(product);
        return result;
    }

    getProductByid = async (id) => {
        const product = await productsModel.findOne({ _id: id });
        return product;
    }

    deleteProductByid = async (id) => {
        let product = await productsModel.deleteOne({ _id: id });
        return product;
    }

    updateProduct = async (id, update) => {
        let product = await productsModel.updateOne({ _id: id }, { $set: update });
        return product;
    }
}