/*
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-05-17 16:37:12
 * @LastEditors: admin
 * @LastEditTime: 2021-05-31 10:10:47
 */
// 合同管理api内容
import request from '@/utils/request'

// 分页查询列表
export function contractNotePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/pms/contract/pageList',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 数量统计
export function contractNoteCount(data) {
  return request({
    url: '/pms/contract/count',
    method: 'post',
    data
  })
}
// 下载合同
export function downFile(data = {}) {
  return request({
    url: `/common/file/download/${data.id}`,
    responseType: 'arraybuffer',
    method: 'get',
    params: {}
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

