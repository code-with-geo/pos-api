import mongoose, { Schema } from "mongoose";

const formatDateTime = (date) => {
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options)
    .format(date)
    .replace(",", "")
    .replace(" AM", "am")
    .replace(" PM", "pm");
};

const generateInvoiceNumber = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const OrderSchema = mongoose.Schema({
  orderNumber: { type: Number, require: true },
  invoiceNumber: { type: String, default: generateInvoiceNumber },
  userID: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "users",
  },
  total: { type: Number },
  orderDateTime: { type: String, default: () => formatDateTime(new Date()) },
  paymentStatus: { type: String, default: "Unpaid" },
  orderStatus: { type: String, default: "Pending" },
});

OrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

OrderSchema.set("toJSON", {
  virtual: true,
});

export const OrdersModel = mongoose.model("orders", OrderSchema);
