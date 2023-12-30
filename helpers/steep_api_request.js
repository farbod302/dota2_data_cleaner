
const { default: axios } = require("axios")


const api_keys = [
    "CBFA72D2C15715642CFA13D130ED91AA",
    "6FCF589DF7920B997C79A36C38029271"
]

const steam_request = async (path, payload) => {
    const get_random_key = Math.floor(Math.random() * api_keys.length)
    const params = new URLSearchParams({ ...payload, key: api_keys[get_random_key] }).toString()
    console.log(`https://api.steampowered.com/IDOTA2Match_570/${path}/v1/?${params}`);
    const { data } = await axios.get(`https://api.steampowered.com/IDOTA2Match_570/${path}/v1/?${params}`)
    return data
}




module.exports = { steam_request }