const Url = require('../model/url_schema')
const MyCollection = require('../model/my_schema')
const only = require('only')

/**
 * 查询改链接是否已收藏
 */

exports.collectionHas = async (ctx) => {
    let query = ctx.request.query
    let urlId = query.urlId
    if (!urlId) ctx.throw(400, 'urlId required')
    let user = ctx.state.user
    let collection = await MyCollection.findOne({ author: user._id, collection_url: urlId }).select('id')
    if (collection) {
        ctx.body = { collection: true, data: collection }
    } else {
        ctx.body = { collection: false, data: collection }
    }
}

/**
 * 获取收藏夹
 */
exports.collection = async (ctx) => {
    let user = ctx.state.user
    let collection = await MyCollection.findOne({ author: user._id }).populate({path: 'collection_url', select: 'title id'})
    ctx.body = { data: collection || new MyCollection()}
}

/**
 * 添加到收藏
 */
exports.addCollection = async (ctx) => {
    let body = ctx.request.body
    if (!body.urlId) ctx.throw(400, 'urlId required')
    let urlId = body.urlId
    let user = ctx.state.user
    let ret = await MyCollection.update({ author: user._id }, { $addToSet: { collection_url: urlId } }, { upsert: true })
    ctx.body = ret
}

/**
 * 查询详情
 */
exports.findOne = async (ctx) => {
    let id = ctx.params.urlId
    ctx.body = {
        data: await Url.findOne({ _id: id }).populate({ path: 'author', select: 'id name' })
    }
}

/**
 * 分享链接
 */
exports.sendUrl = async (ctx) => {
    let url = new Url(only(ctx.request.body, 'link title describe'))
    url.author = ctx.state.user
    await url.save()
    ctx.body = { data: url }
}

/** 
 * 搜索链接
*/
exports.search = async (ctx) => {
    let query = ctx.request.query
    let params = {}
    params.page = Number(query.page) // 页码
    params.pageSize = Number(query.pageSize) // 一页条数
    if (query.criteria) { // 搜索条件
        params.criteria = JSON.parse(query.criteria)
    }
    ctx.body = {
        data: await Url.search(params)
    }
}