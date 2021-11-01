import request from '@/utils/request'
// import { filterOptions } from '@/utils/index'
// const props = {
//   id: 'value',
//   name: 'label',
//   enabled: 'disabled',
//   enabledValue: false,
//   disabledValue: true,
//   disabledName: v => v
// }

// 新增
export function addYarn(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionTesting/add',
    method: 'post',
    data
  })
}
// 试纱-处理
export function yarnProcess(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionTesting/process',
    method: 'post',
    data
  })
}
// 试纱-审核
export function yarnProcessAudit(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionTesting/audit',
    method: 'post',
    data
  })
}

// 试纱-删除
export function yarnDelete(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionTesting/delete',
    method: 'post',
    data
  })
}
// 试纱-修改状态
export function yarnExchange(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionTesting/exchange',
    method: 'post',
    data
  })
}

// 试纱-详情
export function detailsData(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionTesting/info',
    method: 'post',
    data
  })
}
// 试纱-修改
export function yarnModify(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionTesting/modify',
    method: 'post',
    data
  })
}
// 试纱-复试
export function yarnRepeat(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionTesting/repeat',
    method: 'post',
    data
  })
}
