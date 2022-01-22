# discord-bot-eco
Very customizable economy framework for your Discord Bot

## How does it work?
Easy and fast. Data is saved to a MongoDB database.
Economics is divided into wallet and bank balance, so you have more room to act!

## Need Help?
Join our [Discord Server](https://discord.gg/EdJFwNvNS9).

## Simple Economy System
discord-bot-eco supports activities such as buy, daily, deposit, get, getItems, giveItem, leaderboard, monthly, reset, rob, sell, take, takeItem, weekly, withdraw, and work!

## Introduction
To start using **discord-bot-eco**, you will first need to initialise the configuration as shown below.
```js
const economy = require('discord-bot-eco')
client.on('ready', async() => {
    economy.setConfig({
        mongoURL: "",
        currency: "$",
        allowBankruptcy: false,
        limits: {
            defaultBankLimit: 3000,
            enabled: true
        },
        shopEnabled: true,
        shop: [
            /*
                Item properties can be modified but the following below must be kept as they are used in the module!
                The entire item is returned when using it with functions, go crazy!
            */
            {
                itemName: "Example Item",
                itemBuyPrice: 1000,
                itemSellPrice: 900,
                itemBuyable: true,
                itemSellable: false
            }
        ]
    });
});
```

## Wallet & Bank Functions
|*Function* |Wallet|Bank|
|-------------|---------------|------------------|
|give|`economy.give(userID, amount, "wallet")`|`economy.give(userID, amount, "bank")`|
|take|`economy.take(userID, amount, "wallet")`|`economy.take(userID, amount, "bank")`|
|set|`economy.set(userID, amount, "wallet")`|`economy.set(userID, amount, "bank")`|
|reset|`economy.reset(userID, "wallet")`|`economy.reset(userID, "bank")`|
|get|`economy.get(userID, "wallet")`|`economy.get(userID, "bank")`|
|leaderboard|`economy.leaderboard("wallet")`|`economy.leaderboard("bank")`|

## Shop Functions
|*Function* |Usage|
|-------------|-----------------|
|getShop|`economy.getShop(optionalGuildID)`|
|setShop|`economy.setShop(guildID, newShop)`|
|buy|`economy.buy(userID, itemName)`|
|sell|`economy.sell(userID, itemName)`|
|giveItem|`economy.giveItem(userID, itemName)`|
|takeItem|`economy.takeItem(userID, itemName)`|
|hasItem|`economy.hasItem(userID, itemName)`|
|getItems|`economy.getItems(userID)`|

## Other Functions
|*Function* |Usage|
|-------------|---------------|
|withdraw|`economy.withdraw(userID, amount)`|
|deposit|`economy.deposit(userID, amount)`|
|work|`economy.work(userID, minEarn, maxEarn)`|
|rob|`economy.rob(userID, robUserID, minEarn, maxEarn, failChance)`|
|daily|`economy.daily(userID, amount)`|
|weekly|`economy.weekly(userID, amount)`|
|monthly|`economy.monthly(userID, amount)`|
|format|`economy.format(amount)`|
|getTimeout|`economy.getTimeout(userID, timeout)`|
|getBankLimit|`economy.getBankLimit(userID)`|
|setBankLimit|`economy.setBankLimit(userID, amount)`|
|getRandom|`economy.getRandom(from, to)`|
|getStreak|`economy.getStreak(userID, type)`|

## Handling
All error handling is built into the package! User tries buying a package and it's not real? It'll return an error!
User cannot afford an item? That will also return an error, more details and examples below!
- All functions that save data can return **false** if it failed to save.
### Buy
```js
await economy.buy(userID, itemName);
```
- **not_real:** The item the user is attempting to buy is not real.
- **not_for_sale:** The item the user is attempting to buy is not for sale.
- **cannot_afford:** The user does not have enough money in their wallet to afford the item.
- The balance will be returned upon success.

### Sell
```js
await economy.sell(userID, itemName);
```
- **not_real:** The item the user is attempting to sell is not real.
- **not_sellable:** The item the user is attempting to sell is not sellable.
- **not_owned:** The user does not own the item.
- The balance will be returned upon success.

### Daily, Weekly and Monthly
```js
await economy.daily(userID, amount);
await economy.weekly(userID, amount);
await economy.monthly(userID, amount);
```
- **false:** The timeout has not yet expired.
- The balance and the users streak will be returned upon success.

### Deposit
```js
await economy.deposit(userID, amount);
```
- **false:** The user does not have enough money.
- **bank_limit:** The users bank limit will exceed.
- The balance will be returned upon success.

### Withdraw
```js
await economy.withdraw(userID, amount);
```
- **false:** The user does not have enough money in the bank.
- The balance will be returned upon success.

### Leaderboard
```js
await economy.leaderboard(type);
```
- Type can be: **wallet**, **bank** or **both**.
- **false:** The leaderboard is empty.
- The leaderboard sorted from highest to lowest will be returned upon success.

### Rob
```js
await economy.rob(userID, robUserID, minEarn, maxEarn, failChance);
```
- failChance is the percentage of the rob failing (10%=10)
- **false:** The rob failed from failChance.
- The amount earned and your current balance will be returned upon success.

### Give
```js
await economy.give(userID, amount, type);
```
- Type can be: **wallet**, **bank** or **both**.
- **bank_limit:** The users bank limit will be exceeded if money is given.
- The balance will be returned upon success.

### Take
```js
await economy.take(userID, amount, type);
```
- Type can be: **wallet**, **bank** or **both**.
- **false:** The user will go bankrupt if money is taken.
- The balance will be returned upon success.

### Get
```js
await economy.get(userID, type);
```
- If type is not provided, both balances will be returned.

### GetBankLimit
```js
await economy.getBankLimit(userID);
```
- **false:** Bank limit is not enabled
- The limit will be returned upon success.

### SetBankLimit
```js
await economy.setBankLimit(userID, amount);
```
- **false:** Bank limit is not enabled
- The bank limit will be returned upon success.

### GetTimeout
```js
await economy.getTimeout(userID, timeout);
```
- Timeout can be: **daily**, **weekly** or **monthly**.
- Returns the *milliseconds* until the next reward is ready.

### GetStreak
```js
await economy.getStreak(userID, type);
```
- Type can be: **daily**, **weekly** or **monthly**.
- Returns the streak for the type.


Copyright Plain 
Fuck plain.
2022
All right reserved.
