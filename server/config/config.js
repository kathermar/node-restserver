//process: objeto global que esta corriendo a lo largo de toda la aplicacion

//======
//puerto
//======

process.env.PORT = process.env.PORT || 3000;

//========
//Entorno
//========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==================
//vencimiento del token
//60 seg
//60 min
//24 hr
//30dias 
//==================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//======================
//seed de autentificacion
//=======================

process.env.SEED = process.env.SEED || 'secret';

//============
//Base de datos
//=============


let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // creamos en heroku una variable de entorno a la que le asignamos el URL en dond se guarda el usuario 
    // y contrase;a de la base de datos
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//================
//Google Client ID
//================

process.env.CLIENT_ID = process.env.CLIENT_ID || '233987860002-om31sc9h12l02dj26q0i2dfjauoacg16.apps.googleusercontent.com';