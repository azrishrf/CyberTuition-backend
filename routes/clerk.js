const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create clerk data
router.post("/api/clerk", async (req, res) => {
    const createdClerk = await prisma.clerk.create({ data: req.body });
    res.json(createdClerk);
});

module.exports = router;
