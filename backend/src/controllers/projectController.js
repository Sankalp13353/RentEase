const { prisma } = require("../config/database");

/* ============================================
   CREATE PROPERTY (Owner)
============================================ */
async function createOwnerPropertyController(req, res) {
  try {
    const {
      title,
      description,
      budget_min,
      budget_max,
      deadline,
      client_id,
      status
    } = req.body;

    if (!title || !client_id) {
      return res.status(400).json({ ERROR: "Missing required fields" });
    }

    const property = await prisma.owner.create({
      data: {
        title,
        description,
        budget_min: budget_min ? Number(budget_min) : null,
        budget_max: budget_max ? Number(budget_max) : null,
        deadline: deadline ? new Date(deadline) : null,
        status: status || "ForSale",
        client_id: Number(client_id)
      }
    });

    return res.status(201).json({ message: "Property created", property });
  } catch (err) {
    console.error("Create property error:", err);
    return res.status(500).json({
      ERROR: "Internal Server Error",
      details: err.message
    });
  }
}

/* ============================================
   GET ALL PROPERTIES OF A OWNER
============================================ */
async function getOwnerPropertiesController(req, res) {
  try {
    const { clientId } = req.params;

    const properties = await prisma.owner.findMany({
      where: { client_id: Number(clientId) },
      orderBy: { created_at: "desc" }
    });

    return res.json({ properties });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================
   GET ALL PUBLIC PROPERTIES
============================================ */
async function getAllPropertiesController(req, res) {
  try {
    const properties = await prisma.owner.findMany({
      orderBy: { created_at: "desc" },
      include: {
        client: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    const formatted = properties.map((p) => ({
      ...p,
      price:
        p.budget_min && p.budget_max
          ? `₹${p.budget_min} - ₹${p.budget_max}`
          : p.budget_min
          ? `₹${p.budget_min}`
          : p.budget_max
          ? `₹${p.budget_max}`
          : null,
      category: "Real Estate"
    }));

    return res.json({ properties: formatted });
  } catch (err) {
    console.error("Get properties error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================
   GET SINGLE PROPERTY BY ID
============================================ */
async function getPropertyByIdController(req, res) {
  try {
    const { id } = req.params;

    const property = await prisma.owner.findUnique({
      where: { id: Number(id) },
      include: {
        client: { select: { id: true, name: true, username: true } }
      }
    });

    if (!property)
      return res.status(404).json({ ERROR: "Property not found" });

    return res.json({ property });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================
   UPDATE PROPERTY
============================================ */
async function updatePropertyController(req, res) {
  try {
    const { id } = req.params;
    const tokenUser = req.user;

    const existing = await prisma.owner.findUnique({
      where: { id: Number(id) }
    });

    if (!existing)
      return res.status(404).json({ ERROR: "Property not found" });

    if (existing.client_id !== tokenUser.id)
      return res.status(403).json({ ERROR: "Forbidden" });

    const {
      title,
      description,
      budget_min,
      budget_max,
      deadline,
      status
    } = req.body;

    const updated = await prisma.owner.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        budget_min: budget_min ? Number(budget_min) : null,
        budget_max: budget_max ? Number(budget_max) : null,
        deadline: deadline ? new Date(deadline) : null,
        status
      }
    });

    return res.json({ message: "Property updated", property: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: err.message });
  }
}

/* ============================================
   DELETE PROPERTY
============================================ */
async function deletePropertyController(req, res) {
  try {
    const { id } = req.params;
    const tokenUser = req.user;

    const existing = await prisma.owner.findUnique({
      where: { id: Number(id) }
    });

    if (!existing)
      return res.status(404).json({ ERROR: "Property not found" });

    if (existing.client_id !== tokenUser.id)
      return res.status(403).json({ ERROR: "Forbidden" });

    await prisma.owner.delete({
      where: { id: Number(id) }
    });

    return res.json({ message: "Property deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: err.message });
  }
}

module.exports = {
  createOwnerPropertyController,
  getOwnerPropertiesController,
  getAllPropertiesController,
  getPropertyByIdController,
  updatePropertyController,
  deletePropertyController
};
