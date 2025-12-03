const express = require("express");
const router = express.Router();

// Correct imports
const { authMiddleware } = require("../middlewares/userMiddleware");
const {
  ownerOnlyMiddleware,
  validatePropertyFields,
} = require("../middlewares/houseMiddleware");

const houseController = require("../controllers/houseController");

// CREATE HOUSE (Owner only)
router.post(
  "/create",
  authMiddleware,
  ownerOnlyMiddleware,
  validatePropertyFields,
  houseController.createHouseController
);

// GET ALL PUBLIC HOUSES
router.get("/", houseController.getAllHousesController);

// GET LOGGED-IN OWNER'S HOUSES
router.get(
  "/my-properties",
  authMiddleware,
  ownerOnlyMiddleware,
  houseController.getOwnerHousesController
);

// GET SINGLE HOUSE
router.get("/:id", houseController.getHouseByIdController);

// UPDATE HOUSE (Owner only)
router.put(
  "/:id",
  authMiddleware,
  ownerOnlyMiddleware,
  houseController.updateHouseController
);

// DELETE HOUSE (Owner only)
router.delete(
  "/:id",
  authMiddleware,
  ownerOnlyMiddleware,
  houseController.deleteHouseController
);

module.exports = router;
