const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticate = require("../middlewares/auth");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authenticate, async (req, res) => {
  const { wpm, accuracy, timeTaken } = req.body;
  const stat = await prisma.statistic.create({
    data: { wpm, accuracy, timeTaken, userId: req.user.id },
  });
  res.json(stat);
});

router.get("/", authenticate, async (req, res) => {
  const stats = await prisma.statistic.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  res.json(stats);
});
