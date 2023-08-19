import ProductService from "../servicio/productManager.service.js";

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
      return {
        error: "Debe completar todos los campos",
      };
    }
    return await this.productService.addProductService(product);
  }

  async getProductByidController(id) {
    if (!id) {
      return {
        error: "id vacio",
      };
    }
    return await this.productService.getProductByidService(id);
  }

  async deleteProductByidController(id) {
    if (!id) {
      return {
        error: "producto vacio",
      };
    }
    return await this.productService.deleteProductByidService(id);
  }

  async updateProductController(id, update) {
    if (!id || !update) {
      return {
        error: "Error al actualizar",
      };
    }
    return await this.productService.updateProductService(id, update);
  }
}
