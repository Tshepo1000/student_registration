// add students to the students table
//when the page loads

// const { response } = require("express");

// load students from the database
function loadStudents(){
    fetch('http://localhost:3000/students')
    .then(response => response.json())
    .then(data => {
        const studentTableBody = document.querySelector('#student-table tbody');
        studentTableBody.innerHTML=''; // clear rows
        data.forEach(student => {
            const row = document.createElement('tr');
            row.dataset.id = student.id;
            row.innerHTML = `
                 <td>${student.student_id}</td>
                    <td>${student.first_name}</td>
                    <td>${student.last_name}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>                   
                    <td>
                        <button class="edit-btn" onclick="hideStudentRecords()">Modify</button> 
                        <button class="delete-btn">Delete</button>
                    </td>
   
            `;

            studentTableBody.appendChild(row);
        });
   })
   .catch(error => console.error('Error loading students', error));
    
}

// form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('student-form');
    const studentTableBody = document.querySelector('#student-table tbody');
    let editMode = false;
    let editId = null;

    // user input validation
    function isValidEmail(email){
        // email validation regex
        const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return reg.test(email);
    }

    function isValidPhone(phone) {
        // phone validation regex 
        const reg = /^\d{10,15}$/;
        return reg.test(phone);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const student = {
            student_id: document.getElementById('student-id').value.trim(),
            first_name: document.getElementById('first-name').value.trim(),
            last_name: document.getElementById('last-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim()
        };

        if (!isValidEmail(student.email)) {
            alert('Invalid email address.');
            return;
        }

        if (!isValidPhone(student.phone)) {
            alert('Invalid phone number. Please enter a number with 10-15 digits.');
            return;
        }

        // checks for duplicates
        fetch('http://localhost:3000/students/check-duplicate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ student_id: student.student_id, email: student.email })
        })
        .then(response => response.json())
        .then(data => {
            if(data.isDuplicate){
                alert('Student ID or Email already exists!')
            } else {
                const method = editMode ? 'PUT' : 'POST';
                const endpoint = editMode ? `http://localhost:3000/students/${editId}` : 'http://localhost:3000/students';

                fetch(endpoint, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(student)
                })
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    loadStudents(); //reload students for any new addition
                    form.reset();
                    editMode = false;
                    editId = null;
                })
                .catch(error => console.error('Error adding student: ', error));
            }
        })
        .catch(error => console.error('Error checking for duplicates: ', error));
    });


    loadStudents();

    // handles deletion
    studentTableBody.addEventListener('click', (event) => {
        if(event.target.classList.contains('delete-btn')){
            const row = event.target.closest('tr');
            const id = row.dataset.id;

            fetch('http://localhost:3000/students/' + id, {
                method: 'DELETE'
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                loadStudents(); // Reload students to reflect the deletion
            })
            .catch(error => console.error('Error deleting student:', error));
        } else if (event.target.classList.contains('edit-btn')) {
            const row = event.target.closest('tr');
            const id = row.dataset.id;

            // Populate form with current student details
            document.getElementById('student-id').value = row.children[0].innerText;
            document.getElementById('first-name').value = row.children[1].innerText;
            document.getElementById('last-name').value = row.children[2].innerText;
            document.getElementById('email').value = row.children[3].innerText;
            document.getElementById('phone').value = row.children[4].innerText;

            editMode = true;
            editId = id;
        }
    });

    loadStudents();
});

// toggle between adding students and viewing records
function showStudentRecords(){
    document.getElementById('container1').style.display = 'none'; 
    document.getElementById('container2').style.display = 'block';
    document.getElementById('addStudentsHeader').style.display = 'none';
    document.getElementById('studentRecords').style.display = 'block';
    document.getElementById('bi').style.display = 'block';
}

function hideStudentRecords(){
    document.getElementById('container1').style.display = 'block'; 
    document.getElementById('container2').style.display = 'none';
    document.getElementById('addStudentsHeader').style.display = 'block';
    document.getElementById('studentRecords').style.display = 'none';
    document.getElementById('bi').style.display = 'none';
}