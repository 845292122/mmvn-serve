import { Body, Controller, Get, Inject, Post } from '@midwayjs/core';
import { ILogin } from '../interface';
import { BizError } from '../error/biz.error';
import { AuthService } from '../service/auth.service';
import { Context } from '@midwayjs/koa';
import { AccountDTO } from '../dto/account.dto';

@Controller('/auth')
export class AuthController {
  @Inject()
  ctx: Context;

  @Inject()
  authService: AuthService;

  @Post('/login')
  async login(@Body() loginInfo: ILogin): Promise<string> {
    const jwtIp = this.ctx.request.ip;
    if (!loginInfo.phone || !loginInfo.password) {
      throw new BizError('请输入完整登录信息');
    }
    return this.authService.login(loginInfo, jwtIp);
  }

  @Get('/info')
  async getInfo(): Promise<AccountDTO> {
    const { aid } = this.ctx.state?.authInfo;
    return this.authService.getAccountInfo(aid);
  }
}
