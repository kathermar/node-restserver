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
    urlDB = 'mongodb://cafe-user:k25101991@ds251210.mlab.com:51210/cafe';
}

process.env.URLDB = urlDB;