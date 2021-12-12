exports.run = async(type, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!type) {
        const d2 = await require('../db.js').find({});

        d2.sort(function (a, b) {
            return a.balance.wallet - b.balance.wallet;
        });
        if(!d2[0] || d2[0].balance.wallet === 0) return false;
        return d2;
    }
    if(type === "wallet") {
        const d2 = await require('../db.js').find({});

        d2.sort(function (a, b) {
            return a.balance.wallet - b.balance.wallet;
        });
        if(!d2[0] || d2[0].balance.wallet === 0) return false;
        return d2;
    }
    if(type === "bank") {
        const d2 = await require('../db.js').find({});

        d2.sort(function (a, b) {
            return a.balance.bank - b.balance.bank;
        });
        if(!d2[0] || d2[0].balance.bank === 0) return false;
        return d2;
    }
    if(type === "both") {
        const d2 = await require('../db.js').find({});

        d2.sort(function (a, b) {
            return (a.balance.bank + a.balance.wallet) - (b.balance.bank + b.balance.bank);
        });
        if(!d2[0]) return false;
        if(d2[0].balance.bank === 0 && d2[0].balance.wallet === 0) return false;
        return d2;
    }
}