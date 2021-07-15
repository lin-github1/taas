import appRequestInstance from "@/utils/app";

export function getGeneralTaskList(data) {
  return appRequestInstance.post('/baipai/get_generaltask_result/', {data: data})
}

export function editCaseResult(data) {
  return appRequestInstance.post('/baipai/edit_case_result/', {data: data})
}//编辑用例结果

export function getJobContainerList(data) {
  return appRequestInstance.get('/baipai/get_task_result_num/', {params: data})
}

export function getTestCaseList(data) {
  return appRequestInstance.post('/baipai/get_case_result/', {data: data})
}

export function saveJob(data) {
  return appRequestInstance.post('/baipai/create_all_task/', {data: data})
}

export function saveJobV2(data) {
  return appRequestInstance.post('/baipai/create_all_taskV2/', {data: data})
}

export function run_mctc_task(data){
  return appRequestInstance.post('/baipai/run_mctc_task/',{data:data})
}

export function downDocex(data) {
  return appRequestInstance.post('/baipai/downDocex/', {data: data})
}
export function getJobContainerDetail(data) {
  return appRequestInstance.get('/runner/job/job_detail/', {params: data})
}

export function startToRun(data) {
  return appRequestInstance.post('/runner/job/start_to_run/', {data: data})
}

export function deleteJob(data) {
  return appRequestInstance.post('/runner/job/delete_job/', {data: data})
}

export function runCase(data) {
  return appRequestInstance.post('/runner/case/run_case/', {data: data})
}

export function getNextRunTime(data) {
  return appRequestInstance.get('/runner/job/get_job_next_runtime/', {params: data})
}

export function cancelCron(data) {
  return appRequestInstance.post('/runner/job/delete_cron/', {data: data})
}
