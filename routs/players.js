const express = require("express")
const player_games = require("../funcs/players/player_games")
const files = require("../helpers/files")

const router = express.Router()


const game_modes = [
    "None",
    "All Pick",
    "Captain Mode",
    "Single Draft",
    "Random Draft",
    "All Random",
    "Intro",
    "Diretide",
    "Reverse Captain Mode",
    "The Greeviling",
    "Tutorial",
    "Mid Only",
    "Last Played",
    "New Player Pool",
    "Compendium Matchmaking",
    "Co-op Vs. Bots",
    "Captain Draft",
    "",
    "Ability Draft",
    "",
    "All Random Death Match",
    "1v1 Mid Only",
    "Ranked Matchmaking",
    "Turbo mode"
]


router.get("/game_history_list/:account_id", async (req, res) => {
    const { account_id } = req.params
    const player_last_matches = await player_games.get_match_history(account_id)
    const heros_list = files.read_file("../clean_json/hero_basic.json")
    const clean_data = player_last_matches.map(game => {
        const { players, radiant_win, duration, start_time, match_id, game_mode } = game.result
        const player_slot = players.find(player => player.account_id == account_id)
        const { kills, deaths, assists, hero_id, team_number } = player_slot
        const chosen_hero = heros_list.find(hero => hero.id == hero_id)
      
        return {
            chosen_hero,
            date: start_time,
            winner_team: radiant_win ? "radiant" : "dire",
            match_id,
            duration,
            game_mode: game_modes[game_mode],
            player_win: team_number && radiant_win,
            in_game_status: {
                kills, deaths, assists
            }

        }
    })
    res.json({
        status: true,
        msg: "",
        data: {
            match_history: clean_data
        }
    })
})








module.exports = router