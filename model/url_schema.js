
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UrlSchema = new Schema({
    link: { type: String, default: '' }, // 链接地址
    title: { type: String, default: '' }, // 标题 
    describe: { type: String, default: '' }, // 描述
    createDate: { type: Date, default: Date.now }, // 创建时间
    author: { type: Schema.Types.ObjectId, ref: 'share_user' }
})

/** 静态方法 */
UrlSchema.statics = {
    /**
     * 获取所有文章
     * {
     *   page {Number} 页码，默认1
     *   pageSize {Number} 页数，默认20
     *   select {String} 筛选，默认 '-describe'
     *   criteria {Object} 条件，默认 {}
     * }
     */
    search({ page = 1, pageSize = 20, select = '-describe', criteria = {} } = {}) {
        pageSize = Math.min(30, pageSize)
        return this.find(criteria)
            .select(select)
            .populate({path: 'author', select: 'id name'})
            .sort({ date: -1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize)
    },
}

module.exports = mongoose.model('share_url', UrlSchema)
