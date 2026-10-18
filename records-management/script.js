let allStudents = [];

const recordCount = document.getElementById('recordCount');
const tableBody = document.getElementById('tableBody');

loadStudents();

function loadStudents() {
  fetch('students_25.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return response.json();
    })
    .then((data) => {
      allStudents = data;
      updateTable();
    })
    .catch((error) => {
      console.error('Could not load students_25.json: ' + error);
      showMessage(
        'Could not load records. Run the page through local local server and check that students_25.json is in the same folder.',
        true,
      );
      recordCount.textContent = '';
    });
}

function showMessage(text, isError) {
  const row = document.createElement('tr');
  row.className = 'message' + (isError ? ' error' : '');

  const cell = document.createElement('td');
  cell.colSpan = 5;
  cell.textContent = text;

  row.appendChild(cell);

  tableBody.innerHTML = '';
  tableBody.appendChild(row);
}

function updateTable() {
  const filtered = allStudents;

  renderTable(filtered);
}

function renderTable(records) {
  tableBody.innerHTML = '';

  if (!records.length) {
    showMessage('No records found', false);
    return;
  }

  records.forEach((student) => {
    const row = document.createElement('tr');

    [
      student.first_name,
      student.middle_initial,
      student.last_name,
      student.program,
      student.year_level,
    ].forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;

      row.appendChild(cell);
    });

    recordCount.textContent = `Showing ${records.length} of ${allStudents.length} student`;
    tableBody.appendChild(row);
  });
}
