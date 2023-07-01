const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create subject data
router.post("/api/subject", async (req, res) => {
    try {
        const newSubject = await prisma.subject.create({
            data: req.body,
        });

        res.json(newSubject);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating new subject");
    }
});

// Get all subjects
router.get("/api/subjects", async (req, res) => {
    try {
        const subjects = await prisma.subject.findMany({
            include: { teacher: true },
        });
        res.json(subjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve subjects" });
    }
});

// Delete subject and user data
router.delete("/api/subject/:subjectId", async (req, res) => {
    const { subjectId } = req.params;

    try {
        const deletedSubject = await prisma.subject.delete({
            where: { idSubject: subjectId },
        });

        res.status(200).json(deletedSubject);
    } catch (error) {
        res.status(500).json({ error: "Error deleting subject" });
    }
});

// Get subject
router.get("/api/subject/:subjectId", async (req, res) => {
    const { subjectId } = req.params;
    try {
        const subject = await prisma.subject.findUnique({
            where: { idSubject: subjectId },
            include: {
                attendance: true,
                teacher: true,
                student_Subject: { include: { student: true } },
            },
        });
        return res.status(200).json(subject);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get subjectData using param subject name
router.get("/api/subject/data/:subjectName", async (req, res) => {
    const { subjectName } = req.params;
    try {
        const subject = await prisma.subject.findFirst({
            where: { name: subjectName },
        });
        return res.status(200).json(subject);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Update subject data
router.put("/api/subject/:subjectId", async (req, res) => {
    const { subjectId } = req.params;
    // const { teacherId } = req.body;

    try {
        const updatedSubject = await prisma.subject.update({
            where: { idSubject: subjectId },
            include: { teacher: true },
            data: req.body,
        });
        res.json(updatedSubject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not update subject." });
    }
});

// Get subject data
router.get("/api/students/:studentId/subjects", async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await prisma.student.findUnique({
            where: {
                idStudent: studentId,
            },
            include: {
                student_Subject: {
                    include: {
                        subject: true,
                    },
                },
            },
        });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        const subjects = student.student_Subject.map(
            (studentSubject) => studentSubject.subject
        );

        res.json(subjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
