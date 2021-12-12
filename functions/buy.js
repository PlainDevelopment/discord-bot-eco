exports.run = async(userID, iName, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!userID || !iName) throw new Error("Missing variables.");

    const data = await eco.getUser(userID);

    const shop = eco.config.shop;
    let item = shop.find(o => o.itemName === iName);

    if(!item) return("not_real");
    if(!item.itemBuyable) return("not_for_sale");
    if(data.balance.wallet < item.itemBuyPrice) return("cannot_afford");

    data.balance.wallet = data.balance.wallet - item.itemBuyPrice;

    let failed = 0;
    try {
        await data.save();
    } catch(e) {
        failed++;
    }
    if(failed !== 0) return false;
    else {
        require('../index').giveItem(userID, item.itemName); 
        return data.balance;
    }
}