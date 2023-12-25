const dotenv = require("dotenv");
const express = require('express');
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const db = require('./config/db');
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

// Configure dotenv
dotenv.config();

// Connect with the database
db();

// Create the express app
const app = express();

// Define the PORT
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'https://ecommerce-app-4mt6.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);

// Rest APIs
app.get('/', (req, res) => {
    res.send("Hello");
});

// Start the server
app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`.bgCyan.white);
});
