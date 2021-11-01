import request from '@/utils/request'

// 物料计划分页查询列表
export function orderMaterielPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: '/aps/materielPlanProcess/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 物料计划确认操作
// export function materielPlanConfirm(data = {}) {
//   return request({
//     url: '/aps/materielPlan/confirm',
//     method: 'post',
//     data
//   })
// }
