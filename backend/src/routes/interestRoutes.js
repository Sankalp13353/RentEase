// routes/interestRoutes.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");
const { ownerOnlyMiddleware } = require("../middlewares/houseMiddleware");

const {
  createInterestController,
  getMyInterestsController,
  deleteInterestController,
  getOwnerInterestsController,
  approveInterestController,
  rejectInterestController,
} = require("../controllers/interestController");

// POST /api/interests -> tenant shows interest
router.post("/", authMiddleware, createInterestController);

// GET /api/interests/my-interests -> tenant's interests
router.get("/my-interests", authMiddleware, getMyInterestsController);

// DELETE /api/interests/:id -> tenant cancels interest
router.delete("/:id", authMiddleware, deleteInterestController);

// OWNER ROUTES
router.get(
  "/owner",
  authMiddleware,
  ownerOnlyMiddleware,
  getOwnerInterestsController
);

// Owner approves interest
router.patch(
  "/:id/approve",
  authMiddleware,
  ownerOnlyMiddleware,
  approveInterestController
);

// Owner rejects interest
router.patch(
  "/:id/reject",
  authMiddleware,
  ownerOnlyMiddleware,
  rejectInterestController
);



module.exports = router;
