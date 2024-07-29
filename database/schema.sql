-- create a database if it does not exists
CREATE DATABASE IF NOT EXISTS studentdb;

-- use the database
USE studentdb;

-- drop the table if it exists
DROP TABLE IF EXISTS students;

-- creates the students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20)
);