const { default: axios } = require("axios")
const fs = require("fs")
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

module.exports=start_scrap