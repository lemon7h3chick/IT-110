let allStudents = [];

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
    })
    .catch((error) => {
      console.error('Could not load students_25.json: ' + error);
    });
}
