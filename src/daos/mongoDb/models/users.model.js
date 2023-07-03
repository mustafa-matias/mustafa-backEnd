import mongoose from 'mongoose'

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
    }
})

const userModel = mongoose.model(collection, userSchema);

export default userModel;