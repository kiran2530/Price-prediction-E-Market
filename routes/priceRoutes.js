const express = require("express");
const router = express.Router();
const {
  getAveragePrice,
  predictFuturePrice,
} = require("../controllers/priceController");

router.get("/average", getAveragePrice);
router.get("/predict", predictFuturePrice);

module.exports = router;
