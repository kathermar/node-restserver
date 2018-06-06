//process: objeto global que esta corriendo a lo largo de toda la aplicacion

//======
//puerto

process.env.PORT = process.env.PORT || 3000;

//======
//Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//======
//Base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // creamos en heroku una variable de entorno a la que le asignamos el URL en dond se guarda el usuario 
    // y contrase;a de la base de datos
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;