import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface categoryInterface extends Document {
  name: string;
  parentCategory: ObjectId;
  description: string;
  subCategories: [ObjectId];
}

const categorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name must be required"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Category must have a description"],
      trim: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

const categoryRepository = mongoose.model<categoryInterface>(
  "Category",
  categorySchema
);

export default categoryRepository;
