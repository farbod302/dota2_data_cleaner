
const express = require("express")
require("dotenv").config()
const app = express()
const routs = require("./routs/index")
const cors = require("cors")
const fs = require("fs")
const files = require("./helpers/files")
const hero_cleaner = require("./funcs/heros/hero_cleaner")
const scrap = require("./pick-ban/scrap")
const pick_ban = require("./pick-ban")
const keys = Object.keys(routs)
const bodyParser = require("body-parser")
const { start_scrap } = require("./funcs/heros")
const JWT = require("./helper/jwt")
const  mongoose  = require("mongoose")
const scrap_all = require("./pick-ban/scrap")
const _validator = require("./helpers/validator")
const { get_player_data } = require("./funcs/players/player_ptofile")


String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 

app.use(cors())
app.use(bodyParser.json())



mongoose.connect(process.env.DB)

const check_token = (req, res, next) => {
    const token = req.headers.token
    if (!token) return next()
    const user_data = JWT.verify(token)
    if (!user_data) {
        res.json({
            status: false,
            msg: "شناسه نامعتبر",
            data: {}
        })
        return
    }
    else {
        req.body.user = user_data
        next()
    }
}
app.use(check_token)
keys.forEach(key => {
    app.use("/" + key, routs[key])
})


app.listen(3434)





// const clean_item_images = () => {
//     const items = files.read_file("abilities_image.json")
//     const keys = Object.keys(items)
//     const clean_images = keys.map(k => {
//         const { id, shortName,displayName } = items[k]
//         return {
//             id,
//             img:"https://cdn.stratz.com/images/dota2/items/"+shortName+".png",
//             name:displayName
//         }
//     })
//     fs.writeFileSync(`${__dirname}/clean_json/items_image.json`,JSON.stringify(clean_images))
// }

// clean_item_images()




// const clean_item_images = () => {
//     const items = files.read_file("abilities_image.json")
//     const keys = Object.keys(items)
//     const clean_images = keys.map(k => {
//         const { id, name ,isTalent,language} = items[k]
//         const {displayName}=language
//         return {
//             id,
//             img:`https://cdn.stratz.com/images/dota2/abilities/${name}.png`,
//             name,
//             isTalent,
//             displayName
//         }
//     })
//     fs.writeFileSync(`${__dirname}/clean_json/abilities_image.json`,JSON.stringify(clean_images))
// }

// clean_item_images()



hero_cleaner.clean_all()