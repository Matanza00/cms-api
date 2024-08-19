import mongoose from "mongoose";

const DB_URI: string | undefined =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.LOCAL_MONGO_URI;

const connectDb = async () => {
  try {
    if (!DB_URI) {
      throw new Error("MongoDB URI is not defined.");
    }

    await mongoose.connect(DB_URI);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log("DB_ERROR", error);
    process.exit(1);
  }
};

export default connectDb;
