/*
 * @Author: your name
 * @Date: 2020-12-09 13:38:57
 * @LastEditTime: 2021-01-07 19:28:46
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \erp-tech-manage\src\views\tech-manage\weave-tech\analyse\list\api\index.js
 */
import request from '@/utils/request'

// 客样分析分页查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/techManage/sampleAnalysisResult/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 客样分析各个状态数量
export function sysDataGroupNum(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/techManage/sampleAnalysisResult/countByStatus',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 提交客样分析状态
export function statusSubmit(data) {
  return request({
    url: `/techManage/sampleAnalysisResult/submit/${data}`,
    method: 'post'
  })
}

// 审核客样分析状态
export function statusApprove(data = {}) {
  return request({
    url: `/techManage/sampleAnalysisResult/audit`,
    method: 'post',
    data: { ...data }
  })
}

// 驳回客样分析状态
export function statusReject(data = {}) {
  return request({
    url: `/techManage/sampleAnalysisResult/reject`,
    method: 'post',
    data: { ...data }
  })
}

// 客服搜索列表下拉
export function userSelet(data = {}) {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data: { ...data }
  })
}
