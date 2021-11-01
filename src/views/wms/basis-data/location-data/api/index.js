// 库位资料API
import request from '@/utils/request'

// 分页查询列表
export function locationPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/wms/warehouseLocation/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function locationAdd(data) {
  return request({
    url: '/wms/warehouseLocation/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function locationDetail(data) {
  return request({
    url: '/wms/warehouseLocation/info',
    method: 'post',
    data
  })
}

// 删除
export function locationDelete(data) {
  return request({
    url: '/wms/warehouseLocation/delete',
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

// 货架调用的下拉接口
export function locationShelf(data) {
  return request({
    url: '/wms/warehouseShelf/list',
    method: 'post',
    data
  })
}

// 启用禁用
export function locationEnabled(data) {
  return request({
    url: '/wms/warehouseLocation/status/modify',
    method: 'post',
    data
  })
}
