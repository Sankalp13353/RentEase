const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");
const {
  ownerOnlyMiddleware,
  validatePropertyFields
} = require("../middlewares/houseMiddleware");

const houseController = require("../controllers/houseController");

router.post(
  "/create",
  authMiddleware,
  ownerOnlyMiddleware,
  validatePropertyFields,
  houseController.createHouseController
);

router.get("/", houseController.getAllHousesController);

router.get(
  "/my-properties",
  authMiddleware,
  ownerOnlyMiddleware,
  houseController.getOwnerHousesController
);

router.get("/:id", houseController.getHouseByIdController);

router.put(
  "/:id",
  authMiddleware,
  ownerOnlyMiddleware,
  houseController.updateHouseController
);

router.delete(
  "/:id",
  authMiddleware,
  ownerOnlyMiddleware,
  houseController.deleteHouseController
);

module.exports = router;