const mongoose = require("mongoose");

const LinkSchema = mongoose.Schema({
    code: {
        type: Number,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: (new Date()).setMinutes( (new Date()).getMinutes() + 5 )
    }
});

LinkSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model("link", LinkSchema);