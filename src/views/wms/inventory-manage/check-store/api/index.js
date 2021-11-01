// 盘点管理页面 API
import request from '@/utils/request'

// 分页查询列表
export function checkPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/wms/checkPlan/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function checkAdd(data) {
  return request({
    url: '/wms/checkPlan/add',
    method: 'post',
    data
  })
}

// 新增盘点明细的接口
export function addDetails(data) {
  const defaultParams = { pageNum: 1, pageSize: 20000000 }
  return request({
    url: '/wms/materiel/stock/location/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 编辑--上面的详情（盘点计划0、盘盈1、盘亏2）
export function checkDetail(data) {
  return request({
    url: '/wms/checkPlan/info',
    method: 'post',
    data
  })
}

// 编辑--下面表的详情--要分页
export function downDetail(data) {
  const defaultParams = { pageNum: 1, pageSize: 20000000 }
  return request({
    url: '/wms/checkPlan/detail/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 确认页面下面的表--不要分页
export function makeDetail(data) {
  return request({
    url: '/wms/checkPlan/detail/page',
    method: 'post',
    data
  })
}

// 编辑--保存
export function checkUpdate(data) {
  return request({
    url: '/wms/checkPlan/modify',
    method: 'post',
    data
  })
}

// 删除
export function checkDelete(data) {
  return request({
    url: '/wms/checkPlan/delete',
    method: 'post',
    data
  })
}

// 审核
export function checkApprove(data) {
  return request({
    url: '/wms/checkPlan/status/modify',
    method: 'post',
    data
  })
}

// 盘点确认、复盘
export function makeCheck(data) {
  return request({
    url: '/wms/checkPlan/confirm',
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

// 库区下拉的接口
export function locationArea(data) {
  return request({
    url: '/wms/warehouseArea/list',
    method: 'post',
    data
  })
}

// 库位下拉的接口
export function locationSelect(data) {
  return request({
    url: '/wms/warehouseLocation/list',
    method: 'post',
    data
  })
}

// 盘点负责人调用的下拉接口--暂时先用用户中心的所有人员的下拉
export function peopleList(data) {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data
  })
}
