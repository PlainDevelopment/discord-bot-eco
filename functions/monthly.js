exports.run = async(userID, amount, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!userID || !amount) throw new Error("Missing variables.");
    const data = await eco.getUser(userID);
    
    if(Date.now() < (data.monthlyTimeout + 2592000000 )) return false // If it has been less than 24 hours, return.
    
    data.monthlyTimeout = Date.now();
    data.balance.wallet = data.balance.wallet + amount;
    
    let failed = 0;
    try {
        await data.save();
    } catch(e) {
        failed++;
    }
    if(failed !== 0) return false;
    else return data.balance;
}