import { OrdersModel } from "../model/Orders.js";
import { OrdersItemModel } from "../model/OrderItems.js";
import { ProductModel } from "../model/Products.js";

export const createOrder = async (req, res) => {
  try {
    const { userID, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).send({ message: "No items provided for order." });
    }

    let total = 0;

    // Check stock availability and calculate total
    for (const item of items) {
      const product = await ProductModel.findById(item.productID);
      if (!product) {
        return res
          .status(404)
          .send({ message: `Product not found: ${item.productID}` });
      }
      if (product.productUnits < item.units) {
        return res
          .status(400)
          .send({ message: `Not enough stock for ${product.productName}` });
      }
      total += item.units * product.productPrice;
    }

    // Create order
    const order = await new OrdersModel({
      userID,
      total,
    }).save();

    // Create order items and update stock
    for (const item of items) {
      await new OrdersItemModel({
        orderID: order._id,
        userID,
        productID: item.productID,
        price: item.price,
        units: item.units,
        subtotal: item.units * item.price,
      }).save();

      // Reduce product stock
      await ProductModel.findByIdAndUpdate(item.productID, {
        $inc: { productUnits: -item.units },
      });
    }

    return res.status(201).send({
      message: "Order successfully created.",
      order,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const order = await OrdersModel.findOne({ invoiceNumber });

    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }

    if (order.paymentStatus !== "Paid") {
      return res.status(400).send({
        message: "Payment must be marked as Paid before completing the order.",
      });
    }

    order.orderStatus = "Complete";
    await order.save();

    return res
      .status(200)
      .send({ message: "Order status updated to Complete." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const order = await OrdersModel.findOne({ invoiceNumber });

    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }

    order.paymentStatus = "Paid";
    await order.save();

    return res.status(200).send({ message: "Payment status updated to Paid." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const order = await OrdersModel.findOne({ invoiceNumber });

    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }

    if (order.orderStatus !== "Pending") {
      return res
        .status(400)
        .send({ message: "Only pending orders can be canceled." });
    }

    order.orderStatus = "Canceled";
    await order.save();

    return res.status(200).send({ message: "Order successfully canceled." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

export const getOrderByInvoiceNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const order = await OrdersModel.findOne({ invoiceNumber });

    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }

    return res.status(200).send(order);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const orders = await OrdersModel.find({ orderStatus: "Pending" });
    return res.status(200).send(orders);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

export const getOrderProductsByOrderId = async (req, res) => {
  try {
    const { orderID } = req.params;
    const orderItems = await OrdersItemModel.find({ orderID }).populate(
      "productID"
    );

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found for this order." });
    }

    return res.status(200).send(orderItems);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrdersModel.find();
    return res.status(200).send(orders);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

// Helper function to format date as MM/DD/YYYY
const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

// Get today's transaction count
export const getTodayTransactionCount = async (req, res) => {
  try {
    const today = getTodayDate();

    const transactionCount = await OrdersModel.countDocuments({
      orderDateTime: { $regex: `^${today}` }, // Match beginning of the string
    });

    return res.status(200).send({ transactionCount });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

// Get top 10 selling products for today
export const getTop10TodaySales = async (req, res) => {
  try {
    const today = getTodayDate();

    // Get all orders placed today
    const todaysOrders = await OrdersModel.find({
      orderDateTime: { $regex: `^${today}` },
      orderStatus: { $ne: "Canceled" }, // Exclude canceled orders
    }).select("_id");

    if (todaysOrders.length === 0) {
      return res.status(200).send([]); // No orders today
    }

    const orderIds = todaysOrders.map((order) => order._id);

    // Aggregate top selling products from today's orders
    const topProducts = await OrdersItemModel.aggregate([
      {
        $match: {
          orderID: { $in: orderIds },
        },
      },
      {
        $group: {
          _id: "$productID",
          totalUnitsSold: { $sum: "$units" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.productName",
          totalUnitsSold: 1,
        },
      },
      { $sort: { totalUnitsSold: -1 } },
      { $limit: 10 },
    ]);

    return res.status(200).send(topProducts);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};

// Get today's total sales
export const getTodaySales = async (req, res) => {
  try {
    const today = getTodayDate();

    const totalSales = await OrdersModel.aggregate([
      {
        $match: {
          orderDateTime: { $regex: `^${today}` }, // Match beginning of the string
          orderStatus: { $ne: "Canceled" }, // Exclude canceled orders
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    return res
      .status(200)
      .send({ totalSales: totalSales[0]?.totalRevenue || 0 });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Please contact technical support." });
  }
};
