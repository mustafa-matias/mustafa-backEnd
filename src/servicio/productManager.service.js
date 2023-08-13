import ProductDao from "../persistencia/mongoDb/productManager.dao.js";

export default class ProductService {
    constructor() {
        this.productDao = new ProductDao();
    }
    async getProductsService() {
        return await this.productDao.getProducts();
    }

    async getProductsFilterService(limit, page, sort, filter = null, filterValue = null) {
        if (!limit) limit = 10;
        if (!page) page = 1;
        if (!sort) sort = 0;
        let whereOptions = {};

        if (filter != "" && filterValue != "") {
            whereOptions = { [filter]: filterValue };
        }
        return await this.productDao.getProductsFilter(limit, page, sort, whereOptions);
    }

    async addProductService(product) {
        let products = await this.productDao.getProducts();
        const aux = await products.find((e) => e.code == product.code);
        if (aux) {
            return {
                error: 'El codigo ya existe'
            }
        }
        return await this.productDao.addProduct(product);;
    }

    async getProductByidService(id) {
        const product = await this.productDao.getProductByid(id);
        if (!product) {
            return {
                error: 'id incorrecto'
            }
        }
        return await this.productDao.getProductByid(id);
    }

    async deleteProductByidService(id) {
        const product = await this.productDao.getProductByid(id);
        if (!product) {
            return {
                error: 'id incorrecto'
            }
        }
        return await this.productDao.deleteProductByid(id);;
    }

    async updateProductService(id, update) {
        const product = await this.productDao.getProductByid(id);
        if (!product) {
            return {
                error: 'id incorrecto'
            }
        }
        return await this.productDao.updateProduct(id, update);;
    }
}

