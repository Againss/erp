import request from '@/utils/request'

// 色板项目进度列表、查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/customerOrder/colorModel/colorModelScheduleConf/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增色板项目进度
export function sysDataGroupAdd(data) {
  return request({
    url: '/customerOrder/colorModel/colorModelScheduleConf/add',
    method: 'post',
    data
  })
}

// 修改色板项目进度
export function sysDataGroupModify(data) {
  return request({
    url: '/customerOrder/colorModel/colorModelScheduleConf/modify',
    method: 'post',
    data
  })
}

// 删除色板项目进度
export function sysDataGroupDelete(id) {
  return request({
    url: `/customerOrder/colorModel/colorModelScheduleConf/delete/${id}`,
    method: 'post'
  })
}

// 色板项目进度审核
export function sysDataGroupApprove(data) {
  return request({
    url: '/customerOrder/colorModel/colorModelScheduleConf/approve',
    method: 'post',
    data
  })
}

// 色板项目进度启用禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/customerOrder/colorModel/colorModelScheduleConf/isEnable',
    method: 'post',
    data
  })
}

// 色板项目进度详情
export function sysDataGroupDetail(data) {
  return request({
    url: '/customerOrder/colorModel/colorModelScheduleConf/info',
    method: 'post',
    data
  })
}
