import appRequestInstance from "@/utils/app";

export function getTestBedList(data) {
  return appRequestInstance.post('/baipai/get_test_bed_content/', {data: data})
}

export function getDeviceListByBed(data) {
  return appRequestInstance.get('/baipai/get_device_by_bed_content/', {params: data})
}

export function getVariables() {
  return appRequestInstance.get('/topo/public/get_common_variables/')
}

export function getVersionList(data) {
  return appRequestInstance.get('/baipai/get_version_list_content/', {params: data})
}

export function getComboList(data) {
  return appRequestInstance.get('/topo/public/get_combo_list/', {params: data})
}

export function getSoftWarePkg() {
  return appRequestInstance.get('/topo/public/get_software_pkg_list/')
}

