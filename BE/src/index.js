require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth");
const statRoutes = require("./routes/statistics");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/statistics", statRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
