import request from '@/utils/request'

export const pickGetPage = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/out/pick/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

export const pickGetDetailBase = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/pick/info',
    data: params
  })
}

export const pickGetDetailPageNo = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/out/pick/product/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

export const pickGetDetailPage = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/out/pick/product/detail/sum/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

export const pickConfirm = (params = {}) => {
  return request({
    method: 'post',
    // url: '/wms/out/pick/add',
    url: '/wms/out/pick/confirm',
    data: params
  })
}

// 拣货确认-拣货明细 --与预出库一致
export const pickConfirmGetDetailPage = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/out/reservation/product/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}
// 拣货员 /sysUser/list
export const sysUserList = (params = {}) => {
  return request({
    method: 'post',
    url: '/userCenter/sysUser/list',
    data: params
  })
}
// 确认拣货库存
export const stockManage = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/stock/manage/page',
    data: params
  })
}
// 拆件明细
export const splitDetail = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/pick/product/detail/disjoin',
    data: params
  })
}

export const addMateriel = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/pick/addMateriel',
    data: params
  })
}

export const getPickedPage = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/pick/product/detail/page',
    data: params
  })
}

export const deleteMateriel = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/pick/deleteMateriel',
    data: params
  })
}

export const splitMateriel = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/pick/splitMateriel',
    data: params
  })
}

export const count = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/pick/count',
    data: params
  })
}
