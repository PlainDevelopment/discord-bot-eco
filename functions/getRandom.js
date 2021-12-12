exports.run = async(from, to, eco) => {
    if(!eco.config) throw new Error("You haven't initialised discord-bot-eco!");
    if(!from || !to) throw new Error("Missing variables.");

    return Math.floor(Math.random() * (to - from + 1) + from)
}