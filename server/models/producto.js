const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productoSchema = new Schema({



    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },

    precioUni: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },

    descripcion: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },

    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }


});

/*categoriaSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
*/
module.exports = mongoose.model('Producto', productoSchema);