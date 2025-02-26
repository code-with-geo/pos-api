import mongoose from "mongoose";

const Schema = mongoose.Schema({
  productName: { type: String, require: true },
  productDescription: { type: String },
  productPrice: { type: Number },
  productSpecification: { type: String },
  productUnits: { type: Number, default: 1 },
});

Schema.virtual("id").get(function () {
  return this._id.toHexString();
});

Schema.set("toJSON", {
  virtual: true,
});

export const ProductModel = mongoose.model("products", Schema);
