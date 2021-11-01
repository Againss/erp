import request from '@/utils/request'

// 补布单新增
export function orderAdd(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/add',
    method: 'post',
    data: { ...data }
  })
}

// 补布单修改
export function orderModify(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/modify',
    method: 'post',
    data: { ...data }
  })
}

// 补布单变更
export function orderChange(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/change',
    method: 'post',
    data: { ...data }
  })
}

// 补布单删除
export function orderDelete(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/delete',
    method: 'post',
    data: { ...data }
  })
}

// 补布单提交
export function orderSubmit(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/submit',
    method: 'post',
    data: { ...data }
  })
}

// 补布单审核
// export function orderAudit(data = {}) {
//   return request({
//     url: '/customerOrder/reissueOrder/audit',
//     method: 'post',
//     data: { ...data }
//   })
// }

// 补布单撤回
export function orderWithdrawt(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/withdraw',
    method: 'post',
    data: { ...data }
  })
}

// 补布单取消
export function orderCancel(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/cancel',
    method: 'post',
    data: { ...data }
  })
}

// 补布单会签
export function orderCountersign(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/countersign',
    method: 'post',
    data: { ...data }
  })
}

// 补布单hold单
export function orderHold(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/hold',
    method: 'post',
    data: { ...data }
  })
}

// 补布单解hold
export function orderRemoveHold(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/removeHold',
    method: 'post',
    data: { ...data }
  })
}

// 补布单完结
export function orderFinish(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/finish',
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
// 色号分页列表
export function queryColorNoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/colorModel/colorModelApply/queryColorNoPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 详情信息
export function getDetail(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/info',
    method: 'post',
    data: { ...data }
  })
}
// 大货单详情
export function getGoodsDetail(data = {}) {
  return request({
    url: '/customerOrder/coOrder/info',
    method: 'post',
    data: { ...data }
  })
}

// 花号分页列表
export function queryFlowerNoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/soPrint/printApply/queryFlowerNoPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 色布/印花布编码分页列表
export function querycolorFabricPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/reissueOrder/colorPrintCode',
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

// 获取分析单详情
export function techgetDetail(data) {
  const statuIndex = { 'status': '4' }
  return request({
    url: 'techManage/sampleAnalysisResult/info',
    method: 'post',
    data: { ...data, ...statuIndex }
  })
}
// 需求列表详情
export function guestneedDetail(data = {}) {
  return request({
    url: '/customerOrder/customerRequire/detail',
    method: 'post',
    data: { ...data }
  })
}

// 样板复制请求接口
export function gueCopyInfo(data = {}) {
  return request({
    url: '/customerOrder/reissueOrder/copyInfo',
    method: 'post',
    data: { ...data }
  })
}
export function getCoOrderList(data = {}) {
  return request({
    url: '/customerOrder/coOrder/process/list',
    method: 'post',
    data: { ...data }
  })
}
