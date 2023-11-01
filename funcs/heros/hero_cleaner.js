const files = require("../../helpers/files")
const fs=require("fs")
const hero_cleaner = {

    HERO_IDS: 150,
    
    clean_all() {
        for (let i = 1; i <= this.HERO_IDS; i++) {
            const hero_data=this.clean_hero(i)
            if(hero_data){
                fs.writeFileSync(`${__dirname}/../../clean_heros_json/${hero_data.name}.json`,JSON.stringify(hero_data))
            }
        }
    },
    all_files: files.read_multi_files({
        heros: "heroes.json",
        abilities: "abilities.json",
        hero_abilities: "hero_abilities.json",
        aghs:"aghs_desc.json"
    }),

    clean_hero(id) {
        const hero_main_file = this.all_files.heros[id]
        if (!hero_main_file) return
        const { name } = hero_main_file
        const hero_file = files.read_file(`../heroes_data/${name}.json`)
        const hero_abilities_name = this.all_files.hero_abilities[name]
        const { abilities, talents } = hero_abilities_name
        const clean_tallents=talents.map(t=>{
            return {...t,name: this.all_files.abilities[t.name]?.dname}
        })
        const hero_aghs=this.all_files.aghs.find(h=>h.hero_name === name)
        let clean_abilities = abilities.map(e => {
            const att = this.all_files.abilities[e]
            const ability_additional_info = hero_file.abilities.find(a => a.name === e)
            if(ability_additional_info){
                const {
                    ability_has_scepter,
                    ability_has_shard,
                    ability_is_granted_by_scepter,
                    ability_is_granted_by_shard,
                } = ability_additional_info

                return  {...att, ability_has_scepter,
                    ability_has_shard,
                    ability_is_granted_by_scepter,
                    ability_is_granted_by_shard}
               
            }else{
                return null
            }
        })
        clean_abilities=clean_abilities.filter(e=>e)
        return{
            ...hero_main_file,
            complexity:hero_file.complexity,
            talents:clean_tallents,
            abilities:clean_abilities,
            hero_aghs
        }
    }
}

module.exports = hero_cleaner