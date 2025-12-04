// controllers/houseController.js
const { prisma } = require("../config/database");

/* CREATE HOUSE (OWNER ONLY) */
async function createHouseController(req, res) {
  try {
    const ownerId = req.user.id;

    const {
      title, description, address, city, state, zipcode,
      property_type, bedrooms, bathrooms, area_sqft,
      rent, available_from
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
      },
    });

    return res.status(201).json({ message: "House created successfully", house });

  } catch (err) {
    console.error("Create house error:", err);
    console.error("Request body was:", req.body);
    return res.status(500).json({ ERROR: err.message, DETAILS: err.meta || "No additional details" });
  }
}

/* Helper to build Prisma where object from query params */
function buildWhereFromQuery({ search, city, property_type, status, owner_id }) {
  const where = {};

  if (owner_id !== undefined) {
    where.owner_id = Number(owner_id);
  }

  // status filter (for public list usually)
  if (status) {
    where.status = status;
  }

  // property type
  if (property_type) {
    where.property_type = property_type;
  }

  // city filter (exact or contains)
  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  // search across title, address, city, description
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

/* GET ALL HOUSES (FOR TENANTS) with filtering/sorting/pagination */
async function getAllHousesController(req, res) {
  try {
    // Query params
    const {
      search,
      city,
      property_type,
      status = "ForSale", // default public houses ForSale
      sort = "created_at",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(limit) || 10));
    const skip = (pageNum - 1) * pageSize;
    const take = pageSize;

    const where = buildWhereFromQuery({ search, city, property_type, status });

    // total count for pagination
    const total = await prisma.house.count({ where });

    // orderBy — ensure we handle direction and fallback
    const orderBy = {};
    const safeOrder = order.toLowerCase() === "asc" ? "asc" : "desc";
    orderBy[sort] = safeOrder;

    const houses = await prisma.house.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        owner: { select: { id: true, name: true, username: true } },
      },
    });

    return res.status(200).json({
      houses,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    console.error("Get houses error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* GET LOGGED-IN OWNER HOUSES (with filtering/sorting/pagination) */
async function getOwnerHousesController(req, res) {
  try {
    const ownerId = req.user.id;

    // Query params for owner list (search, sort, page, limit, property_type, city, status)
    const {
      search,
      city,
      property_type,
      status,
      sort = "created_at",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Math.min(200, Number(limit) || 10)); // owners can ask larger pages
    const skip = (pageNum - 1) * pageSize;
    const take = pageSize;

    // build where and enforce owner_id
    const where = buildWhereFromQuery({ search, city, property_type, status, owner_id: ownerId });

    // count for pagination
    const total = await prisma.house.count({ where });

    const orderBy = {};
    const safeOrder = order.toLowerCase() === "asc" ? "asc" : "desc";
    orderBy[sort] = safeOrder;

    const houses = await prisma.house.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return res.status(200).json({
      houses,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    console.error("Get owner houses error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* GET HOUSE BY ID */
async function getHouseByIdController(req, res) {
  try {
    const { id } = req.params;

    const house = await prisma.house.findUnique({
      where: { id: Number(id) },
      include: {
        owner: { select: { id: true, name: true, username: true } },
      },
    });

    if (!house) return res.status(404).json({ ERROR: "House not found" });

    return res.status(200).json({ house });
  } catch (err) {
    console.error("Get house by id error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* UPDATE HOUSE (OWNER ONLY) */
async function updateHouseController(req, res) {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const existingHouse = await prisma.house.findUnique({
      where: { id: Number(id) },
    });

    if (!existingHouse)
      return res.status(404).json({ ERROR: "House not found" });

    if (existingHouse.owner_id !== ownerId)
      return res.status(403).json({ ERROR: "Forbidden" });

    const updateData = { ...req.body };

    // Fix numeric fields
    if (updateData.bedrooms) updateData.bedrooms = Number(updateData.bedrooms);
    if (updateData.bathrooms) updateData.bathrooms = Number(updateData.bathrooms);
    if (updateData.area_sqft) updateData.area_sqft = Number(updateData.area_sqft);
    if (updateData.rent) updateData.rent = Number(updateData.rent);

    // Fix Date
    if (updateData.available_from)
      updateData.available_from = new Date(updateData.available_from);

    // FIX amenities
    if (updateData.amenities) {
      if (Array.isArray(updateData.amenities)) {
        updateData.amenities = updateData.amenities;
      } else {
        updateData.amenities = updateData.amenities
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a.length > 0);
      }
    }

    const updatedHouse = await prisma.house.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return res
      .status(200)
      .json({ message: "House updated", house: updatedHouse });

  } catch (err) {
    console.error("Update house error:", err);
    return res.status(500).json({ ERROR: err.message });
  }
}

/* DELETE HOUSE (OWNER ONLY) */
async function deleteHouseController(req, res) {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const existingHouse = await prisma.house.findUnique({
      where: { id: Number(id) },
    });

    if (!existingHouse)
      return res.status(404).json({ ERROR: "House not found" });

    if (existingHouse.owner_id !== ownerId)
      return res.status(403).json({ ERROR: "Forbidden" });

    await prisma.house.delete({ where: { id: Number(id) } });

    return res
      .status(200)
      .json({ message: "House deleted successfully" });

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
