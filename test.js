const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Assuming you have the following variables:
const studentSubjectId = "123"; // The ID of the Student_Subject record to delete
const studentId = "456"; // The ID of the student

// Find the Student_Subject record to delete
const studentSubject = await prisma.student_Subject.findUnique({
    where: { idStudentSubject: studentSubjectId },
    include: { subject: true }, // Include the related subject
});

// Retrieve the subject name
const subjectName = studentSubject.subject.name;

// Find the student
const student = await prisma.student.findUnique({
    where: { idStudent: studentId },
});

// Remove the subject name from the subjectsList string
const updatedSubjectsList = student.tuitionFee.subjectsList
    .split(", ")
    .filter((subject) => subject !== subjectName)
    .join(", ");

// Update the Student and TuitionFee records
const updatedStudent = await prisma.student.update({
    where: { idStudent: studentId },
    data: {
        student_Subject: {
            delete: { idStudentSubject: studentSubjectId },
        },
    },
});

const updatedTuitionFee = await prisma.tuitionFee.update({
    where: { idStudent: studentId },
    data: {
        subjectsList: updatedSubjectsList,
    },
});

// Return the updated Student and TuitionFee records
console.log(updatedStudent);
console.log(updatedTuitionFee);
