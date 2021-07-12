/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import request, {extend} from 'umi-request';
// import { request } from 'umi';
import {notification, Modal} from 'antd';

import {ErrorHandle} from './errorHandle'


const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;
  if (response && response.status) {
    // const errorText = codeMessage[response.status] || response.statusText;
    // const { status, url } = response;
    ErrorHandle[response.status]();
    // ErrorHandle[response.status]();
    // if ( response.status === 401 ) {
    //   Modal.info({
    //     title: '提示 认证过期·HTTP401',
    //     content: (
    //       <div>
    //         <br/>
    //         <p>尊敬的用户：</p>
    //         {/*<br/>*/}
    //         <p style={{textIndent:'2em'}}>
    //           您好，为了保证您的数据安全，您的令牌Token已过期，请您
    //           <span style={{color:'#108ee9'}}>重新登录</span>。
    //         </p>
    //         <p style={{textIndent:'2em'}}>您点击“知道了”按钮后，系统将会自动跳转到登录界面，感谢您的配合。</p>
    //         <br/>
    //         <div style={{textAlign:'right'}}>SDC工具·前端中心</div>
    //       </div>
    //     ),
    //     onOk() {
    //       window.location.reload();
    //     }
    //   });
    //   // notification.error({
    //   //   message: `请求12错误 ${status}: ${url}`,
    //   //   description: errorText,
    //   //   onClose: () => {
    //   //     window.location.reload();
    //   //   }
    //   // });
    // } else {
    //   notification.error({
    //     message: `请求错误 ${status}: ${url}`,
    //     description: errorText,
    //   });
    // }
  } else if (!response) {
    notification.error({
      description: "您的网络发生异常，无法连接服务器",
      message: '网络异常',
    });
  }
  // return Promise.reject(response);
  // throw error;
  return response;
};

request.interceptors.request.use(( url, options ) => {
  const _method = options.method.toUpperCase();
  if (_method === 'PUT' || _method === 'PATCH' || _method === 'DELETE') {
    options.method = 'POST';
    options.headers = options.headers || {};
    options.params = options.params || {};
    Object.assign(options.headers, {
      'X-HTTP-Method-Override': _method,
      'X-Requested-With': 'XMLHttpRequest'
    });
    Object.assign(options.params, { _method });
  }
  return ({url: url, options: options});
});

request.interceptors.response.use(async (response)=>{
  if (response.ok){
    const data = await response.clone().json();
    if (response.ok && data && data.ErrorInfo && data.ErrorInfo.errCode !== "0") {
      ErrorHandle["APIERROR"](data.ErrorInfo.errCode, data.ErrorInfo.errDec);
      // notification.warning({
      //   message: `请求数据异常: ${data.ErrorInfo.errCode}`,
      //   description: data.ErrorInfo.errDec,
      // });
      return response;
      // return Promise.reject(response);
      // return Promise.reject(new Error(data.ErrorInfo.errDec));
    } else {
      // response.data = data.MsgInfo
    }
  }
  return response

});

function createInstance(baseUrl) {
  return extend({
    prefix: baseUrl,
    errorHandler, // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
  });
}
const iccRequest = createInstance(`${process.env.iCCServer}/icc/api`);

// const appRequest = createInstance(`${process.env.appDataServer}/amt/api`);  //0814切后端
const appRequest = createInstance(`${process.env.appDataServer}/whiteBox/api`)
export {iccRequest, appRequest}
