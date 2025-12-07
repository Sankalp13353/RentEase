const express = require("express");
const usersRouter = express.Router();

const {
  createUserMiddleware,
  loginUserMiddleware,
  logoutUserMiddleware,
  updateUserMiddleware,
  authMiddleware
} = require("../middlewares/userMiddleware");

const {
  createUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  updateUserController
} = require("../controllers/userController");

usersRouter.post("/register", createUserMiddleware, createUserController);

usersRouter.post("/login", loginUserMiddleware, loginUserController);

usersRouter.post("/logout", logoutUserMiddleware, logoutUserController);

usersRouter.get("/me", authMiddleware, getMeController);

usersRouter.put("/update", authMiddleware, updateUserMiddleware, updateUserController);

module.exports = usersRouter;