const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// const totalStudentsMonth5Promise = prisma.student.count({
//     where: {
//         createdAt: {
//             gte: "2023-05-01T00:00:00Z",
//             lt: "2023-06-01T00:00:00Z",
//         },
//     },
// });

// const totalTeachersMonth5Promise = prisma.teacher.count({
//     where: {
//         createdAt: {
//             gte: "2023-05-01T00:00:00Z",
//             lt: "2023-06-01T00:00:00Z",
//         },
//     },
// });

// const totalStudentsMonth6Promise = prisma.student.count({
//     where: {
//         createdAt: {
//             gte: "2023-06-01T00:00:00Z",
//             lt: "2023-07-01T00:00:00Z",
//         },
//     },
// });

// const totalTeachersMonth6Promise = prisma.teacher.count({
//     where: {
//         createdAt: {
//             gte: "2023-06-01T00:00:00Z",
//             lt: "2023-07-01T00:00:00Z",
//         },
//     },
// });

// Promise.all([
//     totalStudentsMonth5Promise,
//     totalTeachersMonth5Promise,
//     totalStudentsMonth6Promise,
//     totalTeachersMonth6Promise,
// ])
//     .then(
//         ([
//             totalStudentsMonth5,
//             totalTeachersMonth5,
//             totalStudentsMonth6,
//             totalTeachersMonth6,
//         ]) => {
//             console.log("Total Students Month 5:", totalStudentsMonth5);
//             console.log("Total Teachers Month 5:", totalTeachersMonth5);
//             console.log("Total Students Month 6:", totalStudentsMonth6);
//             console.log("Total Teachers Month 6:", totalTeachersMonth6);
//         }
//     )
//     .catch((error) => {
//         console.error("Error:", error);
//     });

// correct code await
// const totalStudentsMonth5 = await prisma.student.count({
//     where: {
//       createdAt: {
//         gte: "2023-05-01T00:00:00Z",
//         lt: "2023-06-01T00:00:00Z",
//       },
//     },
//   });

//   const totalTeachersMonth5 = await prisma.teacher.count({
//     where: {
//       createdAt: {
//         gte: "2023-05-01T00:00:00Z",
//         lt: "2023-06-01T00:00:00Z",
//       },
//     },
//   });

//   const totalStudentsMonth6 = await prisma.student.count({
//     where: {
//       createdAt: {
//         gte: "2023-06-01T00:00:00Z",
//         lt: "2023-07-01T00:00:00Z",
//       },
//     },
//   });

//   const totalTeachersMonth6 = await prisma.teacher.count({
//     where: {
//       createdAt: {
//         gte: "2023-06-01T00:00:00Z",
//         lt: "2023-07-01T00:00:00Z",
//       },
//     },
//   });

//   console.log("Total Students Month 5:", totalStudentsMonth5);
//   console.log("Total Teachers Month 5:", totalTeachersMonth5);
//   console.log("Total Students Month 6:", totalStudentsMonth6);
//   console.log("Total Teachers Month 6:", totalTeachersMonth6);

// To calculate the total amount for two different statusPayment values (i.e., "Telah Dibayar" and "Belum Dibayar") in the current month and the four months before.
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
const currentYear = currentDate.getFullYear();

const totalAmountPromises = [];
for (let i = 0; i < 5; i++) {
    const month = currentMonth - i;
    const year = currentYear;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const totalPaidAmountPromise = prisma.tuitionFee.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            month,
            year,
            statusPayment: "Telah Dibayar",
            createdAt: {
                gte: startOfMonth.toISOString(),
                lt: endOfMonth.toISOString(),
            },
        },
    });

    const totalUnpaidAmountPromise = prisma.tuitionFee.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            month,
            year,
            statusPayment: "Belum Dibayar",
            createdAt: {
                gte: startOfMonth.toISOString(),
                lt: endOfMonth.toISOString(),
            },
        },
    });

    totalAmountPromises.push(totalPaidAmountPromise, totalUnpaidAmountPromise);
}

Promise.all(totalAmountPromises)
    .then((totalAmounts) => {
        let month = currentMonth;
        let year = currentYear;
        for (let i = 0; i < totalAmounts.length; i += 2) {
            const totalPaidAmount = totalAmounts[i]._sum.amount || 0;
            const totalUnpaidAmount = totalAmounts[i + 1]._sum.amount || 0;
            console.log(`Month ${month} Year ${year}:`);
            console.log("Total Amount (Telah Dibayar):", totalPaidAmount);
            console.log("Total Amount (Belum Dibayar):", totalUnpaidAmount);
            console.log("--------------------");

            month--;
            if (month === 0) {
                month = 12;
                year--;
            }
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
