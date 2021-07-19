import {
  getTopCaseTree,
  UpdateTreeNode,
  getSelectCaseNum,
  getTreeNodeDetail,
  refreshCase
} from '@/services/case';

import {runCase} from "@/services/task"

const CaseModel = {
  namespace: "caseTree",
  state: {
    caseTreeData: [],
    treeDataLoading: true,
    expandedKeys: [],
    selectedKeys: {
      keys: [],
      caseNum: {total: 0, auto: 0}
    },
    selectTreeNode: {}
  },
  effects: {
    * fetCaseData({payload }, {call, put}) {
      const resData = yield call(getTopCaseTree, payload);
      const treeData = resData.MsgInfo ? resData.MsgInfo.tree_data : [];
      const expandedKeys = resData.MsgInfo ? resData.MsgInfo.expand_keys : [];
      yield put({
        type: 'storeCaseTree', payload: {
          caseTreeData: treeData,
          treeDataLoading: false,
          expandedKeys: expandedKeys
        }
      });
    },
    * fetUpdateTreeNode({payload, treeNode, callback}, {call, put, select}) {
      const resData = yield call(UpdateTreeNode, payload);
      const caseTreeData = yield select((state) => state.caseTree.caseTreeData);
      // console.log(treeNode.props.pos, caseTreeData);
      treeNode.props.dataRef.children = resData.MsgInfo;
      // console.log(caseTreeData);
      yield put({
        type: 'updateCaseTreeNode', payload: {
          caseTreeData: caseTreeData,
          treeDataLoading: false,
        }
      });
      callback();
    },
    * fetGetSelectedCaseNum({payload}, {call, put}) {
      const selectKeys = payload.selectedKeys;
      const resData = yield call(getSelectCaseNum, {key: selectKeys});
      const caseNum = resData.MsgInfo || 0;
      yield put({
        type: 'updateSelectKeys', payload: {
          selectedKeys: {
            keys: selectKeys, caseNum: {total: caseNum.total, auto: caseNum.auto}
          }
        }
      });
    },
    * fetTreeNodeDetail({payload}, {call, put}) {
      const selectKey = payload.selectKey;
      const resData = yield call(getTreeNodeDetail, {key: selectKey});
      yield put({
        type: 'updateTreeNodeDetail', payload: {
          selectTreeNode: resData.MsgInfo || {}
        }
      });
    },
    * fetchRunCase({payload, callback}, {call, put}) {
      // const selectKey = payload.selectKey;
      const resData = yield call(runCase, {...payload});
      callback()
    },
    * fetRefreshCase({payload, callback}, {call}) {
      yield call(refreshCase, {key: payload.key});
      callback()
    },
  },
  reducers: {
    initTreeRequest(state, action) {
      return {
        ...state,
        treeDataLoading: action.payload.treeDataLoading,
      };
    },
    storeCaseTree(state, action) {
      return {
        ...state,
        caseTreeData: action.payload.caseTreeData || [],
        treeDataLoading: action.payload.treeDataLoading,
        expandedKeys: action.payload.expandedKeys || []
      };
    },
    updateCaseTreeNode(state, action) {
      return {
        ...state,
        caseTreeData: action.payload.caseTreeData || [],
      };
    },
    updateSelectKeys(state, action) {
      return {
        ...state,
        selectedKeys: action.payload.selectedKeys,
      };
    },
    updateTreeNodeDetail(state, action) {
      return {
        ...state,
        selectTreeNode: action.payload.selectTreeNode,
      };
    },
  },
};
export default CaseModel;
