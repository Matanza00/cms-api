import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface productInterface extends Document {
  name: string;
  description: string;
  images: [string];
  imageName: string;
  price: number;
  category: ObjectId;
}

const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product must have a name"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product must have a description"],
      trim: true,
    },
    images: [
      {
        imageName: String,
        imageUrl: String,
      },
    ],
    price: {
      type: Number,
      required: [true, "Product must have a price"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

const productRepository = mongoose.model<productInterface>(
  "Product",
  productSchema
);

export default productRepository;
