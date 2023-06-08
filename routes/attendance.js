const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create attendance
router.post("/api/attendance/", async (req, res) => {
    const { idSubject, date, time } = req.body;
    try {
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                date,
                idSubject,
            },
        });

        if (existingAttendance) {
            res.json(existingAttendance);
            console.log("existing attendance");
        } else {
            const newAttendance = await prisma.attendance.create({
                data: req.body,
            });
            res.json(newAttendance);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not create attendance." });
    }
});

// Get attendance
router.get("/api/attendance/:attendanceId", async (req, res) => {
    const { attendanceId } = req.params;
    try {
        const attendance = await prisma.subject.findUnique({
            where: { idAttendance: attendanceId },
        });
        return res.status(200).json(attendance);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
