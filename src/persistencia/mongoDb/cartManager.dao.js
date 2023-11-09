import { cartModel } from "./models/carts.model.js";
import ProductDao from "./productManager.dao.js";

export default class CartDao {
  productDao = new ProductDao();

  getCarts = async () => {
    try {
      const carts = await cartModel.find();
      if (!carts) {
        throw new Error(
          "No conecto con la base de datos al buscar todos los carritos"
        );
      }
      return carts;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addCart = async () => {
    try {
      const cart = await cartModel.create({ products: [] });
      if (!cart) {
        throw new Error(
          "No conecto con la base de datos al agregar un carrito nuevo"
        );
      }
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getCartByID = async (id) => {
    try {
      const cart = await cartModel
        .findOne({ _id: id })
        .populate("products.product");
      if (!cart) {
        throw new Error(
          `Carrito ID: ${id} no encontrado`
        );
      }
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addProductToCart = async (cart) => {
    try {
      const result = await cart.save();
      return result;
    } catch (error) {
      throw new Error(
        "Error al guardar en base de datos"
      );
    }
  };

  async deleteProductFromCart(cart) {
    try {
      return await cart.save();
    } catch (error) {
      throw new Error(
        "Error al guardar en base de datos"
      );
    }
  }
  async deleteAllProductsFromCart(cart) {
    try {
      const result = await cart.save();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  actualizarCarrito = async (cart) => {
    try {
      const result = await cart.save();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  actualizarCantidadProducto = async (cart) => {
    try {
      const result = await cart.save();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
