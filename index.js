
const express = require("express")
const app = express()
const routs=require("./routs/index")

const fs=require("fs")
const player_games = require("./funcs/players/player_games")
const keys=Object.keys(routs)

keys.forEach(key=>{
    app.use("/"+key,routs[key])
})


app.listen(3434)



