const files = require("../../helpers/files")
const fs = require("fs")
const hero_cleaner = {

    HERO_IDS: 150,

    clean_all() {
        for (let i = 1; i <= this.HERO_IDS; i++) {
            const hero_data = this.clean_hero(i)
            if (hero_data) {
                fs.writeFileSync(`${__dirname}/../../clean_heros_json/${hero_data.id}.json`, JSON.stringify(hero_data))
            }
        }
    },
    all_files: files.read_multi_files({
        heros: "heroes.json",
        abilities: "abilities.json",
        hero_abilities: "hero_abilities.json",
        aghs: "aghs_desc.json",
        abilities_clean:"../clean_json/abilities_image.json"
    }),

    clean_hero(id) {
        const hero_main_file = this.all_files.heros[id]
        if (!hero_main_file) return
        const { name } = hero_main_file
        const hero_file = files.read_file(`../heroes_data/${name}.json`)
        const { max_health, max_mana, turn_rate, armor, damage_max, damage_min, primary_attr
            , str_base, agi_base, int_base
        } = hero_file
        const hero_abilities_name = this.all_files.hero_abilities[name]
        const { abilities, talents } = hero_abilities_name
        const clean_tallents = talents.map(t => {
            const selected_talent=this.all_files.abilities_clean.find(e=>e.name == t.name )
            return { ...t, name: selected_talent.displayName ,id:selected_talent.id}
        })
        const hero_aghs = this.all_files.aghs.find(h => h.hero_name === name)
        let clean_abilities = abilities.map(e => {
            const att = this.all_files.abilities[e]
            const clean_att = { ...att }
            const keys = ["behavior", "dmg_type", "mc", "cd", "dmg", "target_team", "target_type"]
            for (let key of keys) {
                if (clean_att[key] && typeof clean_att[key] === "object") {
                    clean_att[key] = clean_att[key].join(" / ")
                }
            }
            const clean_attrib = clean_att.attrib.map(a => {
                let { value } = a
                if (typeof value === "object") {
                    value = value.join(" / ")
                }
                return {
                    ...a,
                    value
                }

            })
            clean_att.attrib=clean_attrib
            const ability_additional_info = hero_file.abilities.find(a => a.name === e)
            if (ability_additional_info) {
                const {
                    ability_has_scepter,
                    ability_has_shard,
                    ability_is_granted_by_scepter,
                    ability_is_granted_by_shard,
                } = ability_additional_info

                return {
                    ...clean_att, ability_has_scepter,
                    ability_has_shard,
                    ability_is_granted_by_scepter,
                    ability_is_granted_by_shard
                }

            } else {
                return null
            }
        })
        clean_abilities = clean_abilities.filter(e => e)
        return {
            ...hero_main_file,
            max_health, max_mana, turn_rate, armor,
            damage_max: primary_attr !== 3 ? damage_max : Math.floor(damage_max + ((str_base + agi_base + int_base) * 0.7)),
            damage_min: primary_attr !== 3 ? damage_min : Math.floor(damage_min + ((str_base + agi_base + int_base) * 0.7)),
            complexity: hero_file.complexity,
            talents: clean_tallents,
            abilities: clean_abilities,
            hero_aghs
        }
    }
}

module.exports = hero_cleaner