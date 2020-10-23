import Server from "./api.js"; //т.к. экспортируется из файла api.js по default можно переименовать API в Server
import { addStudent } from './functions.js';

const api = new Server('https://frontend-lectures.firebaseio.com', 1); // адрес сервера, версия api
const formEditStudent = document.querySelector('#form-edit-student');
console.log(api);

api.getStudentsList().then(response => {
    console.log(response);
    //Object это то, что вернул сервер
    console.log('keys - возвращает все ключи объекта response', Object.keys(response)); //возвращает все ключи объекта response
    console.log('values - массив всех значений, отделить ключи от значений', Object.values(response)); //массив всех значений, отделить ключи от значений
    console.log('entries - позволяет получить как ключи так и значения объекта response', Object.entries(response)); //позволяет получить как ключи так и значения объекта response

    // map
    const students = Object.entries(response).map(item => {
        console.log('item', item);
        const [id, student] = item;
        console.log('id', id);
        console.log('student', student);
        student.id = id; // добавляем в объект student ключ id со значение id, полученный при деструктуризации item (элемент массива Object.entries(response))

        return student; //возвращаем полученный массив
    });

    console.log(students);

    students.forEach(addStudent); // то же самое, что и students.forEach(student => addStudent(student));

}).catch(error => {
    console.error(error);
});

document.body.addEventListener('click', event => {
    event.preventDefault(); //убираем значение по умолчанию, а именно на ссылке

    console.log(event.target.hasAttribute('data-id')); //true если по ссылке с data-id, false - все остальное

    if (!event.target.hasAttribute('data-id')) return;

    const studentId = event.target.getAttribute('data-id');

    console.log('studentId = ', studentId);
    api.getStudentById(studentId).then(response => {
        console.log(response);

        for(let key in response){
            formEditStudent.elements[key].value = response[key];
        }
        formEditStudent.elements.id.value = studentId;
    });
});

// formEditStudent.addEventListener('submit', function(event){
//     event.preventDefault(); // форма не отправляет запрос

//     console.log(event);
// })

document.querySelector('#form-edit-student button[type="submit"]').addEventListener('click', ()=>{
    console.log(formEditStudent.elements);

    const data ={
        'firstname': formEditStudent.elements.firstname.value,
        'lastname': formEditStudent.elements.lastname.value,
        'email': formEditStudent.elements.email.value,
        'git': formEditStudent.elements.git.value,
        'info': formEditStudent.elements.info.value
    };

    console.log(data);

    const id = formEditStudent.elements.id.value; //скрытый input в index.html

    api.updateStudentById(id, data).then(response => {
        console.log('response от updateStudentById', response);
        const element = document.querySelector(`#student-list [data-id="${id}"]`);

        console.log('element соответствующий редактируемому', element);// element соответствующий редактируемому
    }).catch(error => {
        console.error(error);
    });
})