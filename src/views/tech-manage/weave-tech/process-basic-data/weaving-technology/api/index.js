import request from '@/utils/request'

// 织造工艺分页
export function tmWeavingTechPage(data = {}) {
  // const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/tmWeavingTech/page',
    method: 'post',
    data
  })
}

// 织造工艺列表
export function tmWeavingTechList(data) {
  return request({
    url: '/baseData/tmWeavingTech/list',
    method: 'post',
    data
  })
}

// 织造工艺添加
export function tmWeavingTechAdd(data) {
  return request({
    url: '/baseData/tmWeavingTech/add',
    method: 'post',
    data
  })
}

// 织造工艺修改
export function tmWeavingTechModify(data) {
  return request({
    url: '/baseData/tmWeavingTech/modify',
    method: 'post',
    data
  })
}

// 织造工艺删除
export function tmWeavingTechDelete(data) {
  return request({
    url: '/baseData/tmWeavingTech/delete',
    method: 'post',
    data
  })
}

// 织造工艺查询详情
export function tmWeavingTechInfo(data) {
  return request({
    url: '/baseData/tmWeavingTech/info',
    method: 'post',
    data
  })
}

// 织造工艺审核
export function tmWeavingTechStatus(data) {
  return request({
    url: '/baseData/tmWeavingTech/status',
    method: 'post',
    data
  })
}

// 织造工艺启用/禁用
export function tmWeavingTechEnable(data) {
  return request({
    url: '/baseData/tmWeavingTech/enable',
    method: 'post',
    data
  })
}

