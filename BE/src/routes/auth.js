const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { generateTokens } = require("../utils/jwt");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, username },
  });
  const tokens = generateTokens(user);
  res.json({ ...tokens, userId: user.id });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid credentials");
  }
  const tokens = generateTokens(user);
  res.json({ ...tokens, userId: user.id });
});
