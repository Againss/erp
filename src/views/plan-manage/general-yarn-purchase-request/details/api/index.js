import request from '@/utils/request'

// 常规纱采购分页查询
// export function grayYarnPage(data = {}) {
//   const defaultParams = { pageNum: 1, pageSize: 20 }
//   return request({
//     url: '/aps/grayYarn/page',
//     method: 'post',
//     data: { ...defaultParams, ...data }
//   })
// }

// 常规纱采购详情查询
export function purchaseGeneralYarnInfo(data = {}) {
  return request({
    url: '/aps/purchaseGeneralYarn/info',
    method: 'post',
    data: data
  })
}

