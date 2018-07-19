
const mongoose = require('mongoose')

const Schema = mongoose.Schema

/**
 * User Schema
 */

const UserSchema = new Schema({
    name: { type: String, default: '' }, // 用户名 - 展示用
    username: { type: String, default: '', trim: true }, // 用户名 - 登入用
    createDate: { type: Date, default: Date.now }, // 创建时间
    site_admin: { type: Boolean, default: false }, // 网站管理员
    github: { type: Object, default: null }, // 绑定的github用户信息
    github_id: { type: String, default: null } // 绑定的github用户ID
})


module.exports = mongoose.model('share_user', UserSchema)
