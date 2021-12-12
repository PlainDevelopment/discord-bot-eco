const err = (text) => {
    return text + ` Do you need help? Join our Discord server: ...`;
}
const mongoose = require("mongoose");
exports.init = async(config) => {
    if (!config) throw new Error(err(`You need to use a config!`));
    let notSetYetAndRequired = [];
    if (!config.mongodbUrl) notSetYetAndRequired.push('mongodbUrl');
    if (notSetYetAndRequired[0]) throw new Error(err(`You need to define some more things: ${notSetYetAndRequired.join(', ')}.`));
    
    try {
        await mongoose.connect(config.mongodbUrl,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            }
        )
    } catch (error) {
        throw new Error(err("The MongoDB URL is NOT VALID!"))
    }
    this.config = config;
    console.log("Economy System Loaded");
    return true;
}

const ecoSchema = require('./db');
this.getUser = async(userID) => {
    var storedSettings = await ecoSchema.findOne({
        userID
    });

    if (!storedSettings) {
        // If there are no settings stored for this guild, we create them and try to retrive them again.
        const newSettings = new ecoSchema({
            userID,
            bankLimit: this.config.limits.defaultBankLimit || 3000
        });
        await newSettings.save().catch(() => {});
        var storedSettings = await ecoSchema.findOne({
            userID
        });
    }
    return storedSettings;
};

exports.give = async (userID, amount, type) => await require('./functions/give').run(userID, amount, type, this);
exports.take = async (userID, amount, type) => await require('./functions/take').run(userID, amount, type, this);
exports.set = async (userID, amount, type) => await require('./functions/set').run(userID, amount, type, this);
exports.reset = async (userID, type) => await require('./functions/reset').run(userID, type, this);
exports.withdraw = async (userID, amount) => await require('./functions/withdraw').run(userID, amount, this);
exports.deposit = async (userID, amount) => await require('./functions/deposit').run(userID, amount, this);
exports.get = async (userID, type) => await require('./functions/get').run(userID, type, this);
exports.work = async (userID, minEarn, maxEarn) => await require('./functions/work').run(userID, minEarn, maxEarn, this);
exports.rob = async(userID, robUserID, minEarn, maxEarn, failChance) => await require('./functions/rob').run(userID, robUserID, minEarn, maxEarn, failChance, this);
exports.giveItem = async(userID, iName) => await require('./functions/giveItem').run(userID, iName, this);
exports.takeItem = async(userID, iName) => await require('./functions/takeItem').run(userID, iName, this);
exports.buy = async(userID, iName) => await require('./functions/buy').run(userID, iName, this);
exports.getItems = async(userID) => await require('./functions/getItems').run(userID, this);
exports.leaderboard = async(type) => await require('./functions/leaderboard').run(type, this);
exports.sell = async(userID, iName) => await require('./functions/sell').run(userID, iName, this);
exports.format = async(money) => await require('./functions/format').run(money, this);
exports.getBankLimit = async(userID) => await require('./functions/getBankLimit').run(userID, this);
exports.getTimeout = async(userID, timeout) => await require('./functions/getBankLimit').run(userID, timeout, this);

exports.shop = async() => {
    if(!this.config.shopEnabled) return false;
    return this.config.shop
}

exports.daily = async (userID, amount) => await require('./functions/daily').run(userID, amount, this);
exports.weekly = async (userID, amount) => await require('./functions/weekly').run(userID, amount, this);
exports.monthly = async (userID, amount) => await require('./functions/monthly').run(userID, amount, this);
exports.yearly = async (userID, amount) => await require('./functions/yearly').run(userID, amount, this);