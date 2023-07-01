const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getMalaysiaDateTime } = require("../datetimeUtils");

// Create a teacher data
router.post("/api/teacher", async (req, res) => {
    const createdAt = getMalaysiaDateTime();
    const createdTeacher = await prisma.teacher.create({
        data: { ...req.body, createdAt },
    });
    res.json(createdTeacher);
});

// Get all teachers data
router.get("/api/teachers", async (req, res) => {
    try {
        const teachers = await prisma.teacher.findMany({
            include: { user: true },
            orderBy: {
                createdAt: "asc",
            },
        });
        res.json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve all teachers" });
    }
});

// Check teacher data
router.post("/api/existingteacher/:noICTeacher", async (req, res) => {
    const { noICTeacher } = req.params;
    try {
        const existingTeacher = await prisma.teacher.findUnique({
            where: { noICTeacher },
        });
        const isExistingTeacher = !!existingTeacher;

        res.json(isExistingTeacher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve users" });
    }
});

// Get data of teacher
router.get("/api/teacher/:teacherId", async (req, res) => {
    const { teacherId } = req.params;
    try {
        const teacher = await prisma.teacher.findUnique({
            where: { idTeacher: teacherId },
            include: { user: true, subjects: true },
        });
        return res.status(200).json(teacher);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get teacher id based on teacher name
router.get("/api/teacher/id/:nameTeacher", async (req, res) => {
    const { nameTeacher } = req.params;

    try {
        const teacher = await prisma.teacher.findFirst({
            where: { nameTeacher },
            // include: { user: true },
        });
        if (teacher) {
            return res.status(200).json(teacher.idTeacher);
        } else {
            return res.status(404).json({ message: "Teacher not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Update teacher data
router.put("/api/teacher/:teacherId", async (req, res) => {
    const { teacherId } = req.params;

    try {
        const updatedTeacher = await prisma.teacher.update({
            where: { idTeacher: teacherId },
            include: { subjects: true },
            data: req.body,
        });
        res.json(updatedTeacher);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not update teacher." });
    }
});

// Delete teacher and user data
router.delete("/api/teacher/:teacherId", async (req, res) => {
    const { teacherId } = req.params;

    try {
        const deletedTeacher = await prisma.teacher.delete({
            where: { idTeacher: teacherId },
        });

        // Delete user data
        await prisma.user.delete({
            where: { idUser: deletedTeacher.idUser },
        });

        res.status(200).json(deletedTeacher);
    } catch (error) {
        res.status(500).json({ error: "Error deleting student" });
    }
});

// Get the total number of students that a specific teacher teaches
router.get("/api/studentscount/:teacherId", async (req, res) => {
    const teacherId = req.params.teacherId;

    try {
        const teacher = await prisma.teacher.findUnique({
            where: {
                idTeacher: teacherId,
            },
            include: {
                subjects: {
                    include: {
                        student_Subject: true,
                    },
                },
            },
        });

        const totalStudents = teacher.subjects.reduce(
            (total, subject) => total + subject.student_Subject.length,
            0
        );

        res.status(200).json(totalStudents);
    } catch (error) {
        console.error("Error retrieving total students:", error);
        res.status(500).json({
            error: "An error occurred while retrieving the total students.",
        });
    }
});

module.exports = router;
