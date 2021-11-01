import request from '@/utils/request'

// 生产分页查询列表
export function produceRequirePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: '/aps/produceRequire/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 生产下发操作
export function produceRequireSend(data = {}) {
  return request({
    url: '/aps/produceRequire/send',
    method: 'post',
    data
  })
}

// 生产抽纱详情
export function produceRequireGray(data = {}) {
  return request({
    url: '/aps/produceRequire/gray',
    method: 'post',
    data
  })
}

