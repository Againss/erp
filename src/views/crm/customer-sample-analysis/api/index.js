import request from '@/utils/request'

// 客样分析分页查询
export function sampleAnalysisPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/sample/analysis/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 客样分析列表
export function sampleAnalysisList(data) {
  return request({
    url: '/crm/sample/analysis/list',
    method: 'post',
    data
  })
}

// 客样分析详情
export function sampleAnalysisInfo(data) {
  return request({
    url: '/crm/sample/analysis/info',
    method: 'post',
    data
  })
}

// 客样分析新增
export function sampleAnalysisAdd(data) {
  return request({
    url: '/crm/sample/analysis/add',
    method: 'post',
    data
  })
}

// 客样分析删除
export function sampleAnalysisDelete(data) {
  return request({
    url: '/crm/sample/analysis/delete',
    method: 'post',
    data
  })
}

// 客样分析修改
export function sampleAnalysisModify(data) {
  return request({
    url: '/crm/sample/analysis/modify',
    method: 'post',
    data
  })
}

// 客样分析更改所有人
export function sampleAnalysisModifyFollower(data) {
  return request({
    url: '/crm/sample/analysis/modify/follower',
    method: 'post',
    data
  })
}

// 客样分析状态变更
export function sampleAnalysisModifyStatus(data) {
  return request({
    url: '/crm/sample/analysis/modify/status',
    method: 'post',
    data
  })
}

// 客样分析查看工艺分析单
export function sampleAnalysisReport(data) {
  return request({
    url: '/crm/pdf/generator/sample/analysis/report',
    method: 'get',
    params: data
  })
}

