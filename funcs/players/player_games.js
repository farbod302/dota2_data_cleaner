const files = require("../../helpers/files")
const { steam_request } = require("../../helpers/steep_api_request")
const fs = require("fs")
const player_games = {

    async get_match_history(account_id) {
        const max_page = 1
        let match_ids = []
        let last_match = null
        for (let i = 0; i < max_page; i++) {
            const body = { account_id, matches_requested: 100 }
            if (i !== 0) body.start_at_match_id = last_match
            const data = await steam_request("GetMatchHistory", body)
            const { matches } = data.result
            const matches_id = matches.map(e => e.match_id)
            match_ids = match_ids.concat(matches_id)
            last_match = match_ids.at(-1)
        }
        let now=Date.now()
        const match_details = await this.get_matches_detail(match_ids)
        console.log(`Fetch ${match_details.length} game successfully in ${Date.now() - now} ms`);
        return match_details
    },

    async get_matches_detail(match_ids) {
        const exist_games = fs.readdirSync(`${__dirname}/../../matches`)

        const promises = match_ids.map(match => {
            if (exist_games.includes(`${match}.gzip`)) {
                return files.from_gzip(match)
            } else {
                return new Promise(async resolve => {
                    const data = await steam_request("GetMatchDetails", { match_id: match })
                    files.to_gzip(data, match)
                    resolve(data)
                    return
                })
            }
        })
        const data = await Promise.all(promises)
        return data

    },



}

module.exports = player_games