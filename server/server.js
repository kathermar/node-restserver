const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./config/config');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.send('get usuario')
})

// el post es para crear nuevos registros
app.post('/usuario', function(req, res) {

    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'el nombre es necesario'
        });
    } else {


        res.json({
            body
        });
    }
})


//put para actualizar data 

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    res.json({
        id
    });
});

//delete para borrar, cambiar el status
app.delete('/usuario', function(req, res) {
    res.send('delete usuario')
})

app.listen(process.env.PORT, () => {

    console.log("escuchando puerto 3000");
});