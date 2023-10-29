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
        error: "id incorrecto",
      };
    }
    return await this.cartDao.getCartByID(id);
  }

  async addProductToCartService(cid, pid) {
    const cart = await this.cartDao.getCartByID(cid);
    const productFilter = await this.productServicie.getProductByidService(pid);
    if (!cart) {
      return {
        error: "id cart incorrecto",
      };
    }
    if (!productFilter) {
      return {
        error: "id producto incorrecto",
      };
    }
    const item = cart.products.find(
      (e) => e.product._id.toString() == productFilter._id
    );
    if (item) {
      item.quantity += 1;
      item.amount += productFilter.price;
    } else {
      cart.products.push({
        product: productFilter,
        quantity: 1,
        amount: productFilter.price,
      });
    }

    return await this.cartDao.addProductToCart(cart);
  }

  async deleteProductFromCartService(cid, pid) {
    const cart = await this.cartDao.getCartByID(cid);
    const item = cart.products.find((producto) => producto.product._id == pid);

    if (!cart) {
      return {
        error: "id cart incorrecto",
      };
    }
    if (!item) {
      return {
        error: "no existe producto en el carrito",
      };
    }
    const indice = cart.products.indexOf(item);
    cart.products.splice(indice, 1);

    return await this.cartDao.deleteProductFromCart(cart);
  }

  async deleteAllProductsFromCartService(cid) {
    const cart = await this.cartDao.getCartByID(cid);
    if (!cart) {
      return {
        error: "id cart incorrecto",
      };
    }
    cart.products = [];
    return await this.cartDao.deleteAllProductsFromCart(cart);
  }

  async actualizarCarritoService(cid, newProducts) {
    console.log(newProducts);
    const cart = await this.cartDao.getCartByID(cid);
    if (!cart) {
      return {
        error: "id cart incorrecto",
      };
    }
    cart.products = [];
    newProducts.forEach((newProduct) => {
      cart.products.push({
        product: newProduct,
        quantity: 1,
        amount: newProduct.price,
      });
    });
    return await this.cartDao.actualizarCarrito(cart);
  }

  async actualizarCantidadProductoService(cid, productId, quantity) {
    const cart = await this.cartDao.getCartByID(cid);
    if (!cart) {
      return {
        error: "id cart incorrecto",
      };
    }
    let product = cart.products.find((e) => e._id == productId);
    product.quantity = quantity;
    return await this.cartDao.actualizarCantidadProducto(cart);
  }
}
