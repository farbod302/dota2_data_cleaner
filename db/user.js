const mongoose = require("mongoose")

const user = mongoose.Schema({
    name: String,
    phone: String,
    user_id: String,
    vip: { type: Boolean, default: true },
    vip_until: Number,
    steam_id: Number,
    dota_id: Number,
})

module.exports = mongoose.model("User", user)