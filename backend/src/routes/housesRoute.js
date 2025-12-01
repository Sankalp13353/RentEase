const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");
const houseController = require("../controllers/houseController");

// CREATE HOUSE / PROPERTY (Owner only)
router.post("/create", authMiddleware, houseController.createHouseController);

// GET ALL PUBLIC HOUSES / PROPERTIES (Tenants browse)
router.get("/", houseController.getAllHousesController);

// GET HOUSES OF LOGGED-IN OWNER
router.get("/owner/:ownerId", houseController.getOwnerHousesController);

// GET SINGLE HOUSE / PROPERTY
router.get("/:id", houseController.getHouseByIdController);

// UPDATE HOUSE / PROPERTY (Owner only)
router.put("/:id", authMiddleware, houseController.updateHouseController);

// DELETE HOUSE / PROPERTY (Owner only)
router.delete("/:id", authMiddleware, houseController.deleteHouseController);

module.exports = router;
