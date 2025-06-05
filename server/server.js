// server/server.js
const express = require("express");
const cors = require("cors");
const app = express();

const residentsRoutes = require("./routes/residents");
const householdsRoutes = require("./routes/households");
const residentDetailsRoutes = require("./routes/residentDetails");
const addressRoutes = require("./routes/address");
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use("/api/residents", residentsRoutes);
app.use("/api/households", householdsRoutes);
app.use("/api/resident-details", residentDetailsRoutes);
app.use('/api', authRoutes);
app.use("/api/address", addressRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});