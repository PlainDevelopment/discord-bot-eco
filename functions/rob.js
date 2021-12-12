exports.run = async(userID, robUserID, minEarn, maxEarn, failChance, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!userID || !maxEarn) throw new Error("Missing variables.");
    if(!minEarn) minEarn = 0;
    const data = await eco.getUser(userID);
    const data2 = await eco.getUser(robUserID);

    const failed = Math.random() < (failChance / 10);
    if(failed) return false;

    let amount = Math.floor(Math.random() * (maxEarn - minEarn + 1) + minEarn);
    if(amount < 0 || amount === 0) return false;
    if(data2.balance.wallet - amount < amount - (amount*.15)) return false; // Let them keep 15%
    data.balance.wallet = data.balance.wallet + amount;
    data2.balance.wallet = data.balance.wallet - amount;
    
    let failed = 0;
    try {
        await data.save();
        await data2.save();
    } catch(e) {
        failed++;
    }
    if(failed !== 0) return false;
    else return {
        earned: amount,
        balance: data.balance
    };
}