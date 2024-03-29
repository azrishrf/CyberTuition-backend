const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getMalaysiaDateTime } = require("../datetimeUtils");

// Create student_attendance
router.post("/api/student_attendance", async (req, res) => {
    const createdAt = getMalaysiaDateTime();

    const studentAttendance = await prisma.student_attendance.create({
        data: { ...req.body, createdAt },
    });
    res.json(studentAttendance);
});

// Get data attendance of student
router.get("/api/studentAttendance/:idStudentAttendance", async (req, res) => {
    const { idStudentAttendance } = req.params;
    try {
        const studentAttendanceData =
            await prisma.student_attendance.findUnique({
                where: { idStudentAttendance },
                include: {
                    student: true,
                    attendance: { include: { subject: true } },
                },
            });
        return res.status(200).json(studentAttendanceData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get amount of students that attend
router.get("/api/studentattend/:attendanceId", async (req, res) => {
    const { attendanceId } = req.params;

    try {
        const attendance = await prisma.attendance.findFirst({
            where: {
                idAttendance: attendanceId,
            },
            include: {
                student_Attendance: {
                    where: {
                        isAttend: true,
                    },
                },
            },
        });
        const studentCount = attendance.student_Attendance.length;

        return res.status(200).json(studentCount);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// update status attendance for student to true
router.put("/api/student_attendance/:idStudentAttendance", async (req, res) => {
    const { idStudentAttendance } = req.params;

    try {
        const updatedStudentAttendance = await prisma.student_attendance.update(
            {
                where: { idStudentAttendance },
                data: { isAttend: true },
            }
        );

        res.json(updatedStudentAttendance);
    } catch (error) {
        console.error("Error updating student attendance:", error);
        res.status(500).json({
            error: "Error updating student attendance.",
        });
    }
});

// mark student attend class (As teacher)
router.put("/api/markAttend/student_attendance", async (req, res) => {
    const { idAttendance, idStudent } = req.body;

    try {
        const studentAttendance = await prisma.student_attendance.findFirst({
            where: {
                idAttendance,
                idStudent,
            },
        });

        const idStudentAttendance = studentAttendance.idStudentAttendance;
        const updatedStudentAttendance = await prisma.student_attendance.update(
            {
                where: { idStudentAttendance },
                data: { idAttendance, idStudent, isAttend: true },
            }
        );

        res.json(updatedStudentAttendance);
    } catch (error) {
        console.error("Error updating student attendance:", error);
        res.status(500).json({
            error: "Error updating student attendance.",
        });
    }
});

// mark student not attend class (As teacher)
router.put("/api/markNotAttend/student_attendance", async (req, res) => {
    const { idAttendance, idStudent } = req.body;

    try {
        const studentAttendance = await prisma.student_attendance.findFirst({
            where: {
                idAttendance,
                idStudent,
            },
        });

        const idStudentAttendance = studentAttendance.idStudentAttendance;
        const updatedStudentAttendance = await prisma.student_attendance.update(
            {
                where: { idStudentAttendance },
                data: { idAttendance, idStudent, isAttend: false },
            }
        );

        res.json(updatedStudentAttendance);
    } catch (error) {
        console.error("Error updating student attendance:", error);
        res.status(500).json({
            error: "Error updating student attendance.",
        });
    }
});

// checks if the idSubject in student_Subject is the same as the idSubject in attendance
// used when student want to scan qr code to make sure student scan correct subject qr code
router.post("/api/student_subject/check-subject-match", async (req, res) => {
    const { idStudent, idAttendance } = req.body;

    try {
        const attendance = await prisma.attendance.findFirst({
            where: {
                idAttendance,
            },
        });

        if (attendance) {
            const match = await prisma.student_subject.findFirst({
                where: {
                    idStudent,
                    idSubject: attendance.idSubject,
                },
            });

            if (match) {
                res.json(true);
            } else {
                res.json(false);
            }
        } else {
            res.json(false);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

// Check existing attendance record for scanning qr code
router.get(
    "/api/student_attendance/:attendanceId/:studentId",
    async (req, res) => {
        const { attendanceId, studentId } = req.params;
        try {
            const existingRecord = await prisma.student_attendance.findFirst({
                where: {
                    idAttendance: attendanceId,
                    idStudent: studentId,
                },
            });

            res.json(existingRecord);
        } catch (error) {
            console.error("Error checking student_attendance:", error);
            res.status(500).json({
                error: "Error checking student_attendance.",
            });
        }
    }
);

// Check existing attendance records
router.get("/api/student_attendance/:studentId", async (req, res) => {
    const { studentId } = req.params;
    try {
        const existingRecord = await prisma.student_attendance.findMany({
            where: {
                idStudent: studentId,
            },
        });

        res.json(existingRecord);
    } catch (error) {
        console.error("Error checking student_attendance:", error);
        res.status(500).json({
            error: "Error checking student_attendance 2.",
        });
    }
});

// Get all students based on idAttendance and display attendance detail
router.get("/api/attendance/students/:idAttendance", async (req, res) => {
    const idAttendance = req.params.idAttendance;

    try {
        const students = await prisma.student_attendance.findMany({
            where: { idAttendance },
            include: { student: true },
        });

        const formattedStudents = students.map((studentAttendance) => {
            return {
                idStudent: studentAttendance.student.idStudent,
                name: studentAttendance.student.nameStudent,
                form: studentAttendance.student.form,
                isAttend: studentAttendance.isAttend,
            };
        });

        res.json(formattedStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while retrieving the students.",
        });
    }
});

// Post all student_attendance after teacher display qr code
router.post(
    "/api/student_attendance/:subjectId/:attendanceId/:date",
    async (req, res) => {
        const { subjectId, attendanceId, date } = req.params;

        try {
            const allStudents = await prisma.student_subject.findMany({
                where: { idSubject: subjectId },
            });

            const existingRecord = allStudents.map((student) => ({
                idStudent: student.idStudent,
                idAttendance: attendanceId,
            }));

            await Promise.all(
                existingRecord.map(async (record) => {
                    const foundRecord =
                        await prisma.student_attendance.findFirst({
                            where: {
                                idStudent: record.idStudent,
                                idAttendance: record.idAttendance,
                            },
                        });

                    if (foundRecord) {
                        console.log("Matching record found:", foundRecord);
                    } else {
                        // Create student_attendance record here
                        const createdRecord =
                            await prisma.student_attendance.create({
                                data: {
                                    idStudent: record.idStudent,
                                    idAttendance: record.idAttendance,
                                    isAttend: false,
                                    createdAt: date,
                                },
                            });
                        console.log(
                            "Created student_attendance record:",
                            createdRecord
                        );
                    }
                })
            );

            res.sendStatus(200); // Send a response indicating success
        } catch (error) {
            console.error(error);
            res.sendStatus(500); // Send a response indicating an error
        }
    }
);

module.exports = router;
