document.getElementById('okButton').addEventListener('click', function() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('options').style.display = 'block';
});


document.getElementById('numSubjects').addEventListener('input', function() {
    const numSubjects = parseInt(this.value, 10);
    const subjectInputContainer = document.getElementById('subjectInputContainer');
    subjectInputContainer.innerHTML = '';

    if (numSubjects > 0) {
        for (let i = 0; i < numSubjects; i++) {
            const subjectInputDiv = document.createElement('div');
            subjectInputDiv.classList.add('form-group');
            subjectInputDiv.innerHTML = `
                <label for="subject-${i}">Subject ${i + 1} Name:</label>
                <input type="text" id="subject-${i}" required>
            `;
            subjectInputContainer.appendChild(subjectInputDiv);
        }
        document.getElementById('generateButton').classList.remove('hidden');
    } else {
        document.getElementById('generateButton').classList.add('hidden');
    }
});

document.getElementById('generateButton').addEventListener('click', function() {
    const numStudents = parseInt(document.getElementById('numStudents').value, 10);
    const numSubjects = parseInt(document.getElementById('numSubjects').value, 10);
    const subjects = [];
    const studentsInput = document.getElementById('studentsInput');
    studentsInput.innerHTML = '';
    studentsInput.classList.remove('hidden');

    for (let i = 0; i < numSubjects; i++) {
        const subjectName = document.getElementById(`subject-${i}`).value.trim();
        if (subjectName === '') {
            alert(`Please enter the name for Subject ${i + 1}`);
            return;
        }
        subjects.push(subjectName);
    }

    for (let i = 0; i < numStudents; i++) {
        const studentDiv = document.createElement('div');
        studentDiv.classList.add('student');
        studentDiv.innerHTML = `
            <h3>Student ${i + 1}</h3>
            <div class="form-group">
                <label for="roll-${i}">Roll:</label>
                <input type="text" id="roll-${i}" required>
            </div>
            <div class="form-group">
                <label for="name-${i}">Name:</label>
                <input type="text" id="name-${i}" required>
            </div>
            <div class="form-group">
                <label for="regNo-${i}">Registration No:</label>
                <input type="text" id="regNo-${i}" required>
            </div>
        `;

        subjects.forEach((subject, j) => {
            studentDiv.innerHTML += `
                <div class="form-group">
                    <label for="subject-${i}-${j}">${subject} Grade:</label>
                    <select id="subject-${i}-${j}" required>
                        <option value="0">0.00</option>
                        <option value="2">2.00</option>
                        <option value="2.25">2.25</option>
                        <option value="2.50">2.50</option>
                        <option value="2.75">2.75</option>
                        <option value="3">3.00</option>
                        <option value="3.25">3.25</option>
                        <option value="3.50">3.50</option>
                        <option value="3.75">3.75</option>
                        <option value="4">4.00</option>
                    </select>
                </div>
            `;
        });

        studentsInput.appendChild(studentDiv);
    }

    document.getElementById('calculateBtn').classList.remove('hidden');
});

document.getElementById('calculateBtn').addEventListener('click', function() {
    const session = document.getElementById('session').value;
    const department = document.getElementById('department').value;
    const semester = document.getElementById('semester').value;
    const numStudents = parseInt(document.getElementById('numStudents').value, 10);
    const numSubjects = parseInt(document.getElementById('numSubjects').value, 10);
    const subjects = [];

    for (let i = 0; i < numSubjects; i++) {
        subjects.push(document.getElementById(`subject-${i}`).value.trim());
    }

    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = `
        <h2>Sylhet International University (SIU)</h2>
        <h3>${department} Department</h3>
        <h4>${session}, Semester: ${semester}</h4>
        <h2>Result Sheet</h2>
        <table>
            <thead>
                <tr>
                    <th>Roll</th>
                    <th>Name</th>
                    <th>Reg No</th>
                    ${subjects.map((subj) => `<th>${subj}</th>`).join('')}
                    <th>GPA</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div style="margin-top: 50px;">
            <h3>Controller of Examination</h3>
            <h3>Sylhet International University</h3>
        </div>
    `;

    const tableBody = resultContent.querySelector('tbody');
    const studentResults = [];

    for (let i = 0; i < numStudents; i++) {
        let totalPoints = 0;
        let failCount = 0;

        const roll = document.getElementById(`roll-${i}`).value.trim();
        const name = document.getElementById(`name-${i}`).value.trim();
        const regNo = document.getElementById(`regNo-${i}`).value.trim();
        let studentResult = `<tr><td>${roll}</td><td>${name}</td><td>${regNo}</td>`;

        for (let j = 0; j < numSubjects; j++) {
            const grade = parseFloat(document.getElementById(`subject-${i}-${j}`).value);
            totalPoints += grade;
            if (grade === 0.00) {
                failCount++;
            }
            studentResult += `<td>${grade.toFixed(2)}</td>`;
        }

        const gpa = (totalPoints / numSubjects).toFixed(2);
        const resultText = failCount > 0 ? `R-${failCount}` : gpa;
        studentResult += `<td>${resultText}</td></tr>`;

        studentResults.push({ roll, studentResult });
    }

    
    studentResults.sort((a, b) => {
       
        return parseInt(a.roll) - parseInt(b.roll);
    });

    studentResults.forEach(student => {
        tableBody.innerHTML += student.studentResult;
    });

    document.getElementById('resultOutput').classList.remove('hidden');
    document.getElementById('printButton').classList.remove('hidden');
});

document.getElementById('printButton').addEventListener('click', function() {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Result Sheet</title>');
    printWindow.document.write('<link rel="stylesheet" href="styles.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(document.getElementById('resultContent').innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
});
