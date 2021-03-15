const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const UsersSchema = new mongoose.Schema({
    nome_usuario: String,
    email_usuario: String,
    tipo_usuario: { type: Number, default: 1 }, // 1-User, 2-GrandUSER, 3-HIPER-FOCKING-BIG-MORE-THAN-YOUR-MOM-USER
    senha_usuario: String,
    foto_perfil: { type: String, default: 'https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg' }
}, {
    timestamps: true
});

UsersSchema.pre('save', function (next) {
    if (!this.isModified("senha_usuario")) {
        return next();
    }
    this.senha_usuario = bcrypt.hashSync(this.senha_usuario, 10);
    next();
});

UsersSchema.pre('findOneAndUpdate', function (next) {
    let password = this.getUpdate().senha_usuario + '';
    if (password.length < 100) {
        this.getUpdate().senha_usuario = bcrypt.hashSync(password, 10);
    }
});

module.exports = UsersSchema;