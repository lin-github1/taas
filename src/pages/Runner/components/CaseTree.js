import React, {useState} from 'react';
import {useRequest, useLocalStorageState} from '@umijs/hooks';
import {getTopCaseTree, UpdateTreeNode} from "@/services/case"
import {Tree} from "antd";

import "./CaseTree.less"
import {updateTreeData} from "@/utils";


const CaseSelectTree = (props) => {
  const {detailRequest, checkCallback} = props;
  const [treeData, SetTreeData] = useState([]);
  const [extendKeys, setExtendKeys] = useLocalStorageState('AMT-USER-CaseExtend', []);
  useRequest(getTopCaseTree, {
    onSuccess: (data, params) => {
      SetTreeData(data.MsgInfo ? data.MsgInfo.tree_data : [])
    }
  });
  const treeDataRequest = useRequest(UpdateTreeNode, {
    manual: true,
    onSuccess: (data, params) => {
      SetTreeData(origin => updateTreeData(origin, params[0].key, data.MsgInfo ? data.MsgInfo : []))
    }
  });
  const renderTreeNode = (data) => {
    return data.map(node_data => {
      const showTitle = node_data.name.length > 10 ? node_data.name.substring(0, 10) + "..." : node_data.name;
      const titleCom = node_data.is_leaf ? <span title={node_data.name}>{showTitle}</span> : node_data.name;
      const canbeTest = node_data.can_run;
      const canbeCheck = node_data.is_leaf ? canbeTest : true;
      return <Tree.TreeNode
        key={node_data.key} title={titleCom}
        disableCheckbox={!canbeCheck}
        isLeaf={node_data.is_leaf}
        dataRef={node_data}
      >
        {node_data.children && renderTreeNode(node_data.children)}
      </Tree.TreeNode>
    })
  };
  const onExpand = (expandedKeys, {expanded, node})=>{
    setExtendKeys(expandedKeys);
  };

  return (
    <Tree
      onCheck={checkCallback}
      onSelect={key => detailRequest.run({key: key})}
      loadData={({key}) => treeDataRequest.run({key: key})}
      checkable
      showLine
      onExpand={onExpand}
      expandedKeys={extendKeys.concat()}
    >
      {renderTreeNode(treeData)}
    </Tree>
  )
};

export default CaseSelectTree
