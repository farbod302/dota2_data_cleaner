const sms_handler = {
    sms_list: [],
    send_sms(phone) {
        this.sms_list = this.sms_list.filter(e => e.phone !== phone)
        const random_num = 1234
        //send code
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

module.exports=sms_handler