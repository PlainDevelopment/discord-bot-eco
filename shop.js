const { Schema, model } = require("mongoose");

const ecoSchema = new Schema({
    guildID: { type: String },
    shop: { type: Object }
});

module.exports = model("economyshop", ecoSchema);