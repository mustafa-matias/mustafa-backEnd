import TicketsDao from "../persistencia/mongoDb/tickesManager.dao.js";
import { cartModel } from "../persistencia/mongoDb/models/carts.model.js";
import CartService from "./cart.service.js";
import ProductService from "./productManager.service.js";
export default class TicketService {
  constructor() {
    this.ticketsDao = new TicketsDao();
    this.productService = new ProductService();
    this.cartService = new CartService();
  }

  async addTicketService(id, email) {
    try {
      const cart = await cartModel.findOne({ _id: id });
      if (!cart) {
        throw new Error("No se encontro el carrito");
      }
      const products = await this.productService.getProductsService();
      if (!products) {
        throw new Error("No se encontron los productos en la base de datos");
      }

      let newCart = [];
      let productsTickets = [];
      let amount = 0;

      if (!cart.products.length) {
        throw new Error(
          "No hay productos en el carrito para procesar la compra"
        );
      }

      for (const item of cart.products) {
        const productBaseDatos = products.find(
          (producto) => producto._id.toString() == item.product.toString()
        );
        const quantityCart = item.quantity;
        const stockProcuct = productBaseDatos.stock;

        if (quantityCart <= stockProcuct) {
          productsTickets.push(productBaseDatos);
          await this.productService.updateProductService(
            productBaseDatos._id.toString(),
            { stock: productBaseDatos.stock - quantityCart }
          );
          amount = amount + quantityCart * productBaseDatos.price;
        } else {
          newCart.push(productBaseDatos);
        }
      }

      if (!productsTickets.length) {
        throw new Error(
          "Error al procesar la compra: los productos no tienen Stock"
        );
      }
      await this.cartService.deleteAllProductsFromCartService(id);

      for (const item of newCart) {
        await this.cartService.addProductToCartService(id, item._id);
      }

      cart.save();

      if (productsTickets.length > 0 && newCart.length > 0) {
        const ticket = {
          products: productsTickets,
          amount: amount,
          purchaser: email,
        };
        await this.ticketsDao.addTicket(ticket);
        return {
          status: "Se generó Tickets",
          ProductosProcesados: productsTickets.map((item) => item._id),
          ProductosNoProcesados: newCart.map((item) => item._id),
        };
      }
      if (!newCart.length) {
        const ticket = {
          products: productsTickets,
          amount: amount,
          purchaser: email,
        };
      await this.ticketsDao.addTicket(ticket);
      return {
        status: "Se procesaron todos los productos con éxito",
        ProductosProcesados: productsTickets.map((item) => item._id),
      };
    }} catch (error) {
      throw new Error(error.message);
    }
  }
}
