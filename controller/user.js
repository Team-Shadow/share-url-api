const User = require('../model/user_schema')
const axios = require('axios')

/**
 * 获取当前登入用户
 */
exports.getLoginedUser = async (ctx) => {
    let user = ctx.session.user
    ctx.body = { data: user }
}

/**
 * 退出登入
 */
exports.logout = async ctx => {
    ctx.session.user = null
    ctx.body = { err: null }
}

/**
 * github 第三方登入
 */
const client_id = '274df6a3dc60b0dd834c'
const client_secret = 'e8dfc09c2a5544087f4fc01c646d3f57b302e0f5'
exports.githubCallback = async (ctx) => {
    let code = ctx.query.code
    let { data: tokenStr } = await axios.post('https://github.com/login/oauth/access_token', {
        client_id,
        client_secret,
        code,
    })
    let { data: githubUser } = await axios.get('https://api.github.com/user?' + tokenStr)
    /**
     * 查找用户，无 - 注册并登入  有 - 直接登入
     */
    let findUser = await User.findOne({ github_id: githubUser.id })
    if (findUser) { // 已存在用户
        ctx.session.user = findUser
    } else { // 不存在用户 -> 注册
        let user = new User()
        user.github_id = githubUser.id
        user.github = githubUser
        user.name = githubUser.name
        let ret = await user.save()
        ctx.session.user = user
        // ctx.body = user
    }
    ctx.body = `<script>location.href = '/'</script>`
}