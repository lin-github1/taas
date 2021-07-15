import {getTicket, initAuth as initCarrierAuth} from '@/utils/icc';
import appRequestInstance, {initAuth as initAppAuth} from "@/utils/app";

export async function getAppUserInfo(token){
  const itoken = await initCarrierAuth(token);
  if(itoken){
    //根据Token获取ticket
    const userTicketRes = await getTicket();
    //根据ticket去资源服务器获取Token
    await initAppAuth(userTicketRes.MsgInfo);
    return appRequestInstance.get('/user/get_user_info/');
  }
}

