const Url = require('../model/url_schema')
const User = require('../model/user_schema')
const only = require('only')
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
    let page = Number(query.page)
    let pageSize = Number(query.pageSize)
    ctx.body = {
        data: await Url.search({
            page, pageSize
        })
    }
}