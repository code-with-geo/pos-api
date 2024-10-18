import { SubProductModel } from "../model/SubProduct.js";
import dotenv from "dotenv";
dotenv.config();

export const addSubProduct = async (req, res) => {
  try {
    const { sku, name, desc, price, units, productTypeID, mainProductID } =
      req.body;

    let subproduct = await SubProductModel.findOne({ subSKU: sku });

    if (subproduct) {
      return res.status(400).send({
        message: "Sub product is already added.",
      });
    }

    subproduct = await new SubProductModel({
      subSKU: sku,
      subName: name,
      subDescription: desc,
      subPrice: price,
      subUnits: units,
      subProductType: productTypeID,
      subMainProduct: mainProductID,
    }).save();

    return res.status(200).send({
      message: "Sub product is successfully added.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};

export const updateSubProduct = async (req, res) => {
  try {
    const { id, sku, name, desc, price, units, productTypeID, mainProductID } =
      req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        message: "Sub product not found.",
      });
    }

    let subproduct = await SubProductModel.findOne({ _id: id });

    if (!subproduct) {
      return res.status(400).send({
        message: "Sub product not found.",
      });
    }

    subproduct = await SubProductModel.findOne({ subSKU: sku });

    if (subproduct && subproduct._id.toString() !== id) {
      return res.status(400).send({
        message: "Sub product duplicate sku is not allowed.",
      });
    }

    await SubProductModel.updateOne(
      { _id: id },
      {
        $set: {
          subSKU: sku,
          subName: name,
          subDescription: desc,
          subPrice: price,
          subUnits: units,
          subProductType: productTypeID,
          subMainProduct: mainProductID,
        },
      }
    );

    return res.status(200).send({
      message: "Sub product successfully updated.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};

export const removeSubProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        message: "Sub product not found.",
      });
    }

    let subproduct = await SubProductModel.findOne({ _id: id });

    if (!subproduct) {
      return res.status(400).send({
        message: "Sub product not found.",
      });
    }

    await SubProductModel.deleteOne({ _id: id });

    return res.status(200).send({
      message: "Sub product successfully removed.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};

export const getAllSubProduct = async (req, res) => {
  try {
    const subproduct = await SubProductModel.find({}).populate([
      {
        path: "subProductType",
        select: "typeName", // Only include the departmentName field
      },
      {
        path: "subMainProduct",
        select: "productName", // Only include the departmentName field
      },
    ]);

    return res.status(200).send({
      subproduct: subproduct,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};

export const getSubProductByID = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        message: "Sub product not found.",
      });
    }

    const subproduct = await SubProductModel.find({ _id: id }).populate([
      {
        path: "subProductType",
        select: "typeName", // Only include the departmentName field
      },
      {
        path: "subMainProduct",
        select: "productName", // Only include the departmentName field
      },
    ]);

    return res.status(200).send({
      subproduct: subproduct,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};
