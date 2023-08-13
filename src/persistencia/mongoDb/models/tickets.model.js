import mongoose from "mongoose";

const collection = 'tickets';
import { v4 as uuidv4 } from 'uuid';
import moment from "moment-timezone";

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    },
    purchase_datatime: {
        type: String,
        default: () => moment().tz('America/Argentina/Buenos_Aires').format('DD-MM-YYYY HH:mm:ss'),
        required: true
    },
    products: {
        type: Array,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})

export const ticketsModel = mongoose.model(collection, ticketsSchema);