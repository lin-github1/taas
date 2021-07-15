import appRequestInstance from "@/utils/app";

export function getRecordList(data) {
  return appRequestInstance.post('/runner/record/record_list/', {data: data})
}

export function deleteRecord(data) {
  return appRequestInstance.post('/runner/record/delete_record/', {data: data})
}

export function stopRecord(data) {
  return appRequestInstance.post('/runner/record/stop_record/', {data: data})
}

export function runCase(data) {
  return appRequestInstance.post('/runner/case/run_case/', {data: data})
}

export function recordDetail(data) {
  return appRequestInstance.get('/runner/record/record_detail/', {params: data})
}

export function caseDetail(data) {
  return appRequestInstance.get('/runner/record/execute_case_detail/', {params: data})
}

export function getExeCaseList(data) {
  return appRequestInstance.post('/runner/record/get_ecr_list/', {data: data})
}

export function getRecordLogStr(data) {
  return appRequestInstance.get('/runner/record/get_task_console/', {params: data})
}
