const fs = require("fs")
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
    write_clean_json_file(data,name){
        fs.writeFileSync(`${__dirname}/../clean_json/${name}`,JSON.stringify(data))
    }
}

module.exports = files