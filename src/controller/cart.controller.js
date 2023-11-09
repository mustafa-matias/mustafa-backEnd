import CartService from "../servicio/cart.service.js";
import mongoose from "mongoose";
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
      throw new Error("ID vacío");
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID no valido invalido");
    }
    try {
      return await this.cartService.getCartByIDService(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addProductToCartController(cid, pid) {
    if (!pid) {
      throw new Error("ID Producto vacío");
    }
    if (!cid) {
      throw new Error("ID Carrito vacío");
    }
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      throw new Error("ID carrito invalido");
    }
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      throw new Error("ID producto invalido");
    }
    return await this.cartService.addProductToCartService(cid, pid);
  }

  async deleteProductFromCartController(cid, pid) {
    if (!cid) {
      throw new Error("ID Carrito vacío");
    }
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      throw new Error("ID Carrito invalido");
    }
    if (!pid) {
      throw new Error("ID producto vacío");
    }
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      throw new Error("ID producto invalido");
    }
    return await this.cartService.deleteProductFromCartService(cid, pid);
  }

  async deleteAllProductsFromCartController(cid) {
    if (!cid) {
      throw new Error("ID Carrito vacío");
    }
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      throw new Error("ID Carrito invalido");
    }
    return await this.cartService.deleteAllProductsFromCartService(cid);
  }

  async actualizarCarritoController(cid, newProducts) {
    if (!cid) {
      throw new Error("ID Carrito vacío");
    }
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      throw new Error("ID Carrito invalido");
    }
    if (!newProducts) {
      throw new Error(
        "No se cargaron correctamente los productos a actualizar"
      );
    }
    return await this.cartService.actualizarCarritoService(cid, newProducts);
  }

  async actualizarCantidadProductoController(cartId, productId, quantity) {
    try {
      if (!cartId) {
        throw new Error("ID Carrito vacío");
      }
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error("ID Carrito invalido");
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("ID producto invalido");
      }
      if (!quantity) {
        throw new Error("No se cargo correctamente la cantidad a actualizar");
      }
      return await this.cartService.actualizarCantidadProductoService(
        cartId,
        productId,
        quantity
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
