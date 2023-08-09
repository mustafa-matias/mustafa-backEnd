import CartDao from "../persistencia/mongoDb/cartManager.dao.js";
import ProductService from "./productManager.service.js";

export default class CartService {
    constructor() {
        this.cartDao = new CartDao();
        this.productServicie = new ProductService();
    }

    async getCartsService() {
        return await this.cartDao.getCarts();
    }

    async addCartService() {
        return await this.cartDao.addCart();
    }

    async getCartByIDService(id) {
        const cart = await this.cartDao.getCartByID(id);
        if (!cart) {
            return {
                error: 'id incorrecto'
            }
        }
        return await this.cartDao.getCarts(id);
    }

    async addProductToCartService(cid, pid) {
        const cart = await this.cartDao.getCartByID(cid);
        const product = await this.productServicie.getProductByidService(pid);
        if (!cart) {
            return {
                error: 'id cart incorrecto'
            }
        }
        if (!product) {
            return {
                error: 'id producto incorrecto'
            }
        }
        const item = cart.products.find(e => e.product._id.toString() == pid);
        if (item) {
            item.quantity += 1;
        } else {
            cart.products.push({ product: product, quantity: 1 });
        }
        return await this.cartDao.addProductToCart(cart);
    }

    async deleteProductFromCartService(cid, pid) {
        const cart = await this.cartDao.getCartByID(cid);
        const item = cart.products.find((producto) => producto.product._id == pid);

        if (!cart) {
            return {
                error: 'id cart incorrecto'
            }
        }
        if (!item) {
            return {
                error: 'no existe producto en el carrito'
            }
        }
        const indice = cart.products.indexOf(item);
        cart.products.splice(indice, 1);

        return await this.cartDao.deleteProductFromCart(cart);
    }

    async deleteAllProductsFromCartService(cid) {
        const cart = await this.cartDao.getCartByID(cid);
        if (!cart) {
            return {
                error: 'id cart incorrecto'
            }
        }
        cart.products = [];
        return await this.cartDao.deleteAllProductsFromCart(cart);
    }

    async actualizarCarritoService(cid, newProducts) {
        const cart = await this.cartDao.getCartByID(cid);
        if (!cart) {
            return {
                error: 'id cart incorrecto'
            }
        }
        cart.products = [];
        newProducts.forEach(product => {
            cart.products.push({ product: product });
        });

        return await this.cartDao.actualizarCarrito(cart);
    }

    async actualizarCantidadProductoService(cid, productId, quantity) {
        const cart = await this.cartDao.getCartByID(cid);
        if (!cart) {
            return {
                error: 'id cart incorrecto'
            }
        }
        let product = cart.products.find(e => e._id.toString() == productId);
        product.quantity = quantity

        return await this.cartDao.actualizarCantidadProducto(cart);
    }
}
