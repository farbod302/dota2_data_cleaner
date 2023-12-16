const express = require("express")
const files = require("../helpers/files")
const router = express.Router()


router.get("/list", (req, res) => {
    const heroes = files.read_file("../clean_json/hero_basic.json")
    res.json({
        status: true,
        msg: "",
        data: { heroes_list: heroes }
    })

})

router.get("/hero_detail/:hero_id", (req, res) => {
    try {
        const { hero_id } = req.params
        const selected_hero = files.read_file(`../clean_heros_json/${hero_id}.json`)
        res.json({
            status: true,
            msg: "",
            data: selected_hero
        })
    }
    catch {
        res.json({
            status: false,
            msg: "Invalid hero name",
            data: {}
        })
    }
})


module.exports = router