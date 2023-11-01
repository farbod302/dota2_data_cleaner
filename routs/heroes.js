const express=require("express")
const files = require("../helpers/files")
const router=express.Router()



router.get("/list",(req,res)=>{
    const heroes=files.read_file("../clean_json/hero_basic.json")
    res.json({
        status:true,
        msg:"",
        data:{heroes_list:heroes}
    })

})


module.exports=router