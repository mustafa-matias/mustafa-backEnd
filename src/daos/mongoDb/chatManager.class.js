import mongoose from "mongoose";
import { chatModel } from "./models/chat.model.js";

export default class ChatManager {
    connection = mongoose.connect('mongodb+srv://mustafa-matias:8XjhYJrr7ajSjjg2@cluster0.3l5b4gw.mongodb.net/?retryWrites=true&w=majority');

    getMessages = async () => {
        let messages = await chatModel.find().lean();
        return messages;
    }

    addMessage = async (message) => {
        let result = await chatModel.create(message);
        return result;
    }
}

