// routes/interestRoutes.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");
const {
  createInterestController,
  getMyInterestsController,
  deleteInterestController,
} = require("../controllers/interestController");

// POST /api/interests  -> show interest (tenant)
router.post("/", authMiddleware, createInterestController);

// GET /api/interests/my-interests -> logged-in tenant's interests
router.get("/my-interests", authMiddleware, getMyInterestsController);

// DELETE /api/interests/:id -> cancel interest
router.delete("/:id", authMiddleware, deleteInterestController);

module.exports = router;
