const router = require('koa-router')()
const axios = require('axios')
const User = require('../model/user_schema')

router.get('/', async ctx => {
    ctx.body = '<h1>share-url-api</h1>'
})
    .get('/github_callback', githubCallback)
    .get('/api/user', async ctx => {
        let user = ctx.session.user
        ctx.body = user
    })

/**
 * github 第三方登入
 */
const client_id = '274df6a3dc60b0dd834c'
const client_secret = 'e8dfc09c2a5544087f4fc01c646d3f57b302e0f5'
async function githubCallback(ctx) {
    let code = ctx.query.code
    let { data: tokenStr } = await axios.post('https://github.com/login/oauth/access_token', {
        client_id,
        client_secret,
        code,
    })
    let { data: githubUser } = await axios.get('https://api.github.com/user?' + tokenStr)
    /**
     * 查找用户，无 - 注册并登入  有 - 登入
     */
    let findUser = User.findOne({ github_id: githubUser.id })
    if (findUser) { // 已存在
        ctx.session.user = findUser
        // ctx.body = findUser
    } else { // 不存在
        let user = new User()
        user.github_id = githubUser.id
        user.github = githubUser
        user.name = githubUser.name
        let ret = await user.save()
        ctx.session.user = ret.user
        // ctx.body = user
    }
    ctx.body = `<script>location.href = '/'</script>`
}

module.exports = router.routes()