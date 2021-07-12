import {iccRequest as requestInstance} from "./request";
import config from "@/config/app";

requestInstance.interceptors.request.use((url, options) => {
  if(!url.endsWith('/user_token/get_user_token/')){
    const headers = {Authorization: `Token ${requestInstance.token}`};
    return ({
      url: url,
      options: {...options, headers: headers}
    });
  } else {
    return ({
      url: url,
      options: {...options}
    });
  }
}, { global: false });

export function getTicket() {
  return requestInstance.get('/ticket/get_user_ticket/');
}

//获取认证服务器Token
export function getToken() {
  let pyload = {};
  if (config.loginUID !== 'admin' && process.env.NODE_ENV !== "production") {
    pyload = {uid: config.loginUID}
  }
  return requestInstance.get('/user_token/get_user_token/', {params: pyload});
}


export async function initAuth(token) {
  if (!token) {
    const res = await getToken();
    requestInstance.token = res.MsgInfo;
  } else {
    requestInstance.token = token;
  }
  return requestInstance.token
}

export default requestInstance;
