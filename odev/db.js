import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export default () => {
  mongoose.connect(process.env.MONGO_URI_ODEV);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

  mongoose.connection.on("open", () => console.log("mongoo connection"));
  mongoose.connection.on("err", (e) => console.log("mongoo not connection", e));
};
