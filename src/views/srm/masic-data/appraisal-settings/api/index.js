// 考核设置页面 API
import request from '@/utils/request'

// 这是考核比重的api--1
// 分页查询列表
export function weightPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/srm/assessSpecific/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

/* 根据id获取详情 */
export function weightDetail(params) {
  console.log('详情', params)
  return request({
    method: 'post',
    url: '/srm/assessSpecific/info',
    data: params
  })
}
/* 编辑--保存 --新增，修改，删除全部都用这个接口 */
export function weightUpdate(params) {
  return request({
    method: 'post',
    url: '/srm/assessSpecific/modifyBatch',
    data: params
  })
}

// 这是考核维度的api--2
// 分页查询列表
export function dimensionPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/srm/assessSpecific/dimension/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function dimensionAdd(data) {
  return request({
    url: '/srm/assessSpecific/dimension/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function dimensionDetail(data) {
  return request({
    url: '/srm/assessSpecific/dimension/info',
    method: 'post',
    data
  })
}

// 编辑-修改保存
export function dimensionUpdate(data) {
  return request({
    url: '/srm/assessSpecific/dimension/modify',
    method: 'post',
    data
  })
}

// 删除
export function dimensionDelete(data) {
  return request({
    url: '/srm/assessSpecific/dimension/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function dimensionEnabled(data) {
  return request({
    url: '/srm/assessSpecific/dimension/status',
    method: 'post',
    data
  })
}

// 针织厂...tap页签的接口：服务供应商supplierCategory: 1
export function factoryTap(data) {
  return request({
    url: '/srm/supplierType/list',
    method: 'post',
    data
  })
}

// 评价设置列表查询
export function reviewPage(data) {
  return request({
    url: '/srm/assessSpecific/evaluation/list',
    method: 'post',
    data
  })
}

// 编辑-修改保存
export function reviewUpdate(data) {
  return request({
    url: '/srm/assessSpecific/evaluation/modify',
    method: 'post',
    data
  })
}

// 编辑-详情
export function reviewDetail(data) {
  return request({
    url: '/srm/assessSpecific/evaluation/info',
    method: 'post',
    data
  })
}

/* 选择评估部门 */
export const getSysOrgListData = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/usercommon/org/list?r=' + Math.random(),
    data: params
  })
}

/* 获取用户部门 */
export const getSysUserListData = (params = {}) => {
  /*  orgIds: [params.orglds] */
  return request({
    method: 'post',
    url: '/srm/usercommon/user/list?r=' + Math.random(),
    data: {
      orgIds: [params.orglds]
    }
  })
}
