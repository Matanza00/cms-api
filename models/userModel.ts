import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

// Define interface for the schema
export interface IInquiryForm extends Document {
  name: string;
  email: string;
  tel: string;
  eventDate: Date;
  eventName: string;
  otherEventName?: string;
  shippingOption: string;
  quantityAndOrders: number;
  role: string;
  password: string;
  encryptedPassword?: string;
  keyHex?: string;
  ivHex?: string;
  // Define methods
  isCorrectPassword(password: string, hashedPassword: string): Promise<boolean>;
}

// Define the mongoose schema
const InquiryFormSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name can't be empty"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      index: true,
      validate: [
        validator.isEmail,
        "Invalid email! Please enter a valid email",
      ],
    },
    tel: {
      type: String,
      required: [true, "Phone number must be required"],
    },
    eventDate: { type: Date, required: [true, "Please enter event date"] },
    eventName: { type: String, required: [true, "Please enter event name"] },
    otherEventName: { type: String },
    shippingOption: {
      type: String,
      required: [
        true,
        "Please select one of the options either Local Customer or Ship Flowers",
      ],
    },
    quantityAndOrders: {
      type: Number,
      required: [true, "Quantity must be required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    encryptedPassword: { type: String },
    keyHex: { type: String },
    ivHex: { type: String },
  },
  { timestamps: true }
);

// PASSWORD COMPARING FUNCTION
InquiryFormSchema.methods.isCorrectPassword = async function (
  password: string,
  hashedPassword: string
) {
  return await bcrypt.compare(password, hashedPassword);
};

// HASHING PASSWORD MIDDLEWARE
InquiryFormSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const password = this.password as string;

  this.password = await bcrypt.hash(password, 12);
  next();
});

const UserRepository = mongoose.model<IInquiryForm>("User", InquiryFormSchema);

export default UserRepository;
