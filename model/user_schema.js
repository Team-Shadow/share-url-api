
const mongoose = require('mongoose')
const crypto = require('crypto')

const Schema = mongoose.Schema

/**
 * User Schema
 */

const UserSchema = new Schema({
    name: { type: String, default: '' }, // 用户名 - 展示用
    username: { type: String, default: '', trim: true }, // 用户名 - 登入用
    hashed_password: { type: String, default: '' },
    salt: { type: String, default: '' },
    createDate: { type: Date, default: Date.now }, // 创建时间
    site_admin: { type: Boolean, default: false }, // 网站管理员
    github: { type: Object, default: null }, // 绑定的github用户信息
    github_id: { type: String, default: null } // 绑定的github用户ID
})

/** 虚拟属性 */
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

/** 参数验证 */
// UserSchema.path('username').validate(name => name.length, '用户名不能为空')
// UserSchema.path('hashed_password').validate(pwd => pwd.length, '密码不能为空')

/** 事件钩子 */
UserSchema.pre('save', function (next) {
    if (this.isNew) {
        console.log('新用户：', this.username)
    }
    next()
})

/** 实例方法 */
UserSchema.methods = {

    /**
     * 验证 - 检测密码是否正确
     * @param {String} 普通的文本（明文）
     * @return {Boolean}
     */
    authenticate(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    /**
     * 创建 salt
     * @return {String}
     */
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    },

    /**
     * 加密 password
     *
     * @param {String} password
     * @return {String}
     */
    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
}


module.exports = mongoose.model('share_user', UserSchema)
