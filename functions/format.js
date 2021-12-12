var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

exports.run = async(money, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!money && money !== 0) throw new Error("Missing variables.");
    const convert = formatter.format(money);
    return (convert.replace('$', eco.config.currency).replace('.00', ''));
}