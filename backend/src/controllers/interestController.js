const { prisma } = require("../config/database");

/* ===========================
   Tenant: Create Interest
=========================== */
async function createInterestController(req, res) {
  try {
    const tenantId = req.user.id;
    const { houseId, message } = req.body;

    if (!houseId) return res.status(400).json({ ERROR: "houseId required" });

    const house = await prisma.house.findUnique({
      where: { id: Number(houseId) },
    });

    if (!house) return res.status(404).json({ ERROR: "House not found" });

    if (house.owner_id === tenantId)
      return res.status(400).json({ ERROR: "Cannot show interest on own property" });

    const existing = await prisma.interest.findFirst({
      where: { tenant_id: tenantId, house_id: Number(houseId) },
    });

    if (existing) return res.status(200).json({ message: "Interest already exists", interest: existing });

    const interest = await prisma.interest.create({
      data: {
        tenant_id: tenantId,
        house_id: Number(houseId),
        message: message || null,
      },
    });

    return res.status(201).json({ message: "Interest created", interest });
  } catch (err) {
    console.error("Create interest error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ===========================
   Tenant: Get My Interests
=========================== */
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

/* ===========================
   Tenant: Delete Interest
=========================== */
async function deleteInterestController(req, res) {
  try {
    const tenantId = req.user.id;
    const { id } = req.params;

    const interest = await prisma.interest.findUnique({
      where: { id: Number(id) },
    });

    if (!interest) return res.status(404).json({ ERROR: "Interest not found" });
    if (interest.tenant_id !== tenantId) return res.status(403).json({ ERROR: "Forbidden" });

    await prisma.interest.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: "Interest deleted" });
  } catch (err) {
    console.error("Delete interest error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ===========================
   Owner: Get Incoming Interests
=========================== */
async function getOwnerInterestsController(req, res) {
  try {
    const ownerId = req.user.id;

    const interests = await prisma.interest.findMany({
      where: {
        house: {
          owner_id: ownerId,
        },
      },
      orderBy: { created_at: "desc" },
      include: {
        tenant: {
          select: { id: true, name: true, username: true, email: true },
        },
        house: {
          select: { id: true, title: true, city: true, rent: true, address: true },
        },
      },
    });

    return res.status(200).json({ interests });
  } catch (err) {
    console.error("Owner interests error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ===========================
   Owner: Approve (Reveal Email)
=========================== */
async function approveInterestController(req, res) {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const interest = await prisma.interest.findUnique({
      where: { id: Number(id) },
      include: { house: true },
    });

    if (!interest) return res.status(404).json({ ERROR: "Interest not found" });
    if (interest.house.owner_id !== ownerId) return res.status(403).json({ ERROR: "Forbidden" });

    const updated = await prisma.interest.update({
      where: { id: Number(id) },
      data: { status: "Approved" },
    });

    return res.status(200).json({ message: "Approved", interest: updated });
  } catch (err) {
    console.error("Approve error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ===========================
   Owner: Reject
=========================== */
async function rejectInterestController(req, res) {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const interest = await prisma.interest.findUnique({
      where: { id: Number(id) },
      include: { house: true },
    });

    if (!interest) return res.status(404).json({ ERROR: "Interest not found" });
    if (interest.house.owner_id !== ownerId) return res.status(403).json({ ERROR: "Forbidden" });

    const updated = await prisma.interest.update({
      where: { id: Number(id) },
      data: { status: "Rejected" },
    });

    return res.status(200).json({ message: "Rejected", interest: updated });
  } catch (err) {
    console.error("Reject error:", err);
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
