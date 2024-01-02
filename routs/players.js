const express = require("express")
const player_games = require("../funcs/players/player_games")
const files = require("../helpers/files")
const { get_player_data } = require("../funcs/players/player_ptofile")

const router = express.Router()


const game_modes = [
    "None",
    "All Pick",
    "Captain's Mode",
    "Random Draft",
    "Single Draft",
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


router.get("/game_history_list", async (req, res) => {
    try {
        const accepted_games = [1, 2, 3, 4, 22, 23, 18, 14]
        const account_id = req.body?.user?.dota_id
        if (!account_id) {
            res.json({
                status: false,
                msg: "شناسه کاربری نا معتبر",
                data: {}
            })
            return
        }
        const player_last_matches = await player_games.get_match_history(account_id)
        const heros_list = files.read_file("../clean_json/hero_basic.json")
        const clean_data = player_last_matches.map(game => {
            const { players, radiant_win, duration, start_time, match_id, game_mode, radiant_score, dire_score } = game.result
            if (!accepted_games.includes(game_mode)) return null
            const player_slot = players.find(player => player.account_id == account_id)
            const all_hero_ids = players.map(e => {
                return {
                    hero_id: e.hero_id,
                    team_id: e.team_number
                }
            })
            const { kills, deaths, assists, hero_id, team_number } = player_slot
            const chosen_hero = heros_list.find(hero => hero.id == hero_id)
            const clean_heros_list = all_hero_ids.map(hero => {
                return {
                    hero_image: heros_list.find(h => h.id === hero.hero_id).image,
                    team_id: hero.team_id
                }
            })
            return {
                chosen_hero,
                date: start_time,
                winner_team: radiant_win ? "radiant" : "dire",
                match_id,
                duration,
                game_mode: game_modes[game_mode],
                player_win: (team_number === 0 && radiant_win) || (team_number === 1 && !
                    radiant_win) ? true : false,
                in_game_status: {
                    kills, deaths, assists
                },
                hero_images: {
                    radiant: clean_heros_list.filter(e => !e.team_id).map(e => e.hero_image),
                    dire: clean_heros_list.filter(e => e.team_id).map(e => e.hero_image),
                },
                radiant_score,
                dire_score

            }
        })
        res.json({
            status: true,
            msg: "",
            data: {
                match_history: clean_data.filter(e => e)
            }
        })
    }
    catch (err) {
        console.log({ err });
        res.json({
            status: false,
            msg: "شناسه حساب دوتا۲ نامعتبر است",
            data: {}
        })
    }
})


router.get("/match_detail/:match_id", async (req, res) => {

    const items = files.read_file("../clean_json/items_image.json")
    const heros = files.read_file("../clean_json/hero_basic.json")
    const abilities = files.read_file("../clean_json/abilities_image.json")

    const { match_id } = req.params
    const selected_match = await files.from_gzip(match_id)
    const { players, radiant_win, duration, pre_game_duration, start_time, game_mode, radiant_score, dire_score, picks_bans
    } = selected_match.result
    const clean_players = players.map(player => {
        const {
            hero_id,
            item_0,
            item_1,
            item_2,
            item_3,
            item_4,
            item_5,
            backpack_0,
            backpack_1,
            backpack_2,
            item_neutral,
            gold_per_min,
            xp_per_min,
            level,
            net_worth,
            aghanims_scepter,
            aghanims_shard,
            moonshard,
            kills,
            deaths,
            assists,
            last_hits,
            denies
        } = player
        let items_image = [
            item_0,
            item_1,
            item_2,
            item_3,
            item_4,
            item_5,
            backpack_0,
            backpack_1,
            backpack_2,
            item_neutral
        ]
        items_image = items_image.map(e => {
            const s_item = items.find(i => i.id == e)
            return s_item?.img || null
        })
        const hero = heros.find(e => e.id === hero_id)
        let additional_info = null
        if (player.hero_damage) {
            const { hero_damage, tower_damage, hero_healing, gold, gold_spent, ability_upgrades } = player
            const clean_ab = ability_upgrades.map(e => {
                const selected_ab = abilities.find(i => e.ability === i.id)
                return {
                    ...e,
                    image: selected_ab.img,
                    is_talent: selected_ab.isTalent,
                    display_name: selected_ab.displayName
                }
            })

            const selected_hero = files.read_file(`../clean_heros_json/${hero_id}.json`)
            const talent_tree = selected_hero.talents
            const clean_tree = talent_tree.map(t => {
                const is_picked = clean_ab.some(e => Math.abs(e.ability - t.id) <= 2)
                return {
                    ...t,
                    is_picked
                }
            })

            additional_info = {
                hero_damage, tower_damage, hero_healing, gold, gold_spent,
                ability_upgrades: clean_ab, talent_tree: clean_tree
            }
        }

        return {
            items: items_image,
            hero: hero.image, gold_per_min,
            xp_per_min,
            level,
            net_worth,
            aghanims_scepter,
            aghanims_shard,
            moonshard,
            additional_info,
            kills,
            deaths,
            assists,
            last_hits,
            denies
        }
    })
    const clean_pick_ban = picks_bans?.map(p => {
        const { hero_id } = p
        const s_hero = heros.find(e => e.id === hero_id)
        return {
            ...p,
            hero_image: s_hero.image
        }
    }) || []
    const winner = radiant_win ? "Radiant" : "Dire"
    res.json({
        status: true,
        msg: "",
        data: {
            duration, pre_game_duration, start_time, game_mode, radiant_score, dire_score,
            players: clean_players,
            winner,
            picks_bans: clean_pick_ban
        }
    })
})


router.post("/player_rank", async (req, res) => {
    const { dota_id } = req.body
    const data = await get_player_data(dota_id)
    res.json({
        status: true,
        msg: "",
        data: { ...data }
    })
})







module.exports = router