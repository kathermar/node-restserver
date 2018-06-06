const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'el correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'la contrase;a es necesaria']
    },
    img: {
        type: String,
        required: false
    }, //no es obligatorio
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    }, //default
    estado: {
        type: Boolean,
        default: true
    }, //boolean
    google: {
        type: Boolean,
        default: false // si el usuario no se crea con la propiedad de google siempre va a ser un usuario normal y esa propiedad siempre va a estar en falso
    } //boolean

});

// metodo para que no se muestre la contrase;a cuando el servicio retorna el objeto

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);