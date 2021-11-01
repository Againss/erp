import request from '@/utils/request'

// 色板标准列表、查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/colorModel/colorModelStandardConf/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增色板标准
export function sysDataGroupAdd(data) {
  return request({
    url: '/baseData/colorModel/colorModelStandardConf/add',
    method: 'post',
    data
  })
}

// 修改色板标准
export function sysDataGroupModify(data) {
  return request({
    url: '/baseData/colorModel/colorModelStandardConf/modify',
    method: 'post',
    data
  })
}

// 删除色板标准
export function sysDataGroupDelete(id) {
  return request({
    url: `/baseData/colorModel/colorModelStandardConf/delete/${id}`,
    method: 'post'
  })
}

// 色板标准审核
export function sysDataGroupApprove(data) {
  return request({
    url: '/baseData/colorModel/colorModelStandardConf/approve',
    method: 'post',
    data
  })
}

// 色板标准启用禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/baseData/colorModel/colorModelStandardConf/isEnable',
    method: 'post',
    data
  })
}

// 色板标准详情
export function sysDataGroupDetail(data) {
  return request({
    url: '/baseData/colorModel/colorModelStandardConf/info',
    method: 'post',
    data
  })
}
