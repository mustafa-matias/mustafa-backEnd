import mongoose from "mongoose";

const collection = 'messages';

const chatSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

export const chatModel = mongoose.model(collection, chatSchema);