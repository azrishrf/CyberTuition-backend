const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

// Create a user data
router.post("/api/user", async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            email,
            password: hashedPassword,
            role,
        };
        const createdUser = await prisma.user.create({ data: user });
        res.json(createdUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating new user");
    }
});

// Get all users data
router.get("/api/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve all users" });
    }
});

// Get user data
router.get("/api/user/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const users = await prisma.user.findUnique({
            where: { idUser: userId },
            include: { student: true, teacher: true },
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve users" });
    }
});

// Check user data
router.post("/api/existinguser/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        const isExistingUser = !!existingUser;
        res.json(isExistingUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve users" });
    }
});

// Update user data
router.put("/api/user/:userId", async (req, res) => {
    const { userId } = req.params;
    const { email } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { idUser: userId },
            data: { email },
        });
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not update user." });
    }
});

// Change password
router.post("/api/password", async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(401).json({ error: "E-Mel Salah" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ error: "Kata Laluan Semasa Salah" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
        where: { idUser: user.idUser },
        data: { password: hashedPassword },
    });

    res.send({ message: "Password updated successfully" });
});

module.exports = router;
