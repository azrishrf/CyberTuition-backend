const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Import the createTuitionFee function from createTuitionFee.js
require("./createTuitionFee");

app.use(express.json());
/* HTTP Status Code
200 - Ok : read, delete, update
201 - Created : create
204 - No Content : logout
400 - Bad Request : takde password utk login, xde nama utk create student data/data x ckup
404 - Not Found : tak jumpa
409 - Conflict : email dah ada
500 - Internal Server Error : database error, server down
*/

// enable CORS for all routes
app.use(cors());

// Create a user data (email, password & role)
app.post("/api/user", async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            email,
            password: hashedPassword,
            role,
        };
        const createdUser = await prisma.user.create({ data: user });
        res.json(createdUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating new subject");
    }
});

// Get all users data
app.get("/api/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve all users" });
    }
});

// Create a student data
app.post("/api/student", async (req, res) => {
    const createdStudent = await prisma.student.create({ data: req.body });
    res.json(createdStudent);
});

// Create student data and wait for confirmation from the clerk
app.post("/api/students_notregistered", async (req, res) => {
    const createdStudent = await prisma.student.create({ data: req.body });
    res.json(createdStudent);
});

// Get all students data
app.get("/api/students_registered", async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            where: {
                isRegistered: true,
            },
            include: { user: true },
        });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve all students" });
    }
});

// Get all students data
app.get("/api/students_notregistered", async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            where: {
                isRegistered: false,
            },
            include: { user: true },
        });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve all students" });
    }
});

// Create a teacher data
app.post("/api/teacher", async (req, res) => {
    const createdTeacher = await prisma.teacher.create({ data: req.body });
    res.json(createdTeacher);
});

// Get all teachers data
app.get("/api/teachers", async (req, res) => {
    try {
        const teachers = await prisma.teacher.findMany({
            include: { user: true },
        });
        res.json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve all teachers" });
    }
});

// Create clerk data
app.post("/api/clerk", async (req, res) => {
    const createdClerk = await prisma.clerk.create({ data: req.body });
    res.json(createdClerk);
});

// Create subject data
app.post("/api/subject", async (req, res) => {
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
app.get("/api/subjects", async (req, res) => {
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

// Choose subject for student
app.post("/api/student_subject", async (req, res) => {
    const studentSubject = await prisma.student_Subject.create({
        data: req.body,
    });
    res.json(studentSubject);
});

// Create tuition fee
app.post("/api/createtuitionfee", async (req, res) => {
    const { month, year, idStudent, subjectsList } = req.body;
    console.log(req.body);
    console.log(idStudent);
    try {
        const createTuitionfee = await prisma.tuitionFee.create({
            data: { month, year, idStudent, subjectsList, isPaid: false },
        });
        return res.status(200).json(createTuitionfee);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Login
app.use("", require("./routes/auth"));

// Create attendance
app.post("/api/attendance/", async (req, res) => {
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

// Create student_attendance
app.post("/api/student_attendance", async (req, res) => {
    const studentAttendance = await prisma.student_Attendance.create({
        data: req.body,
    });
    res.json(studentAttendance);
});

// Check student paid yet
app.post("/api/check-tuition-fee", async (req, res) => {
    try {
        const { month, year, studentId } = req.body;

        // Query the TuitionFee table to check if a record exists for the given month, year, and student ID
        const tuitionFee = await prisma.tuitionFee.findFirst({
            where: {
                month,
                year,
                idStudent: studentId,
            },
        });

        // Check if a tuition fee record exists
        const isTuitionFeePaid = !!tuitionFee;

        res.json(isTuitionFeePaid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Use params
// Create tuition fee for student

// Get user data
app.get("/api/user/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const users = await prisma.user.findUnique({
            where: { idUser: userId },
            include: { student: true, teacher: true },
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to retrieve users" });
    }
});

// Get student id
app.get("/api/student/:studentId", async (req, res) => {
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

// Get data of teacher
app.get("/api/teacher/:teacherId", async (req, res) => {
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

// Get data attendance of student
app.get("/api/studentAttendance/:idStudentAttendance", async (req, res) => {
    const { idStudentAttendance } = req.params;
    try {
        const studentAttendanceData =
            await prisma.Student_Attendance.findUnique({
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

// Get teacher id based on teacher name
app.get("/api/teacher/id/:nameTeacher", async (req, res) => {
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

// Update user data
app.put("/api/user/:userId", async (req, res) => {
    const { userId } = req.params;
    const { email } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { idUser: userId },
            data: { email },
        });
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not update user." });
    }
});

// Update student data
app.put("/api/student/:studentId", async (req, res) => {
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

// Update teacher data
app.put("/api/teacher/:teacherId", async (req, res) => {
    const { teacherId } = req.params;

    try {
        const updatedTeacher = await prisma.teacher.update({
            where: { idTeacher: teacherId },
            data: req.body,
        });
        res.json(updatedTeacher);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not update teacher." });
    }
});

// Delete student and user data
app.delete("/api/student/:studentId", async (req, res) => {
    const { studentId } = req.params;

    try {
        // Delete related foreign key first
        // Delete student_Subject records
        await prisma.student_Subject.deleteMany({
            where: { idStudent: studentId },
        });
        // Delete tuitionFee records
        await prisma.tuitionFee.deleteMany({
            where: { idStudent: studentId },
        });
        // Delete student_Attendance records
        await prisma.student_Attendance.deleteMany({
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

// Delete teacher and user data
app.delete("/api/teacher/:teacherId", async (req, res) => {
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

// Delete subject and user data
app.delete("/api/subject/:subjectId", async (req, res) => {
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
app.get("/api/subject/:subjectId", async (req, res) => {
    const { subjectId } = req.params;
    try {
        const subject = await prisma.subject.findUnique({
            where: { idSubject: subjectId },
            include: { attendance: true, teacher: true, student_Subject: true },
        });
        return res.status(200).json(subject);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get subjectData using param subject name
app.get("/api/subject/data/:subjectName", async (req, res) => {
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

// Get attendance
app.get("/api/attendance/:attendanceId", async (req, res) => {
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

// Get tuition fee
app.post("/api/tuitionfee", async (req, res) => {
    const { month, year, idStudent } = req.body;
    console.log(req.body);
    console.log(idStudent);
    try {
        const tuitionfee = await prisma.tuitionFee.findFirst({
            where: { month, year, idStudent },
        });
        return res.status(200).json(tuitionfee);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get student that attend
app.get("/api/studentattend/:attendanceId", async (req, res) => {
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

// app.put("/api/student_attendance/:studentId", async (req, res) => {
//     const { studentId } = req.params;

//     try {
//         const updatedStudentAttendance = await prisma.student_Attendance.update(
//             {
//                 where: { idStudent: studentId },
//                 data: req.body,
//             }
//         );

//         res.json(updatedStudentAttendance);
//     } catch (error) {
//         console.error("Error updating student attendance:", error);
//         res.status(500).json({
//             error: "Error updating student attendance.",
//         });
//     }
// });
// update status attendance for student to true
app.put("/api/student_attendance/:idStudentAttendance", async (req, res) => {
    const { idStudentAttendance } = req.params;

    try {
        const updatedStudentAttendance = await prisma.student_Attendance.update(
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
app.put("/api/markAttend/student_attendance", async (req, res) => {
    const { idAttendance, idStudent } = req.body;

    try {
        const studentAttendance = await prisma.student_Attendance.findFirst({
            where: {
                idAttendance,
                idStudent,
            },
        });

        const idStudentAttendance = studentAttendance.idStudentAttendance;
        const updatedStudentAttendance = await prisma.student_Attendance.update(
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
app.put("/api/markNotAttend/student_attendance", async (req, res) => {
    const { idAttendance, idStudent } = req.body;

    try {
        const studentAttendance = await prisma.student_Attendance.findFirst({
            where: {
                idAttendance,
                idStudent,
            },
        });

        const idStudentAttendance = studentAttendance.idStudentAttendance;
        const updatedStudentAttendance = await prisma.student_Attendance.update(
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

// Create tuition fee based on student id
app.post("/api/tuition-fee/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;
        const { month, year, amount } = req.body;

        const newTuitionFee = await prisma.TuitionFee.create({
            data: {
                idStudent: studentId,
                month: month,
                year: year,
                amount: amount,
            },
        });

        res.json(newTuitionFee);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating new tuition fee");
    }
});

// Get subject that student takes
app.get("/students/:id/subjects", async (req, res) => {
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
// checks if the idSubject in student_Subject is the same as the idSubject in attendance
app.post("/api/student_subject/check-subject-match", async (req, res) => {
    const { idStudent, idAttendance } = req.body;

    try {
        const attendance = await prisma.attendance.findFirst({
            where: {
                idAttendance,
            },
        });

        if (attendance) {
            const match = await prisma.student_Subject.findFirst({
                where: {
                    idStudent,
                    idSubject: attendance.idSubject,
                },
            });

            if (match) {
                res.json(true);
                // res.json("match is true ");
            } else {
                res.json(false);
                // res.json("match is false ");
            }
        } else {
            res.json(false);
            // res.json("Attendance id wrong");
        }

        // console.log(attendance.idSubject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

// Check existing attendance record for scanning qr code
app.get(
    "/api/student_attendance/:attendanceId/:studentId",
    async (req, res) => {
        const { attendanceId, studentId } = req.params;
        try {
            const existingRecord = await prisma.student_Attendance.findFirst({
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
app.get("/api/student_attendance/:studentId", async (req, res) => {
    const { studentId } = req.params;
    try {
        const existingRecord = await prisma.student_Attendance.findMany({
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
app.get("/api/attendance/students/:idAttendance", async (req, res) => {
    const idAttendance = req.params.idAttendance;

    try {
        const students = await prisma.student_Attendance.findMany({
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

// Update subject data
app.put("/api/subject/:subjectId", async (req, res) => {
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

// Post all student_attendance after teacher display qr code
app.post(
    "/api/student_attendance/:subjectId/:attendanceId",
    async (req, res) => {
        const { subjectId, attendanceId } = req.params;
        try {
            const allStudents = await prisma.student_Subject.findMany({
                where: { idSubject: subjectId },
            });

            const existingRecord = allStudents.map((student) => ({
                idStudent: student.idStudent,
                idAttendance: attendanceId,
            }));

            await Promise.all(
                existingRecord.map(async (record) => {
                    const foundRecord =
                        await prisma.student_Attendance.findFirst({
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
                            await prisma.student_Attendance.create({
                                data: {
                                    idStudent: record.idStudent,
                                    idAttendance: record.idAttendance,
                                    isAttend: false,
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

// Payment Gateway
app.post("/api/createBill", async (req, res) => {
    const requestData = req.body;

    try {
        const createdBill = await prisma.bill.create({
            data: requestData,
        });

        console.log(createdBill);
        // Handle the created bill here

        res.json(createdBill);
    } catch (error) {
        console.error(error);
        // Handle the error here
        res.status(500).json({ error: "An error occurred" });
    }
});

// Update tuition fee after user success make a payment
app.put("/api/tuitionfee/:idTuitionFee", async (req, res) => {
    const idTuitionFee = req.params.idTuitionFee;
    const { transactionDate } = req.body;

    try {
        const updatedTuitionFee = await prisma.tuitionFee.update({
            where: { idTuitionFee },
            data: { isPaid: true, transactionDate },
        });

        res.json(updatedTuitionFee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update tuition fee." });
    }
});

// Callback data
// app.post("/callback", async (req, res) => {
//     try {
//         // Log the callback data
//         console.log("test");
//         console.log("Callback data:", req.body);

//         // Handle the callback logic here
//         // This is where you process the payment notification or callback data

//         // Extract the necessary data from the request body
//         // const { studentId, subjectsList, month, year, amount, isPaid } =
//         //     req.body;

//         // // Update the tuition fee status in the database
//         // const updatedTuitionFee = await prisma.tuitionFee.update({
//         //     where: { idStudent: studentId, month, year },
//         //     data: { isPaid },
//         // });

//         // console.log("Tuition fee status updated:", updatedTuitionFee);
//         res.status(200).end();
//     } catch (error) {
//         console.error("Error updating tuition fee status:", error);
//         res.status(500).end();
//     }
// });

// // get data from callback
// app.get("/pelajar/statuspembayaran", (req, res) => {
//     const statusId = req.query.status_id;
//     console.log(statusId); // Use the extracted statusId as needed

//     // Other processing logic

//     res.sendStatus(200);
// });

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
