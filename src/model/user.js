import { getAppUserInfo } from '@/services/user';

const initApplicationModel = {
  namespace: "user",
  state: { userInfo: {}, },
  effects: {
    *getUserInfo(_, { call, put }) {
      const userInfo = yield call(getAppUserInfo);
      yield put({ type: 'storeUser', payload: { userInfo: userInfo.MsgInfo || {} }, });
    },
  },
  reducers: {
    storeUser(state, action) {
      return { ...state, userInfo: action.payload.userInfo || {} };
    },
  },
};
export default initApplicationModel;
