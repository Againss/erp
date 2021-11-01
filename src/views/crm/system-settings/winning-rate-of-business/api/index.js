import request from '@/utils/request'

// 商机阶段赢率分页查询
export function winRatePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/winRate/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 商机阶段赢率详情
export function winRateInfo(data) {
  return request({
    url: '/crm/winRate/info',
    method: 'post',
    data
  })
}

// 商机阶段赢率修改
export function winRateModify(data) {
  return request({
    url: '/crm/winRate/modify',
    method: 'post',
    data
  })
}

// 商机阶段赢率全量列表
export function winRateList(data) {
  return request({
    url: '/crm/winRate/list',
    method: 'post',
    data
  })
}

