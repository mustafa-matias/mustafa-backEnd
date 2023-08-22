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
    let cart;
    try {
      cart = await cartModel.findOne({ _id: id });
    } catch (cartError) {
      console.error("Error find cart:", cartError);
      return { error: "Error find cart" };
    }

    let products;
    try {
      products = await this.productService.getProductsService();
    } catch (productsError) {
      console.error("Error find products:", productsError);
      return { error: "Error find products" };
    }

    let newCart = [];
    let productsTickets = [];
    let amount = 0;

    for (const item of cart.products) {
      const productBaseDatos = products.find(
        (producto) => producto._id.toString() == item.product.toString()
      );
      const quantityCart = item.quantity;
      const stockProcuct = productBaseDatos.stock;

      try {
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
      } catch (updateError) {
        console.error("Error updating product:", updateError);
        return { error: "Error updating product" };
      }
    }

    try {
      await this.cartService.deleteAllProductsFromCartService(id);
    } catch (deleteError) {
      console.error("Error delete Products:", deleteError);
      return { error: "Error delete products" };
    }

    try {
      for (const item of newCart) {
        await this.cartService.addProductToCartService(id, item._id);
      }
    } catch (addProductToCartServiceError) {
      console.error(
        "Error add product to Cart Service:",
        addProductToCartServiceError
      );
      return { error: "Error add product to Cart Service" };
    }

    cart.save();

    if (!productsTickets.length) {
      return {
        status: "No se genero tickets, ya que no hay productos en stock",
        ProductosNoProcesados: newCart.map((item) => item._id),
      };
    }
    if (productsTickets.length > 0 && newCart.length > 0) {
      const ticket = {
        products: productsTickets,
        amount: amount,
        purchaser: email,
      };
      try {
        await this.ticketsDao.addTicket(ticket);
      } catch (addTicketError) {
        console.error("Add Ticket Error:", addTicketError);
        return { error: "Add Ticket Error" };
      }
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
      try {
        await this.ticketsDao.addTicket(ticket);
      } catch (addTicketError) {
        console.error("Add Ticket Error:", addTicketError);
        return { error: "Add Ticket Error" };
      }
      return {
        status: "Se procesaron todos los productos con éxito",
        ProductosProcesados: productsTickets.map((item) => item._id),
      };
    }
  }
}
