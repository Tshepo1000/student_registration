# Student Registration System

A full-stack web app for registering and managing students. A browser front end talks to a Node.js/Express REST API backed by a MySQL database.

## Features

- Add, update and delete student records
- Search students through a dedicated search endpoint
- MySQL schema included for quick setup

## Tech stack

- **Front end:** HTML, CSS, JavaScript
- **Back end:** Node.js, Express, CORS
- **Database:** MySQL (via `mysql2`)

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/students` | Register a new student |
| PUT | `/students/:id` | Update a student |
| DELETE | `/students/:id` | Delete a student |
| GET | `/students/search` | Search students |

## Getting started

Prerequisites: Node.js 18+ and a running MySQL server.

```bash
git clone https://github.com/Tshepo1000/student_registration.git
cd student_registration

# 1. create the database and table
mysql -u <user> -p < database/schema.sql

# 2. install and start the API
cd backend
npm install
node server.js
```

Update the connection details in `backend/db.js` to match your MySQL setup, then open `frontend/index.html` in your browser.

## Project structure

```
student_registration/
├── backend/    # Express server and database connection
├── database/   # schema.sql
└── frontend/   # index.html, script.js, styles
```

## Status and roadmap

Core create, update, delete and search features are in place. Planned improvements:

- [ ] Read database credentials from environment variables
- [ ] Add input validation and clearer error messages
- [ ] Add automated tests

## Author

Tshepo Sekete, [GitHub](https://github.com/Tshepo1000)
