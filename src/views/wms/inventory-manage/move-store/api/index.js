// 移库管理页面 API
import request from '@/utils/request'

// 分页查询列表
export function movePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/wms/moveStock/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function moveAdd(data) {
  return request({
    url: '/wms/moveStock/add',
    method: 'post',
    data
  })
}

// 编辑--详情（不分页）
export function copyDetail(data) {
  return request({
    url: '/wms/moveStock/info',
    method: 'post',
    data
  })
}

// 点击详情出现--分页
export function detailList(data) {
  // const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/wms/moveStock/info',
    method: 'post',
    data
  })
}

// 编辑
export function moveUpdate(data) {
  return request({
    url: '/wms/moveStock/modify',
    method: 'post',
    data
  })
}

// 审核
export function moveAudit(data) {
  return request({
    url: '/wms/moveStock/audit',
    method: 'post',
    data
  })
}

// 删除
export function moveDelete(data) {
  return request({
    url: '/wms/moveStock/delete',
    method: 'post',
    data
  })
}

// 批量完成移库
export function batchGet(data) {
  return request({
    url: '/wms/moveStock//status/modify',
    method: 'post',
    data
  })
}

// 仓库调用的下拉接口
export function storeWarehouse(data) {
  return request({
    url: '/wms/warehouse/list',
    method: 'post',
    data
  })
}

// 新增页面--库位的下拉
export function locationSelect(data) {
  return request({
    url: '/wms/warehouseLocation/list',
    method: 'post',
    data
  })
}

// 新增移库列表的接口--搜索的
export function moveDetails(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/wms/stock/manage/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 移库单列表-单数统计
export function count(data = {}) {
  return request({
    url: '/wms/moveStock/count',
    method: 'post',
    data: data
  })
}
