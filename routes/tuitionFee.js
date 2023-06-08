const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create tuition fee
router.post("/api/createtuitionfee", async (req, res) => {
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

// Check student paid yet
router.post("/api/check-tuition-fee", async (req, res) => {
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

// Create tuition fee
router.post("/api/tuitionfee", async (req, res) => {
    const { month, year, idStudent, amount, subjectsList } = req.body;
    try {
        const tuitionfee = await prisma.tuitionFee.create({
            data: {
                month,
                year,
                idStudent,
                amount,
                subjectsList,
                isPaid: false,
            },
        });
        return res.status(200).json(tuitionfee);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get tuition fee
router.post("/api/checktuitionfee", async (req, res) => {
    const { month, year, idStudent } = req.body;
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

// Create tuition fee based on student id
router.post("/api/tuition-fee/:studentId", async (req, res) => {
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

// Payment Gateway
router.post("/api/createBill", async (req, res) => {
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
router.put("/api/tuitionfee/:idTuitionFee", async (req, res) => {
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

module.exports = router;
