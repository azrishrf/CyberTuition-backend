const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cron = require("node-cron");
const { getMalaysiaDateTime } = require("./datetimeUtils");

// Function to create tuition fee for a specific month and year
const createTuitionFee = async (month, year) => {
    const createdAt = getMalaysiaDateTime();

    // Retrieve the list of students with their associated subjects and fees
    const students = await prisma.student.findMany({
        include: {
            student_Subject: {
                include: {
                    subject: true,
                },
            },
        },
    });

    // Create tuition fee records for each student
    const tuitionFeePromises = students.map(async (student) => {
        // Check if a tuition fee record already exists for the given month and year
        const existingTuitionFee = await prisma.tuitionFee.findFirst({
            where: { idStudent: student.idStudent, month, year },
        });

        if (existingTuitionFee) {
            console.log(
                `Existing tuition fee for Student ID: ${student.idStudent}, Month: ${month}, Year: ${year}`
            );
        } else {
            const totalFee = student.student_Subject.reduce(
                (acc, studentSubject) => {
                    return acc + parseInt(studentSubject.subject.fee);
                },
                0
            );

            // Create the subjects list
            const subjectsList = student.student_Subject
                .map((studentSubject) => studentSubject.subject.name)
                .join(", ");

            const newTuitionFee = await prisma.tuitionFee.create({
                data: {
                    idStudent: student.idStudent,
                    month,
                    year,
                    amount: totalFee,
                    statusPayment: "Belum Dibayar", // Set the initial payment status as Belum Dibayar
                    subjectsList,
                    createdAt,
                },
            });

            console.log(
                `Created tuition fee for Student ID: ${student.idStudent}, Month: ${month}, Year: ${year}`
            );
            return newTuitionFee;
        }
    });

    await Promise.all(tuitionFeePromises);
};

// Schedule the task to run at the beginning of each month
cron.schedule("0 0 1 * *", () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    createTuitionFee(currentMonth, currentYear)
        .catch((error) => {
            console.error("Error creating tuition fee:", error);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
});

module.exports = { createTuitionFee };
