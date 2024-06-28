import { Inject, Provide } from '@midwayjs/core';
import { ILogin } from '../interface';
import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { BizError } from '../error/biz.error';
import { Context } from '@midwayjs/koa';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@midwayjs/jwt';
import { AccountDTO } from '../dto/account.dto';

@Provide()
export class AuthService {
  @Inject()
  ctx: Context;

  @Inject()
  jwtService: JwtService;

  /**
   * 登录
   * @param loginInfo 登录信息
   * @returns token
   */
  async login(loginInfo: ILogin, jwtIp: string): Promise<string> {
    const condition: Prisma.AccountWhereUniqueInput = {
      deleted: 0,
      phone: loginInfo.phone,
    };
    const accountInfo = await prisma.account.findUnique({
      where: condition,
    });
    if (!accountInfo) {
      this.ctx.getLogger().info('登录失败,账号不存在: ' + loginInfo.phone);
      throw new BizError('手机号或密码不正确');
    }
    if (accountInfo.status === 0) {
      this.ctx.getLogger().info('账号: ' + accountInfo.phone + '已被锁定');
      throw new BizError('账号已被锁定');
    }
    const pwdBool = bcrypt.compareSync(
      loginInfo.password,
      accountInfo.password
    );
    if (!pwdBool) {
      this.ctx.getLogger().info('登录失败,密码不正确: ' + loginInfo.password);
      throw new BizError('手机号或密码不正确');
    }
    const token = await this.jwtService.sign({
      aid: accountInfo.id,
      isa: accountInfo.isAdmin,
      jwtIp,
    });
    return token;
  }

  /**
   * 获取账户信息
   * @param accountId 账户ID
   */
  async getAccountInfo(accountId: number): Promise<AccountDTO> {
    const condition: Prisma.AccountWhereUniqueInput = {
      deleted: 0,
      id: accountId,
      status: 1,
    };

    const accountInfo = await prisma.account.findUnique({
      where: condition,
      select: {
        id: true,
        phone: true,
        status: true,
        contact: true,
        merchantName: true,
        isAdmin: true,
      },
    });

    return accountInfo;
  }
}
