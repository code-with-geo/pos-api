import mongoose from "mongoose";

const Schema = mongoose.Schema({
  subSKU: { type: String, unique: true, require: true },
  subName: { type: String, require: true },
  subDescription: { type: String, require: true },
  subPrice: { type: Number, require: true, default: 0 },
  subUnits: { type: Number, require: true, default: 0 },
  subProductType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "producttypes",
  },
  subMainProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  isEnable: { type: Boolean, default: true },
  createAt: { type: Date, default: Date.now() },
});

Schema.virtual("id").get(function () {
  return this._id.toHexString();
});

Schema.set("toJSON", {
  virtual: true,
});

export const SubProductModel = mongoose.model("subproducts", Schema);
