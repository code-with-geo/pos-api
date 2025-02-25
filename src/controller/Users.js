import { UserModel } from "../model/Users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const addUser = async (req, res) => {
  try {
    const { username, password, name, isAdmin } = req.body;

    let user = await UserModel.findOne({ username });

    if (user) {
      return res.status(400).send({
        message: "User is already added to storage.",
      });
    }

    user = await new UserModel({ username, password, name, isAdmin }).save();

    return res.status(200).send({
      message: "User successfully added to storage.",
      users: user,
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
        message: "Incorrect username or password. Please try again.",
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

export const getUsers = async (req, res) => {
  try {
    let user = await UserModel.find({});

    res.json({
      user: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Please contact technical support.",
    });
  }
};

export const removeUser = async (req, res) => {
  try {
    const { userID } = req.body;

    if (!userID.match(/^[0-9a-fA-F]{24}$/)) {
      return res.send({
        responsecode: "402",
        message: "User not found.",
      });
    }

    let user = await UserModel.findOne({ _id: userID });

    if (!user) {
      return res.json({
        responsecode: "402",
        message: "User not found.",
      });
    }

    await UserModel.deleteOne({ _id: userID });

    return res.json({
      responsecode: "200",
      message: "User is successfully removed.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      responsecode: "500",
      message: "Please contact technical support.",
    });
  }
};
