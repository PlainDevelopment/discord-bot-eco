exports.run = async(userID, type, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!userID || !eco) throw new Error("Missing variables.");
    const data = await eco.getUser(userID);
    if(!type) return data.balance;
    if(type === "wallet") return data.balance.wallet;
    if(type === "bank") return data.balance.bank;
    return data.balance;
}