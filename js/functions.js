export function addStudent(student){
    const studentsList = document.querySelector('#students-list');

    const item = document.createElement('a');
    item.classList.add('list-group-item');
    item.setAttribute('href', '');
    item.setAttribute('data-id', student.id);
    item.innerText = `${student.firstname} ${student.lastname}`;

    studentsList.appendChild(item);
};