
const express = require("express")
const app = express()
const routs=require("./routs/index")
const cors=require("cors")

const keys=Object.keys(routs)

app.use(cors())

keys.forEach(key=>{
    app.use("/"+key,routs[key])
})


app.listen(3434)



