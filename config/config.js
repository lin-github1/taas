import { defineConfig } from 'umi';
import config from "../src/config/app"

export default defineConfig({
  title: config.appTitle,
  antd: {},
  dva: {
    hmr: true,
  },
  routes: [
    { exact: true, path: '/', redirect: config.baseUri + '/task' },
    {
      path: config.baseUri,
      component: '@/layouts/index',
      routes: [
        { exact: true, path: config.baseUri, redirect: config.baseUri + '/task' },
        { path: config.baseUri + '/task', component: '@/pages/Task' },
        { path: config.baseUri + '/task/:id?/edit', component: '@/pages/Task/EditTask' },
        { path: config.baseUri + '/task/execution', component: '@/pages/ExecuteRecord' },
        // { path: config.baseUri + '/task/execution/:id/report', component: '@/pages/Report' },
        { path: config.baseUri + '/task/execution/:id/report', component: '@/pages/Report/Report' },
        { path: config.baseUri + '/case/runner', component: '@/pages/Runner' },
        { path: config.baseUri + '/case/config', component: '@/pages/Task' },
        { path: config.baseUri + '/case/config/:id?/edit', component: '@/pages/CaseSetConfig/EditCaseSet' },
        // 白牌
        { path: config.baseUri + '/wtecard/config', component: '@/pages/whiteCard' }

      ]
    }
  ],
  targets: {
    ie: 11,
  },
  define: {
    "process.env.DEPLOY_ENV": "prod",
    // "process.env.appDataServer": "http://10.243.0.237:51011",
    // "process.env.appDataServer": "http://icc.rnd.huawei.com",
    // "process.env.appDataServer": "http://10.247.10.7:51011",
    // "process.env.appDataServer": "http://icc-uat.rnd.huawei.com",
    // "process.env.appDataServer": "http://10.174.58.103:8088", //test-caitongbin
    "process.env.appDataServer": "http://10.174.56.96:8088", //test-linjiayong
    // "process.env.appDataServer": "http://10.247.175.149:8088", //test-liunx
    // "process.env.appDataServer": "http://icc-uat.rnd.huawei.com",
    // "process.env.iCCServer": "http://icc.rnd.huawei.com",
    "process.env.iCCServer": "http://icc-uat.rnd.huawei.com",
    // "process.env.iCCServer": "http://10.173.115.189:9000",
  },

  // mock: true
});
