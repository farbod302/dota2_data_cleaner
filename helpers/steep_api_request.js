
const { default: axios } = require("axios")
const { gzip, ungzip } = require('node-gzip');
const fs = require("fs")

const steam_request = async (path, payload) => {
    const params = new URLSearchParams({ ...payload, key: "6FCF589DF7920B997C79A36C38029271" }).toString()
    console.log(`https://api.steampowered.com/IDOTA2Match_570/${path}/v1/?${params}`);
    const { data } = await axios.get(`https://api.steampowered.com/IDOTA2Match_570/${path}/v1/?${params}`)
    return data
}




module.exports = { steam_request }