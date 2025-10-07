# CyberTuition-backend

CyberTuition-backend is a Node.js backend application designed to manage tuition center operations, including student attendance, fee management, subject assignments, teacher and clerk management, and authentication.

## Features

- **Student Management**: Add, update, and manage student records.
- **Attendance Tracking**: Record and report student attendance.
- **Tuition Fee Management**: Create and manage tuition fee records.
- **Subject Assignment**: Assign subjects to students and manage subject data.
- **Teacher & Clerk Management**: Manage teacher and clerk information.
- **Authentication**: User authentication and authorization.
- **Monthly Reports**: Generate monthly reports for attendance and fees.

## Project Structure

- `index.js`: Main entry point of the application.
- `routes/`: Contains route handlers for various modules:
  - `attendance.js`
  - `auth.js`
  - `clerk.js`
  - `monthlyReport.js`
  - `student.js`
  - `studentAttendance.js`
  - `studentSubject.js`
  - `subject.js`
  - `teacher.js`
  - `tuitionFee.js`
  - `user.js`
- `prisma/`: Database schema and migrations (uses Prisma ORM).
  - `schema.prisma`: Prisma schema definition.
  - `migrations/`: Database migration files.
- Utility files:
  - `createTuitionFee.js`
  - `datetimeUtils.js`
- `package.json`: Project dependencies and scripts.

## Getting Started

1. **Install dependencies**:

   ```powershell
   npm install
   ```

2. **Set up the database**:

   - Configure your database connection in `prisma/schema.prisma`.
   - Run migrations:
     ```powershell
     npx prisma migrate dev
     ```

3. **Start the server**:
   ```powershell
   node index.js
   ```

## Requirements

- Node.js
- Prisma ORM
- A supported database (configured in Prisma)

## License

This project is for educational purposes. Please update the license section as needed.
