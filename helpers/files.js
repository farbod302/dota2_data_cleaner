const fs = require("fs")
const { gzip, ungzip } = require('node-gzip');

const files = {
    read_file(path) {
        const raw_file = fs.readFileSync(`${__dirname}/../json/${path}`)
        const json = JSON.parse(raw_file.toString())
        return json
    },
    read_multi_files(files) {
        const data = {}
        const keys = Object.keys(files)
        keys.forEach(key => {
            const json = this.read_file(files[key])
            data[key] = json
        })
        return data
    },
    write_clean_json_file(data, name) {
        fs.writeFileSync(`${__dirname}/../clean_json/${name}`, JSON.stringify(data))
    },
    CDN_BASE_URL: "https://cdn.cloudflare.steamstatic.com",
    async to_gzip(json, name) {
        const json_string = JSON.stringify(json)
        const compressed = await gzip(json_string)
        fs.writeFileSync(`${__dirname}/../matches/${name}.gzip`, compressed)
    },

    async from_gzip(name) {
        const file = fs.readFileSync(`${__dirname}/../matches/${name}.gzip`)
        const decoded = await ungzip(file)
        const json_string = decoded.toString()
        return JSON.parse(json_string)
    }
}

module.exports = files