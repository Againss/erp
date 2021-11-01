import request from '@/utils/request'

// 分页查询数据
export function getPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/srm/equipmentBrand/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 编辑
export function editItem(data = {}) {
  return request({
    url: '/srm/equipmentBrand/modify',
    method: 'post',
    data
  })
}

// 新增
export function addItem(data = {}) {
  return request({
    url: '/srm/equipmentBrand/add',
    method: 'post',
    data
  })
}
// 删除
export function equipmentBrandDelete(data = {}) {
  return request({
    url: '/srm/equipmentBrand/delete',
    method: 'post',
    data
  })
}
// 启用禁用
export function enabledItem(data = {}) {
  return request({
    url: '/srm/equipmentBrand/enabled',
    method: 'post',
    data
  })
}
