import mongoose from "mongoose";

const collection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity:{
                    type: Number,
                    // required: true,
                }
                ,
            },
        ],
    },
});

export const cartModel = mongoose.model(collection, cartSchema);