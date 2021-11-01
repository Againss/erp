// 仓库资料页面 API
import request from '@/utils/request'

// 分页查询列表
export function storePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/wms/warehouse/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function storeAdd(data) {
  return request({
    url: '/wms/warehouse/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function storeDetail(data) {
  return request({
    url: '/wms/warehouse/info',
    method: 'post',
    data
  })
}

// 更新
export function storeUpdate(data) {
  return request({
    url: '/wms/warehouse/modify',
    method: 'post',
    data
  })
}

// 删除
export function storeDelete(data) {
  return request({
    url: '/wms/warehouse/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function storeEnabled(data) {
  return request({
    url: '/wms/warehouse/status/modify',
    method: 'post',
    data
  })
}

// 服务供应商的类型--1：服务；0：采购
export function supplierWarehouse(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/srm/supplierType/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 根据服务商类型联动出--服务商公司名称
export function supplierName(data) {
  return request({
    url: '/srm/supplier/searchList',
    method: 'post',
    data
  })
}
