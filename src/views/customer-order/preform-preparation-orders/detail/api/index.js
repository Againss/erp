/**
 * @Description: 订单接口
 * @author Roman
 * @date 2021-05-06 15:20:05
 * @edit 2021-05-06 15:20:05
*/
import request from '@/utils/request'

// 订单详情
export function getDetail(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/info',
    method: 'post',
    data: { ...data }
  })
}

// 复制订单详情
export function getDetailCopy(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/copyInfo',
    method: 'post',
    data: { ...data }
  })
}
// 下载文件 新
export function downFile(data = {}) {
  return request({
    url: `/common/file/download/${data}`,
    responseType: 'arraybuffer',
    method: 'get',
    params: {}
  })
}
// 下载文件 旧
export function downFilelog(data = {}) {
  return request({
    url: '/customerOrder/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

// 色布/印花布编码分页列表
export function querycolorFabricPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/coOrder/colorPrintCode',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 数量交期单位
export function queryUnit(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/basis/openapi/unit/search',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 供应商
export function querySupplier(data = {}) {
  const defaultParams = { isEnabled: 1 }
  return request({
    url: '/srm/supplier/searchList',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 详情文件展示
export function fileListArray(data = {}) {
  const defaultParams = { 'bizType': 'ORDER' }
  return request({
    url: '/common/file/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 保存
export function fetchOrderDataAdd(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/add',
    method: 'post',
    data
  })
}

// 保存
export function fetchOrderDataModify(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/modify',
    method: 'post',
    data
  })
}

// 提交
export function fetchOrderDataSubmit(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/submit',
    method: 'post',
    data
  })
}

// 变更
export function fetchOrderDataChange(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/change',
    method: 'post',
    data
  })
}

// 删除
export function fetchOrderDataDelete(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/delete',
    method: 'post',
    data
  })
}

// 撤回
export function fetchOrderDataWithdraw(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/withdraw',
    method: 'post',
    data
  })
}

// 取消
export function fetchOrderDataCancel(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/cancel',
    method: 'post',
    data
  })
}

// 完结
export function fetchOrderDataFinish(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/finish',
    method: 'post',
    data
  })
}

// hold单
export function fetchOrderDataHold(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/hold',
    method: 'post',
    data
  })
}

// 解hold
export function fetchOrderDataRemoveHold(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/removeHold',
    method: 'post',
    data
  })
}

