
const Koa = require('koa')
const logger = require('koa-logger')
const koaBody = require('koa-body')
const mongoose = require('mongoose')
const session = require('koa-session')
const router = require('./router')
const mongoConfig = require('./config/mongo')
const sessionConfig = require('./config/session')

console.log(mongoConfig.show)
mongoose.connect(mongoConfig.link, {useNewUrlParser: true})
const db = mongoose.connection;

const app = new Koa()
app.keys = ['junn secret 4']

app.use(koaBody({ jsonLimit: '10kb' })) // body解析
app.use(logger()) // 日志
app.use(session(sessionConfig, app)) // session配置
app.use(router) // api请求配置

db.on('error', console.error.bind(console, 'connection error:')) // 数据库链接异常提示
db.once('open', function () { // 连接数据库
    console.log('connect')
    app.listen(8081, () => {
        console.log(8081)
    })
})