const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
                return passwordRegex.test(value)
            },
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
        }
    },
    confirmationCode:{
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);

            },
            message: 'Invalid email address',
        }
    },
    displayName: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
})

module.exports = mongoose.model('userModel', userSchema)