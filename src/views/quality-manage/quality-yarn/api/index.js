import request from '@/utils/request'

// 纱线物测-分页列表
export function qaYarnInspectionPhysicalPage(data = {}) {
  return request({
    // url: '/mock/221/qaYarnInspectionPhysical/page',
    url: '/qa/qaYarnInspectionPhysical/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 纱线检测-每个分组对应的数量
export function allCountsGroupByStatus(data = {}) {
  return request({
    // url: '/mock/221/qaYarnInspectionPhysical/AllCountsGroupByStatus',
    url: '/qa/qaYarnInspectionPhysical/AllCountsGroupByStatus',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
