require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const priceRoutes = require("./routes/priceRoutes");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed:", err));

app.use("/api/prices", priceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
