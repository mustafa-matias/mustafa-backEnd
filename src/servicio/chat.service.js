import ChatDao from "../persistencia/mongoDb/chatManager.dao.js";

export default class ChatService {
  constructor() {
    this.chatDao = new ChatDao();
  }
  getMessagesService = async () => {
    return await this.chatDao.getMessages();
  };

  addMessageService = async (message) => {
    return await this.chatDao.addMessage(message);
  };
}
