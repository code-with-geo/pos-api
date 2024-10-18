import mongoose from "mongoose";

const Schema = mongoose.Schema({
  typeName: { type: String, unique: true, require: true },
  typeDescription: { type: String },
  isEnable: { type: Boolean, default: true },
  createAt: { type: Date, default: Date.now() },
});

Schema.virtual("id").get(function () {
  return this._id.toHexString();
});

Schema.set("toJSON", {
  virtual: true,
});

export const ProductTypeModel = mongoose.model("producttypes", Schema);
