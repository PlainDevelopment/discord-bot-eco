const { Schema, model } = require("mongoose");

const ecoSchema = new Schema({
    userID: { type: String },
    bankLimit: { type: Number },
    itemsOwned: { type: Array, default: [] },
    dailyTimeout: { type: Number, default: 0 },
    weeklyTimeout: { type: Number, default: 0 },
    monthlyTimeout: { type: Number, default: 0 },
    yearlyTimeout: { type: Number, default: 0 },
    balance: {
        wallet: { type: Number, default: 0 },
        bank: { type: Number, default: 0 }
    }
});

module.exports = model("economy", ecoSchema);