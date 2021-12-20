const mongoose = require('mongoose');
const ecoSchema = require('./db');
var mongoUrl;
var config;

class Economy {

    /**
     * @param {string} [userID] - Get raw data for a user
     */
    static async getUser(userID) {
        var storedSettings = await ecoSchema.findOne({
            userID
        });

        if (!storedSettings) {
            // If there are no settings stored for this guild, we create them and try to retrive them again.
            const newSettings = new ecoSchema({
                userID,
                bankLimit: config.limits.defaultBankLimit || 3000
            });
            await newSettings.save().catch(() => {});
            var storedSettings = await ecoSchema.findOne({
                userID
            });
        }
        return storedSettings;
    }

    /**
     * @param {string} [dbUrl] - A valid mongo database URI.
     */
    static async setURL(dbUrl) {
        if (!dbUrl) throw new TypeError("A database url was not provided.");
        mongoUrl = dbUrl;
        return mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    /**
     * @param {object} [conf] - Module configuration
     */
    static async setConfig(conf) {
        if (!conf) throw new TypeError("Configuration was not provided");
        config = conf;
        return config;
    }


    /**
     * @param {string} [userID] - Discord User ID
     * @param {string} [iName] - Item Name
     */
    static async buy(userID, iName) {

        if (!userID || !iName) throw new Error("Missing variables.");

        const data = await Economy.getUser(userID);

        const shop = config.shop;
        let item = shop.find(o => o.itemName === iName);

        if (!item) return ("not_real");
        if (!item.itemBuyable) return ("not_for_sale");
        if (data.balance.wallet < item.itemBuyPrice) return ("cannot_afford");

        data.balance.wallet = data.balance.wallet - item.itemBuyPrice;

        let failed1 = 0;
        try {
            await data.save();
        } catch (e) {
            failed1++;
        }
        if (failed1 !== 0) return false;
        else {
            Economy.giveItem(userID, item.itemName);
            return data.balance;
        }
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {number} [amount] - Amount of money to give
     */
    static async daily(userID, amount) {

        if (!userID || !amount) throw new Error("Missing variables.");
        const data = await Economy.getUser(userID);

        if (Date.now() < (data.dailyTimeout + 86400000)) return false; // If it has been less than 24 hours, return.
        
        
        if (Date.now() > (data.dailyTimeout + (86400000 * 2))) data.dailyStreak = 0
        else data.dailyStreak = data.dailyStreak + 1

        data.dailyTimeout = Date.now();
        data.balance.wallet = data.balance.wallet + amount;

        let failed2 = 0;
        try {
            await data.save();
        } catch (e) {
            failed2++;
        }
        if (failed2 !== 0) return false;
        else return {
            wallet: data.balance.wallet,
            bank: data.balance.bank,
            streak: data.dailyStreak
        };
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {number} [amount] - Item Name
     */
    static async deposit(userID, amount) {

        if (!userID || !amount) throw new Error("Missing variables.");
        const data = await Economy.getUser(userID);

        if ((data.balance.wallet - amount) < 0 && !config.allowBankruptcy) return false;
        if ((data.balance.bank + amount) > data.bankLimit && config.limits.enabled) return ("bank_limit");
        data.balance.wallet = data.balance.wallet - amount;
        data.balance.bank = data.balance.bank + amount;
        let failed3 = 0;
        try {
            await data.save();
        } catch (e) {
            failed3++;
        }
        if (failed3 !== 0) return false;
        else return data.balance;
    }

    /**
     * @param {number} [money] - Number to format
     */
    static async format(money) {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });

        if (!money && money !== 0) throw new Error("Missing variables.");
        const convert = formatter.format(money);
        return (convert.replace('$', config.currency).replace('.00', ''));
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {string} [type] - Wallet, Bank
     */
    static async get(userID, type) {

        if (!userID) throw new Error("Missing variables.");
        const data = await Economy.getUser(userID);
        if (!type) return data.balance;
        if (type === "wallet") return data.balance.wallet;
        if (type === "bank") return data.balance.bank;
        return data.balance;
    }

    /**
     * @param {string} [userID] - Discord User ID
     */
    static async getBankLimit(userID) {

        if (!userID) throw new Error("Missing variables.");
        const data = await Economy.getUser(userID);
        if (!config.limits.enabled) return false;

        return data.bankLimit;
    }

    /**
     * @param {string} [userID] - Discord User ID
     */
    static async getItems(userID) {

        if (!userID) throw new Error("Missing variables.");

        const data = await Economy.getUser(userID);

        return data.itemsOwned;
    }

    /**
     * @param {number} [from] - Min
     * @param {number} [to] - Max
     */
    static async getRandom(from, to) {

        if (!from || !to) throw new Error("Missing variables.");

        return Math.floor(Math.random() * (to - from + 1) + from)
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {string} [timeout] - Daily, Weekly, Monthly
     */
    static async getTimeout(userID, timeout) {

        if (!userID || !timeout) throw new Error("Missing variables.");

        const data = await Economy.getUser(userID);

        if (timeout === "daily") return data.dailyTimeout;
        if (timeout === "weekly") return data.weeklyTimeout;
        if (timeout === "monthly") return data.monthlyTimeout;
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {number} [amount] - Amount of money to give
     * @param {string} [type] - Wallet, Bank
     */
    static async give(userID, amount, type) {

        if (!userID || !amount) throw new Error("Missing variables.");
        const data = await Economy.getUser(userID);
        if (!type) data.balance.wallet = data.balance.wallet + amount;
        else if (type === "wallet") data.balance.wallet = data.balance.wallet + amount;
        else if (type === "bank") {
            if (data.balance.bank + amount > data.bankLimit && config.limits.enabled) return ("bank_limit");
            else data.balance.bank = data.balance.bank + amount;
        }
        let failed4 = 0;
        try {
            await data.save();
        } catch (e) {
            failed4++;
        }
        if (failed4 !== 0) return false;
        else return data.balance;
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {string} [iName] - Item Name to give
     */
    static async giveItem(userID, iName) {

        if (!userID || !iName) throw new Error("Missing variables.");

        const data = await Economy.getUser(userID);

        const shop = config.shop;
        let item = shop.find(o => o.itemName === iName);

        if (!item) return false;
        const objIndex = await data.itemsOwned.findIndex((obj => obj.item.itemName === iName));
        let iowned;
        if (objIndex === -1) {
            data.itemsOwned.push({
                item,
                amount: 1
            });
        } else {
            data.itemsOwned[objIndex].amount = data.itemsOwned[objIndex].amount + 1;
            iowned = data.itemsOwned[objIndex];
        }

        if (iowned) data.itemsOwned[objIndex] = iowned;

        let failed5 = 0;
        try {
            await data.save();
        } catch (e) {
            failed5++;
        }
        if (failed5 !== 0) return false;
        else return data.balance;
    }

    /**
     * @param {string} [type] - Wallet, Bank, Both
     */
    static async leaderboard(type) {

        if (!type || type === "both") {
            const d2 = await require('./db.js').find({});
            if(!d2) return;
            d2.sort((a, b) => {
                return parseFloat(b.balance.bank + b.balance.wallet) - parseFloat(a.balance.bank + a.balance.wallet)
            });
            
            if (!d2[0] || (d2[0].balance.bank + d2[0].balance.wallet) === 0) return false;

            return d2;
        }
        if (type === "wallet") {
            const d2 = await require('./db.js').find({});
            if(!d2) return;
            d2.sort((a, b) => {
                return parseFloat(b.balance.wallet) - parseFloat(a.balance.wallet)
            });
            
            if (!d2[0] || d2[0].balance.wallet === 0) return false;
            return d2;
        }
        if (type === "bank") {
            const d2 = await require('./db.js').find({});
            if(!d2) return;
            d2.sort((a, b) => {
                return parseFloat(b.balance.bank) - parseFloat(a.balance.bank)
            });
            
            if (!d2[0] || d2[0].balance.bank === 0) return false;
            return d2;
        }
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {number} [amount] - Amount of money to give
     */
    static async monthly(userID, amount) {

        if (!userID || !amount) throw new Error("Missing variables.");
        const data = await Economy.getUser(userID);

        if (Date.now() < (data.monthlyTimeout + 2592000000)) return false // If it has been less than 24 hours, return.

        if (Date.now() > (data.monthlyTimeout + (2592000000 * 2))) data.monthlyStreak = 0
        else data.monthlyStreak = data.monthlyStreak + 1

        data.monthlyTimeout = Date.now();
        data.balance.wallet = data.balance.wallet + amount;

        let failed6 = 0;
        try {
            await data.save();
        } catch (e) {
            failed6++;
        }
        if (failed6 !== 0) return false;
        else return {
            wallet: data.balance.wallet,
            bank: data.balance.bank,
            streak: data.monthlyStreak
        };
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {string} [type] - Wallet, Bank
     */
    static async reset(userID, type) {

        if (!userID) throw new Error("Missing variables.");
        const data = await Economy.getUser(userID);
        if (!type) {
            data.balance.wallet = 0;
            data.balance.bank = 0;
        } else if (type === "wallet") data.balance.wallet = 0;
        else if (type === "bank") data.balance.bank = 0;

        let failed7 = 0;
        try {
            await data.save();
        } catch (e) {
            failed7++;
        }
        if (failed7 !== 0) return false;
        else return data.balance;
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {string} [robUserID] - User ID to rob
     * @param {number} [minEarn] - Minimum money to earn
     * @param {number} [maxEarn] - Maximum money to earn
     * @param {number} [failChance] - Fail chance out of 100
     */
    static async rob(userID, robUserID, minEarn, maxEarn, failChance) {

        if (!userID || !robUserID || !maxEarn || !failChance) throw new Error("Missing variables.");
        if (!minEarn) minEarn = 0;
        const data = await Economy.getUser(userID);
        const data2 = await Economy.getUser(robUserID);

        const failed8 = Math.random() < (failChance / 10);
        if (failed8) return false;

        let amount = Math.floor(Math.random() * (maxEarn - minEarn + 1) + minEarn);
        if (amount < 0 || amount === 0) Math.floor(Math.random() * (maxEarn - minEarn + 1) + minEarn);
        if(amount < 0 || amount === 0) return false;
        if (data2.balance.wallet - amount < amount - (amount * .4) && (amount / 2) > data2.balance.wallet) return false; // Let them keep 4%
        data.balance.wallet = data.balance.wallet + amount;
        data2.balance.wallet = data2.balance.wallet - amount;

        let failed9 = 0;
        try {
            await data.save();
            await data2.save();
        } catch (e) {
            failed9++;
        }
        if (failed9 !== 0) return false;
        else return {
            earned: amount,
            balance: data.balance
        };
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {string} [iName] - Item Name
     */
    static async sell(userID, iName) {

        if (!userID || !iName) throw new Error("Missing variables.");

        const data = await Economy.getUser(userID);

        const shop = config.shop;
        let item = shop.find(o => o.itemName === iName);

        if (!item) return ("not_real");
        if (!item.itemSellable) return ("not_sellable");
        if (data.itemsOwned.findIndex((obj => obj.item.itemName == item.name)) === -1) return ("not_owned");
        data.balance.wallet = data.balance.wallet + item.itemSellPrice;

        let failed10 = 0;
        try {
            await data.save();
        } catch (e) {
            failed10++;
        }
        if (failed10 !== 0) return false;
        else {
            require('../index').takeItem(userID, item.itemName);
            return data.balance;
        }
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {number} [amount] - Amount of money to set
     * @param {string} [type] - Wallet, Bank
     */
    static async set(userID, amount, type) {

        if (!userID || !amount) throw new Error("Missing variables.");
        const data = await Economy.getUser(userID);
        if (!type) data.balance.wallet = amount;
        else if (type === "wallet") data.balance.wallet = amount;
        else if (type === "bank") data.balance.bank = amount;

        let failed11 = 0;
        try {
            await data.save();
        } catch (e) {
            failed11++;
        }
        if (failed11 !== 0) return false;
        else return data.balance;
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {number} [amount] - Amount of money to take
     * @param {string} [type] - Wallet, Bank
     */
    static async take(userID, amount, type) {

        if (!userID || !amount) throw new Error("Missing variables.");
        const data = await Economy.getUser(userID);
        if (!type) {
            if (data.balance.wallet - amount < 0 && !config.allowBankruptcy) return false;
            data.balance.wallet = data.balance.wallet - amount;
        } else if (type === "wallet") {
            if (data.balance.wallet - amount < 0 && !config.allowBankruptcy) return false;
            data.balance.wallet = data.balance.wallet - amount;
        } else if (type === "bank") {
            if (data.balance.wallet - amount < 0 && !config.allowBankruptcy) return false;
            data.balance.bank = data.balance.bank - amount;
        }

        let failed12 = 0;
        try {
            await data.save();
        } catch (e) {
            failed12++;
        }
        if (failed12 !== 0) return false;
        else return data.balance;
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {string} [iName] - Item Name to take
     */
    static async takeItem(userID, iName) {

        if (!userID || !iName) throw new Error("Missing variables.");

        const data = await Economy.getUser(userID);

        const shop = config.shop;
        let item = shop.find(o => o.itemName === iName);

        if (!item) return false;
        objIndex = data.itemsOwned.findIndex((obj => obj.item.itemName == item.name));
        if (!objIndex) return ("not_owned");

        if (data.itemsOwned[objIndex].amount === 1) myArray = myArray.filter(obj => {
            return obj.item.name !== data.itemsOwned[objIndex].item.name;
        });
        else data.itemsOwned[objIndex].amount--;

        let failed13 = 0;
        try {
            await data.save();
        } catch (e) {
            failed13++;
        }
        if (failed13 !== 0) return false;
        else return data.balance;
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {number} [amount] - Amount of money to give
     */
    static async weekly(userID, amount) {

        if (!userID || !amount) throw new Error("Missing variables.");
        const data = await Economy.getUser(userID);

        if (Date.now() < (data.weeklyTimeout + (604800000))) return false // If it has been less than 24 hours, return.
        
        if (Date.now() > (data.weeklyTimeout + (604800000 * 2))) data.weeklyStreak = 0
        else data.weeklyStreak = data.weeklyStreak + 1

        data.weeklyTimeout = Date.now();
        data.balance.wallet = data.balance.wallet + amount;

        let failed14 = 0;
        try {
            await data.save();
        } catch (e) {
            failed14++;
        }
        if (failed14 !== 0) return false;
        else return {
            wallet: data.balance.wallet,
            bank: data.balance.bank,
            streak: data.weeklyStreak
        };//?
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {number} [amount] - Item Name
     */
    static async withdraw(userID, amount) {

        if (!userID || !amount) throw new Error("Missing variables.");
        const data = await Economy.getUser(userID);

        if ((data.balance.bank - amount) < 0 && !config.allowBankruptcy) return false;
        data.balance.wallet = data.balance.wallet + amount;
        data.balance.bank = data.balance.bank - amount;
        let failed15 = 0;
        try {
            await data.save();
        } catch (e) {
            failed15++;
        }
        if (failed15 !== 0) return false;
        else return data.balance;
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {number} [minEarn] - Min money they can get
     * @param {number} [maxEarn] - Max money they can get
     * @param {number} [failChance] - Chance they get nothing
     */
    static async work(userID, minEarn, maxEarn, failChance) {

        if (!userID || !maxEarn) throw new Error("Missing variables.");
        if (!minEarn) minEarn = 0;
        const data = await Economy.getUser(userID);

        const failed16 = Math.random() < (failChance / 10);
        if (failed16) return false;

        let amount = Math.floor(Math.random() * (maxEarn - minEarn + 1) + minEarn);

        data.balance.wallet = data.balance.wallet + amount;
        let failed17 = 0;
        try {
            await data.save();
        } catch (e) {
            failed17++;
        }
        if (failed17 !== 0) return false;
        else return {
            earned: amount,
            balance: data.balance
        };
    }

    /**
     * @param {string} [userID] - Discord User ID
     * @param {string} [streak] - Daily, Weekly, Monthly
     */

    static async getStreak(userID, streak) {

        if (!userID || !streak) throw new Error("Missing variables.");

        const data = await Economy.getUser(userID);

        if (streak === "daily") {
            if (Date.now() > (data.dailyTimeout + (86400000 * 2))) {
                data.dailyStreak = 0
                await data.save();
            }
            return data.dailyStreak  
        }
        if (streak === "weekly") {
            if(Date.now() > (data.weeklyTimeout + (604800000 * 2))) {
                data.weeklyStreak = 0;
                await data.save();
            }
            return data.weeklyStreak;
        }
        if (streak === "monthly") {
            if(Date.now() > (data.monthlyTimeout + (2592000000 * 2))) {
                data.monthlyStreak = 0;
                await data.save();
            }
            return data.monthlyStreak;
        }
    }

}

module.exports = Economy;