import request from '@/utils/request'
// 纱检试纱报告详情查询
export function checkDetail(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionPhysicalTesting/info',
    method: 'post',
    data: { ...data }
  })
}
// 纱支-通用基础数据-产品-纱属性-短纤-纱支
export function getSelectData(data = {}) {
  return request({
    url: 'basis/openapi/yarnType/search',
    method: 'post',
    data: { ...data }
  })
}
