import { chatModel } from "./models/chat.model.js";

export default class ChatDao {
  getMessages = async () => {
    let messages = await chatModel.find().lean();
    return messages;
  };

  addMessage = async (message) => {
    let result = await chatModel.create(message);
    return result;
  };
}
