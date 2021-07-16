module.exports = {
  // apiPrefix: '/amt/api/',
  apiPrefix: '/whiteBox/api/',
  baseUri: '/app/mctc',
  fixedHeader: true, // sticky primary layout header
  loginUID: "cWX932019",
  // loginUID: "",
  // rmcServerAddress: process.env.NODE_ENV==='development'?'http://10.66.185.102':['localhost', '10.66.185.102', 'stt.hiktest.com'].indexOf(window.location.hostname) >= 0?process.env.SERVER_ADDRESS:'',
  // appDataServer: process.env.NODE_ENV==='development'?'http://127.0.0.1':['localhost:8000', '10.66.185.102', 'stt.hiktest.com'].indexOf(window.location.hostname) >= 0?process.env.SERVER_ADDRESS:'',
  appName: '测试中心',
  appTitle: '测试中心',
  appAlias: 'auto&manual',
  appHelpLink: undefined,
  issueFeedbackUrl: undefined,
  requirementFeedbackUrl: undefined,

  hasIndexPage:true,
  pageFooter:{
    contactUs:[
      {username:'李志伟l00327768', email:'lizhiwei11@huawei.com', telephone:'69601'},
      {username:'苏木忠s30000367', email:'sumuzhong@huawei.com', telephone:'65693'}
    ],
    products:[
      {name:'SDC·工具服务化', url:'http://toolsonline.rnd.huawei.com/index/'}
    ],
    friendlyLink:[
      {name:'W3办公', url:'http://w3.huawei.com/'},
      {name:'SDC·工具首页', url:'http://sdc.huawei.com'},
      {
        name:'SDC·知识书架',
        url:'http://sdc.resource.huawei.com/table_group/?table_group_id=5d1c45370015dd1ed492fbb2#!#tab_5d1c47200015dd1ed492fbb3_1'
      },
    ]
  },
  /* I18n configuration, `languages` and `defaultLanguage` are required currently. */
  i18n: {
    /* Countrys flags: https://www.flaticon.com/packs/countrys-flags */
    languages: [
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
    ],
    defaultLanguage: 'zh',
  },
};
