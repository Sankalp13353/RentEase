const express = require("express");
const usersRouter = express.Router();

const {
    createUserMiddleware,
    loginUserMiddleware,
    logoutUserMiddleware,
    updateUserMiddleware,
    authMiddleware,
} = require("../middlewares/userMiddleware");

const {
    createUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    updateUserController,
} = require("../controllers/userController");

// REGISTER (Owner / Tenant)
usersRouter.post("/register", createUserMiddleware, createUserController);

// LOGIN (Owner / Tenant)
usersRouter.post("/login", loginUserMiddleware, loginUserController);

// LOGOUT
usersRouter.post("/logout", logoutUserMiddleware, logoutUserController);

// GET MY PROFILE
usersRouter.get("/me", authMiddleware, getMeController);

// UPDATE PROFILE
usersRouter.put("/update", authMiddleware, updateUserMiddleware, updateUserController);

// Future routes (optional)
// usersRouter.post("/refresh", ...);
// usersRouter.post("/change-password", ...);
// usersRouter.post("/forgot-password", ...);
// usersRouter.post("/reset-password/:token", ...);
// usersRouter.delete("/", ...);

module.exports = usersRouter;
