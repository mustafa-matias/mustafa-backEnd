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
    return cart;
  }

  async addProductToCartService(cid, pid) {
    try {
      const cart = await this.cartDao.getCartByID(cid);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const productFilter = await this.productServicie.getProductByidService(
        pid
      );
      if (!productFilter) {
        throw new Error("Producto no encontrado");
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
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProductFromCartService(cid, pid) {
    try {
      const cart = await this.cartDao.getCartByID(cid);
      if (!cart) {
        throw new Error("No se encontró carrito");
      }
      console.log(cart)
      const item = cart.products.find(
        (producto) => producto._id == pid
      );
      if (!item) {
        throw new Error("No se encontró el ID del producto que desea eliminar");
      }
      const indice = cart.products.indexOf(item);
      cart.products.splice(indice, 1);
      return await this.cartDao.deleteProductFromCart(cart);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteAllProductsFromCartService(cid) {
    try {
      const cart = await this.cartDao.getCartByID(cid);
      if (!cart) {
        throw new Error("No se encontro Carrito");
      }
      cart.products = [];
      return await this.cartDao.deleteAllProductsFromCart(cart);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async actualizarCarritoService(cid, newProducts) {
    try {
      const cart = await this.cartDao.getCartByID(cid);
      if (!cart) {
        throw new Error("No se encontro el Carrito a actualizar");
      }
      newProducts.forEach((newProduct) => {
        if (!newProduct.title) {
          throw new Error(
            `En el producto: ${newProduct._id} no se cargo el title`
          );
        }
        if (!newProduct._id) {
          throw new Error(
            `En el producto: ${newProduct.title} no se cargo el ID`
          );
        }
        if (!newProduct.description) {
          throw new Error(
            `En el producto: ${newProduct.title} no se cargo la descripcion`
          );
        }
        if (!newProduct.price) {
          throw new Error(
            `En el producto: ${newProduct.title} no se cargo el precio`
          );
        }
        if (!newProduct.thumbnail) {
          throw new Error(
            `En el producto: ${newProduct.title} no se cargo la imagen`
          );
        }
        if (!newProduct.code) {
          throw new Error(
            `En el producto: ${newProduct.title} no se cargo el codigo`
          );
        }
        if (!newProduct.category) {
          throw new Error(
            `En el producto: ${newProduct.title} no se cargo la categoria`
          );
        }
        if (!newProduct.stock) {
          throw new Error(
            `En el producto: ${newProduct.title} no se cargo el stock`
          );
        }
      });
      cart.products = [];
      newProducts.forEach((newProduct) => {
        cart.products.push({
          product: newProduct,
          quantity: 1,
          amount: newProduct.price,
        });
      });
      return await this.cartDao.actualizarCarrito(cart);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async actualizarCantidadProductoService(cid, productId, quantity) {
    try {
      const cart = await this.cartDao.getCartByID(cid);
      if (!cart) {
        throw new Error("No se encontro el Carrito a actualizar");
      }
      let productFind = cart.products.find((e) => e._id == productId);
      if (!productFind) {
        throw new Error("No se encontro el producto a actualizar");
      }
      productFind.quantity = quantity;
      productFind.amount =  productFind.quantity * productFind.product.price;
      return await this.cartDao.actualizarCantidadProducto(cart);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
