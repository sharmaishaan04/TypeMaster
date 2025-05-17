const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const leaderboard = await prisma.statistic.findMany({
    orderBy: { wpm: "desc" },
    take: 10,
    include: { user: { select: { username: true, id: true } } },
  });
  res.json(leaderboard);
});
