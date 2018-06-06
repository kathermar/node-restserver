const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
// libreria para obtener informacion del body
const bodyParser = require('body-parser');
//libreria para encriptar contrase;as
const bcrypt = require('bcrypt');
//libre con multiples funciones 
//en este caso se utiliza para retornar la informacion que queramos de un objeto (pick)
const _ = require('underscore');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // aqui le digo que campos quiero que muestre o que condiciones
    Usuario.find({ estado: true }, 'nombre email')
        // con limit le estoy diciendo que me retorne solo 5 registros
        // con el skip le digo que se salte los primeros 5 registros
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ esto: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            });

            res.json({
                ok: true,
                usuarios
            })

        });



});

// el post es para crear nuevos registros
app.post('/usuario', function(req, res) {
        let body = req.body;


        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            //usamos bcrypt para encriptar la contrasena
            //colocamos hashsync para que lo haga de forma sincrona sin usar callbacks ni promesas
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });

        usuario.save((err, UsuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // una forma de que no se muestre la contrasena al retornar el objeto
            //UsuarioDB.password = null;

            res.json({
                ok: true,
                usuario: UsuarioDB
            });

        });

    })
    /*
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
    })*/

//put para actualizar data 

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // el new: true nos permite ver el valor que estamos modificando
    // run validator permite que se tomen en cuenta las validaciones colocadas en el schema
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, UsuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: UsuarioDB
        });

    });


});

//delete para borrar, cambiar el status
app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    //la eliminacio fisica se hacce utilizando la funcion .findAndRemove del schema
    //pero la eliminacion que debe usarse es la logica cambiando el estado
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, UsuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!UsuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }

            });
        }
        res.json({
            ok: true,
            usuario: UsuarioBorrado
        });

    });

});
module.exports = app;