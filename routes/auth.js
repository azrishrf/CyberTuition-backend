const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

router.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(401).json({ error: "E-Mel Tidak Sah" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ error: "Kata Laluan Tidak Sah" });
    }

    const userData = user.idUser;

    res.send(userData);
});

module.exports = router;
