import request from '@/utils/request'
// 分页查询坯布列表
export function yarnTestPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/qa/qaYarnInspectionPhysicalTesting/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
