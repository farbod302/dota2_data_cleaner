const get_player_data = async (dota_id) => {
    const fetch=require("node-fetch")
    try {
        const data = await fetch("https://api.stratz.com/graphql", {
            "headers": {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.8",
                "content-type": "application/json",
                "sec-ch-ua": "\"Brave\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                "authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiYWI1Y2M4YzUtMTkwZC00MDcxLWJmMzgtMTAyN2E5MDI0MzI5IiwiU3RlYW1JZCI6IjM5MzA0ODM5MyIsIm5iZiI6MTcwMzkyMTUzOSwiZXhwIjoxNzM1NDU3NTM5LCJpYXQiOjE3MDM5MjE1MzksImlzcyI6Imh0dHBzOi8vYXBpLnN0cmF0ei5jb20ifQ.idc9To1_WppXRfBfi3YrgJ0S_mykKJiMHTThIEW9K3c",
                "Referer": "https://api.stratz.com/",
                "Referrer-Policy": "origin"
            },
            "body": `{\"query\":\"# Welcome to GraphiQL\\n#\\n# GraphiQL is an in-browser tool for writing, validating, and\\n# testing GraphQL queries.\\n#\\n# Type queries into this side of the screen, and you will see intelligent\\n# typeaheads aware of the current GraphQL type schema and live syntax and\\n# validation errors highlighted within the text.\\n#\\n# GraphQL queries typically start with a \\\"{\\\" character. Lines that starts\\n# with a # are ignored.\\n#\\n# An example GraphQL query might look like:\\n#\\n    {\\n     player(steamAccountId:${dota_id}) {\\n      steamAccount{\\n        seasonRank\\n        name\\n        avatar\\n      }\\n     \\n    }\\n    }\\n#\\n# Keyboard shortcuts:\\n#\\n#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)\\n#\\n#     Merge Query:  Shift-Ctrl-M (or press the merge button above)\\n#\\n#       Run Query:  Ctrl-Enter (or press the play button above)\\n#\\n#   Auto Complete:  Ctrl-Space (or just start typing)\\n#\\n\\n\",\"variables\":null}`,
            "method": "POST"
        });
        const player = await data.json()
        const { seasonRank, name, avatar } = player.data.player.steamAccount
        let medal, star
        if (!seasonRank) {
            medal = "https://cdn.stratz.com/images/dota2/seasonal_rank/medal_0.png"
            star = null
        } else {
            medal = `https://cdn.stratz.com/images/dota2/seasonal_rank/medal_${Math.floor(seasonRank / 10)}.png`
            star = `https://cdn.stratz.com/images/dota2/seasonal_rank/star_${seasonRank % 10}.png`
        }
        return {
            name,
            avatar,
            medal,
            star
        }
    } catch(err) {
        console.log(err);
        return {
            name: null,
            avatar: null,
            medal: null,
            star: null
        }

    }
}

module.exports = { get_player_data }