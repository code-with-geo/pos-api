import express from "express";
import {
  addUser,
  loginUser,
  updateUser,
  getUsers,
  removeUser,
} from "../controller/Users.js";
import { authenticateToken } from "../middleware/Authentication.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/update", authenticateToken, updateUser);
router.get("/", authenticateToken, getUsers);
router.delete("/remove", authenticateToken, removeUser);
router.post("/add", authenticateToken, addUser);
export { router as UserRouter };
