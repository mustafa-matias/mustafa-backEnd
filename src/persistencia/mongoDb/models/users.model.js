import mongoose, { Schema } from 'mongoose'

const collection = 'users';

const userSchema = new mongoose.Schema({
    firtName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "cart"
    }
})

const userModel = mongoose.model(collection, userSchema);

export default userModel;