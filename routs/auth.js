const express = require("express")
const router = express.Router()
const User = require("../db/user")
const sms_handler = require("../helper/sms_handler")
const JWT = require("../helper/jwt")
const { uid } = require("uid")


router.post("/", async (req, res) => {
    const { phone } = req.body
    const is_user_signup = await User.findOne({ phone })
    sms_handler.send_sms(phone)
    res.json({
        status: true,
        msg: "کد تایید ارسال شد",
        data: {
            is_user_signup: is_user_signup ? true : false
        }
    })
})

router.post("/log_in", async (req, res) => {
    const { phone, code } = req.body
    const is_valid_code = sms_handler.check_sms(phone, code)
    if (!is_valid_code) {
        res.json({
            status: false,
            msg: "کد تایید اشتباه است",
            data: {}
        })
        return
    }
    const user = await User.findOne({ phone })
    const { steam_id, dota_id, user_id } = user
    const data = { steam_id, dota_id, user_id }
    const token = JWT.sign(data)
    res.json({
        status: true,
        msg: "خوش آمدید",
        data: {
            token
        }
    })


})


router.post("/sign_up", (req, res) => {
    const { name, phone, code, dota_id, steam_id } = req.body
    const is_valid_code = sms_handler.check_sms(phone, code)
    if (!is_valid_code) {
        res.json({
            status: false,
            msg: "کد تایید اشتباه است",
            data: {}
        })
        return
    }
    const user_id = uid(8)
    const new_user = {
        phone,
        name,
        dota_id,
        steam_id: steam_id || 0,
        user_id,
        vip_until: 0
    }
    new User(new_user).save()
    const token = JWT.sign({ steam_id, dota_id, user_id })
    res.json({
        status: true,
        msg: "خوش آمدید",
        data: {
            token
        }
    })
})



module.exports = router