// database connection
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
// Import the database connection
const db = require('./db'); 
// const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

function validateStudent(student) {
    if (!student.student_id || !student.first_name || !student.last_name || !student.email || !student.phone) {
        return 'All fields are required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student.email)) {
        return 'Invalid email address.';
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(student.phone)) {
        return 'Invalid phone number. Please enter a number with 10-15 digits.';
    }

    return null;
}

function checkDuplicate(student, id, callback){
    let sql;
    let params;

    if(id){
        sql = 'SELECT * FROM students WHERE (student_id = ? OR email = ?) AND id != ?';
        params = [student.student_id, student.email, id];
    } else {
        sql = 'SELECT * FROM students WHERE student_id = ? OR email = ?';
        params = [student.student_id, student.email];
    }

    console.log('Check Duplicate Query:', sql);
    console.log('Check Duplicate Params:', params);

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error checking for duplicates:', err);
            return callback(err, null);
        }
        console.log('Duplicate Check Results:', results);
        return callback(null, results.length > 0);
    });
}

app.post('/students', (req, res) => {
    const student = req.body;
    console.log('Adding student:', student);

    const validationError = validateStudent(student);
    if (validationError) {
        res.status(400).send(validationError);
        return;
    }

    checkDuplicate(student, null, (err, isDuplicate) => {
        if (err) {
            res.status(500).send('Server error');
            return;
        }
        if (isDuplicate) {
            res.status(409).send('Student ID or Email already exists.');
            return;
        }

        const sql = 'INSERT INTO students SET ?';
        db.query(sql, student, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).send('Server error');
                return;
            }
            res.send('Student added!');
        });
    });
});

app.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    console.log('Updating student ID:', id);
    console.log('Updated data:', updatedData);

    const validationError = validateStudent(updatedData);
    if (validationError) {
        res.status(400).send(validationError);
        return;
    }
    checkDuplicate(updatedData, id, (err, isDuplicate) => {
        if (err) {
            res.status(500).send('Server error');
            return;
        }
        if (isDuplicate) {
            res.status(409).send('Student ID or Email already exists.');
            return;
        }

        const sql = 'UPDATE students SET ? WHERE id = ?';
        db.query(sql, [updatedData, id], (err, result) => {
            if (err) {
                console.error('Error updating data', err);
                res.status(500).send('Server error');
                return;
            }
            res.send('Student updated!');
        });
    });
});

app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).send('Server error');
            return;
        }
      res.send('Student deleted!');
    });
});

app.get('/students/search', (req, res) => {
    const { id, email, name } = req.query;

    if (!id && !email && !name) {
        res.status(400).send('At least one search parameter (id, email, or name) is required.');
        return;
    }

    let sql = 'SELECT * FROM students WHERE';
    let params = [];

    if (id) {
        sql += ' id = ?';
        params.push(id);
    } 

    if (email) {
        if (params.length > 0) sql += ' AND';
        sql += ' email = ?';
        params.push(email);
    } 

    if (name) {
        if (params.length > 0) sql += ' AND';
        sql += ' (first_name LIKE ? OR last_name LIKE ?)';
        params.push(`%${name}%`, `%${name}%`);
    }

    console.log('Search Query:', sql);
    console.log('Search Params:', params);

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error searching for students:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });