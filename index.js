require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const priceRoutes = require("./routes/priceRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed:", err));

app.use(
  cors({
    origin: "http://localhost:5173", // or '*' for all origins (not recommended for production)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/prices", priceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
