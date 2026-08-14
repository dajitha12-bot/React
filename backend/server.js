const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;

const DATA_FILE =
  path.join(
    __dirname,
    "data",
    "students.json"
  );


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

app.use(express.json());


// ============================================================
// READ JSON FILE
// ============================================================

function readStudents() {

  try {

    const data =
      fs.readFileSync(
        DATA_FILE,
        "utf-8"
      );

    return JSON.parse(data);

  }
  catch (error) {

    return [];

  }

}


// ============================================================
// WRITE JSON FILE
// ============================================================

function writeStudents(students) {

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(
      students,
      null,
      2
    )
  );

}


// ============================================================
// HOME
// ============================================================

app.get("/", (req, res) => {

  res.json({
    message:
      "Student Management API is running",
    database:
      "JSON File"
  });

});


// ============================================================
// GET ALL STUDENTS
// ============================================================

app.get(
  "/api/students",
  (req, res) => {

    try {

      const students =
        readStudents();

      res.json(students);

    }
    catch (error) {

      res.status(500).json({
        message:
          "Failed to read students"
      });

    }

  }
);


// ============================================================
// GET STUDENT BY ID
// ============================================================

app.get(
  "/api/students/:id",
  (req, res) => {

    const students =
      readStudents();

    const id =
      Number(req.params.id);

    const student =
      students.find(
        (item) => item.id === id
      );


    if (!student) {

      return res.status(404).json({
        message:
          "Student not found"
      });

    }


    res.json(student);

  }
);


// ============================================================
// ADD STUDENT
// ============================================================

app.post(
  "/api/students",
  (req, res) => {

    try {

      const students =
        readStudents();


      const {
        rollNo,
        name,
        department,
        year,
        course,
        email
      } = req.body;


      if (
        !rollNo ||
        !name ||
        !department ||
        !year ||
        !course ||
        !email
      ) {

        return res.status(400).json({
          message:
            "All student fields are required"
        });

      }


      const duplicate =
        students.find(
          (student) =>
            student.rollNo
              .toLowerCase() ===
            rollNo
              .toLowerCase()
        );


      if (duplicate) {

        return res.status(400).json({
          message:
            "Roll number already exists"
        });

      }


      const newStudent = {
        id:
          students.length > 0
            ? Math.max(
                ...students.map(
                  (s) => s.id
                )
              ) + 1
            : 1,
        rollNo,
        name,
        department,
        year,
        course,
        email
      };


      students.push(newStudent);

      writeStudents(students);


      res.status(201).json(newStudent);

    }
    catch (error) {

      res.status(500).json({
        message:
          "Failed to add student"
      });

    }

  }
);


// ============================================================
// UPDATE STUDENT
// ============================================================

app.put(
  "/api/students/:id",
  (req, res) => {

    try {

      const students =
        readStudents();


      const id =
        Number(req.params.id);


      const index =
        students.findIndex(
          (s) => s.id === id
        );


      if (index === -1) {

        return res.status(404).json({
          message:
            "Student not found"
        });

      }


      const {
        rollNo,
        name,
        department,
        year,
        course,
        email
      } = req.body;


      if (
        !rollNo ||
        !name ||
        !department ||
        !year ||
        !course ||
        !email
      ) {

        return res.status(400).json({
          message:
            "All student fields are required"
        });

      }


      const duplicate =
        students.find(
          (student) =>
            student.id !== id &&
            student.rollNo
              .toLowerCase() ===
            rollNo
              .toLowerCase()
        );


      if (duplicate) {

        return res.status(400).json({
          message:
            "Roll number already exists"
        });

      }


      students[index] = {
        id,
        rollNo,
        name,
        department,
        year,
        course,
        email
      };


      writeStudents(students);


      res.json(students[index]);

    }
    catch (error) {

      res.status(500).json({
        message:
          "Failed to update student"
      });

    }

  }
);


// ============================================================
// DELETE STUDENT
// ============================================================

app.delete(
  "/api/students/:id",
  (req, res) => {

    try {

      const students =
        readStudents();


      const id =
        Number(req.params.id);


      const filtered =
        students.filter(
          (s) => s.id !== id
        );


      if (
        students.length ===
        filtered.length
      ) {

        return res.status(404).json({
          message:
            "Student not found"
        });

      }


      writeStudents(filtered);


      res.json({
        message:
          "Student deleted successfully"
      });

    }
    catch (error) {

      res.status(500).json({
        message:
          "Failed to delete student"
      });

    }

  }
);


// ============================================================
// LISTEN
// ============================================================

app.listen(PORT, () => {

  console.log(
    `Server is running on http://localhost:${PORT}`
  );

});
