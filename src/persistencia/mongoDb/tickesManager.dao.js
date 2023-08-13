import { ticketsModel } from "./models/tickets.model.js";

export default class TicketsDao {
    async addTicket(ticket) {
        let result = await ticketsModel.create(ticket);
        return result;
    }
}