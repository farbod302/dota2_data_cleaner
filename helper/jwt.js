const jwt = require("jsonwebtoken")

const JWT = {
    sign(data) {
        const token = jwt.sign(data, process.env.JWT)
        return token
    },

    verify(token) {
        try {
            const data = jwt.verify(token, process.env.JWT)
            return data
        } catch {
            return null
        }

    }
}


module.exports=JWT