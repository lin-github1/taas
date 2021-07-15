import appRequestInstance from "@/utils/app";

export function getNextRunTime(data) {
  return appRequestInstance.get('/status/get_cron_expression_next_run_time/', {params: data})
}
