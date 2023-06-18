const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

// Create clerk data
router.post("/api/clerk", async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user first
    const createdUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: "Clerk",
        },
    });

    // Create the clerk using the created user's ID
    const createdClerk = await prisma.clerk.create({
        data: {
            idUser: createdUser.idUser,
        },
    });

    res.json({
        success: true,
        message: "Clerk created successfully",
        clerk: createdClerk,
    });
});

module.exports = router;
