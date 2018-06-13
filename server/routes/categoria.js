const express = require('express');
const bodyParser = require('body-parser');


const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria.js');
const Usuario = require('../models/usuario.js');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


app.get('/categoria', verificaToken, (req, res) => {
    // retorna todas las categorias
    Categoria.find({})
        .sort('descripcion')
        // no se estan mostrando
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        })

});


app.get('/categoria:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

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
    let body = req.body;


    let descCategoria = {
        descripcion: body.descripcion
    };
    // el new: true nos permite ver el valor que estamos modificando
    // run validator permite que se tomen en cuenta las validaciones colocadas en el schema
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

//delete para borrar, cambiar el status
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    //la eliminacio fisica se hacce utilizando la funcion .findAndRemove del schema
    //pero la eliminacion que debe usarse es la logica cambiando el estado
    Usuario.findByIdAndRemove(id, (err, CategoriaBorrada) => {
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
                    message: 'id no existe'
                }

            });
        }
        res.json({
            ok: true,
            usuario: CategoriaBorrada
        });

    });

});


module.exports = app;