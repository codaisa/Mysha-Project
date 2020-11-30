const { play, stop, summon, dev, lista, taylor, add, next, qClean} = require ('./commands')
const { Client } = require ('discord.js');
const bot = new Client();
const token = "Nzc5NjkwMDkyNDAyOTY2NTM5.X7kM-w.Chni3n0r-rcF1lVbp26nA0blxfA";

bot.login(token)

bot.on("ready", () =>{
    var textChannel = bot.channels.cache.get("676917684130283541");
    textChannel.send("Fala aí galera, estou em fase de desenvolvimento, cuidado comigo, estou online!")
});

bot.on("message", msg => {
    if (msg.author.bot) return;

    const prefix = '!';

    if(!msg.content.startsWith(prefix)) return;

    const commandName = getCommandName(prefix, msg.content);
    const args = getCommandArgs(prefix, msg.content);
       

    if(commandName.toLowerCase() === '!play' || commandName.toLowerCase() ==="!p")
    return play(msg,args);

    if(commandName.toLowerCase() === '!add' || commandName.toLowerCase() ==="!a")
    return add(msg,args);
    
    if (commandName.toLowerCase() === '!stop' || commandName.toLowerCase() ==="!s")
    return stop(msg);

    if (commandName.toLowerCase() === '!queueclean' || commandName.toLowerCase() ==="!qc")
    return qClean(msg);

    if (commandName.toLowerCase() === '!next' || commandName.toLowerCase() ==="!n")
    return next(msg,args);

    if(commandName.toLowerCase() === '!summon')
    return summon(msg);

    if(commandName.toLowerCase() === "!dev" || commandName.toLowerCase() ==="!d")
    return dev(msg);

    if(commandName.toLowerCase() === '!queue' || commandName.toLowerCase() ==="!q")
    return lista(msg);

    if(commandName.toLowerCase() === "!taylor")
    return taylor(msg);

});

function getCommandName(prefix, content){
    return content
    .slice(prefix.lenght)
    .split(' ')[0];
}

function getCommandArgs(prefix, content) {
    return content
    .slice(prefix.lenght)
    .split(' ')
    .slice(1);
}