import { Catch, HttpStatus } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // 所有的未分类错误会到这里
    ctx.logger.warn('系统异常: ' + err.message);
    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: err.message,
    };
  }
}
