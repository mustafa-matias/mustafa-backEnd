import ProductService from "../servicio/productManager.service.js";
import mongoose from "mongoose";
import CustomError from "../servicio/error/customError.class.js";
import { ErrorEnum } from "../servicio/enum/error.enum.js";
export default class ProductController {
  constructor() {
    this.productService = new ProductService();
  }
  async getProductsController() {
    return await this.productService.getProductsService();
  }

  async getProductsFilterController(limit, page, sort, whereOptions) {
    return await this.productService.getProductsFilterService(
      limit,
      page,
      sort,
      whereOptions
    );
  }

  async addProductController(product) {
    try {
      const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      } = product;
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !status ||
        !category
      ) {
        throw new Error(
          "No se completaron todos los campos para cargar el producto"
        );
      }
      return await this.productService.addProductService(product);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductByidController(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw CustomError.createError({
          name: "ID invalido",
          cause: `Id invalido por Mongo: ${id}`,
          message: "Id invalido por Mongo",
          code: ErrorEnum.PARAM_ERROR,
        });
      }
      return await this.productService.getProductByidService(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProductByidController(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw CustomError.createError({
          name: "ID invalido",
          cause: `Id invalido por Mongo: ${id}`,
          message: "Id invalido por Mongo",
          code: ErrorEnum.PARAM_ERROR,
        });
      }
      return await this.productService.deleteProductByidService(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProductController(id, update) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw CustomError.createError({
          name: "ID invalido",
          cause: `Id invalido por Mongo: ${id}`,
          message: "Id invalido por Mongo",
          code: ErrorEnum.PARAM_ERROR,
        });
      }
      if (!update) {
        throw new Error(
          "No se completaron los datos a actualizar del producto"
        );
      }
      return await this.productService.updateProductService(id, update);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
