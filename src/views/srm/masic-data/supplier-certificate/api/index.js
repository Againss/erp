import request from '@/utils/request'

// 分页查询数据
export function getPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/srm/supplierCertdential/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 编辑
export function editItem(data = {}) {
  return request({
    url: '/srm/supplierCertdential/modify',
    method: 'post',
    data
  })
}

// 新增
export function addItem(data = {}) {
  return request({
    url: '/srm/supplierCertdential/add',
    method: 'post',
    data
  })
}
// 删除
export function supplierCertdentialDelete(data = {}) {
  return request({
    url: '/srm/supplierCertdential/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function enabledItem(data = {}) {
  return request({
    url: '/srm/supplierCertdential/enabled',
    method: 'post',
    data
  })
}
