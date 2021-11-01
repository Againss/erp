/*
 * @Author: ll
 * @Date: 2021-01-12 11:17:45
 * @LastEditTime: 2021-01-12 11:21:41
 * @LastEditors: ll
 * @Description: 色板申请详情api
 */
import request from '@/utils/request'
// 列表
export function pageList(data = {}) {
  const defaultParams = { pageSize: 20, pageNum: 1 }
  return request({
    url: '/customerOrder/colorModel/colorModelApply/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 打印预览
export function pagePrint(data) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/info',
    method: 'post',
    data
  })
}

// 完结
export function getFinish(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/finish',
    method: 'post',
    data: { ...data }
  })
}
// 取消生产
export function getCancel(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/cancel',
    method: 'post',
    data: { ...data }
  })
}

