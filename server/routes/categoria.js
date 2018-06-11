const express = require('express');
const bodyParser = require('body-parser');


const { verificaToken } = require('../middlewares/autenticacion');
const Categoria = requiere('../models/categoria');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


app.get('/categoria', verificaToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // aqui le digo que campos quiero que muestre o que condiciones
    Categoria.find({ estado: true }, 'nombre')
        // con limit le estoy diciendo que me retorne solo 5 registros
        // con el skip le digo que se salte los primeros 5 registros
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ esto: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                })
            });

            res.json({
                ok: true,
                categorias
            })

        });



});

// el post es para crear nuevos registros
app.post('/categoria', verificaToken, function(req, res) {
    let body = req.body;


    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id

        //usamos bcrypt para encriptar la contrasena
        //colocamos hashsync para que lo haga de forma sincrona sin usar callbacks ni promesas
        //  password: bcrypt.hashSync(body.password, 10),
        //role: body.role
    });

    categoria.save((err, CategoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!CategoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // una forma de que no se muestre la contrasena al retornar el objeto
        //UsuarioDB.password = null;

        res.json({
            ok: true,
            categoria: CategoriaDB
        });

    });

});
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

app.put('/categoria/:id', [verificaToken], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);

    // el new: true nos permite ver el valor que estamos modificando
    // run validator permite que se tomen en cuenta las validaciones colocadas en el schema
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, CategoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: CategoriaDB
        });

    });


});

//delete para borrar, cambiar el status
app.delete('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    //la eliminacio fisica se hacce utilizando la funcion .findAndRemove del schema
    //pero la eliminacion que debe usarse es la logica cambiando el estado
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, CategoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!CategoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }

            });
        }
        res.json({
            ok: true,
            usuario: CategoriaBorrado
        });

    });

});


module.exports = app;