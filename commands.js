const youtubeM = require("ytdl-core");
const searchYT = require('yt-search');
const { concat } = require("ffmpeg-static");
var queue = [];
var queueTitle = [];
var queueTime = [];

async function play(msg, ...args) {

    const vc = msg.member.voice.channel;
    const connection = await vc.join();
    const video = await findVideo(args.join(' '));

    if (video) {

        const stream = youtubeM(video.url, { filter: 'audioonly' });
        queue.push(stream);
        queueTime.push(video.seconds);
        queueTitle.push(video.title);

        back();
        function back() {

            if (queue.length > 0) {

                if (args == "vazio") {
                    queue.length -= 1;
                    queueTime.length -= 1;
                    queueTitle.length -= 1;
                    start();
                }

                const embed = {
                    "title": `Reproduzindo... `,
                    "description": `\`${queueTitle[0]}\`.`,
                    "thumbnail": {
                    },
                    "color": 14712189
                }

                connection.play(queue[0], { seek: 0, volume: 1 });
                msg.reply({ embed });

                start();
                function start() {

                    setTimeout(function () {

                        queue.shift();
                        queueTime.shift();
                        queueTitle.shift();
                        if (queue.length > 0) {
                            msg.reply("Fim da música, começando a próxima.")
                        }

                        back();

                    }, (queueTime[0] + 2) * 1000);
                }
            }
        }

    } else {
        await msg.reply(" Infelizmente não consegui encontrar esse título, tente novamente flor. ")
    }
}

async function qClean(msg) {
    msg.reply("A lista agora está limpa.")
    queue.length -= queue.length;
    queueTime.length -= queueTime.length
    queueTitle.length -= queueTitle.length
    stop(msg);

}

async function next(msg) {
    queue.shift();
    queueTime.shift();
    queueTitle.shift();
    msg.reply("Avançando para a próxima.")
    play(msg, "vazio")
}

async function lista(msg) {
    if (queue.length <= 0) {
        msg.reply("Queue vazia, adicione novos títulos. ")
    } else {
        msg.reply(` Na queue estão os títulos: \`${queueTitle}\`.`);
    }
}

async function add(msg, ...args) {

    const video = await findVideo(args.join(' '));
    if (video) {
        const stream = youtubeM(video.url, { filter: 'audioonly' });
        queue.push(stream);
        queueTitle.push(video.title);
        queueTime.push(video.seconds);
    }

    const embed = {
        "title": `Adicionado a lista`,
        "description": `\`${video.title}\`.`,
        "thumbnail": {
        },
        "color": 14712189
    }

    msg.reply({ embed })
}

async function taylor(msg) {
    const embed = {
        "title": "Taylor Swift",
        "color": 14712189,
        "thumbnail": {
            "url": "https://images2.imgbox.com/04/03/DVLDCy6n_o.png"
        },
        "footer": {
            "text": "tá bom pra você pedro?"
        },
        "image": {
            "url": "https://ogimg.infoglobo.com.br/in/24566581-210-8b1/FT1086A/652/Taylor-Swift.jpg"
        },
        "description": "Taylor Swift começou sua carreira logo cedo. Aos 10 anos de idade a garotinha com cachinhos loiros já encantava o público cantando em festivais e karaokês. Aos 11 anos, fez uma viagem até a cidade de Nashville e deixou uma fita demo em todas as gravadoras que encontrou.\n\nQuando tinha apenas 14 anos, Taylor se tornou a mais jovem pessoa a fazer parte da equipe de compositores profissionais da Sony/ATV Publishing. Ela fechou seu primeiro contrato com uma gravadora antes de começar a dirigir, e aos 17 foi a cantora mais jovem a escrever e cantar sozinha um hit que foi para o topo das paradas americanas."

    }
    await msg.reply({ embed });

}

async function findVideo(query) {
    const result = await searchYT(query);
    return (result.videos.length > 1)
        ? result.videos[0]
        : null;
}


async function stop(msg) {
    const vc = msg.member.voice.channel;
    await vc.leave();

    await msg.reply("Saindo mo");
}


async function summon(msg) {
    const vc = msg.member.voice.channel;
    await msg.reply("já vou caralho");

    vc.join()
}

async function dev(msg) {
    const embed = {
        "title": "Você deseja me conhecer melhor? basta me seguir!",
        "description": "*Este bot ainda está em desenvolvimento",
        "url": "https://instagram.com/sa_filho",
        "color": 14712189,
        "timestamp": "2020-11-29T01:23:45.633Z",
        "footer": {
            "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
        },
        "thumbnail": {
            "url": "https://i.imgur.com/JPTi1qI.png"
        },
        "author": {
            "name": "Poowerllz",
            "url": "https://github.com/poowerlz",
            "icon_url": "https://icons-for-free.com/iconfiles/png/512/part+1+github-1320568339880199515.png"
        },
    };
    msg.reply({ embed });
}

module.exports.play = play;
module.exports.stop = stop;
module.exports.summon = summon;
module.exports.dev = dev;
module.exports.lista = lista;
module.exports.taylor = taylor;
module.exports.add = add;
module.exports.next = next;
module.exports.qClean = qClean;


