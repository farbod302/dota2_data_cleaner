const express = require("express")
const player_games = require("../funcs/players/player_games")

const router = express.Router()



router.get("/game_history/:account_id",async (req, res) => {
    const { account_id } = req.params
    const player_last_matches=await player_games.get_match_history(account_id)
    res.json({
        player_games:player_last_matches
    })
})








module.exports = router