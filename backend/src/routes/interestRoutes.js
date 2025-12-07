
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
  rejectInterestController
} = require("../controllers/interestController");

router.post("/", authMiddleware, createInterestController);

router.get("/my-interests", authMiddleware, getMyInterestsController);

router.delete("/:id", authMiddleware, deleteInterestController);

router.get(
  "/owner",
  authMiddleware,
  ownerOnlyMiddleware,
  getOwnerInterestsController
);

router.patch(
  "/:id/approve",
  authMiddleware,
  ownerOnlyMiddleware,
  approveInterestController
);

router.patch(
  "/:id/reject",
  authMiddleware,
  ownerOnlyMiddleware,
  rejectInterestController
);

module.exports = router;