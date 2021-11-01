/*
 * @Descripttion:
 * @version:
 * @Author: shujing
 * @Date: 2020-11-18 09:29:25
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-01-09 14:49:36
 */
import request from '@/utils/request'

// 列表
export function pageList(data = {}) {
  return request({
    url: '/customerOrder/sampleAnalysisApply/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 列表状态数量
export function ListNum(data = {}) {
  return request({
    url: '/customerOrder/sampleAnalysisApply/statusNum',
    method: 'post',
    data: { ...data }
  })
}
// 列表提交,取消
export function commitCancelApi(data = {}) {
  return request({
    url: '/mock/125/sampleAnalysisApply/changeStatus',
    method: 'post',
    data: { ...data }
  })
}
// 详情
export function applyDetail(data = {}) {
  return request({
    url: '/customerOrder/sampleAnalysisApply/info',
    method: 'post',
    data: { ...data }
  })
}
// 详情添加
export function addSave(data = {}) {
  return request({
    url: '/customerOrder/sampleAnalysisApply/add',
    method: 'post',
    data: { ...data }
  })
}
// 详情修改
export function modifySave(data = {}) {
  return request({
    url: '/customerOrder/sampleAnalysisApply/modify',
    method: 'post',
    data: { ...data }
  })
}
// 提交
export function guestapplyCommit(data = {}) {
  return request({
    url: '/customerOrder/sampleAnalysisApply/submit',
    method: 'post',
    data: { ...data }
  })
}
// 删除
export function guestapplyDelete(data = {}) {
  return request({
    url: '/customerOrder/sampleAnalysisApply/delete',
    method: 'post',
    data: { ...data }
  })
}
// 取消
export function guestapplyCancel(data = {}) {
  return request({
    url: '/customerOrder/sampleAnalysisApply/cancel',
    method: 'post',
    data: { ...data }
  })
}
// 客服，销售员下拉
export function userSelet(data = {}) {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data: { ...data }
  })
}
// 销售团队下拉
export function sellTeamselet(data = {}) {
  return request({
    url: '/crm/sysOrg/list',
    method: 'post',
    data: { ...data }
  })
}
// 品牌商下拉
export function brandSelet(data = {}) {
  return request({
    url: '/crm/brand/list',
    method: 'post',
    data: { ...data }
  })
}
// 销售年份下拉
export function yearSelet(data = {}) {
  return request({
    url: '/customerOrder/sampleAnalysisApply/year',
    method: 'post',
    data: { ...data }
  })
}
// 下载文件
export function downFile(data = {}) {
  return request({
    url: '/customerOrder/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
// 下载文件
export function jumpcrmAnalysis(data = {}) {
  return request({
    url: '/crm/pdf/generator/sample/analysis/report',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
// 获取分析单详情
export function getDetail(data) {
  return request({
    url: 'techManage/sampleAnalysisResult/info',
    method: 'post',
    data
  })
}
