import request from '@/utils/request'
/* 列表 */
export const getRatingData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/srm/rankAssess/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 新增 */
export const insertRatingData = (params) => {
  return request({
    method: 'post',
    url: '/srm/rankAssess/add',
    data: params
  })
}
/* 编辑 */
export const updateRatingData = (params) => {
  return request({
    method: 'post',
    url: '/srm/rankAssess/modify',
    data: params
  })
}
/* 根据id获取详情 */
export const getRatingInfoByIdData = (params) => {
  return request({
    method: 'post',
    url: '/srm/rankAssess/info',
    data: params
  })
}
/* 删除 */
export const deleteRatingData = (params) => {
  return request({
    method: 'post',
    url: '/srm/rankAssess/delete',
    data: params
  })
}

/* 更新状态 */
export const disableRatingData = (params) => {
  return request({
    method: 'post',
    url: '/srm/rankAssess/operate',
    data: params
  })
}

