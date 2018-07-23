const User = require('../model/user_schema')
const axios = require('axios')
const {client_id, client_secret} = require('../config/github')
/**
 * 中间件，需要登入
 */
exports.need = async (ctx, next) => {
    if (ctx.session.user) {
        ctx.state.user = ctx.session.user
        await next()
    } else {
        return ctx.body = {
            login: true
        }
    }
}
    
/**
 * 注册
 */
exports.register = async (ctx) => {
    let body = ctx.request.body
    if (!body.username) ctx.throw(400, 'username required')
    if (!body.password) ctx.throw(400, 'password required')
    let username = body.username
    let password = body.password
    let user = await User.findOne({ username })
    if (user) {
        ctx.body = { err: '用户已存在' }
    } else {
        let user = await new User({ username, password, name: username }).save()
        ctx.session.user = user
        ctx.body = { data: user }
    }
}

/**
 * 登入
 */
exports.login = async (ctx) => {
    let body = ctx.request.body
    if (!body.username) ctx.throw(400, 'username required')
    if (!body.password) ctx.throw(400, 'password required')
    let username = body.username
    let password = body.password
    let user = await User.findOne({ username })
    if (user && user.authenticate(password)) {
        ctx.session.user = user
        ctx.body = { data: user }
    } else if (user) {
        ctx.body = { err: '密码错误' }
    } else {
        ctx.body = { err: '用户名不存在' }
    }
}

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
        await user.save()
        ctx.session.user = user
    }
    ctx.body = `<script>location.href = '/'</script>`
}