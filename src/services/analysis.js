import appRequestInstance from "@/utils/app";

export function getAnalysisList(data) {
  return appRequestInstance.post('/ana/record/record_list_by_task/', {data: data})
}

export function saveAnalysisResult(data) {
  return appRequestInstance.post('/ana/record/save_ana_result/', {data: data})
}
