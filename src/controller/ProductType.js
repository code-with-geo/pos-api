import { ProductTypeModel } from "../model/ProductType.js";
import dotenv from "dotenv";
dotenv.config();

export const addProductType = async (req, res) => {
  try {
    const { name, desc } = req.body;

    let producttype = await ProductTypeModel.findOne({ typeName: name });

    if (producttype) {
      return res.status(400).send({
        message: "Product type is already added.",
      });
    }

    producttype = await new ProductTypeModel({
      typeName: name,
      typeDescription: desc,
    }).save();

    return res.status(200).send({
      message: "Product type is successfully added.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};

export const updateProductType = async (req, res) => {
  try {
    const { id, name, desc } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        message: "Product type not found.",
      });
    }

    let producttype = await ProductTypeModel.findOne({ _id: id });

    if (!producttype) {
      return res.status(400).send({
        message: "Product type not found.",
      });
    }

    await ProductTypeModel.updateOne(
      { _id: id },
      {
        $set: {
          typeName: name,
          typeDescription: desc,
        },
      }
    );

    return res.status(200).send({
      message: "Product type successfully updated.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};

export const removeProductType = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        message: "Product type not found.",
      });
    }

    let producttype = await ProductTypeModel.findOne({ _id: id });

    if (!producttype) {
      return res.status(400).send({
        message: "Product type not found.",
      });
    }

    await ProductTypeModel.deleteOne({ _id: id });

    return res.status(200).send({
      message: "Product type successfully removed.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};
