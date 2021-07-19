import React, {useState} from 'react';
import {useRequest} from '@umijs/hooks';
import {getTopCaseTree, UpdateTreeNode} from "@/services/case"
import {Tree, TreeSelect} from "antd";
import {updateTreeData} from "@/utils";


const TreeSelectFolder = ({value, onChange, placeholder}) => {
  const [treeData, SetTreeData] = useState([]);
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
      // const showTitle = node_data.name;
      // const titleCom = node_data.is_leaf ? <span title={node_data.name}>{showTitle}</span> : node_data.name;
      // const canbeTest = node_data.can_run;
      // const canbeCheck = node_data.is_leaf ? canbeTest : true;
      return <Tree.TreeNode
        key={node_data.key} title={node_data.name}
        // disableCheckbox={!canbeCheck}
        isLeaf={node_data.is_leaf}
        dataRef={node_data}
        value={node_data.key}
      >
        {node_data.children && renderTreeNode(node_data.children)}
      </Tree.TreeNode>
    })
  };
  const onSelect = (value, node, extra)=>{
    // console.log(value, node, extra)
  };
  return (
    <TreeSelect
      // name={name}
      // onCheck={checkCallback}
      // switcherIcon={<FolderOpenOutlined />}
      // onSelect={key => detailRequest.run({key: key})}
      // onSelect={onSelect}
      allowClear
      multiple={"tag"}
      // value={selectKeys}
      onSelect={onSelect}
      treeCheckable
      onChange={onChange}
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
      placeholder={placeholder}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      loadData={({key}) => treeDataRequest.run({key: key, mode: "folder"})}
      // checkable
      // showLine
      // defaultExpandAll={true}
    >
      {renderTreeNode(treeData)}
    </TreeSelect>
  )
};

export default TreeSelectFolder
