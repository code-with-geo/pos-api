import mongoose from "mongoose";

const Schema = mongoose.Schema({
  username: { type: String, unique: true, require: true },
  password: { type: String },
  name: { type: String },
  isAdmin: { type: Boolean, default: false },
});

Schema.virtual("id").get(function () {
  return this._id.toHexString();
});

Schema.set("toJSON", {
  virtual: true,
});

export const UserModel = mongoose.model("users", Schema);
