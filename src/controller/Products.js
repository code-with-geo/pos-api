import { ProductModel } from "../model/Products.js";
import dotenv from "dotenv";
dotenv.config();
import { storage } from "../database/Firebase.js";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      productPrice,
      productSpecification,
      productUnits,
    } = req.body;

    let product = await ProductModel.findOne({ productName });

    if (product) {
      return res.status(400).send({
        message: "Product is already added to storage.",
      });
    }

    const storageRef = ref(storage, "products/" + req.file.originalname);
    const metadata = { contentType: req.file.mimetype };
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    product = await new ProductModel({
      productName,
      productDescription,
      productPrice,
      productSpecification,
      productUnits,
      productImage: downloadURL,
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

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }

    return res.status(200).json(product);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDescription,
      productPrice,
      productSpecification,
      productUnits,
    } = req.body;

    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }

    let fileName = "";
    if (req.file != null) {
      fileName = req.file.originalname;
      const desertRef = ref(storage, product.productImage);
      deleteObject(desertRef);
    } else {
      fileName = product.productImage;
    }

    if (product.productImage != fileName) {
      const storageRef = ref(storage, "products/" + req.file.originalname);
      const metadata = { contentType: req.file.mimetype };
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );

      const downloadURL = await getDownloadURL(snapshot.ref);

      await ProductModel.updateOne(
        { _id: productId },
        {
          $set: {
            productName,
            productDescription,
            productPrice,
            productSpecification,
            productUnits,
            productImage: downloadURL,
          },
        }
      );
    } else {
      await ProductModel.updateOne(
        { _id: productId },
        {
          $set: {
            productName,
            productDescription,
            productPrice,
            productSpecification,
            productUnits,
            productImage: fileName,
          },
        }
      );
    }

    return res.status(200).send({ message: "Product successfully updated." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

// Update product units only
export const updateProductUnits = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productUnits } = req.body;

    if (productUnits === undefined || productUnits < 0) {
      return res.status(400).send({ message: "Invalid product units." });
    }

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { productUnits },
      { new: true }
    );

    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }

    return res
      .status(200)
      .send({ message: "Product units successfully updated." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};
// Increase product units
export const increaseProductUnits = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productUnits } = req.body;

    if (!productUnits || productUnits <= 0) {
      return res.status(400).send({ message: "Invalid units." });
    }

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { productUnits: productUnits } },
      { new: true }
    );

    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }

    return res
      .status(200)
      .send({ message: "Product units successfully increased." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

// Decrease product units
export const decreaseProductUnits = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productUnits } = req.body;

    if (!productUnits || productUnits <= 0) {
      return res.status(400).send({ message: "Invalid units." });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }

    if (product.productUnits < productUnits) {
      return res.status(400).send({ message: "Not enough units available." });
    }

    product.productUnits -= productUnits;
    await product.save();

    return res
      .status(200)
      .send({ message: "Product units successfully decreased." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }

    return res.status(200).send({ message: "Product successfully deleted." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};
