
function ownerOnlyMiddleware(req, res, next) {
  if (req.user.role !== "Owner") {
    return res.status(403).json({ ERROR: "Only owners can add properties" });
  }
  next();
}

function validatePropertyFields(req, res, next) {
  const { title, address, city, state, zipcode, property_type } = req.body;
  console.log("Validating property fields:", { title, address, city, state, zipcode, property_type });

  if (!title || !address || !city || !state || !zipcode || !property_type) {
    return res.status(400).json({ ERROR: "Required fields missing" });
  }

  const validPropertyTypes = ["Apartment", "Villa", "Independent", "Studio", "Other"];
  if (!validPropertyTypes.includes(property_type)) {
    return res.status(400).json({ ERROR: `Invalid property_type. Must be one of: ${validPropertyTypes.join(", ")}` });
  }
  next();
}

module.exports = { ownerOnlyMiddleware, validatePropertyFields };