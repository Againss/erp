import request from '@/utils/request'
// 抽坯查询列表
export function grayclothPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/aps/grayclothreduce/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 抽坯汇总
export function grayclothCount(data) {
  return request({
    url: '/aps/grayclothreduce/page/count',
    method: 'post',
    data
  })
}

// 检查是否能编辑、重新抽坯
export function grayclothCheck(data) {
  return request({
    url: '/aps/grayclothreduce/redo',
    method: 'post',
    data
  })
}
