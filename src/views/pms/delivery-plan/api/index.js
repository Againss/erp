/*
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-05-13 14:52:42
 * @LastEditors: admin
 * @LastEditTime: 2021-05-26 16:35:58
 */
// 送货计划api内容
import request from '@/utils/request'

// 分页查询列表
export function planPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/pms/deliveryPlan/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 数量统计
export function planCount(data) {
  return request({
    url: '/pms/deliveryPlan/count',
    method: 'post',
    data
  })
}

// 编辑
export function planUpdate(data) {
  return request({
    url: '/pms/deliveryPlan/modify',
    method: 'post',
    data
  })
}

// 批量新增
export function planAdd(data) {
  return request({
    url: '/pms/deliveryPlan/batchAdd',
    method: 'post',
    data
  })
}

// 删除
export function planDelete(data) {
  return request({
    url: '/pms/deliveryPlan/delete/' + data.id,
    method: 'post'
  })
}

// 编辑--详情
export function planDetail(data) {
  return request({
    url: '/pms/deliveryPlan/info/' + data.id,
    method: 'post'
  })
}
// 是否可以编辑
export function planCheckModify(data) {
  return request({
    url: '/pms/deliveryPlan/checkModify/' + data.id,
    method: 'post'
  })
}
// 弹窗使用采购汇总的数据
export function dialogPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 2000000 }
  return request({
    url: '/pms/purchaseOrder/bill/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
