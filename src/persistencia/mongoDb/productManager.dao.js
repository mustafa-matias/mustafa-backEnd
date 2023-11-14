import { productsModel } from "./models/products.model.js";
import Mail from "../../helpers/mail.js";
const mail = new Mail();

export default class ProductDao {
  async getProducts() {
    let products = await productsModel.find().lean();
    return products;
  }

  async getProductsFilter(limit, page, sort, whereOptions) {
    try {
      let products = await productsModel.paginate(whereOptions, {
        limit,
        page,
        sort: { price: sort },
      });
      if (!products) {
        throw new Error("Error al obtener los productos en la base de datos");
      }
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addProduct(product) {
    try {
      let result = await productsModel.create(product);
      if (!result) {
        throw new Error("Error al crear producto en base de datos");
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductByid(id) {
    try {
      const product = await productsModel.findOne({ _id: id });
      if (!product) {
        throw new Error("No se encontro el producto en la base de datos");
      }
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProductByid(id, product) {
    try {
      let result = await productsModel.deleteOne({ _id: id });
      if (!result) {
        throw new Error("No se pudo eliminar el producto de la base de datos");
      }
      if (product.owner != "admin") {
        mail.sendDeleteProduct(
          "Producto eliminado", product.owner,
          product
        );
      }
      return;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id, update) {
    try {
      let product = await productsModel.updateOne(
        { _id: id },
        { $set: update }
      );
      if (!product) {
        throw new Error("No se pudo actualizar producto en la base de datos");
      }
      return update;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
