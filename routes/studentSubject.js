const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Choose subject for student
router.post("/api/student_subject", async (req, res) => {
    const studentSubject = await prisma.student_Subject.create({
        data: req.body,
    });
    res.json(studentSubject);
});

// Get subject that student takes
router.get("/students/:id/subjects", async (req, res) => {
    try {
        // Authenticate the user
        // Here, we assume that the user ID is passed as a parameter in the URL
        const userId = req.params.id;
        const user = await prisma.user.findUnique({
            where: { idUser: userId },
            include: {
                student: {
                    include: {
                        Student_Subject: { include: { subject: true } },
                    },
                },
            },
        });

        // Query the database to retrieve the list of subjects for the student
        const subjects = user.student[0].Student_Subject.map(
            (studentSubject) => studentSubject.subject
        );

        // Map the retrieved data to a response format suitable for the front-end
        const mappedData = subjects.map((subject) => ({
            id: subject.idSubject,
            name: subject.name,
            time: subject.time,
            day: subject.day,
            fee: subject.fee,
        }));

        // Return the mapped data as a JSON response
        res.json(mappedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
