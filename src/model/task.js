import {deleteTask, getTaskList, stopTask, taskDetail} from '@/services/task';
import {caseDetail, recordDetail} from "@/services/record"
import moment from "moment";
const createTimeEndValue = moment();
const createTimeStartValue = moment().subtract(1, 'months');


const taskModel = {
  namespace: "task",
  state: {
    activeTabKey: "own",
    taskDataList: [],
    itemListLoading: true,
    taskTotal: 0,
    taskPageSize: 8,
    taskDefaultCurrent: 1,
    taskCurrentPage: 1,
    timeCondition:[createTimeStartValue, createTimeEndValue],
    taskDetailInfo: {
      loadingData: true,
      taskInfo: {},
      executeResult: [],
      CaseResultList: []
    }
  },
  effects: {
    * fetTaskList({payload}, {call, put}) {
      const resData = yield call(getTaskList, payload);
      const tableData = resData.MsgInfo ? resData.MsgInfo.items : [];
      const dataTotal = resData.MsgInfo ? resData.MsgInfo.total : 0;
      const pageNo = resData.MsgInfo ? resData.MsgInfo.page_current : 1;
      const sizes = resData.MsgInfo ? resData.MsgInfo.page_size : 8;
      yield put({
        type: 'storeTaskList', payload: {
          taskList: tableData,
          taskTotal: dataTotal,
          loadingData: false,
          itemListLoading: false,
          taskCurrentPage: pageNo,
          taskPageSize: sizes
        }
      });
    },
    * fetDeleteTask({payload, callback}, {call, put}) {
      const resData = yield call(deleteTask, payload);
      callback(resData)
    },
    * fetStopTask({payload, callback}, {call, put}) {
      const resData = yield call(stopTask, payload);
      callback(resData)
    },
    * getTaskDetail({payload, callback}, {call, put}) {
      const resData = yield call(recordDetail, payload);
      yield put({
        type: 'updateState', payload: {
          taskDetailInfo: {
            loadingData: false,
            taskInfo: resData.MsgInfo.task_info,
            executeResult: resData.MsgInfo.general_result,
            CaseResultList: resData.MsgInfo.run_case,
          }
        }
      });
      callback(resData)
    },
    * getCaseDetail({payload, callback}, {call, put}) {
      const resData = yield call(caseDetail, payload);
      callback(resData.MsgInfo)
    }
  },
  reducers: {
    initTaskRequest(state, action) {
      return {
        ...state,
        itemListLoading: action.payload.itemListLoading,
      };
    },
    storeTaskList(state, action) {
      return {
        ...state,
        taskDataList: action.payload.taskList || {},
        taskTotal: action.payload.taskTotal,
        loadingData: action.payload.loadingData,
        itemListLoading: action.payload.itemListLoading,
        taskCurrentPage: action.payload.taskCurrentPage,
        taskPageSize: action.payload.taskPageSize
      };
    },
    updateState(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
export default taskModel;
