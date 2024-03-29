const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getMalaysiaDateTime } = require("../datetimeUtils");

// Create tuition fee
router.post("/api/tuitionfee", async (req, res) => {
    const { month, year, idStudent, amount, subjectsList } = req.body;
    const createdAt = getMalaysiaDateTime();

    try {
        const tuitionfee = await prisma.tuitionfee.create({
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

// Get data tuition fee based on tuition id
router.get("/api/tuitionfee/:idTuitionFee", async (req, res) => {
    const { idTuitionFee } = req.params;

    try {
        const tuitionFees = await prisma.tuitionfee.findUnique({
            where: {
                idTuitionFee,
            },
            include: {
                paymentGateway: true,
                receiptBank: true,
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

// Check student paid yet
router.post("/api/check-tuition-fee", async (req, res) => {
    try {
        const { month, year, studentId } = req.body;

        // Query the TuitionFee table to check if a record exists for the given month, year, and student ID
        const tuitionFee = await prisma.tuitionfee.findFirst({
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
        const tuitionfee = await prisma.tuitionfee.findFirst({
            where: { month, year, idStudent },
        });
        return res.status(200).json(tuitionfee);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get all data tuition fee based on month and year
router.get("/api/tuitionfee/monthyear/:month/:year", async (req, res) => {
    const { month, year } = req.params;

    try {
        const tuitionFees = await prisma.tuitionfee.findMany({
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

        const newTuitionFee = await prisma.tuitionfee.create({
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
        const tuitionFeeWithPaymentGateway = await prisma.tuitionfee.findUnique(
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

        const createdPaymentGateway = await prisma.paymentgateway.create({
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

        const createdPaymentGateway = await prisma.paymentgateway.update({
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

// Api Callback
// Student
router.post("/api/callback", async (req, res) => {
    try {
        // Extract the callback parameters from the request body
        const {
            refno,
            status,
            reason,
            billcode,
            order_id,
            amount,
            transaction_time,
        } = req.body;

        // Log the callback parameters
        console.log("Callback Parameters:");
        console.log("Reference Number:", refno);
        console.log("Payment Status:", status);
        console.log("Reason:", reason);
        console.log("Billcode:", billcode);
        console.log("Order ID:", order_id);
        console.log("Payment Amount:", amount);
        console.log("Transaction Time:", transaction_time);

        // Send a response indicating success
        res.status(200).send("Callback processed successfully.");
    } catch (error) {
        // Handle any errors that occur during processing
        console.error("Error processing callback:", error);
        res.status(500).send(
            "An error occurred while processing the callback."
        );
    }
});

// Update tuition fee after user success make a payment through payment gateway
// Student
router.put("/api/tuitionfee/:idTuitionFee", async (req, res) => {
    const idTuitionFee = req.params.idTuitionFee;

    try {
        const updatedTuitionFee = await prisma.tuitionfee.update({
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

// Update Cash Method
// Clerk
router.put("/api/tuitionfee/cash/:idTuitionFee", async (req, res) => {
    const idTuitionFee = req.params.idTuitionFee;
    const createdAt = getMalaysiaDateTime();

    try {
        const updatedTuitionFee = await prisma.tuitionfee.update({
            where: { idTuitionFee },
            data: {
                statusPayment: "Telah Dibayar",
                paymentMethod: "Tunai",
                cashTransactionDate: createdAt,
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
        const updatedTuitionFee = await prisma.tuitionfee.update({
            where: { idTuitionFee },
            data: {
                statusPayment: "Telah Dibayar",
                paymentMethod: "Muat Naik Resit Bank",
            },
        });

        res.json(updatedTuitionFee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update tuition fee." });
    }
});
router.put(
    "/api/tuitionfee/deletereceiptbank/:idTuitionFee",
    async (req, res) => {
        const idTuitionFee = req.params.idTuitionFee;

        try {
            const updatedTuitionFee = await prisma.tuitionfee.update({
                where: { idTuitionFee },
                data: {
                    statusPayment: "Belum Dibayar",
                    paymentMethod: "",
                },
            });

            res.json(updatedTuitionFee);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to update tuition fee." });
        }
    }
);

// Cancelled Receipt Bank
// Clerk
// Receipt Bank
router.delete(
    "/api/tuitionfee/receiptbank/:receiptBankId",
    async (req, res) => {
        const receiptBankId = req.params.receiptBankId;

        try {
            const deletedReceiptBank = await prisma.receiptbank.delete({
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
        const receiptBank = await prisma.receiptbank.findUnique({
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
        const receiptBank = await prisma.receiptbank.findUnique({
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

        const createdReceiptBank = await prisma.receiptbank.create({
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
        const receipts = await prisma.receiptbank.findMany({
            where: {
                tuitionFee: {
                    statusPayment: "Menunggu Pengesahan",
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

// Update Receipt Bank
// Student
router.put(
    "/api/tuitionfee/uploadreceiptbank/:idTuitionFee",
    async (req, res) => {
        const idTuitionFee = req.params.idTuitionFee;

        try {
            const updatedTuitionFee = await prisma.tuitionfee.update({
                where: { idTuitionFee },
                data: {
                    statusPayment: "Menunggu Pengesahan",
                    paymentMethod: "Muat Naik Resit Bank",
                },
            });

            res.json(updatedTuitionFee);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to update tuition fee." });
        }
    }
);

// Delete receipt bank
// Student
router.delete("/api/receiptbank/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the receipt bank entry
        await prisma.receiptbank.delete({
            where: { receiptBankId: id },
        });

        res.json("Receipt bank deleted successfully");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
