import { UserModel } from "../model/Users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const addUser = async (req, res) => {
  try {
    const { username, password, name } = req.body;

    let user = await UserModel.findOne({ username });

    if (user) {
      return res.status(400).send({
        message: "User is already added to storage.",
      });
    }

    user = await new UserModel({ username, password, name }).save();

    return res.status(200).send({
      message: "User successfully added to storage.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(400).send({
        message: "User not found.",
      });
    }

    user = await UserModel.findOne({ username, password });

    if (!user) {
      return res.status(400).send({
        message: "Incorrect email or password. Please try again.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).send({
      message: "User successfully added to storage.",
      token,
      userID: user._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userID, username, password, name } = req.body;
    console.log(username);
    let user = await UserModel.findOne({ _id: userID });

    if (!user) {
      return res.status(400).send({
        message: "User not found.",
      });
    }

    await UserModel.updateOne(
      { _id: userID },
      {
        $set: {
          username,
          password,
          name,
        },
      }
    );

    return res.status(200).send({
      message: "User successfully update.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};
