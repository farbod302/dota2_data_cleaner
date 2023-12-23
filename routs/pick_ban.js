const express=require("express")
const pick_ban = require("../pick-ban")
const router=express.Router()


router.post("/",(req,res)=>{
    const {heros}=req.body
    const scores=pick_ban.check_rate(heros)
    res.json({
        status:true,
        msg:"",
        data:{scores}
    })
})


module.exports=router