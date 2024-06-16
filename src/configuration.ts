import { Configuration, App, ILifeCycle } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import { BizErrorFilter } from './filter/biz.filter';
import { DefaultErrorFilter } from './filter/default.filter';
import { ResultMiddleware } from './middleware/result.middleware';

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration implements ILifeCycle {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, ResultMiddleware]);
    // add filter
    this.app.useFilter([BizErrorFilter, DefaultErrorFilter]);
  }
}
