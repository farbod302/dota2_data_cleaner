const files = require("../../helpers/files")
const fs = require("fs")
const { convert } = require('html-to-text');


const convertor=(html)=>{
    return convert(html,
        {
            selectors:[
                {
                    selector:"br",
                    format:"skip"
                }
            ]
        }
        ).replace("\n","")
}

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
        abilities_clean: "../clean_json/abilities_image.json",
        comp_abilities: "abilities_image.json"
    }),

    clean_hero(id) {
        const hero_main_file = this.all_files.heros[id]
        if (!hero_main_file) return
        const { name } = hero_main_file
        const hero_file = files.read_file(`../heroes_data/${name}.json`)
        const { max_health, max_mana, turn_rate, armor, damage_max, damage_min, primary_attr
            , str_base, agi_base, int_base
        } = hero_file
        const hero_abilities_name = this.all_files.hero_abilities[id]
        const { abilities, talents } = hero_abilities_name
        const clean_tallents = talents.map(t => {
            const selected_talent = this.all_files.abilities_clean.find(e => e.id == t.abilityId)
            return { ...t, name: selected_talent.displayName, id: selected_talent.id, level: (Math.floor(t.slot / 2) + 1) }
        })

        const clean_abilities = abilities.map(ab => {
            const selected_ab = this.all_files.comp_abilities[ab.abilityId]
            const { name, language, stat } = selected_ab
            const { hasShardUpgrade, isGrantedByShard, isGrantedByScepter, hasScepterUpgrade } = stat
            const { displayName, description, attributes } = language
            const secondary_file = this.all_files.abilities[name]
            const { behavior, dmg_type, bkbpierce, target_team, target_type, attrib } = secondary_file
            return {
                dname: displayName,
                behavior: behavior?.toString() || null,
                dmg_type: dmg_type?.toString() || null,
                target_team: target_team?.toString() || null,
                target_type: target_type?.toString() || null,
                bkbpierce: bkbpierce || null,
                desc: `${convertor(description[0])}${hasScepterUpgrade && language.aghanimDescription ? ` \n\n Aghanim Upgrade: ${convertor(language.aghanimDescription)}` : ""} ${hasShardUpgrade && language.shardDescription ? `${`\n\n Shard Upgrade: ${convertor(language.shardDescription)}`}` : ""}`,
                // attrib: attributes.map(at => {
                //     const spited = at.split(":")
                //     return {
                //         key: spited[0],
                //         header: spited[0],
                //         value: spited[1]
                //     }
                // }),
                attrib,
                mc: secondary_file.mc?.toString() || null,
                cd: secondary_file.cd?.toString() || null,
                img: `/apps/dota2/images/dota_react/abilities/${name}.png`,
                ability_has_scepter: hasScepterUpgrade,
                ability_has_shard: hasShardUpgrade,
                ability_is_granted_by_scepter: isGrantedByScepter,
                ability_is_granted_by_shard: isGrantedByShard

            }
        })
        return {
            ...hero_main_file,
            max_health, max_mana, turn_rate, armor,
            damage_max: primary_attr !== 3 ? damage_max : Math.floor(damage_max + ((str_base + agi_base + int_base) * 0.7)),
            damage_min: primary_attr !== 3 ? damage_min : Math.floor(damage_min + ((str_base + agi_base + int_base) * 0.7)),
            complexity: hero_file.complexity,
            talents: clean_tallents,
            abilities: clean_abilities.filter(e => e.dname),

        }
    }
}

module.exports = hero_cleaner