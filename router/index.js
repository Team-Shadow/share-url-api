const router = require('koa-router')()
const user = require('../controller/user')
const share = require('../controller/share')

router.get('/', async ctx => {
    ctx.body = '<h1>share-url-api</h1>'
})
    .get('/api/github_callback', user.githubCallback) // github第三方登入回调
    .get('/api/user', user.getLoginedUser) // 获取当前登入用户信息
    .delete('/api/user', user.logout) // 退出登入
    .post('/api/url', user.need, share.sendUrl) // 分享链接

module.exports = router.routes()