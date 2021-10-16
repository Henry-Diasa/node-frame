const Service = require("egg").Service
const jwt = require('jsonwebtoken')
class UserService extends Service {
    get User () {
        return this.app.model.User
    }
    findByUsername(username) {
        return this.User.findOne({
            username
        })
    }
    findByEmail(email) {
        return this.User.findOne({
            email
        }).select('+password') // 因为设计schema的时候 密码的select属性是false 所以不会给我们返回password
    }
    async createUser(data) {
        data.password = this.ctx.helper.md5(data.password)
        const user = new this.User(data)
        await user.save()
        return user
    }
    createToken(data) {
        return jwt.sign(data, this.app.config.jwt.secret, {
            expiresIn: this.app.config.jwt.expiresIn
        })
    }

    verifyToken(token) {
        return jwt.verify(token, this.app.config.jwt.secret)
    }
    updateUser(data) {
        return this.User.findByIdAndUpdate(this.ctx.user._id, data, {
            new: true // 返回更新之后的数据
        })
    }
}

module.exports = UserService