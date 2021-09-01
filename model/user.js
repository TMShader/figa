const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: true
    }, 
    models: {
        type: Array
    }
});

module.exports = mongoose.model("user", UserSchema);