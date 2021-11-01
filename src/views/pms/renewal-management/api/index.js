// 复期管理api内容
import request from '@/utils/request'

// 分页查询列表
export function renewalPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/pms/renewal/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 数量统计
export function renewalCount(data) {
  return request({
    url: '/pms/renewal/count',
    method: 'post',
    data
  })
}

// 复期
export function renewalUpdate(data) {
  return request({
    url: '/pms/renewal/restore',
    method: 'post',
    data
  })
}

// 编辑--详情
export function renewalDetail(data) {
  return request({
    url: '/pms/renewal/info/' + data.id,
    method: 'post'
  })
}
