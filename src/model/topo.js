import {getTestBedList, getDeviceListByBed, getVariables, getVersionList} from '@/services/topo';

const eiicoDeviceModel = {
  namespace: "eiicoDevice",
  state: {
    envType: "by_bed",
    versionData: [],
    selectedData: [],
    loadBed: false,
    loadEnvData: false,
    testBedData: {
      total: 0,
      data: []
    },
    deviceData: {},
    advanceConfig: false,
    Variable: {
      GlobalVariable: {},
      UserDefine: {}
    },
    rightCurrentSelectedData: [],
    leftCurrentSelectedData: []
  },
  effects: {
    * getTestBed({payload}, {call, put}) {
      const resData = yield call(getTestBedList, {user: payload.userShortName, version: payload.version});
      yield put({type: 'storeBed', payload: {testBedData: resData.MsgInfo || {}}, loadBed: false});
    },
    * getDeviceByBed({payload, callback}, {call, put}) {
      const resData = yield call(getDeviceListByBed, {key: payload.key});
      yield put({
        type: 'storeDevice', payload: {
          deviceData: resData.MsgInfo || [], key: payload.key, loadEnvData: false
        },
      });
      callback(resData.MsgInfo)
    },
    * fetGetVariables({__}, {call, put}) {
      const resData = yield call(getVariables);
      yield put({
        type: 'setVariables', payload: {
          GlobalVariable: resData.MsgInfo.global_variable || {},
          UserDefine: resData.MsgInfo.user_define_variable || {},
        }
      });
    },
    * fetGetVersionList({payload}, {call, put}) {
      const resData = yield call(getVersionList, {user: payload.userShortName});
      yield put({
        type: 'setVersionData', payload: {
          versionData: resData.MsgInfo || [],
        }
      });
    }
  },
  reducers: {
    storeBed(state, action) {
      return {...state, testBedData: action.payload.testBedData || {}, loadBed: action.payload.loadBed};
    },
    storeDevice(state, action) {
      const currentKey = action.payload.key;
      state.deviceData[currentKey] = action.payload.deviceData;
      return {
        ...state,
        deviceData: {
          ...state.deviceData
        },
        loadEnvData: action.payload.loadEnvData
      }
    },
    setVersionData(state, action) {
      return {
        ...state,
        versionData: action.payload.versionData || [],
      };
    },
    setVariables(state, action) {
      return {
        ...state,
        Variable: {
          GlobalVariable: action.payload.GlobalVariable || {},
          UserDefine: action.payload.UserDefine || {},
        },
      };
    },
    updateConfig(state, action) {
      let extra_init = {};
      if (action.payload.topo_type !== state.envType) {
        extra_init = {
          selectedData: [],
          rightCurrentSelectedData: [],
          leftCurrentSelectedData: [],
        }
      }
      return {
        ...state,
        envType: action.payload.topo_type || "by_bed",
        advanceConfig: action.payload.advance || false,
        Variable: {
          ...state.Variable,
          GlobalVariable: {
            topo_type: action.payload.topo_type || "by_bed",
            polymorphic: action.payload.polymorphic,
            timeout: action.payload.timeout || 600,
            version: action.payload.version || ["all"],
          },
        },
        ...extra_init
      };
    },
    setRightCurrentSelected(state, action) {
      return {
        ...state,
        rightCurrentSelectedData: action.payload.selectedData
      }
    },
    setLeftCurrentSelected(state, action) {
      action.callback();
      return {
        ...state,
        leftCurrentSelectedData: action.payload.selectedData
      }
    },
    setListSelected(state, action) {
      let selectedData = [];
      let leftCurrentSelectedData = state.leftCurrentSelectedData;
      let rightCurrentSelectedData = state.rightCurrentSelectedData;
      if (action.payload.operation === "add") {
        selectedData = new Set([...state.selectedData, ...action.payload.selectedData]);
        leftCurrentSelectedData = []
      } else {
        selectedData = state.selectedData.filter(x => action.payload.selectedData.indexOf(x) < 0);
        rightCurrentSelectedData = []
      }
      return {
        ...state,
        selectedData: [...selectedData],
        leftCurrentSelectedData: leftCurrentSelectedData,
        rightCurrentSelectedData: rightCurrentSelectedData
      }
    },
    setEiicoData(state, action) {
      return {
        ...state, ...action.payload
      }
    }
  },
};
export default eiicoDeviceModel;
