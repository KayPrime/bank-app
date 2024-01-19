import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./database/db.js";
import { userRouter } from "./routes/userRouter.js";

const port = process.env.PORT || 8080;
const app = express();
const apiVersion = "/api/v1";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(apiVersion, userRouter);

(async function () {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`app is listening on port: ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
})();

export { apiVersion };
