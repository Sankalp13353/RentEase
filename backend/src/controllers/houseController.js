const { prisma } = require("../config/database");

/* ============================================
   CREATE HOUSE (OWNER ONLY)
============================================ */
async function createHouseController(req, res) {
  try {
    const ownerId = req.user.id;
    const {
      title,
      description,
      address,
      city,
      state,
      zipcode,
      property_type,
      bedrooms,
      bathrooms,
      area_sqft,
      rent,
      available_from,
      amenities,
    } = req.body;

    if (!title || !address || !city || !state || !zipcode || !property_type) {
      return res.status(400).json({ ERROR: "Missing required fields" });
    }

    const house = await prisma.house.create({
      data: {
        owner_id: ownerId,
        title,
        description: description || null,
        address,
        city,
        state,
        zipcode,
        property_type,
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        area_sqft: Number(area_sqft) || 0,
        rent: rent ? Number(rent) : null,
        available_from: available_from ? new Date(available_from) : null,
        amenities: amenities || null,
      },
    });

    return res.status(201).json({ message: "House created successfully", house });
  } catch (err) {
    console.error("Create house error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error", details: err.message });
  }
}

/* ============================================
   GET ALL HOUSES (FOR TENANTS TO BROWSE)
============================================ */
async function getAllHousesController(req, res) {
  try {
    const houses = await prisma.house.findMany({
      where: { status: "ForSale" },
      orderBy: { created_at: "desc" },
      include: {
        owner: { select: { id: true, name: true, username: true } },
      },
    });

    return res.status(200).json({ houses });
  } catch (err) {
    console.error("Get houses error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================
   GET HOUSES OF LOGGED-IN OWNER
============================================ */
async function getOwnerHousesController(req, res) {
  try {
    const ownerId = Number(req.params.ownerId);

    if (!ownerId) return res.status(400).json({ ERROR: "Owner ID required" });

    const houses = await prisma.house.findMany({
      where: { owner_id: ownerId },
      orderBy: { created_at: "desc" },
    });

    return res.status(200).json({ houses });
  } catch (err) {
    console.error("Get owner houses error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================
   GET HOUSE BY ID
============================================ */
async function getHouseByIdController(req, res) {
  try {
    const { id } = req.params;

    const house = await prisma.house.findUnique({
      where: { id: Number(id) },
      include: { owner: { select: { id: true, name: true, username: true } } },
    });

    if (!house) return res.status(404).json({ ERROR: "House not found" });

    return res.status(200).json({ house });
  } catch (err) {
    console.error("Get house by id error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================
   UPDATE HOUSE (OWNER ONLY)
============================================ */
async function updateHouseController(req, res) {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const existingHouse = await prisma.house.findUnique({ where: { id: Number(id) } });
    if (!existingHouse) return res.status(404).json({ ERROR: "House not found" });
    if (existingHouse.owner_id !== ownerId) return res.status(403).json({ ERROR: "Forbidden" });

    const updateData = { ...req.body };
    if (updateData.bedrooms) updateData.bedrooms = Number(updateData.bedrooms);
    if (updateData.bathrooms) updateData.bathrooms = Number(updateData.bathrooms);
    if (updateData.area_sqft) updateData.area_sqft = Number(updateData.area_sqft);
    if (updateData.rent) updateData.rent = Number(updateData.rent);
    if (updateData.available_from) updateData.available_from = new Date(updateData.available_from);

    const updatedHouse = await prisma.house.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return res.status(200).json({ message: "House updated", house: updatedHouse });
  } catch (err) {
    console.error("Update house error:", err);
    return res.status(500).json({ ERROR: err.message });
  }
}

/* ============================================
   DELETE HOUSE (OWNER ONLY)
============================================ */
async function deleteHouseController(req, res) {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const existingHouse = await prisma.house.findUnique({ where: { id: Number(id) } });
    if (!existingHouse) return res.status(404).json({ ERROR: "House not found" });
    if (existingHouse.owner_id !== ownerId) return res.status(403).json({ ERROR: "Forbidden" });

    await prisma.house.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: "House deleted successfully" });
  } catch (err) {
    console.error("Delete house error:", err);
    return res.status(500).json({ ERROR: err.message });
  }
}

module.exports = {
  createHouseController,
  getAllHousesController,
  getOwnerHousesController, 
  getHouseByIdController,
  updateHouseController,
  deleteHouseController,
};
