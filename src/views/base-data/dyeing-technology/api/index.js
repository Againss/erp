import request from '@/utils/request'

// 分页
export function tmWeavingTechPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/tmDyeFinishTech/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 添加
export function tmWeavingTechAdd(data) {
  return request({
    url: '/baseData/tmDyeFinishTech/add',
    method: 'post',
    data
  })
}

// 修改
export function tmWeavingTechModify(data) {
  return request({
    url: '/baseData/tmDyeFinishTech/modify',
    method: 'post',
    data
  })
}

// 删除
export function tmWeavingTechDelete(data) {
  return request({
    url: '/baseData/tmDyeFinishTech/delete',
    method: 'post',
    data
  })
}

// 查询详情
export function tmWeavingTechInfo(data) {
  return request({
    url: '/baseData/tmDyeFinishTech/info',
    method: 'post',
    data
  })
}

// 审核
export function tmWeavingTechStatus(data) {
  return request({
    url: '/baseData/tmDyeFinishTech/status',
    method: 'post',
    data
  })
}

// 启用/禁用
export function tmWeavingTechEnable(data) {
  return request({
    url: '/baseData/tmDyeFinishTech/enable',
    method: 'post',
    data
  })
}
