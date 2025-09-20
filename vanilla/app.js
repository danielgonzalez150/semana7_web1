//Funciones de almacenamiento
function getStudents() {
    const students = localStorage.getItem('students'); //Obtiene los estudiantes del localStorage
    return students ? JSON.parse(students) : [];
}
//¿Qué hace este código?
//localStorage.getItem('students'): Busca en el almacenamiento local del navegador un ítem llamado 'students'.
//Si existe, lo obtiene como texto (string).
//JSON.parse(students): Convierte ese texto en un arreglo de objetos JavaScript (los estudiantes).
//Si no existe nada guardado, retorna un arreglo vacío [].
//En resumen:
//Esta función te permite recuperar la lista de estudiantes guardados en el navegador. Si no hay estudiantes guardados, devuelve una lista vacía.
function saveStudent(student) {
    const students = getStudents();
    students.push(student); //Agrega el nuevo estudiante al arreglo
    localStorage.setItem('students', JSON.stringify(students)); //Guarda el arreglo actualizado en el localStorage
    console.log('Estudiante guardado:', student);}
function saveStudents(students) {
    localStorage.setItem('students', JSON.stringify(students)); // Guarda el arreglo actualizado
}
function deleteStudent() {}
//La función router en tu código es la encargada de mostrar el contenido correcto en la página según la ruta (hash) del navegador. 
// Así funciona:
//En resumen:
//El router detecta la ruta en la URL y muestra el template correspondiente (formulario, lista o 404) en el <main id="app">. 
// Así tu aplicación funciona como una SPA (Single Page Application).
function router() {
    const path = location.hash.slice(1) || '/';
    const app = document.getElementById('app');
    app.innerHTML = "";

    let templateId;
    if (path === '/') {
        templateId = 'form-template';
    } else if (path === '/lista') {
        templateId = 'list-template';
    } else {
        templateId = '404-template';
    }

    const template = document.getElementById(templateId);
    app.appendChild(template.content.cloneNode(true));

    if (path === '/') {
        attachFormLogic();
    } else if (path === '/lista') {
        renderStudentList(); // <--- ¡Esto es lo que hace que aparezcan los estudiantes!
    }
}
function attachFormLogic() {
    const form = document.getElementById('studentform');
    form.addEventListener('submit', (e)=> {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const nota1 = parseFloat(document.getElementById('nota1').value);
        const nota2 = parseFloat(document.getElementById('nota2').value);
        const nota3 = parseFloat(document.getElementById('nota3').value);
        if (!name || isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
            document.getElementById('msg').textContent = "Por favor, complete todos los campos correctamente."; //Ocupa el id msg del html
            return;
        } //Para hacer estas validaciones más complejas, se usa RegEx 
        // ...dentro de attachFormLogic()...
        const average = (nota1 + nota2 + nota3) / 3; // Esto es un número
        saveStudent({ name, average });
        document.getElementById('msg').textContent = `Estudiante ${name} con nota final ${average} guardado.`; //<Este tipo de 
        //comillas permite insertar variables dentro de cadenas de texto
        form.reset(); //Limpia el formulario
    });
}
function renderStudentList() {
    const students = getStudents();
    const listContainer = document.getElementById('student-list');
    listContainer.innerHTML = "";
    if (students.length === 0) {
        const emptyMsg = document.createElement('li');
        emptyMsg.textContent = "No hay estudiantes registrados.";
        listContainer.appendChild(emptyMsg);
        return;
    }
    const template = document.getElementById('student-item-template');
    students.forEach((student, index) => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.student-name').textContent = student.name;
        clone.querySelector('.student-average').textContent = student.average.toFixed(2);
        // Botón eliminar
        clone.querySelector('.delete-btn').addEventListener('click', () => {
            deleteStudent(index);
            renderStudentList();
        });
        listContainer.appendChild(clone);
    });
}
function deleteStudent(index) {
    const students = getStudents();
    students.splice(index, 1); // Elimina el estudiante en la posición index
    localStorage.setItem('students', JSON.stringify(students));
}
window.addEventListener('hashchange', router);
window.addEventListener('load', router);
