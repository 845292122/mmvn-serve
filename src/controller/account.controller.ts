import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuard,
} from '@midwayjs/core';
import { AccountService } from '../service/account.service';
import { ParseIntPipe } from '@midwayjs/validate';
import { IPage } from '../interface';
import { AccountDTO } from '../dto/account.dto';
import { BizError } from '../error/biz.error';
import { AdminGuard } from '../guard/admin.guard';

/**
 * 账户控制器
 */
@UseGuard(AdminGuard)
@Controller('/account')
export class AccountController {
  @Inject()
  accountService: AccountService;

  @Get('/list', { summary: '查询账户列表' })
  async getAccountList(
    @Query('merchantName') merchantName: string,
    @Query('pageNo', [ParseIntPipe]) pageNo: number,
    @Query('pageSize', [ParseIntPipe]) pageSize: number
  ): Promise<IPage> {
    const res = await this.accountService.selectAccountPage(
      {
        pageNo,
        pageSize,
      },
      merchantName
    );
    return res;
  }

  @Get('/:aid', { summary: '查询账户详情' })
  async queryAccount(
    @Param('aid', [ParseIntPipe]) aid: number
  ): Promise<AccountDTO> {
    const accountInfo = await this.accountService.selectAccount(aid);
    return accountInfo;
  }

  @Post('/create', { summary: '创建账户' })
  async createAccount(@Body() account: AccountDTO): Promise<void> {
    if (!account.phone) throw new BizError('手机号不能为空');
    await this.accountService.verifyPhoneUnique(account);
    await this.accountService.insertAccount(account);
  }

  @Post('/modify', { summary: '修改账户' })
  async modifyAccount(@Body() account: AccountDTO): Promise<void> {
    if (!account.phone) throw new BizError('手机号不能为空');
    await this.accountService.verifyPhoneUnique(account);
    await this.accountService.updateAccount(account);
  }

  @Post('/remove/:aid', { summary: '删除账户' })
  async removeAccount(
    @Param('aid', [ParseIntPipe]) aid: number
  ): Promise<void> {
    await this.accountService.deleteAccount(aid);
  }
}
