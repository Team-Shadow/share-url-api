
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MySchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'share_user' },
    collection_url: [ {type: Schema.Types.ObjectId, ref: 'share_url'} ]
    // collection_url: { type: Array, default: [] } // 收藏的链接
})

module.exports = mongoose.model('share_my', MySchema)
