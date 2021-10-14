'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async create() {
    this.ctx.body = 'hi, 121312';
  }
}

module.exports = UserController;
