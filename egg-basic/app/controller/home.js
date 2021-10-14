const Controller = require('egg').Controller

class HomeController extends Controller {
    async index() {
        this.ctx.body = 'hello world'
    }
    async foo() {
        this.ctx.body = 'foo'
    }
}

module.exports = HomeController