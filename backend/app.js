// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customerRoute");

const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes
app.use("/api/customers", customerRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Customer CRUD API");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
