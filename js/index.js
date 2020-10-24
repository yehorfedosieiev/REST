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
        const element = document.querySelector(`#students-list [data-id="${id}"]`);

        console.log('element соответствующий редактируемому', element);// element соответствующий редактируемому
        element.innerText = `${data.firstname} ${data.lastname}`;
    }).catch(error => {
        console.error(error);
    });
});

//кнопка Create - обработка нажатия
document.querySelector('#form-add-student button[type="submit"]').addEventListener('click', function(event){
    
    const formAddStudent = document.querySelector('#form-add-student');
    // const data ={
    //     'firstname': formAddStudent.elements.firstname.value,
    //     'lastname': formAddStudent.elements.lastname.value,
    //     'email': formAddStudent.elements.email.value,
    //     'git': formAddStudent.elements.git.value,
    //     'info': formAddStudent.elements.info.value
    // };

    const {elements} = formAddStudent;
    const data ={
        'firstname': elements.firstname.value,
        'lastname': elements.lastname.value,
        'email': elements.email.value,
        'git': elements.git.value,
        'info': elements.info.value
    };

    //если нет класса has-error, поля не будут подсвечиваться красным
    const elementsWithError = formAddStudent.querySelectorAll('.has-error');
    if (elementsWithError !== null){ //if (elementsWithError.length) {
        console.log('все элементы на странице, у которых есть класс has-error', elementsWithError);
            elementsWithError.forEach(element => {
                element.classList.remove('has-error');
            });
    }
    //----------

    //проверка, что поля пустые
    let hasError = false;
    if (!data.firstname){
        formAddStudent.querySelector('[name="firstname"]').parentNode.classList.add("has-error");
        hasError = true;
    };
    if (!data.lastname){
        formAddStudent.querySelector('[name="lastname"]').parentNode.classList.add("has-error");
        hasError = true;
    };
    if(hasError) return;
    //----------

    api.createStudent(data).then(response => {

        console.log(response);//при успешном респонсе 200, сервер вернет id
        
        const {name:id} = response;
        data.id = id;
        
        addStudent(data);
        
        formAddStudent.reset();// очищение формы
        
    }).catch(error => {
        console.error(error);
    });
});

//кнопка Delete - обработка нажатия
document.querySelector('#form-edit-student button[type="button"]').addEventListener('click', () => {
    const id = document.querySelector('#form-edit-student [name="id"]').value;
    if(!id){
        return;
    }
    console.log('id удаляемого студента', id);
    api.deleteStudent(id).then(response => { // вместо response можно поставить ()
        document.querySelector('#students-list [data-id="' + id + '"]').remove();
        const formEditStudent = document.querySelector('#form-edit-student');
        formEditStudent.reset();
    }).catch(error => {
        console.error(error);
    })
});

//кнопка Reset - обработка нажатия
document.querySelector('#form-add-student button[type="reset"]').addEventListener('click', () => {
    const formAddStudent = document.querySelector('#form-add-student');
    console.log('yes');
    formAddStudent.reset();
});