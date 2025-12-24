const cors = require("cors");
require("dotenv").config();


const allowedOrigins = [
  process.env.FRONTEND_LOCAL_URL,   
  process.env.FRONTEND_SERVER_URL   
].filter(Boolean); 

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

module.exports = cors(corsOptions);
