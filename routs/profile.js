const express = require("express")
const player_games = require("../funcs/players/player_games")
const files = require("../helpers/files")
const router = express.Router()
const heros_list = files.read_file("../clean_json/hero_basic.json")

router.get("/", async (req, res) => {
    const user = req.body.user
    if (!user) {
        res.json({
            status: false,
            msg: "Invalid Token",
            data: {}
        })
        return
    }
    const { dota_id } = user
    const match_history = await player_games.get_match_history(dota_id)

    //clean game history

    const clean_heros_list = []
    const overall = {
        duration: 0,
        win: 0,
        lose: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        last_hits: 0,
        denies: 0,
        rank: 0,
        duration: 0

    }

    match_history.forEach(match => {
        const { players, radiant_win, duration, game_mode } = match.result
        const user_hero = players.find(player => player.account_id == dota_id)
        const { hero_id, team_number, } = user_hero
        const is_winner = (team_number === 0 && radiant_win) || (team_number === 1 && !radiant_win) ? true : false
        if (game_mode === 22) {
            overall.rank += (is_winner ? 17 : -17)
        }
        overall["duration"] += duration
        overall[is_winner ? "win" : "lose"] += 1
        const change_overall = ["kills", "deaths", "assists", "last_hits", "denies"]
        change_overall.forEach(e => overall[e] += user_hero[e])
        const index = clean_heros_list.findIndex(hero => hero.id === hero_id)
        if (index === -1) {
            const hero_to_add = {
                id: hero_id,
                win: is_winner ? 1 : 0,
                loss: !is_winner ? 1 : 0,
                count: 1
            }
            change_overall.map(e => hero_to_add[e] = user_hero[e])
            clean_heros_list.push(hero_to_add)
        } else {
            change_overall.map(e => clean_heros_list[index][e] += user_hero[e])
            if (is_winner) clean_heros_list[index].win += 1
            else clean_heros_list[index].loss += 1
            clean_heros_list[index].count += 1
        }
    })
    const clean_hero = clean_heros_list.map(hero => {
        const { win, count, id } = hero
        const win_rate = (win * 100) / count
        const hero_detail = heros_list.find(e => e.id === id)
        return {
            ...hero,
            win_rate,
            hero_detail
        }
    })
    clean_hero.sort((a,b)=>b.count - a.count)
    res.json({
        status: true,
        msg: "",
        data: {
            heros_status:clean_hero, overall
        }
    })

})


module.exports = router