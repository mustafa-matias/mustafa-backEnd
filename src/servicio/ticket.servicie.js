import TicketsDao from "../persistencia/mongoDb/tickesManager.dao.js";
import { cartModel } from "../persistencia/mongoDb/models/carts.model.js";
import ProductController from "../controller/product.controller.js";
import CartController from "../controller/cart.controller.js";

export default class TicketService {
    constructor() {
        this.ticketsDao = new TicketsDao();
        this.productController = new ProductController();
        this.cartController = new CartController();
    }

    async addTicketService(id, email) {
        let cart = await cartModel.findOne({ _id: id })
        const products = await this.productController.getProductsController();

        let newCart = [];
        let productsTickets = [];
        let amount = 0;

        cart.products.forEach(item => {
            const productBaseDatos = products.find(producto => producto._id.toString() == item.product.toString())
            const quantityCart = item.quantity;
            const stockProcuct = productBaseDatos.stock;

            if (quantityCart <= stockProcuct) {
                productsTickets.push(productBaseDatos);
                this.productController.updateProductController(productBaseDatos._id.toString(), { stock: (productBaseDatos.stock - quantityCart) })
                amount = amount + (quantityCart * productBaseDatos.price)
            } else {
                newCart.push(productBaseDatos);
            }
        });

        await this.cartController.deleteAllProductsFromCartController(id);
        newCart.forEach(item => {
            this.cartController.addProductToCartController(id, item._id);
        })
        cart.save();
        if (!productsTickets.length) {
            return {
                status: 'No se genero tickets, ya que no hay productos en stock'
            }
        }
        const ticket = { products: productsTickets, amount: amount, purchaser: email }
        return await this.ticketsDao.addTicket(ticket);
    }
}