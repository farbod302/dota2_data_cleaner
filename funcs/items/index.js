const files = require("../../helpers/files")

const items = {
    gathering_items_data() {
        const items_data = files.read_file("items.json")
        const items_data_2 = files.read_file("items_2.json")
        const all_items = Object.keys(items_data)
        const clean_items_data = all_items.map(item => {
            const item_data = items_data[item]
            const item_clean_data = {}
            //name and id
            item_clean_data["name"] = item_data["dname"] || item.replaceAll("_", " ")
            item_clean_data["name_id"] = item
            item_clean_data["id"] = item_data["id"]
            item_clean_data["image"] = item_data["img"]
            item_clean_data["mc"] = item_data["mc"]
            item_clean_data["cd"] = item_data["cd"]
            item_clean_data["notes"] = item_data["notes"]
            item_clean_data["lore"] = item_data["lore"]
            item_clean_data["cost"] = item_data["cost"]
            item_clean_data["visible"] = item.indexOf("recipe") > -1 ? false : true
            item_clean_data["charges"] = item_data["charges"]
            item_clean_data["neutral"] = +items_data_2[`item_${item}`]?.ItemIsNeutralDrop?true:false
            item_clean_data["recipe"] = item_data["components"] || []
            const have_recipe = all_items.find(i => i === "recipe_" + item)
            if (have_recipe) item_clean_data["recipe"].push("recipe_" + item)
            item_clean_data["hint"] = item_data.hint?.join("") || ""
            const attrib = items_data_2[`item_${item}`]
            if (attrib) {
                const { AbilityValues } = attrib
                if (!AbilityValues) {
                    item_clean_data["attrib"] = []
                } else {
                    const attrib_keys = Object.keys(AbilityValues)
                    const clean_attrib = attrib_keys.map(att => {
                        return {
                            key: att.replaceAll("_", " "),
                            value: AbilityValues[att]
                        }
                    })
                    item_clean_data["attrib"] = clean_attrib

                }
            } else {
                item_clean_data["attrib"] = []

            }

            return item_clean_data
        })
        // files.write_clean_json_file(clean_items_data, "items.json")
    }
}

module.exports = items