import ProductManager from "../persistencia/mongoDb/productManager.class.js";
const productManager = new ProductManager;

export const getProductsFilterService = async (limit, page, sort, filter = null, filterValue = null) => {

    if (!limit) limit = 10;
    
    if (!page) page = 1;

    if (!sort) sort = 0;
    
    let whereOptions = {};

    if (filter != "" && filterValue != "") {
        whereOptions = { [filter]: filterValue };
    }

    return await productManager.getProductsFilter(limit, page, sort, whereOptions);
}
