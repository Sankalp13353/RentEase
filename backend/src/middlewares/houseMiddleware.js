// Check if logged-in user is an Owner
function ownerOnlyMiddleware(req, res, next) {
  if (req.user.role !== "Owner") {
    return res.status(403).json({ ERROR: "Only owners can add properties" });
  }
  next();
}

// Validate required property fields
function validatePropertyFields(req, res, next) {
  const { title, address, city, state, zipcode } = req.body;
  console.log("Validating property fields:", { title, address, city, state, zipcode });
  if (!title || !address || !city || !state || !zipcode) {
    return res.status(400).json({ ERROR: "Required fields missing" });
  }
  next();
}

module.exports = { ownerOnlyMiddleware, validatePropertyFields };
