const express = require("express");
const corsMiddleware = require("./config/cors.js");
const usersRouter = require("./routes/userRoute.js");
const houseRoutes = require("./routes/housesRoute.js");
const interestRoutes = require("./routes/interestRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;


app.use(corsMiddleware);


app.use(express.json());


app.use("/api/users", usersRouter);
app.use("/api/houses", houseRoutes);
app.use("/api/interests", interestRoutes);


app.get("/", (req, res) => {
  res.status(200).send("<h1>RentEase Backend Running Successfully 🚀</h1>");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
  console.log(`Deployed Backend URL: ${process.env.BACKEND_SERVER_URL}`);
});
