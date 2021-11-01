import request from '@/utils/request'

// 工序字典列表
export function apsProcessDicPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/bmpAps/ltset/apsProcessDic/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 工序字典列表
export function apsProcessDicList(data = {}) {
  return request({
    url: '/bmpAps/ltset/apsProcessDic/list',
    method: 'post',
    data
  })
}

// 工序字典保存
export function apsProcessDicAdd(data = {}) {
  return request({
    url: '/bmpAps/ltset/apsProcessDic/add',
    method: 'post',
    data
  })
}

// 工序字典修改
export function apsProcessDicModify(data = {}) {
  return request({
    url: '/bmpAps/ltset/apsProcessDic/modify',
    method: 'post',
    data
  })
}

// 工序字典删除
export function apsProcessDicDelete(data = {}) {
  return request({
    url: '/bmpAps/ltset/apsProcessDic/delete',
    method: 'post',
    data
  })
}

// 工序字典详情
export function apsProcessDicInfo(data = {}) {
  return request({
    url: '/bmpAps/ltset/apsProcessDic/info',
    method: 'post',
    data
  })
}

// 工序字典状态修改
export function apsProcessDicUpdateStatus(data = {}) {
  return request({
    url: '/bmpAps/ltset/apsProcessDic/updateStatus',
    method: 'post',
    data
  })
}
