// 仓库资料页面 API
import request from '@/utils/request'

// 分页查询列表
export function shelfPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/wms/warehouseShelf/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function shelfAdd(data) {
  return request({
    url: '/wms/warehouseShelf/add',
    method: 'post',
    data
  })
}

// 删除
export function shelfDelete(data) {
  return request({
    url: '/wms/warehouseShelf/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function shelfEnabled(data) {
  return request({
    url: '/wms/warehouseShelf/status/modify',
    method: 'post',
    data
  })
}

// 仓库调用的下拉接口
export function locationWarehouse(data) {
  return request({
    url: '/wms/warehouse/list',
    method: 'post',
    data
  })
}

// 库区调用的下拉接口
export function locationArea(data) {
  return request({
    url: '/wms/warehouseArea/list',
    method: 'post',
    data
  })
}
