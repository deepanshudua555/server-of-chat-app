import mongoose from "mongoose";

export const connectDatabse = async () => {
  try {
    console.log("connecting DataBase");
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connect: ${connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
