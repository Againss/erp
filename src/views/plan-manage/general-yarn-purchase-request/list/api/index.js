import request from '@/utils/request'

// 常规纱采购分页查询
export function purchaseGeneralYarnPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/aps/purchaseGeneralYarn/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
