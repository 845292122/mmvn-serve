import { Provide } from '@midwayjs/core';
import { AccountDTO } from '../dto/account.dto';
import * as bcrypt from 'bcrypt';
import { Constant } from '../common/constant';
import { prisma } from '../prisma';
import { type Prisma } from '@prisma/client';
import { BizError } from '../error/biz.error';
import { IPage } from '../interface';

@Provide()
export class AccountService {
  /**
   * 分页查询账户
   * @param query 分页参数
   * @param merchantName 商户名称
   */
  async selectAccountPage(query: IPage, merchantName: string): Promise<IPage> {
    const condition: Prisma.AccountWhereInput = {
      deleted: 0,
    };
    if (merchantName) {
      condition.merchantName = merchantName;
    }

    const skipNum: number = (query.pageNo - 1) * query.pageSize;
    const takeNum: number = query.pageSize;
    const records = await prisma.account.findMany({
      where: condition,
      skip: skipNum,
      take: takeNum,
    });
    const count = await prisma.account.count({
      where: condition,
    });
    return {
      records,
      total: count,
      pageNo: query.pageNo,
      pageSize: query.pageSize,
    };
  }

  /**
   * 查询账户
   * @param aid 账户ID
   * @returns 账户详情
   */
  async selectAccount(aid: number): Promise<AccountDTO> {
    return await prisma.account.findUnique({
      where: {
        id: aid,
        deleted: 0,
      },
    });
  }

  /**
   * 插入账户信息
   * @param accountDTO 账户信息
   */
  async insertAccount(accountDTO: AccountDTO): Promise<void> {
    accountDTO.password = bcrypt.hashSync(
      Constant.INIT_PWD,
      Constant.SALT_ROUNDS
    );

    await prisma.account.create({
      data: accountDTO,
    });
  }

  /**
   * 更新账户
   * @param accountDTO 账户
   */
  async updateAccount(accountDTO: AccountDTO): Promise<void> {
    await prisma.account.update({
      where: {
        id: accountDTO.id,
        deleted: 0,
      },
      data: accountDTO,
    });
  }

  /**
   * 删除账户
   * @param aid 账户ID
   */
  async deleteAccount(aid: number): Promise<void> {
    await prisma.account.update({
      where: {
        id: aid,
        deleted: 0,
      },
      data: {
        deleted: 1,
      },
    });
  }

  /**
   * 验证手机号是否重复
   * @param accountDTO 账户
   */
  async verifyPhoneUnique(accountDTO: AccountDTO): Promise<void> {
    const condition: Prisma.AccountWhereInput = {
      phone: accountDTO.phone,
      deleted: 0,
    };

    if (accountDTO.id) {
      condition.id = {
        not: accountDTO.id,
      };
    }

    const res = await prisma.account.findFirst({
      where: condition,
    });

    if (res) throw new BizError('手机号已经存在');
  }
}
