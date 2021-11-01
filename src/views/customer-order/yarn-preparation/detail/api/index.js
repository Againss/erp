import request from '@/utils/request'

// 大货订单新增
export function orderAdd(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/add',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单修改
export function orderModify(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/modify',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单变更
export function orderChange(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/change',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单删除
export function orderDelete(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/delete',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单提交
export function orderSubmit(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/submit',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单撤回
export function orderWithdrawt(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/withdraw',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单取消
export function orderCancel(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/cancel',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单hold单
export function orderHold(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/hold',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单解hold
export function orderRemoveHold(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/removeHold',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单完结
export function orderFinish(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/finish',
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

// 样板详情信息
export function getDetail(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/info',
    method: 'post',
    data: { ...data }
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
    url: '/customerOrder/coYarnOrder/copyInfo',
    method: 'post',
    data: { ...data }
  })
}

// 纱线编码弹窗 测试连接
export function countryPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/coYarnOrder/materialInfoPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

