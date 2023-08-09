import { productsModel } from "./models/products.model.js";

export default class ProductDao {

    async getProducts() {
        let products = await productsModel.find().lean();
        return products;
    }

    async getProductsFilter(limit, page, sort, whereOptions) {
        let products = await productsModel.paginate(whereOptions, {
            limit, page, sort: { price: sort },
        });
        return products;
    }

    async addProduct(product) {
        let result = await productsModel.create(product);
        return result;
    }

    async getProductByid(id) {
        const product = await productsModel.findOne({ _id: id });
        return product;
    }

    async deleteProductByid(id) {
        let product = await productsModel.deleteOne({ _id: id });
        return product;
    }

    async updateProduct(id, update) {
        let product = await productsModel.updateOne({ _id: id }, { $set: update });
        return product;
    }
}