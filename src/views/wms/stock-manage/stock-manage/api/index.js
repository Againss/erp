// 移库管理页面 API
import request from '@/utils/request'

// 分页查询列表
export function stockPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/wms/materiel/stock/warehouse/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 详情分页查询的列表
export function detailsPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/wms/stock/manage/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 销售组织的下拉
export function sellTeamselet(data = {}) {
  return request({
    url: '/crm/sysOrg/list',
    method: 'post',
    data: { ...data }
  })
}

// 库位的下拉
export function locationSelect(data) {
  return request({
    url: '/wms/warehouseLocation/list',
    method: 'post',
    data
  })
}

// 库位锁定
export function lock(data) {
  return request({
    url: '/wms/stock/manage/lock',
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

export function stockList(data) {
  return request({
    url: '/wms/stock/manage/list',
    method: 'post',
    data
  })
}
