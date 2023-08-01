const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getMalaysiaDateTime } = require("../datetimeUtils");

// Create a student data
router.post("/api/student", async (req, res) => {
    const createdAt = getMalaysiaDateTime();
    const createdStudent = await prisma.student.create({
        data: { ...req.body, createdAt },
    });
    res.json(createdStudent);
});

// Create student data and wait for confirmation from the clerk
router.post("/api/students_notregistered", async (req, res) => {
    const createdAt = getMalaysiaDateTime();

    const createdStudent = await prisma.student.create({
        data: { ...req.body, createdAt },
    });
    res.json(createdStudent);
});

// Get all students data
router.get("/api/students_registered", async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            where: {
                isRegistered: true,
            },
            include: { user: true },
            orderBy: {
                createdAt: "asc",
            },
        });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve all students" });
    }
});

// Get all students data
router.get("/api/students_notregistered", async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            where: {
                isRegistered: false,
            },
            include: { user: true },
            orderBy: {
                createdAt: "asc",
            },
        });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve all students" });
    }
});

// Check student data
router.post("/api/existingstudent/:noICStudent", async (req, res) => {
    const { noICStudent } = req.params;
    try {
        const existingStudent = await prisma.student.findUnique({
            where: { noICStudent },
        });
        const isExistingStudent = !!existingStudent;

        res.json(isExistingStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve users" });
    }
});

// Get student id
router.get("/api/student/:studentId", async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await prisma.student.findUnique({
            where: { idStudent: studentId },
            include: {
                user: true,
                student_Subject: {
                    include: { subject: { include: { teacher: true } } },
                },
                student_Attendance: {
                    include: { attendance: { include: { subject: true } } },
                },
                tuitionFee: true,
            },
        });
        return res.status(200).json(student);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Update student data
router.put("/api/student/:studentId", async (req, res) => {
    const { studentId } = req.params;

    try {
        const updatedStudent = await prisma.student.update({
            where: { idStudent: studentId },
            data: req.body,
        });
        res.json(updatedStudent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not update student." });
    }
});

// Delete student and user data
router.delete("/api/student/:studentId", async (req, res) => {
    const { studentId } = req.params;

    try {
        // Delete related foreign key first
        // Delete student_Subject records
        await prisma.student_subject.deleteMany({
            where: { idStudent: studentId },
        });
        // Delete tuitionFee records associated with the student
        const tuitionFees = await prisma.tuitionfee.findMany({
            where: { idStudent: studentId },
        });

        for (const tuitionFee of tuitionFees) {
            // Delete associated receiptbank and paymentgateway records
            await prisma.receiptbank.deleteMany({
                where: { idTuitionFee: tuitionFee.idTuitionFee },
            });
            await prisma.paymentgateway.deleteMany({
                where: { idTuitionFee: tuitionFee.idTuitionFee },
            });
        }
        // Delete tuitionFee records
        await prisma.tuitionfee.deleteMany({
            where: { idStudent: studentId },
        });
        // Delete student_Attendance records
        await prisma.student_attendance.deleteMany({
            where: { idStudent: studentId },
        });

        // Delete the student data
        const deletedStudent = await prisma.student.delete({
            where: { idStudent: studentId },
        });

        // Delete the associated user
        await prisma.user.delete({
            where: { idUser: deletedStudent.idUser },
        });

        res.status(200).json(deletedStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting student" });
    }
});

module.exports = router;
