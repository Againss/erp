import request from '@/utils/request'
/* 获取供应商列表 */
export const getTypeSupplierData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum || 1
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize || 20
  }
  return request({
    method: 'post',
    url: '/srm/supplierType/page?r=' + Math.random(),
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 删除 */
export const deleteTypeSupplierData = (data) => {
  return request({
    method: 'post',
    url: '/srm/supplierType/delete',
    data
  })
}
/* 编辑查看 */
export const getDetailsByIdData = (ids) => {
  return request({
    method: 'post',
    url: '/srm/supplierType/info',
    data: {
      id: ids
    }
  })
}

/* 禁用 */
export const disableTypeSupplierData = (data) => {
  return request({
    method: 'post',
    url: '/srm/supplierType/operate',
    data
  })
}
/* 编辑 */
export const updateTypeSupplierData = (data) => {
  return request({
    method: 'post',
    url: '/srm/supplierType/modify',
    data
  })
}
/* 新增 */
export const insertTypeSupplierData = (data) => {
  return request({
    method: 'post',
    url: '/srm/supplierType/add',
    data: data
  })
}
