const router = require('koa-router')()

router.get('/', async ctx => {
    ctx.body = '<h1>share-url-api</h1>'
}) // 主页

module.exports = router.routes()