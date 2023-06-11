const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getMalaysiaDateTime } = require("../datetimeUtils");

// Choose subject for student
router.post("/api/student_subject", async (req, res) => {
    const createdAt = getMalaysiaDateTime();
    const studentSubject = await prisma.student_Subject.create({
        data: { ...req.body, createdAt },
    });
    res.json(studentSubject);
});

// Update subject for student
router.post("/api/student_subject/addsubject", async (req, res) => {
    try {
        const createdAt = getMalaysiaDateTime();
        const { idStudent, idSubject } = req.body;

        console.log(idSubject);

        // Retrieve the subject fee and name
        const subject = await prisma.subject.findFirst({
            where: { idSubject: idSubject },
        });

        if (!subject) {
            return res.status(404).json({ error: "Subject not found." });
        }

        // Get the current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        // Update the subjectsList for the student's tuition fee
        const tuitionFee = await prisma.tuitionFee.findFirst({
            where: {
                idStudent: idStudent,
                month: currentMonth,
                year: currentYear,
            },
        });

        let updatedSubjectsList = "";

        // Split the subjectsList string into an array of subjects
        const subjectsArray = tuitionFee.subjectsList
            ? tuitionFee.subjectsList.split(", ")
            : [];
        console.log(subjectsArray);

        // Add the new subject to the subjectsArray if it's not already present
        subjectsArray.push(subject.name);

        // Join the subjectsArray back into a string
        updatedSubjectsList = subjectsArray.join(", ");

        console.log(updatedSubjectsList);

        // Create the student subject record
        const studentSubject = await prisma.student_Subject.create({
            data: {
                idStudent,
                idSubject,
                createdAt,
            },
            include: { subject: true },
        });

        // Calculate the new amount for the tuition fee
        const subjectFee = subject.fee;
        const existingAmount = tuitionFee ? tuitionFee.amount : 0;
        const newAmount = existingAmount + subjectFee;

        // Update the tuition fee for the current month and year
        const updatedTuitionFee = await prisma.tuitionFee.update({
            where: {
                idTuitionFee: tuitionFee.idTuitionFee,
            },
            data: {
                amount: newAmount,
                subjectsList: updatedSubjectsList,
            },
        });

        res.json(studentSubject);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while creating the student subject.",
        });
    }
});

// Delete student and subject data
router.delete("/api/student_subject/:studentSubjectId", async (req, res) => {
    try {
        const studentSubjectId = req.params.studentSubjectId; // Retrieve the studentSubjectId from the route parameters

        // Find the Student_Subject record to delete
        const studentSubject = await prisma.student_Subject.findUnique({
            where: { idStudentSubject: studentSubjectId },
            include: {
                subject: true,
                student: { include: { tuitionFee: true } },
            }, // Include the related subject, student, and tuitionFee
        });

        if (!studentSubject) {
            return res
                .status(404)
                .json({ error: "Student subject not found." });
        }

        // Retrieve the subject name and current month/year
        const { name: subjectName } = studentSubject.subject;
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        // Find the tuitionFee for the current month and year
        const currentTuitionFee = studentSubject.student.tuitionFee.find(
            (fee) => fee.month === currentMonth && fee.year === currentYear
        );

        if (!currentTuitionFee) {
            return res.status(404).json({
                error: "Tuition fee for the current month and year not found.",
            });
        }

        // Retrieve the subjectsList from the currentTuitionFee
        const subjectsList = currentTuitionFee.subjectsList;

        // Remove the subject name from the subjectsList string
        const updatedSubjectsList = subjectsList
            .replace(subjectName, "")
            .replace(/, ,/g, ",") // Remove any double commas
            .replace(/(^,)|(,$)/g, "") // Remove leading/trailing commas
            .trim();

        // Calculate the reduction amount based on the subject's fee
        const subjectFee = parseInt(studentSubject.subject.fee);
        const reductionAmount = currentTuitionFee.amount - subjectFee;

        // Update the Student_Subject and TuitionFee records
        const deletedStudentSubject = await prisma.student_Subject.delete({
            where: { idStudentSubject: studentSubjectId },
            include: {
                subject: true,
            },
        });

        const updatedTuitionFee = await prisma.tuitionFee.update({
            where: { idTuitionFee: currentTuitionFee.idTuitionFee },
            data: {
                subjectsList: updatedSubjectsList,
                amount: reductionAmount,
            },
        });

        // Return the updated TuitionFee record
        res.json(deletedStudentSubject);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            error: "An error occurred while deleting the student subject.",
        });
    }
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
