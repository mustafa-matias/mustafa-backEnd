import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  owner:{
    type: String,
    default: "admin"
  }
});

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(collection, productsSchema);
