import appRequestInstance from "@/utils/app";

export function getTaskList(data) {
  return appRequestInstance.post('/runner/task/task_list/', {data: data})
}

export function deleteTask(data) {
  return appRequestInstance.post('/runner/task/delete_task/', {data: data})
}

export function stopTask(data) {
  return appRequestInstance.post('/runner/task/stop_task/', {data: data})
}

export function saveTask(data) {
  return appRequestInstance.post('/runner/task/save_task/', {data: data})
}

export function runCase(data) {
  return appRequestInstance.post('/runner/case/run_case/', {data: data})
}

export function taskDetail(data) {
  return appRequestInstance.get('/runner/task/task_detail/', {params: data})
}

export function caseDetail(data) {
  return appRequestInstance.get('/runner/task/execute_case_detail/', {params: data})
}
