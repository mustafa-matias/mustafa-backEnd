import { chatModel } from "./models/chat.model.js";

export default class ChatManager {

    getMessages = async () => {
        let messages = await chatModel.find().lean();
        return messages;
    }

    addMessage = async (message) => {
        let result = await chatModel.create(message);
        return result;
    }
}

