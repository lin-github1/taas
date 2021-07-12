
import {appRequest as appRequestInstance} from "@/utils/request";

appRequestInstance.interceptors.request.use(( url, options ) => {
  if(!url.endsWith('/token/get_token')){
    const headers = { Authorization: `Token ${appRequestInstance.token}`};
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

//获取认证服务器Token
export function getToken(ticket) {
  return appRequestInstance.get('/token/get_token/', { params: {ticket} });
}

export async function initAuth(ticket){
  const resData = await getToken(ticket);
  appRequestInstance.token = resData && resData.MsgInfo;
  return appRequestInstance.token
}

export default appRequestInstance;
