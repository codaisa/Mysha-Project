//import axios from "axios";
const axios = require('axios');

async function getPage(msg) {
    let name, link, str;
    let regEx = '/- Steam*/g';
    let body;
    let games = [];

    let res = await axios.request({
        url:"https://www.nerdmaldito.com/2020/04/lista-de-jogos-gratis.html",
        method: "GET"
    })

    body = await res.data

    const regexp = RegExp('- Steam*', 'g');
    const matches = body.matchAll(regexp);

    for (const match of matches) {
        str = body.substring(match.index - 200, match.index + match[0].length);
        link = str.substring(str.indexOf("href="), 180)
        link = link.substring(6, link.indexOf(" ") - 1)

        name = str.substring(str.indexOf("_blank"), match.index + match[0].length)
            .replaceAll('_blank">', '')
            .replaceAll('<b>', '')
            .replaceAll('</b>', '')

        if (name.substring(name.length - 1, name.length) == "m") {

            var options = {
                method: 'GET',
                url: 'https://bing-image-search1.p.rapidapi.com/images/search',
                params: { q: name },
                headers: {
                    'x-rapidapi-host': 'bing-image-search1.p.rapidapi.com',
                    'x-rapidapi-key': '5a72ff4a1emsh89f2439915ab56fp13a75fjsnfa6aaee283d0'
                }
            };

            let imageLink = await axios.request(options)
            imageLink = await imageLink.data.value[0] ? imageLink.data.value[0].thumbnailUrl : "";

            games.push({name, link, imageLink})
        }
    }

    let num = Math.floor(Math.random() * (games.length - 0)) + 0

    const embed = {
        "title": "Um novo jogo disponível!",
        "color": 14712189,
        "footer": {
            "text": games[num].name
        },
        "image": {
            "url": games[num].imageLink
        },
        "description": games[num].link
    }

    msg.reply({embed})

} ;

module.exports.getPage = getPage;
