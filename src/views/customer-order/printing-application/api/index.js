/*
 * @Author: xj
 * @Description: 印花SO申请列表
 * @Date: 2020-12-10 16:35:31
 * @LastEditors: OBKoro1
 * @LastEditTime: 2020-12-16 11:42:08
 */
import request from '@/utils/request'
// 列表
export function pageList(data = {}) {
  const defaultParams = { pageSize: 20, pageNum: 1 }
  return request({
    url: '/customerOrder/soPrint/printApply/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 列表完结
export function sysDataGroupApprove(data) {
  return request({
    url: '/customerOrder/soPrint/printApply/finish',
    method: 'post',
    data
  })
}
// 取消生产
export function sysCancelData(data) {
  return request({
    url: '/customerOrder/soPrint/printApply/cancel',
    method: 'post',
    data
  })
}
// 打印预览
export function sysCancelPrint(data) {
  return request({
    url: '/customerOrder/soPrint/printApply/print',
    method: 'post',
    data
  })
}
