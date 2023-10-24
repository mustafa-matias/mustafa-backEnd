import CartService from "../servicio/cart.service.js";

export default class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  async getCartsController() {
    return await this.cartService.getCartsService();
  }

  async addCartController() {
    return await this.cartService.addCartService();
  }

  async getCartByIDController(id) {
    if (!id) {
      return {
        error: "id vacio",
      };
    }
    return await this.cartService.getCartByIDService(id);
  }

  async addProductToCartController(cid, pid) {
    if (!cid || !pid) {
      return {
        error: "datos incompletos",
      };
    }

    return await this.cartService.addProductToCartService(cid, pid);
  }
  async deleteProductFromCartController(cid, pid) {
    if (!cid) {
      return {
        error: "id vacio",
      };
    }
    return await this.cartService.deleteProductFromCartService(cid, pid);
  }
  async deleteAllProductsFromCartController(cid) {
    if (!cid) {
      return {
        error: "id vacio",
      };
    }
    return await this.cartService.deleteAllProductsFromCartService(cid);
  }

  async actualizarCarritoController(cid, newProducts) {
    if (!cid || !newProducts) {
      return {
        error: "datos incompletos",
      };
    }
    return await this.cartService.actualizarCarritoService(cid, newProducts);
  }

  async actualizarCantidadProductoController(cartId, productId, quantity) {
    if (!cartId || !productId) {
      return {
        error: "datos incompletos ID",
      };
    }
    if (!quantity) {
      return {
        error: "quantity vacia",
      };
    }
    return await this.cartService.actualizarCantidadProductoService(
      cartId,
      productId,
      quantity
    );
  }
}
