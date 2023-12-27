const { steam_request } = require("./steep_api_request")

const _validator = {
    async validate_dota_id(dota_id) {
        const data = await steam_request("GetMatchHistory", {
            account_id: dota_id
        })
        if (data.result.status !== 1) return false
        return true
    }
}

module.exports = _validator