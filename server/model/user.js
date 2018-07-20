const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} Role Invalid'
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Mail required"]
    },
    password: {
        type: String,
        required: [true, "Password required"]
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: validRoles
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


userSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
})

module.exports = mongoose.model('User', userSchema);