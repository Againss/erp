import request from '@/utils/request'

export const list = (params = {}) => {
  // let pageNum = 1; let pageSize = 20
  // if (params.hasOwnProperty('pageNum')) {
  //   pageNum = params.pageNum
  // }
  // if (params.hasOwnProperty('pageSize')) {
  //   pageSize = params.pageSize
  // }
  return request({
    method: 'post',
    url: '/wms/materiel/virtualStock/type/page',
    // data: {
    //   ...params,
    //   pageNum,
    //   pageSize
    // }
    data: params
  })
}

export const groupPage = (params = {}) => {
  // let pageNum = 1; let pageSize = 20
  // if (params.hasOwnProperty('pageNum')) {
  //   pageNum = params.pageNum
  // }
  // if (params.hasOwnProperty('pageSize')) {
  //   pageSize = params.pageSize
  // }
  return request({
    method: 'post',
    url: '/wms/materiel/virtualStock/type/detail/groupPage',
    // data: {
    //   ...params,
    //   pageNum,
    //   pageSize
    // }
    data: params
  })
}

