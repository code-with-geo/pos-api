import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import { UserRouter } from "./src/routes/Users.js";
import { ProductRouter } from "./src/routes/Product.js";
import { ProductTypeRouter } from "./src/routes/ProductType.js";
import { SubProductRouter } from "./src/routes/SubProduct.js";
import { OrderRouter } from "./src/routes/Orders.js";

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use("/users", UserRouter);
app.use("/products", ProductRouter);
app.use("/orders", OrderRouter);
app.use("/product-types", ProductTypeRouter);
app.use("/sub-products", SubProductRouter);
mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port: " + process.env.PORT);
});
