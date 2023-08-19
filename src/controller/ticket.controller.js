import TicketService from "../servicio/ticket.servicie.js";

export default class TicketController {
  constructor() {
    this.ticketService = new TicketService();
  }
  async addTicketController(id, email) {
    if (!id) {
      return {
        error: "id vacio",
      };
    }
    if (!email) {
      return {
        error: "email vacio",
      };
    }

    return await this.ticketService.addTicketService(id, email);
  }
}
