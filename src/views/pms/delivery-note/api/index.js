// 送货单api内容
import request from '@/utils/request'

// 分页查询列表
export function deliveryNotePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/pms/deliveryNote/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 数量统计
export function deliveryNoteCount(data) {
  return request({
    url: '/pms/deliveryNote/count',
    method: 'post',
    data
  })
}

// 送货单详情页面--基本信息
export function deliveryNoteDetail(data) {
  return request({
    url: '/pms/deliveryNote/info/' + data,
    method: 'post'
  })
}

// 明细分页
export function detailList(data) {
  console.log('detailList', data)
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/pms/deliveryNote/detail/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 生成送货单
export function deliveryNoteAdd(data) {
  return request({
    url: '/pms/deliveryNote/add',
    method: 'post',
    data
  })
}

// 下载
export function deliveryNoteDownload(data) {
  return request({
    url: '/pms/deliveryNote/pdfDownload/' + data,
    method: 'post',
    responseType: 'arraybuffer'
  })
}

// 仓库名称--全量查询
export function storePage(data = {}) {
  return request({
    url: '/wms/warehouse/list',
    method: 'post',
    data
  })
}
