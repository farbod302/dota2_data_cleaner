const { default: axios } = require("axios")
const fs = require("fs")
const files = require("../../helpers/files")
const HERO_LENGTH = 150

const scrap_hero = async (id) => {
   try{
    const { data } = await axios.get("https://www.dota2.com/datafeed/herodata?language=english&hero_id=" + id)
    const { heroes } = data.result.data
    const { name } = heroes[0]
    console.log(id,"- Scrap complete for " + name);
    fs.writeFileSync(`${__dirname}/../../heroes_data/${name}.json`, JSON.stringify(heroes[0]))
   }
   catch{
    console.log(id+" pass");
   }
}

const start_scrap = async () => {
    for (let i = 1; i <= HERO_LENGTH; i++) {
        await scrap_hero(i)
    }
}

const merge_heros=()=>{
    const heroes=files.read_file("heroes.json")
    const heroes_basic=[]
    for(let i=1;i<=HERO_LENGTH;i++){
        const hero=heroes[i]
        if(!hero)continue
        const {name}=hero
        const hero_file=files.read_file(`../clean_heros_json/${name}.json`)
        const {localized_name,img,primary_attr,complexity,id}=hero_file
        heroes_basic.push({
            name:localized_name,
            image:files.CDN_BASE_URL+img,
            complexity,
            primary_attr,
            id,
            api_name:name
        })

    }
    fs.writeFileSync(`${__dirname}/../../clean_json/hero_basic.json`,JSON.stringify(heroes_basic))
}

module.exports={start_scrap,merge_heros}