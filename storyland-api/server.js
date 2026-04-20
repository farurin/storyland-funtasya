require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Route Check
app.get("/", (req, res) =>
  res.json({ message: "Welcome to Funtasya StoryLand API" }),
);

// List route
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/bookRoutes"));
app.use("/api/corner", require("./routes/cornerRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// route admin
app.use("/api/admin", require("./routes/adminRoutes"));

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server Backend berjalan di http://localhost:${PORT}`),
);
