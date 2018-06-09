const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


require('./config/config');
//configuracion global de rutas
app.use(require('./routes/index'));




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



// aquin hacemos la conexion con la base de datos mongodb
// especificamos el puerto que en este caso es el 27017 y el nombre de la base de datos que es: cafe
mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;
    console.log('Base de datos ONLINE');

});

app.listen(process.env.PORT, () => {

    console.log("escuchando puerto 3000");
});