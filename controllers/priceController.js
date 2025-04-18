const Product = require("../models/Product");
const mlRegression = require("ml-regression-multivariate-linear");

// Fetch average price for a product name
exports.getAveragePrice = async (req, res) => {
  let { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Product name is required." });
  }

  name = name.toLowerCase();

  try {
    const products = await Product.find({ name });

    if (!products.length) {
      return res
        .status(404)
        .json({ message: `No products found for name: ${name}` });
    }

    const totalPrice = products.reduce((sum, item) => sum + item.price, 0);
    const averagePrice = (totalPrice / products.length).toFixed(2);

    res.status(200).json({
      name,
      averagePrice: parseFloat(averagePrice),
      count: products.length,
    });
  } catch (error) {
    console.error("❌ Error in getAveragePrice:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching average price." });
  }
};

// Predict future price based on historical data using linear regression
exports.predictFuturePrice = async (req, res) => {
  let { name, futureDate } = req.body;

  if (!name || !futureDate) {
    return res
      .status(400)
      .json({ message: "Both 'name' and 'futureDate' are required." });
  }

  name = name.toLowerCase();

  try {
    const products = await Product.find({ name }).sort({ dateAdded: 1 });

    if (products.length < 2) {
      return res.status(400).json({
        message: "Not enough historical data to make a prediction.",
      });
    }

    // Base date for calculating days difference
    const baseDate = new Date(products[0].dateAdded);
    const dateToDays = (date) =>
      Math.floor((new Date(date) - baseDate) / (1000 * 60 * 60 * 24));

    // Prepare training data
    const inputs = products.map((p) => [dateToDays(p.dateAdded)]);
    const outputs = products.map((p) => [p.price]);

    // Logging the trend
    console.log("📈 Price trend data:");
    products.forEach((p, i) => {
      console.log(`Day ${inputs[i][0]} → ₹${p.price}`);
    });

    // Train the model
    const regression = new mlRegression(inputs, outputs);

    // Predict price
    const futureDays = dateToDays(futureDate);
    const prediction = regression.predict([futureDays]);

    res.status(200).json({
      name,
      futureDate: new Date(futureDate).toISOString().split("T")[0],
      predictedPrice: parseFloat(prediction[0].toFixed(2)),
    });
  } catch (error) {
    console.error("❌ Error in predictFuturePrice:", error);
    res
      .status(500)
      .json({ error: "Server error while predicting future price." });
  }
};
