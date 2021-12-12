exports.run = async(userID, timeout, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!userID || !timeout) throw new Error("Missing variables.");
    
    const data = await eco.getUser(userID);
    
    if(timeout === "daily") return data.dailyTimeout;
    if(timeout === "weekly") return data.weeklyTimeout;
    if(timeout === "monthly") return data.monthlyTimeout;
    if(timeout === "yearly") return data.yearlyTimeout;
}