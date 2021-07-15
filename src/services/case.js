import appRequestInstance from "@/utils/app";

export function getTopCaseTree(data) {
  return appRequestInstance.get('/case/public/get_top_tree/', {params:data})
}

export function UpdateTreeNode(data) {
  return appRequestInstance.get('/case/public/get_tree_node_data/', {params:data})
}


export function getSelectCaseNum(data) {
  return appRequestInstance.get('/case/public/get_case_num/', {params:data})
}

export function getTreeNodeDetail(data) {
  return appRequestInstance.get('/case/public/get_tree_node_detail/', {params:data})
}

export function refreshCase(data) {
  return appRequestInstance.post('/case/public/refresh_case/', {data: data})
}
// export function stopTask(data) {
//   return appRequestInstance.post('/runner/task/stop_task/', {data:data})
// }

export function getScopeList(data) {
  return appRequestInstance.get('/case/public/get_case_scope_list/', {params: data})
}
