import appRequestInstance from "@/utils/app";

export function saveCaseSetConfig(data) {
  return appRequestInstance.post('/case/set/save/', {data:data})
}

export function getCaseSetConfig(data) {
  return appRequestInstance.get('/case/set/case_set_detail/', {params:data})
}

export function getScope(data) {
  return appRequestInstance.get('/case/set/get_case_scope/', {params:data})
}

export function deleteSet(data) {
  return appRequestInstance.post('/case/set/delete/', {data:data})
}

export function getFixtureList(data) {
  return appRequestInstance.get('/case/set/get_case_fixture/', {params:data})
}

export function getCaseSetList(data) {
  return appRequestInstance.post('/case/set/case_set_list/', {data:data})
}

export function getCaseCollection() {
  return appRequestInstance.get('/case/set/get_case_collection_for_select/')
}

export function validateScope(data) {
  return appRequestInstance.post('/case/set/validate_case_scope/', {data:data})
}

export function updateCaseCount(data) {
  return appRequestInstance.post('/case/set/update_case_count/', {data:data})
}

export function scopeDisplay(data) {
  return appRequestInstance.post('/case/set/get_scope_display/', {data:data})
}
