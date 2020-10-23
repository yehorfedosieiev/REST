export default class API{
    server = null;
    version = 0;

    constructor(serverName, version){
        this.server = serverName.trim();
        this.version = version;
    }
    //метод получения всех студентов
    getStudentsList(){
        return fetch(`${this.server}/api/v${this.version}/students.json`).then(result => result.json());
    };

    //метод получения студента по id
    getStudentById(id){
        return fetch(`${this.server}/api/v${this.version}/students/${id}.json`).then(result => result.json());
    }

    //метод обновления
    updateStudentById(id, data){
        //по умолчанию fetch отправляет GET
        return fetch(`${this.server}/api/v${this.version}/students/${id}.json`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }).then(result => result.json())
    }
}