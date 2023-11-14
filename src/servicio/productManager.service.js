import ProductDao from "../persistencia/mongoDb/productManager.dao.js";

export default class ProductService {
  constructor() {
    this.productDao = new ProductDao();
  }
  async getProductsService() {
    return await this.productDao.getProducts();
  }

  async getProductsFilterService(
    limit,
    page,
    sort,
    filter = null,
    filterValue = null
  ) {
    if (!limit) limit = 10;
    if (!page) page = 1;
    if (!sort) sort = 0;
    let whereOptions = {};

    if (filter != "" && filterValue != "") {
      whereOptions = { [filter]: filterValue };
    }
    return await this.productDao.getProductsFilter(
      limit,
      page,
      sort,
      whereOptions
    );
  }

  async addProductService(product) {
    try {
      let products = await this.productDao.getProducts();
      const aux = products.find((e) => e.code == product.code);
      if (aux) {
        throw new Error("El código del producto que quiere cargar ya existe");
      }
      return await this.productDao.addProduct(product);
    } catch (error) {
      throw error;
    }
  }

  async getProductByidService(id) {
    try{
    const product = await this.productDao.getProductByid(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return await this.productDao.getProductByid(id);
  }catch(error){
    throw new Error(error.message);
  }
}
  async deleteProductByidService(id) {
    try {
      const product = await this.productDao.getProductByid(id);
      if (!product) {
        throw new Error("No se encontro el producto a eliminar");
      }
      return await this.productDao.deleteProductByid(id, product);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProductService(id, update) {
    try {
      const product = await this.productDao.getProductByid(id);
      if (!product) {
        throw new Error("No se encontro el producto a actualizar");
      }
      return await this.productDao.updateProduct(id, update);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
