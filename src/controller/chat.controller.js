import ChatService from "../servicio/chat.service.js";

export default class ChatController {
  constructor() {
    this.chatService = new ChatService();
  }

  async getMessagesController() {
    return await this.chatService.getMessagesService();
  }

  async addMessageController(message) {
    if (!message) {
      return {
        error: "mensaje vacio",
      };
    }
    return await this.chatService.addMessageService(message);
  }
}
