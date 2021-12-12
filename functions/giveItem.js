exports.run = async(userID, iName, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!userID || !iName) throw new Error("Missing variables.");

    const data = await eco.getUser(userID);

    const shop = eco.config.shop;
    let item = shop.find(o => o.itemName === iName);

    if(!item) return false;
    const objIndex = await data.itemsOwned.findIndex((obj => obj.item.itemName === iName));
    let iowned;
    if(objIndex === -1) {
        data.itemsOwned.push({
            item,
            amount: 1
        });
    } else {
        data.itemsOwned[objIndex].amount = data.itemsOwned[objIndex].amount + 1;
        iowned = data.itemsOwned[objIndex];
    }

    if(iowned) data.itemsOwned[objIndex] = iowned;
    
    let failed = 0;
    try {
        await data.save();
    } catch(e) {
        failed++;
    }
    if(failed !== 0) return false;
    else return data.balance;
}