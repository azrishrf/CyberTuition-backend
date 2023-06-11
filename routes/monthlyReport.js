const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Graph
// Graph total students
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

// Report
// Total Student
router.post("/api/report/students", async (req, res) => {
    try {
        const { month, year } = req.body;
        const prisma = new PrismaClient();

        // Convert month and year to a valid date format
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(`${year}-${month}-31`);

        // Get the total students at the specified month plus the months before
        const totalStudents = await prisma.student.count({
            where: {
                createdAt: {
                    lt: endDate,
                },
            },
        });

        // Get the total students at the specified month
        const totalStudentsNewRegistered = await prisma.student.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        // Get the total students in Form 4 at the specified month plus the months before
        const totalForm4Students = await prisma.student.count({
            where: {
                form: 4,
                createdAt: {
                    lt: endDate,
                },
            },
        });

        // Get the total students in Form 5 at the specified month plus the months before
        const totalForm5Students = await prisma.student.count({
            where: {
                form: 5,
                createdAt: {
                    lt: endDate,
                },
            },
        });

        // Return the student reports as a JSON response
        res.json({
            totalStudents,
            totalStudentsNewRegistered,
            totalForm4Students,
            totalForm5Students,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Total teacher
router.post("/api/report/teachers", async (req, res) => {
    try {
        const { month, year } = req.body;
        const prisma = new PrismaClient();

        // Convert month and year to a valid date format
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(`${year}-${month}-31`);

        // Get the total teachers at the specified month plus the months before
        const totalTeachers = await prisma.teacher.count({
            where: {
                createdAt: {
                    lt: endDate,
                },
            },
        });

        // Get the total teachers at the specified month
        const totalTeachersNewRegistered = await prisma.teacher.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        // Return the teacher reports as a JSON response
        res.json({
            totalTeachers,
            totalTeachersNewRegistered,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Classes
router.post("/api/report/subjects", async (req, res) => {
    try {
        const { month, year } = req.body;
        const prisma = new PrismaClient();

        // Convert month and year to a valid date format
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(`${year}-${month}-31`);

        // Get the total number of classes
        const totalClasses = await prisma.subject.count();

        // Get the total students taking each subject at the specified month plus the months before
        const subjects = await prisma.subject.findMany({
            include: {
                student_Subject: {
                    where: {
                        createdAt: {
                            lte: endDate,
                        },
                    },
                    include: {
                        student: true,
                    },
                },
            },
        });

        // Calculate the total students for each subject
        const subjectStudentCounts = subjects.map((subject) => ({
            subjectName: subject.name,
            totalStudents: subject.student_Subject.length,
        }));

        // Return the subject reports as a JSON response
        res.json({
            totalClasses,
            subjectStudentCounts,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Attendance
router.post("/api/report/attendance", async (req, res) => {
    try {
        const { month, year } = req.body;

        // Convert month and year to a valid date format
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(`${year}-${month}-31`);

        // Get the total attendance at the specified month
        const totalAttendance = await prisma.attendance.count({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        // Get the total student attendance (where isAttend is true) at the specified month
        const totalStudentAttends = await prisma.student_Attendance.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                isAttend: true,
            },
        });

        // Get the total student attendance (where isAttend is false) at the specified month
        const totalStudentNotAttends = await prisma.student_Attendance.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                isAttend: false,
            },
        });

        // Get the total student attendance at the specified month
        const totalStudentAttendanceAll = await prisma.student_Attendance.count(
            {
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            }
        );

        // Calculate the percentage of student attendance (where isAttend is true) at the specified month
        const percentageAttends =
            ((totalStudentAttends / totalStudentAttendanceAll) * 100).toFixed(
                2
            ) + "%";

        // Calculate the percentage of student attendance that is false at the specified month
        const percentageNotAttends =
            (
                100 -
                (
                    (totalStudentAttends / totalStudentAttendanceAll) *
                    100
                ).toFixed(2)
            ).toFixed(2) + "%";

        // Return the attendance reports as a JSON response
        res.json({
            totalAttendance,
            totalStudentAttends,
            totalStudentNotAttends,
            totalStudentAttendanceAll,
            percentageAttends,
            percentageNotAttends,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Tuition Fee
router.post("/api/report/tuitionfees", async (req, res) => {
    try {
        const { month, year } = req.body;
        const prisma = new PrismaClient();

        // Convert month and year to numbers
        const targetMonth = parseInt(month);
        const targetYear = parseInt(year);

        // Get the total amount of tuition fees at the specified month
        const totalTuitionFees = await prisma.tuitionFee.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                month: targetMonth,
                year: targetYear,
            },
        });

        // Get the total amount of tuition fees with statusPayment "Telah Dibayar" at the specified month
        const totalTuitionFeesPaid = await prisma.tuitionFee.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                month: targetMonth,
                year: targetYear,
                statusPayment: "Telah Dibayar",
            },
        });

        // Get the total amount of tuition fees with statusPayment "Belum Dibayar" at the specified month
        const totalTuitionFeesUnpaid = await prisma.tuitionFee.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                month: targetMonth,
                year: targetYear,
                statusPayment: "Belum Dibayar",
            },
        });

        // Return the tuition fee reports as a JSON response
        res.json({
            totalTuitionFees: totalTuitionFees._sum.amount || 0,
            totalTuitionFeesPaid: totalTuitionFeesPaid._sum.amount || 0,
            totalTuitionFeesUnpaid: totalTuitionFeesUnpaid._sum.amount || 0,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
