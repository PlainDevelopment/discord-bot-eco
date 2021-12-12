exports.run = async(userID, amount, type, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!userID || !amount) throw new Error("Missing variables.");
    const data = await eco.getUser(userID);
    if(!type) {
        if(data.balance.wallet - amount < 0 && !eco.config.allowBankruptcy) return false;
        data.balance.wallet = data.balance.wallet - amount;
    } else if(type === "wallet") {
        if(data.balance.wallet - amount < 0 && !eco.config.allowBankruptcy) return false;
        data.balance.wallet = data.balance.wallet - amount;
    } else if(type === "bank") {
        if(data.balance.wallet - amount < 0 && !eco.config.allowBankruptcy) return false;
        data.balance.bank = data.balance.bank - amount;
    }

    let failed = 0;
    try {
        await data.save();
    } catch(e) {
        failed++;
    }
    if(failed !== 0) return false;
    else return data.balance;
}