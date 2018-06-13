const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');


const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria.js');
const Producto = require('../models/producto.js');
const Usuario = require('../models/usuario.js');


const app = express();


app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


app.get('/producto', verificaToken, (req, res) => {
    // retorna todas las categorias
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        })

});


app.get('/producto:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'el id no es valido'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });


        });
});


//==========================
// Buscar productos
//==========================


app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        })



});

//==========================
// Crear nuevo Producto
//==========================

// el post es para crear nuevos registros
app.post('/producto', verificaToken, function(req, res) {
    let body = req.body;


    let producto = new Producto({


        nombre: body.nombre,
        descripcion: body.descripcion,
        disponible: body.disponible,
        precioUni: body.precioUni,
        categoria: body.categoria,
        usuario: req.usuario._id

        //usamos bcrypt para encriptar la contrasena
        //colocamos hashsync para que lo haga de forma sincrona sin usar callbacks ni promesas
        //  password: bcrypt.hashSync(body.password, 10),
        //role: body.role
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // una forma de que no se muestre la contrasena al retornar el objeto
        //UsuarioDB.password = null;

        res.status(201).json({
            ok: true,
            producto: productoDB
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

app.put('/producto/:id', [verificaToken], function(req, res) {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    });
});

//delete para borrar, cambiar el status
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };
    //la eliminacio fisica se hacce utilizando la funcion .findAndRemove del schema
    //pero la eliminacion que debe usarse es la logica cambiando el estado
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, ProductoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!ProductoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }

            });
        }
        res.json({
            ok: true,
            producto: ProductoBorrado
        });

    });

});


module.exports = app;