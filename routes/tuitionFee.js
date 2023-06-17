const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getMalaysiaDateTime } = require("../datetimeUtils");

// Create tuition fee
// router.post("/api/createtuitionfee", async (req, res) => {
//     const { month, year, idStudent, subjectsList } = req.body;
//     console.log(req.body);
//     console.log(idStudent);
//     try {
//         const createTuitionfee = await prisma.tuitionFee.create({
//             data: { month, year, idStudent, subjectsList, isPaid: false },
//         });
//         return res.status(200).json(createTuitionfee);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// });

// Create tuition fee
router.post("/api/tuitionfee", async (req, res) => {
    const { month, year, idStudent, amount, subjectsList } = req.body;
    const createdAt = getMalaysiaDateTime();

    try {
        const tuitionfee = await prisma.tuitionFee.create({
            data: {
                month,
                year,
                idStudent,
                amount,
                subjectsList,
                statusPayment: "Belum Dibayar",
                createdAt,
            },
        });
        return res.status(200).json(tuitionfee);
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

// Get tuition fee
// Student
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

router.get("/api/tuitionfee/monthyear/:month/:year", async (req, res) => {
    const { month, year } = req.params;

    try {
        const tuitionFees = await prisma.tuitionFee.findMany({
            where: {
                month: parseInt(month),
                year: parseInt(year),
            },
            include: {
                student: true,
            },
        });

        res.json(tuitionFees);
    } catch (error) {
        console.error("Error retrieving tuition fees:", error);
        res.status(500).json({
            error: "An error occurred while retrieving tuition fees.",
        });
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
// Get existing payment gateway
// Student
router.get("/api/tuitionfee/paymentgateway/:idTuitionFee", async (req, res) => {
    const idTuitionFee = req.params.idTuitionFee;

    try {
        const tuitionFeeWithPaymentGateway = await prisma.tuitionFee.findUnique(
            {
                where: { idTuitionFee },
                include: { paymentGateway: true },
            }
        );

        res.json(tuitionFeeWithPaymentGateway.paymentGateway); // Sending payment gateway data as a response
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

// Payment Gateway - create new bill
// Student
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

// Create payment gateway data
// Student
router.post("/api/paymentgateway", async (req, res) => {
    try {
        const { billCode, idTuitionFee } = req.body;

        const createdPaymentGateway = await prisma.paymentGateway.create({
            data: {
                billCode,
                idTuitionFee,
            },
        });

        res.json(createdPaymentGateway);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Update payment gateway data
// Student
router.put("/api/paymentgateway", async (req, res) => {
    try {
        const { transactionBill, paymentGatewayId } = req.body;

        const transactionDate = getMalaysiaDateTime();

        const createdPaymentGateway = await prisma.paymentGateway.update({
            where: { paymentGatewayId },
            data: {
                transactionBill,
                transactionDate,
            },
        });

        res.json(createdPaymentGateway);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Update tuition fee after user success make a payment through payment gateway
// Student
router.put("/api/tuitionfee/:idTuitionFee", async (req, res) => {
    const idTuitionFee = req.params.idTuitionFee;

    try {
        const updatedTuitionFee = await prisma.tuitionFee.update({
            where: { idTuitionFee },
            data: {
                statusPayment: "Telah Dibayar",
                paymentMethod: "Payment Gateway",
            },
        });

        res.json(updatedTuitionFee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update tuition fee." });
    }
});

// Update Receipt Bank
// Clerk
router.put("/api/tuitionfee/receiptbank/:idTuitionFee", async (req, res) => {
    const idTuitionFee = req.params.idTuitionFee;

    try {
        const updatedTuitionFee = await prisma.tuitionFee.update({
            where: { idTuitionFee },
            data: {
                statusPayment: "Telah Dibayar",
                paymentMethod: "Pindahan Bank Dalam Talian",
            },
        });

        res.json(updatedTuitionFee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update tuition fee." });
    }
});

// Cancelled Receipt Bank
// Clerk
// Receipt Bank
router.delete(
    "/api/tuitionfee/receiptbank/:receiptBankId",
    async (req, res) => {
        const receiptBankId = req.params.receiptBankId;

        try {
            const deletedReceiptBank = await prisma.receiptBank.delete({
                where: { receiptBankId },
            });

            res.json(deletedReceiptBank);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete tuition fee." });
        }
    }
);

// Upload receipt bank
// Student
router.get("/api/receiptbank/:idTuitionFee", async (req, res) => {
    const idTuitionFee = req.params.idTuitionFee;

    try {
        const receiptBank = await prisma.receiptBank.findUnique({
            where: {
                idTuitionFee,
            },
            include: { tuitionFee: { include: { student: true } } },
        });

        res.json(receiptBank);
    } catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching receipt bank data.",
        });
    }
});

// Get receipt bank id
router.get("/api/receiptbank/id/:idReceiptBank", async (req, res) => {
    const idReceiptBank = req.params.idReceiptBank;

    try {
        const receiptBank = await prisma.receiptBank.findUnique({
            where: {
                receiptBankId: idReceiptBank,
            },
            include: { tuitionFee: { include: { student: true } } },
        });

        res.json(receiptBank);
    } catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching receipt bank data.",
        });
    }
});

// Create receipt bank data
// Student
router.post("/api/receiptbank", async (req, res) => {
    try {
        const { filePath, idTuitionFee, fileName } = req.body;
        const createdAt = getMalaysiaDateTime();

        const createdReceiptBank = await prisma.receiptBank.create({
            data: {
                filePath,
                idTuitionFee,
                createdAt,
                fileName,
            },
        });

        res.json(createdReceiptBank);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Get all receipt bank data
router.get("/api/receiptbank", async (req, res) => {
    try {
        const receipts = await prisma.receiptBank.findMany({
            where: {
                tuitionFee: {
                    statusPayment: "Belum Dibayar",
                },
            },
            include: {
                tuitionFee: { include: { student: true } },
            },
        });
        res.json(receipts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete receipt bank
// Student
router.delete("/api/receiptbank/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the receipt bank entry
        await prisma.receiptBank.delete({
            where: { receiptBankId: id },
        });

        res.json("Receipt bank deleted successfully");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
