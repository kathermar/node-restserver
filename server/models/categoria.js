const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({



    descripcion: {
        type: String,
        unique: true,
        required: [true, 'la descripcion es necesaria'],
        usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
    },


});

/*categoriaSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
*/
module.exports = mongoose.model('Categoria', categoriaSchema);