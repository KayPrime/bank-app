import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to DB successfully");
  } catch (err) {
    console.log(err);
  }
}

export { connectDB };
