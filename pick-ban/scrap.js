const fs = require("fs");
const files = require("../helpers/files");


const scrap = async (hero_id) => {

    const data = await fetch("https://api.stratz.com/graphql", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.5",
            "authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiNmFjMDg2MzYtMDllYy00OWZiLWJhOWEtZDE5YTI2YjBiYjNmIiwiU3RlYW1JZCI6IjE3MzI5MDkxOCIsIm5iZiI6MTcwMzMxMDIzNiwiZXhwIjoxNzM0ODQ2MjM2LCJpYXQiOjE3MDMzMTAyMzYsImlzcyI6Imh0dHBzOi8vYXBpLnN0cmF0ei5jb20ifQ.HBHrrVk-g8k6p7lxh10cpokWnRugjNdK1wh7_Se-2Ag",
            "content-type": "application/json",
            "sec-ch-ua": "\"Brave\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "Referer": "https://stratz.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{\"operationName\":\"GetHeroMatchUps\",\"variables\":{\"heroId\":${hero_id},\"matchLimit\":0},\"query\":\"query GetHeroMatchUps($heroId: Short!, $matchLimit: Int!, $bracketBasicIds: [RankBracketBasicEnum]) {\\n  heroStats {\\n    heroVsHeroMatchup(\\n      heroId: $heroId\\n      matchLimit: $matchLimit\\n      bracketBasicIds: $bracketBasicIds\\n    ) {\\n      advantage {\\n        heroId\\n        matchCountWith\\n        matchCountVs\\n        with {\\n          heroId2\\n          matchCount\\n          winCount\\n          synergy\\n          __typename\\n        }\\n        vs {\\n          heroId2\\n          matchCount\\n          winCount\\n          synergy\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\"}`,
        "method": "POST"
    });
    const clean_data = await data.json()
    const to_save = clean_data.data.heroStats.heroVsHeroMatchup.advantage[0].vs
    fs.writeFileSync(`${__dirname}/heros/${hero_id}.json`, JSON.stringify(to_save))
}



const scrap_all =async () => {
    const hero_basic = files.read_file("../clean_json/hero_basic.json")
    const hero_ids = hero_basic.map(e => e.id)
    for (let hero of hero_ids) {
        await scrap(hero)
    }
}

module.exports = scrap_all


