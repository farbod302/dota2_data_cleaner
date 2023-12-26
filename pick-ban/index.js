const files = require("../helpers/files")

const pick_ban = {

    check_rate(heros_picked,side) {
        const folder=side == 0 ? "heros":"heros-with"
        const hero_basic = files.read_file("../clean_json/hero_basic.json")
        const hero_ids = hero_basic.map(e => e.id)
        const res = {}
        heros_picked.forEach(h => {
            hero_ids.forEach(hero => {
                if (hero === h) return
                const hero_matchup = files.read_file(`../pick-ban/${folder}/` + hero + ".json")
                const selected_hero = hero_matchup.find(e => e.heroId2 == h)
                if (!res[hero]) {
                    res[hero] = selected_hero.synergy
                } else {
                    res[hero] += selected_hero.synergy
                }
            })
        })
        let scores = Object.keys(res).map(h => {
            return {
                hero: h,
                score: res[h]
            }
        })
        scores.sort((a, b) => b.score - a.score)
        scores=scores.filter(e=>!heros_picked.includes(+e.hero))
        const scores_with_heros = scores.map(e => {
            const { hero } = e
            const s = hero_basic.find(s => s.id == hero)
            return {

                name: s.name,
                image: s.image,
                primary_attr: s.primary_attr,
                score:e.score
            }
        })
        return scores_with_heros
    }

}

module.exports = pick_ban