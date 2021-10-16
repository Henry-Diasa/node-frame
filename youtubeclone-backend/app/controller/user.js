const Controller = require("egg").Controller;

class UserController extends Controller {
  async create() {
    const body = this.ctx.request.body;
    // 错误会返回422 报错 可以通过try/ catch来捕获错误 自定义返回
    this.ctx.validate(
      {
        username: { type: "string" },
        email: { type: "email" },
        password: { type: "string" },
      },
      body
    );
    if (await this.service.user.findByUsername(body.username)) {
      this.ctx.throw(422, "用户已存在");
    }

    if (await this.service.user.findByEmail(body.email)) {
      this.ctx.throw(422, "邮箱已存在");
    }
    const user = await this.service.user.createUser(body);
    const token = this.service.user.createToken({
      userId: user._id,
    });
    this.ctx.body = {
      user: {
        email: user.email,
        token,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }

  async login() {
    const body = this.ctx.request.body;
    this.ctx.validate(
      {
        email: { type: "email" },
        password: { type: "string" },
      },
      body
    );
    const userService = this.service.user;
    const user = await userService.findByEmail(body.email);
    if (!user) {
      this.ctx.throw(422, "用户不存在");
    }
    if (this.ctx.helper.md5(body.password) !== user.password) {
      this.ctx.throw(422, "密码不正确");
    }

    const token = userService.createToken({
      userId: user._id,
    });
    this.ctx.body = {
      user: {
        email: user.email,
        token,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }

  async getCurrentUser() {
    const user = this.ctx.user;
    this.ctx.body = {
      user: {
        email: user.email,
        token: this.ctx.header["authorization"],
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }
  async update() {
    const body = this.ctx.request.body;
    this.ctx.validate(
      {
        email: { type: "email", required: false },
        password: { type: "string", required: false },
        username: { type: "string", required: false },
        channelDescription: { type: "string", required: false },
        avatar: { type: "string", required: false },
      },
      body
    );

    if (body.email) {
      if (
        body.email !== this.ctx.user.email &&
        (await this.service.user.findByEmail(body.email))
      ) {
        this.ctx.throw(422, "email已存在");
      }
    }

    if (body.username) {
      if (
        body.username !== this.ctx.user.username &&
        (await this.service.user.findByUsername(body.username))
      ) {
        this.ctx.throw(422, "username已存在");
      }
    }
    if (body.password) {
      body.password = this.ctx.helper.md5(body.password);
    }
    const user = await this.service.user.updateUser(body);
    this.ctx.body = {
      user: {
        email: user.email,
        password: user.password,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }
  async subscribe() {
    
  }
}

module.exports = UserController;
