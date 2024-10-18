import { ProductModel } from "../model/Products.js";
import dotenv from "dotenv";
dotenv.config();

export const addProduct = async (req, res) => {
  try {
    const { productName, productDescription, productPrice } = req.body;

    let product = await ProductModel.findOne({ productName });

    if (product) {
      return res.status(400).send({
        message: "Product is already added to storage.",
      });
    }

    product = await new ProductModel({
      productName,
      productDescription,
      productPrice,
    }).save();

    return res.status(200).send({
      message: "Product successfully added to storage.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};
