import { Body, Controller, Get, Param, Post, Query } from '@midwayjs/core';
import { User } from '../interface';
import { BizError } from '../error/biz.error';

@Controller('/user')
export class UserController {
  /**
   * get 参数请求
   * @param id
   * @returns
   */
  @Get('/')
  async getUser(@Query('id') id: string): Promise<User> {
    throw new BizError('123错误了');
    return {
      id: Number(id),
      name: 'user',
      age: 20,
    };
  }

  /**
   * post请求接收参数
   * @param uid
   * @returns
   */
  @Post('/')
  async postUser(@Body('uid') uid: string): Promise<User> {
    return {
      id: Number(uid),
      name: 'post',
      age: 100,
    };
  }

  /**
   * 路径参数
   * @param uid
   */
  @Get('/:uid')
  async pathUser(@Param('uid') uid: string): Promise<User> {
    return {
      id: Number(uid),
      name: 'path',
      age: 1000,
    };
  }
}
