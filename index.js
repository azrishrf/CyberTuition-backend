const express = require("express");
const app = express();
const cors = require("cors");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

// Router
app.use("", require("./routes/auth"));
app.use("", require("./routes/user"));
app.use("", require("./routes/student"));
app.use("", require("./routes/subject"));
app.use("", require("./routes/studentSubject"));
app.use("", require("./routes/teacher"));
app.use("", require("./routes/clerk"));
app.use("", require("./routes/tuitionFee"));
app.use("", require("./routes/monthlyReport"));
app.use("", require("./routes/attendance"));
app.use("", require("./routes/studentAttendance"));

require("./createTuitionFee");

// Start the server
const port = 3001;
app.listen(Number(port || 3001), "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});

// app.listen(3001, () => {
//     console.log("Server is running on port 3000");
// });
