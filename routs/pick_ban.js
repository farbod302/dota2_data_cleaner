const express=require("express")
const pick_ban = require("../pick-ban")
const router=express.Router()


router.post("/",(req,res)=>{
    const {heros,side}=req.body
    const scores=pick_ban.check_rate(heros,side)
    res.json({
        status:true,
        msg:"",
        data:{scores}
    })
})


module.exports=router