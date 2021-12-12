exports.run = async(userID, type, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!userID) throw new Error("Missing variables.");
    const data = await eco.getUser(userID);
    if(!type) {
        data.balance.wallet = 0;
        data.balance.bank = 0;
    } else if(type === "wallet") data.balance.wallet = 0;
    else if(type === "bank") data.balance.bank = 0;

    let failed = 0;
    try {
        await data.save();
    } catch(e) {
        failed++;
    }
    if(failed !== 0) return false;
    else return data.balance;
}