const { Smsir } = require('smsir-js')
const smsir = new Smsir(process.env.SMS_KEY, 30007871)


const sms_handler = {
    sms_list: [],
    async send_sms(phone) {
        this.sms_list = this.sms_list.filter(e => e.phone !== phone)
        const random_num = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
        smsir.SendVerifyCode(phone, 333755, [{ name: "CODE", value: `${random_num}` }])
        this.sms_list.push({
            phone, code: random_num
        })
    },
    check_sms(phone, code) {
        const is_exist = this.sms_list.find(e => e.phone == phone && e.code == code)
        if (is_exist) {
            this.sms_list = this.sms_list.filter(e => e.phone !== phone)
            return true
        }
        return false
    }
}

module.exports = sms_handler