import request from '@/utils/request'

// 抽纱分页查询
export function grayYarnPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/aps/grayYarn/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 抽纱分页数量查询
export function grayYarnPageCount(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/aps/grayYarn/page/count',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 抽纱分页重新抽纱
export function grayYarnRedo(data = {}) {
  return request({
    url: '/aps/grayYarn/redo',
    method: 'post',
    data
  })
}

