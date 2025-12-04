// controllers/interestController.js
const { prisma } = require("../config/database");

/**
 * Tenant shows interest in a house.
 * Prevent duplicate interest from same tenant -> returns existing interest if found.
 */
async function createInterestController(req, res) {
  try {
    const tenantId = req.user.id;
    const { houseId, message } = req.body;

    if (!houseId) {
      return res.status(400).json({ ERROR: "houseId is required" });
    }

    // check house existence
    const house = await prisma.house.findUnique({ where: { id: Number(houseId) } });
    if (!house) return res.status(404).json({ ERROR: "House not found" });

    // prevent owner from showing interest on their own house
    if (house.owner_id === tenantId) {
      return res.status(400).json({ ERROR: "Owners cannot show interest on their own property" });
    }

    // prevent duplicate interest
    const existing = await prisma.interest.findFirst({
      where: { tenant_id: tenantId, house_id: Number(houseId) },
    });

    if (existing) {
      return res.status(200).json({ message: "Interest already exists", interest: existing });
    }

    const interest = await prisma.interest.create({
      data: {
        tenant_id: tenantId,
        house_id: Number(houseId),
        message: message || null,
      },
    });

    // (Optional) You can emit a websocket/event here so owner gets real-time notification

    return res.status(201).json({ message: "Interest recorded", interest });
  } catch (err) {
    console.error("Create interest error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/**
 * List logged-in tenant's interests
 * Include house and owner info — owner email will be present but frontend only displays owner.email if interest.status === "Approved"
 */
async function getMyInterestsController(req, res) {
  try {
    const tenantId = req.user.id;

    const interests = await prisma.interest.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_at: "desc" },
      include: {
        house: {
          include: {
            owner: { select: { id: true, name: true, username: true, email: true } },
          },
        },
      },
    });

    return res.status(200).json({ interests });
  } catch (err) {
    console.error("Get my interests error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/**
 * Cancel / delete an interest (tenant only)
 */
async function deleteInterestController(req, res) {
  try {
    const tenantId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.interest.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ ERROR: "Interest not found" });

    if (existing.tenant_id !== tenantId) {
      return res.status(403).json({ ERROR: "Forbidden" });
    }

    await prisma.interest.delete({ where: { id: Number(id) } });
    return res.status(200).json({ message: "Interest canceled" });
  } catch (err) {
    console.error("Delete interest error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ===========================
   Owner: list incoming interests
   =========================== */
async function getOwnerInterestsController(req, res) {
  try {
    const ownerId = req.user.id;

    // find interests where house.owner_id == ownerId
    const interests = await prisma.interest.findMany({
      where: {
        house: {
          owner_id: ownerId,
        },
      },
      orderBy: { created_at: "desc" },
      include: {
        house: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            rent: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true, // we'll show in UI only once approved
          },
        },
      },
    });

    return res.status(200).json({ interests });
  } catch (err) {
    console.error("Get owner interests error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ===========================
   Owner: approve interest (reveal contact)
   =========================== */
async function approveInterestController(req, res) {
  try {
    const ownerId = req.user.id;
    const { id } = req.params; // interest id

    const existing = await prisma.interest.findUnique({
      where: { id: Number(id) },
      include: { house: true },
    });

    if (!existing) return res.status(404).json({ ERROR: "Interest not found" });

    // verify owner owns the house for this interest
    if (existing.house.owner_id !== ownerId) {
      return res.status(403).json({ ERROR: "Forbidden" });
    }

    const updated = await prisma.interest.update({
      where: { id: Number(id) },
      data: { status: "Approved" },
      include: {
        tenant: { select: { id: true, name: true, username: true, email: true } },
        house: {
          include: {
            owner: { select: { id: true, name: true, username: true, email: true } },
          },
        },
      },
    });

    return res.status(200).json({ message: "Interest approved", interest: updated });
  } catch (err) {
    console.error("Approve interest error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ===========================
   Owner: reject interest
   =========================== */
async function rejectInterestController(req, res) {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.interest.findUnique({
      where: { id: Number(id) },
      include: { house: true },
    });

    if (!existing) return res.status(404).json({ ERROR: "Interest not found" });

    if (existing.house.owner_id !== ownerId) {
      return res.status(403).json({ ERROR: "Forbidden" });
    }

    const updated = await prisma.interest.update({
      where: { id: Number(id) },
      data: { status: "Rejected" },
      include: {
        tenant: { select: { id: true, name: true, username: true, email: true } },
        house: {
          include: {
            owner: { select: { id: true, name: true, username: true, email: true } },
          },
        },
      },
    });

    return res.status(200).json({ message: "Interest rejected", interest: updated });
  } catch (err) {
    console.error("Reject interest error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

module.exports = {
  createInterestController,
  getMyInterestsController,
  deleteInterestController,
  getOwnerInterestsController,
  approveInterestController,
  rejectInterestController,
};
