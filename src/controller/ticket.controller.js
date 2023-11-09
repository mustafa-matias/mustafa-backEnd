import TicketService from "../servicio/ticket.servicie.js";
import mongoose from "mongoose";

export default class TicketController {
  constructor() {
    this.ticketService = new TicketService();
  }
  async addTicketController(id, email) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID no valido invalido");
      }
      const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
      if (!emailRegex.test(email)) {
        throw new Error("Formato de e-mail invalido");
      }
      return await this.ticketService.addTicketService(id, email);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
