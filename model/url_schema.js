
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UrlSchema = new Schema({
    link: { type: String, default: '' }, // 链接地址
    title: { type: String, default: '' }, // 标题 
    describe: { type: String, default: '' }, // 描述
    createDate: { type: Date, default: Date.now }, // 创建时间
    author: { type: Schema.Types.ObjectId, ref: 'share_user' }
})


module.exports = mongoose.model('share_url', UrlSchema)
