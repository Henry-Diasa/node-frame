module.exports = () => {
  return async (ctx, next) => {
    let token = ctx.headers["authorization"];

    token = token ? token.split("Bearer ")[1] : null;
    console.log(token, 111);
    if (!token) {
      ctx.throw(401);
    }

    try {
      const data = ctx.service.user.verifyToken(token);
      ctx.user = await ctx.model.User.findById(data.userId);
    } catch (err) {
      ctx.throw(401);
    }

    await next()
  };
};
