const { play, stop, summon, dev, lista, add, next, qClean, comandos,  queue, remove} = require('./commands')
const { getPage } = require('./utilities');
const { Client } = require('discord.js');
const bot = new Client();
const token = "OTAxMTE0OTgzOTAxOTg2ODE2.YXLKug.z31tq1UatsP4HsDHh2e7kaeSL8o";
const prefix = '!';

bot.on("ready", () => {

    let a = [
        `| Utilize ${prefix}Comandos`,
        `| Utilize ${prefix}Dev`,
    ]

    i = 0;
    setInterval(() => bot.user.setActivity(`${a[i++ % a.length]}`, {
        type: "PLAYING"
    }), 5000);
    bot.user
        .setStatus("online")
        .catch(console.log());

    const embed = {
        "title": "Status: Online",
        "color": 14712189,
        "description": "[Em Desenvolvimento] "
    }

    var textChannel = bot.channels.cache.get("901121346078117958");
    textChannel.send({ embed })
});

bot.on("message", async msg => {
    if (msg.author.bot) return;

    if (!msg.content.startsWith(prefix)) return;

    const commandName = getCommandName(prefix, msg.content);
    const args = getCommandArgs(prefix, msg.content);

    if (commandName.toLowerCase() === '!comandos' || commandName.toLowerCase() === "!c")
        return comandos(msg);

    if (commandName.toLowerCase() === '!play' || commandName.toLowerCase() === "!p") {
        let next = queue() > 0 ? false : true;
        return play(msg, next, args);
    }

    if (commandName.toLowerCase() === '!add' || commandName.toLowerCase() === "!a")
        return add(msg, args);

    if (commandName.toLowerCase() === '!remove' || commandName.toLowerCase() === "!r")
        return remove(msg, args);

    if (commandName.toLowerCase() === '!stop' || commandName.toLowerCase() === "!s")
        return stop(msg);

    if (commandName.toLowerCase() === '!queueclean' || commandName.toLowerCase() === "!qc")
        return qClean(msg);

    if (commandName.toLowerCase() === '!next' || commandName.toLowerCase() === "!n")
        return next(msg, args);

    if (commandName.toLowerCase() === "!dev" || commandName.toLowerCase() === "!d")
        return dev(msg);

    if (commandName.toLowerCase() === '!queue' || commandName.toLowerCase() === "!q")
        return lista(msg);

    if (commandName.toLowerCase() === '!game' || commandName.toLowerCase() === "!g")
        console.log(await getPage(msg))

});



function getCommandName(prefix, content) {
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

bot.login(token)
