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

// Get attendance
router.get("/api/attendance", async (req, res) => {
    const { month, year, subjectId } = req.query;

    try {
        // const { month, year } = req.query

        let attendanceList = await prisma.attendance.findMany({
            where: { idSubject: subjectId },
            include: {
                student_Attendance: {
                    include: {
                        student: true,
                    },
                },
            },
        });

        attendanceList = attendanceList.filter((attendance) => {
            // how to get the find if the date is month and year
            const attendanceDate = new Date(attendance.date);
            return (
                attendanceDate.getMonth() + 1 === parseInt(month) &&
                attendanceDate.getFullYear() === parseInt(year)
            );
        });

        // Sort attendanceList by date in ascending order
        attendanceList.sort((a, b) => new Date(a.date) - new Date(b.date));
        res.json(attendanceList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch attendance data" });
    }
});

module.exports = router;
