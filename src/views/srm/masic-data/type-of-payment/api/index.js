import request from '@/utils/request'
/* 列表 */
export const getPaymentData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/srm/payMode/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 编辑 */
export const updateTypeOfPaymentData = (params) => {
  return request({
    method: 'post',
    url: '/srm/payMode/modify',
    data: params
  })
}

/* 新增 */
export const insertTypeOfPaymentData = (params) => {
  return request({
    method: 'post',
    url: '/srm/payMode/add',
    data: params
  })
}
/* 根据id获取详情信息 */
export const getPaymentByIdData = (ids) => {
  return request({
    method: 'post',
    url: '/srm/payMode/info',
    data: {
      id: ids
    }
  })
}

/* 更新状态 */
export const disableTypeOfPaymentData = (params) => {
  return request({
    method: 'post',
    url: '/srm/payMode/operate',
    data: params
  })
}

/* 删除 */
export const deleteTypeOfPaymentData = (params) => {
  return request({
    method: 'post',
    url: '/srm/payMode/delete',
    data: params
  })
}

/* 编辑 */
export const updatePaymentData = (params) => {
  return request({
    method: 'post',
    url: '/srm/payMode/modify',
    data: params
  })
}

