import request from '@/utils/request'

// 大货订单新增
export function orderAdd(data = {}) {
  return request({
    url: '/customerOrder/coOrder/add',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单修改
export function orderModify(data = {}) {
  return request({
    url: '/customerOrder/coOrder/modify',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单变更
export function orderChange(data = {}) {
  return request({
    url: '/customerOrder/coOrder/change',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单删除
export function orderDelete(data = {}) {
  return request({
    url: '/customerOrder/coOrder/delete',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单提交
export function orderSubmit(data = {}) {
  return request({
    url: '/customerOrder/coOrder/submit',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单审核
// export function orderAudit(data = {}) {
//   return request({
//     url: '/customerOrder/coOrder/audit',
//     method: 'post',
//     data: { ...data }
//   })
// }

// 大货订单撤回
export function orderWithdrawt(data = {}) {
  return request({
    url: '/customerOrder/coOrder/withdraw',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单取消
export function orderCancel(data = {}) {
  return request({
    url: '/customerOrder/coOrder/cancel',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单会签
export function orderCountersign(data = {}) {
  return request({
    url: '/customerOrder/coOrder/countersign',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单hold单
export function orderHold(data = {}) {
  return request({
    url: '/customerOrder/coOrder/hold',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单解hold
export function orderRemoveHold(data = {}) {
  return request({
    url: '/customerOrder/coOrder/removeHold',
    method: 'post',
    data: { ...data }
  })
}

// 大货订单完结
export function orderFinish(data = {}) {
  return request({
    url: '/customerOrder/coOrder/finish',
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
// 色号分页列表 LED
export function queryColorNoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/colorModel/colorModelApply/queryColorNoPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 样板详情信息
export function getDetail(data = {}) {
  return request({
    url: '/customerOrder/coOrder/info',
    method: 'post',
    data: { ...data }
  })
}

// 花号分页列表 印花SO
export function queryFlowerNoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/soPrint/printApply/queryFlowerNoPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 库存抽用获取备纱单
export function queryYarnPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/coOrder/queryYarnPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 库存抽用获取备坯单
export function queryGreyPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/coOrder/queryGreyPage',
    method: 'post',
    data: { ...defaultParams, ...data }
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
    url: '/customerOrder/coOrder/copyInfo',
    method: 'post',
    data: { ...data }
  })
}

// 色号检索分页-对接色号库
export function ColorCodePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/coOrder/colorCode/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 花号检索分页-对接花号库
export function FlowerCodePpage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/coOrder/flowerCode/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 检测机构下拉
export function organizationSelect(data = {}) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalOrganization/list',
    method: 'post',
    data: data
    // ,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'spathv': 'qa'
    // }

  })
}

// 品牌、成衣类型查询测试项目
export function testItemOptions(data = {}) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalBrandStandardItems/list',
    method: 'post',
    data: data
    // ,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'spathv': 'qa'
    // }

  })
}
