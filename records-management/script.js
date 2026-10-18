let allStudents = [];

const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const programFilter = document.getElementById('programFilter');
const yearFilter = document.getElementById('yearFilter');
const resetBtn = document.getElementById('resetBtn');
const recordCount = document.getElementById('recordCount');
const tableBody = document.getElementById('tableBody');

searchInput.addEventListener('input', updateTable);
sortSelect.addEventListener('change', updateTable);
programFilter.addEventListener('change', updateTable);
yearFilter.addEventListener('change', updateTable);
resetBtn.addEventListener('click', resetControls);

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
  const filtered = getFilteredRecods();
  const sorted = getSortedRecords(filtered);

  renderTable(sorted);
}

function getFilteredRecods() {
  const query = searchInput.value.trim().toLowerCase();
  const program = programFilter.value;
  const year = yearFilter.value;

  return allStudents.filter((student) => {
    const matchesSearch =
      query === '' ||
      student.first_name.toLowerCase().includes(query) ||
      student.last_name.toLowerCase().includes(query) ||
      student.program.toLowerCase().includes(query);

    const matchesProgram = program === 'all' || student.program === program;
    const matchesYear = year === 'all' || student.year_level === Number(year);

    return matchesSearch && matchesProgram && matchesYear;
  });
}

function getSortedRecords(records) {
  const sorted = [...records];
  console.log(sorted);
  const byText = (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' });

  switch (sortSelect.value) {
    case 'first-asc':
      sorted.sort((a, b) => byText(a.first_name, b.first_name));
      break;
    case 'first-desc':
      sorted.sort((a, b) => byText(b.first_name, a.first_name));
      break;
    case 'last-asc':
      sorted.sort((a, b) => byText(a.last_name, b.last_name));
      break;
    case 'last-desc':
      sorted.sort((a, b) => byText(b.last_name, a.last_name));
      break;
    case 'year-asc':
      sorted.sort((a, b) => a.year_level - b.year_level);
      break;
    case 'year-desc':
      sorted.sort((a, b) => b.year_level - a.year_level);
      break;
    default:
      break;
  }
  return sorted;
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

function resetControls() {
  searchInput.value = '';
  sortSelect.value = 'default';
  programFilter.value = 'all';
  yearFilter.value = 'all';

  updateTable();
  searchInput.focus();
}
