import request from '@/utils/request'
// 抽坯详情查询
export function grayclothDetail(data = {}) {
  return request({
    url: '/aps/grayclothreduce/info',
    method: 'post',
    data: { ...data }
  })
}

// 坯布库存查询
export function grayclothreduceList(data = {}) {
  return request({
    url: '/aps/grayclothreduce/query',
    method: 'post',
    data: { ...data }
  })
}

// 备坯单抽用情况查询
export function grayclothreduceHold(data = {}) {
  return request({
    url: '/aps/grayclothreduce/query/hold',
    method: 'post',
    data: { ...data }
  })
}

// 抽坯
export function grayclothSave(data = {}) {
  return request({
    url: '/aps/grayclothreduce/save',
    method: 'post',
    data: { ...data }
  })
}

// 完成抽坯
export function grayclothComplete(data = {}) {
  return request({
    url: '/aps/grayclothreduce/complete/save',
    method: 'post',
    data: { ...data }
  })
}

// 抽坯列表划扣重量编辑
export function grayclothUpdate(data = {}) {
  return request({
    url: '/aps/grayclothreduce/update',
    method: 'post',
    data: { ...data }
  })
}

