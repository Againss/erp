import request from '@/utils/request'

// 竞争对手分页查询
export function competitorPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/competitor/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 竞争对手详情
export function competitorInfo(data) {
  return request({
    url: '/crm/competitor/info',
    method: 'post',
    data
  })
}

// 竞争对手列表查询
export function competitorList(data) {
  return request({
    url: '/crm/competitor/list',
    method: 'post',
    data
  })
}

// 修改竞争对手
export function competitorModify(data) {
  return request({
    url: '/crm/competitor/modify',
    method: 'post',
    data
  })
}

// 删除竞争对手
export function competitorDelete(data) {
  return request({
    url: '/crm/competitor/delete',
    method: 'post',
    data
  })
}

// 新增竞争对手
export function competitorAdd(data) {
  return request({
    url: '/crm/competitor/add',
    method: 'post',
    data
  })
}

// 新增竞争对手
export function competitorModifyFollower(data) {
  return request({
    url: '/crm/competitor/modify/follower',
    method: 'post',
    data
  })
}
