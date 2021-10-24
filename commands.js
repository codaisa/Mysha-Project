const { getTracks } = require('spotify-url-info')
const DeezerPublicApi = require("deezer-public-api")
const youtubeM = require("ytdl-core");
const searchYT = require('yt-search');
let deezer = new DeezerPublicApi();

var queue = [];
var queueTitle = [];
let onPlaying;

async function play(msg, next, ...args) {

    if (queue.length >= 0 & next == true) {
        const vc = msg.member.voice.channel;

        if (vc == null || vc == undefined) {
            msg.reply("Você precisa estar em um canal de voz para me acionar. ")
            return null;
        }

        const connection = await vc.join();
        let video = await findVideo(args.join(' '), msg);

        if (video) {
            insertQueue(video);

            if (queue.length > 0) {
                const embed = {
                    "title": `Reproduzindo... `,
                    "description": `\`${queueTitle[0]}\`.`,
                    "thumbnail": {
                    },
                    "color": 14712189
                }

                start();
                function start() {
                    onPlaying = connection.play(queue[0], { seek: 0, volume: 1 });
                    msg.reply({ embed });

                    onPlaying.on('finish', end => {
                        queue.shift();
                        queueTitle.shift();

                        if (queue.length > 0) {
                            msg.reply("fim da música, começando a próxima.");
                            start();
                        } else {
                            msg.reply("todas as músicas acabaram.");
                            vc.leave();
                        }
                    })

                }
            }

        } else {
            await msg.reply("infelizmente não consegui encontrar esse título, tente novamente flor. ")
        }
    } else {

        const video = await findVideo(args.join(' '), msg);
        if (video) {
            insertQueue(video);
        }

        await msg.reply("Já está tocando algo no momento, mas esse música foi adicionada a queue.")
    }
}

async function remove(msg, ...args) {
    let forRemove = args.join(' ');
    let songRemoved = queueTitle[forRemove]
    queue.splice(forRemove, 1);
    queueTitle.splice(forRemove, 1);

    msg.reply(`o som ${songRemoved} foi removido da lista.`);
}

async function qClean(msg) {
    msg.reply("A lista agora está limpa.")
    queue.length -= queue.length;
    queueTitle.length -= queueTitle.length
    stop(msg);
}

async function comandos(msg) {
    const embed = {

        "type": "rich",
        "title": "Comandos da Dona Maria ♥",
        "description": "",
        "color": "0xf5c5c5",
        "fields": [
            {
                "name": "!Comandos ou !c",
                "value": "Todas as receitas da Dona Maria ♥",
                "inline": "true"
            },
            {
                "name": "!play ou !p",
                "value": "Dona Maria além de otima cozinheira também é uma otima cantora.",
                "inline": "true"
            },
            {
                "name": "!add ou !a",
                "value": "Adicionar uma música para ela cantar. ",
                "inline": "true"
            },
            {
                "name": "!stop ou !s",
                "value": "Pedir para que ela pare de cantar e faça silencio.",
                "inline": "true"
            },
            {
                "name": "!queueclean ou !qc",
                "value": "Limpar a playlist da Dona Maria ♥",
                "inline": "true"
            },
            {
                "name": "!next ou !n",
                "value": "Pedir para que ela cante a próxima música.",
                "inline": "true"
            },
            {
                "name": "!dev ou !d",
                "value": "Informações sobre o pai da Dona Maria ♥",
                "inline": "true"
            },
            {
                "name": "!queue ou !q",
                "value": "Ver as músicas que ela irá cantar.",
                "inline": "true"
            }
        ],
        "thumbnail": {
            "url": "https://static.vecteezy.com/ti/vetor-gratis/p1/1936523-cute-bakery-chef-girl-welcome-smiling-cartoon-art-illustration-vetor.jpg",
            "height": "0",
            "width": "0"
        },
        "footer": {
            "text": "\nCreated by @Hattori "
        }


    }

    msg.reply({ embed })
}

async function next(msg) {
    queue.shift();
    queueTitle.shift();
    msg.reply("avançando para a próxima.")
    play(msg, true, "vazio")
}

async function lista(msg) {
    if (queue.length <= 0) {
        msg.reply("Queue vazia, adicione novos títulos. ")
    } else {
        let str = "";
        queueTitle.map((value, index) => {
            if (index <= 10) {
                if (index == 0) {
                    str += ` => ${value} - [ TOCANDO AGORA ]\n\n`
                } else {
                    str += `${index}- ${value}\n`
                }
            } else {
                if (index == 11) {
                    str += `+ ${queue.length} títulos.\n`
                }
            }
        })
        msg.reply(`Na queue estão os títulos:\n\`${str}\``);
    }
}

async function add(msg, ...args) {
    const video = await findVideo(args.join(' '), msg);
    if (video) {
        insertQueue(video);
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

async function findVideo(query, msg) {
    let result;

    if(query.indexOf("playlist") != -1){
        const embed = {
            "title": `Playlist detectada!`,
            "description": `\`Espere até a reprodução.\``,
            "thumbnail": {
            },
            "color": 14712189
        }
        
        msg.reply({embed})
    }

    if (query.indexOf("https") == -1) {
        result = await searchYT(query);
        return (result.videos.length > 1)
            ? result.videos[0]
            : null;
    } else {
        try {
            if (query.indexOf("youtube") != -1) {
                if (query.indexOf("list=") != -1) {
                    if (query.indexOf("music.youtube") != -1) {
                        query = query.substring(query.indexOf("?v=") + 3, 100)
                        result = await searchYT({ videoId: query });
                        return result;
                    }
                    query = query.substring(query.indexOf("list=") + 5, 100)
                    if (query.indexOf("&") != -1) {
                        query = query.substring(0, query.indexOf("&"))
                    }
                    result = await searchYT({ listId: query });
                    return result.videos

                } else {
                    query = query.substring(query.indexOf("?v=") + 3, 100)
                    end = query.indexOf("?") != -1 ? query.indexOf("?") : 100;
                    query = query.substring(0, end);

                    result = await searchYT({ videoId: query });
                    return result;
                }
            } else if (query.indexOf("spotify") != -1) {
                result = await getTracks(query);
                let fromyt = []
                result.splice(15, 100)
                fromyt = await Promise.all(result.map(async value => {
                    toReturn = await searchYT(value.name)
                    toReturn = toReturn.videos[0]
                    return toReturn
                }))
                return fromyt;
            } else if (query.indexOf("deezer") != -1) {
                if (query.indexOf("playlist") != -1) {
                    let fromyt = [];
                    end = query.indexOf("?") != -1 ? query.indexOf("?") : 100;
                    query = query.substring(query.indexOf("playlist") + 8, end)
                    result = await deezer.playlist.tracks(query)
                    fromyt = await Promise.all(result.data.map(async value => {
                        toReturn = await searchYT(value.title)
                        toReturn = toReturn.videos[0];
                        return toReturn
                    }))
                    return fromyt
                } else {
                    end = query.indexOf("?") != -1 ? query.indexOf("?") : 100;
                    query = query.substring(query.indexOf("track") + 5, end)
                    result = await deezer.track(query);
                    result = await searchYT(result.title)
                    return result.videos[0];
                }
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

async function insertQueue(video) {
    if (Object.prototype.toString.call(video) !== '[object Array]') {
        video = [video]
    }
    video.map((value, index) => {
        let stream;
        if (value.url != undefined) {
            stream = youtubeM(value.url, { filter: 'audioonly' });
        } else {
            stream = youtubeM(value.videoId, { filter: 'audioonly' });
        }
        queue.push(stream);
        queueTitle.push(value.title);
    })
}


async function stop(msg) {
    const vc = msg.member.voice.channel;
    await vc.leave();
    await msg.reply("Saindo bem");
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

function getQueue() {
    return queue.length;
}

module.exports.play = play;
module.exports.remove = remove;
module.exports.stop = stop;
module.exports.summon = summon;
module.exports.dev = dev;
module.exports.lista = lista;
module.exports.add = add;
module.exports.next = next;
module.exports.qClean = qClean;
module.exports.comandos = comandos;
module.exports.queue = getQueue;