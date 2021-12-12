exports.run = async(userID, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!userID) throw new Error("Missing variables.");

    const data = await eco.getUser(userID);

    return data.itemsOwned;
}