// controllers/interestController.js
const { prisma } = require("../config/database");

/* =======================================================
   TENANT → SHOW INTEREST
======================================================= */
async function createInterestController(req, res) {
  try {
    const tenantId = req.user.id;
    const { houseId, message } = req.body;

    if (!houseId) {
      return res.status(400).json({ ERROR: "houseId is required" });
    }

    const house = await prisma.house.findUnique({
      where: { id: Number(houseId) },
    });

    if (!house) return res.status(404).json({ ERROR: "House not found" });

    // owner cannot show interest on their own house
    if (house.owner_id === tenantId) {
      return res
        .status(400)
        .json({ ERROR: "Owners cannot show interest on their own property" });
    }

    // prevent duplicate interest
    const existing = await prisma.interest.findFirst({
      where: { tenant_id: tenantId, house_id: Number(houseId) },
    });

    if (existing) {
      return res.status(200).json({
        message: "Interest already exists",
        interest: existing,
      });
    }

    const interest = await prisma.interest.create({
      data: {
        tenant_id: tenantId,
        house_id: Number(houseId),
        message: message || null,
      },
    });

    return res.status(201).json({
      message: "Interest recorded",
      interest,
    });
  } catch (err) {
    console.error("Create interest error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =======================================================
   TENANT → MY INTERESTS
======================================================= */
async function getMyInterestsController(req, res) {
  try {
    const tenantId = req.user.id;

    const interests = await prisma.interest.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_at: "desc" },
      include: {
        house: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true, // shown directly
              },
            },
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

/* =======================================================
   TENANT → CANCEL INTEREST
======================================================= */
async function deleteInterestController(req, res) {
  try {
    const tenantId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.interest.findUnique({
      where: { id: Number(id) },
    });

    if (!existing)
      return res.status(404).json({ ERROR: "Interest not found" });

    if (existing.tenant_id !== tenantId)
      return res.status(403).json({ ERROR: "Forbidden" });

    await prisma.interest.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: "Interest canceled" });
  } catch (err) {
    console.error("Delete interest error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =======================================================
   OWNER → VIEW INCOMING INTERESTS
======================================================= */
async function getIncomingInterestsController(req, res) {
  try {
    const ownerId = req.user.id;

    const interests = await prisma.interest.findMany({
      where: {
        house: { owner_id: ownerId },
      },
      orderBy: { created_at: "desc" },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true, // shown directly
          },
        },
        house: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            rent: true,
          },
        },
      },
    });

    return res.status(200).json({ interests });
  } catch (err) {
    console.error("Get incoming interests error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

module.exports = {
  createInterestController,
  getMyInterestsController,
  deleteInterestController,
  getIncomingInterestsController,
};
