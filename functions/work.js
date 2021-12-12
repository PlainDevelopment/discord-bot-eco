exports.run = async(userID, minEarn, maxEarn, failChance, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!userID || !maxEarn) throw new Error("Missing variables.");
    if(!minEarn) minEarn = 0;
    const data = await eco.getUser(userID);

    const failed = Math.random() < (failChance / 10);
    if(failed) return false;

    let amount = Math.floor(Math.random() * (maxEarn - minEarn + 1) + minEarn);

    data.balance.wallet = data.balance.wallet + amount;
    let failed = 0;
    try {
        await data.save();
    } catch(e) {
        failed++;
    }
    if(failed !== 0) return false;
    else return {
        earned: amount,
        balence: data.balance
    };
}