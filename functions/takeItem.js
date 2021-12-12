exports.run = async(userID, iName, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!userID || !iName) throw new Error("Missing variables.");

    const data = await eco.getUser(userID);

    const shop = eco.config.shop;
    let item = shop.find(o => o.itemName === iName);

    if(!item) return false;
    objIndex = data.itemsOwned.findIndex((obj => obj.item.itemName == item.name));
    if(!objIndex) return("not_owned");
    
    if(data.itemsOwned[objIndex].amount === 1) myArray = myArray.filter(obj => {
        return obj.item.name !== data.itemsOwned[objIndex].item.name;
    });
    else data.itemsOwned[objIndex].amount--;

    let failed = 0;
    try {
        await data.save();
    } catch(e) {
        failed++;
    }
    if(failed !== 0) return false;
    else return data.balance;
}