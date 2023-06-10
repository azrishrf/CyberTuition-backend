const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/api/totalstudents", async (req, res) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
    const currentYear = currentDate.getFullYear();

    const totalStudentsPromises = [];
    const totalStudentsArray = [];

    for (let i = 0; i < 5; i++) {
        const month = currentMonth - i;
        const year = currentYear;

        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);

        const totalStudentsPromise = prisma.student.count({
            where: {
                createdAt: {
                    gte: startOfMonth.toISOString(),
                    lt: endOfMonth.toISOString(),
                },
            },
        });

        totalStudentsPromises.push(totalStudentsPromise);
    }

    try {
        const totalStudents = await Promise.all(totalStudentsPromises);

        totalStudentsArray.push(...totalStudents.reverse());

        // Send the total students array to the front end
        res.json(totalStudentsArray);
    } catch (error) {
        console.error("Error:", error);
        // Handle the error and send an appropriate response to the front end
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
