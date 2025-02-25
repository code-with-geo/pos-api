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

router.post("/add", addUser);
router.post("/login", loginUser);
router.post("/update", authenticateToken, updateUser);
router.get("/", authenticateToken, getUsers);
router.delete("/remove", authenticateToken, removeUser);
export { router as UserRouter };
