const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    key:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    }
},{
    timestamps:true
});


module.exports = mongoose.model('user', userSchema);