import { cartModel } from "./models/carts.model.js";
import ProductDao from "./productManager.dao.js";

export default class CartDao {
  productDao = new ProductDao();

  getCarts = async () => {
    const carts = await cartModel.find();
    return carts;
  };

  addCart = async () => {
    const cart = await cartModel.create({ products: [] });
    return cart;
  };

  getCartByID = async (id) => {
    const cart = await cartModel
      .findOne({ _id: id })
      .populate("products.product");
    return cart;
  };

  addProductToCart = async (cart) => {
    await cart.save();
    return;
  };
  async deleteProductFromCart(cart) {
    await cart.save();
    return;
  }
  async deleteAllProductsFromCart(cart) {
    await cart.save();
    return;
  }

  actualizarCarrito = async (cart) => {
    await cart.save();
    return;
  };

  actualizarCantidadProducto = async (cart) => {
    cart.save();
    return;
  };
}
