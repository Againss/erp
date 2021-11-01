import request from '@/utils/request'

// 可用邮箱列表查询
export function rolePageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/mailBoxManager/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 新增
export function eailAdd(data) {
  return request({
    url: '/userCenter/mailBoxManager/add',
    method: 'post',
    data
  })
}
// 修改
export function eailModify(data) {
  return request({
    url: '/userCenter/mailBoxManager/modify',
    method: 'post',
    data
  })
}
// 编辑--详情
export function eailDetail(data) {
  return request({
    url: '/userCenter/mailBoxManager/info',
    method: 'post',
    data
  })
}
// 删除邮箱
export function mailDelete(data = {}) {
  return request({
    url: '/userCenter/mailBoxManager/delete',
    method: 'post',
    data
  })
}

// 邮箱列表
export function mailBoxManagerList(data = {}) {
  return request({
    url: '/userCenter/mailBoxManager/list',
    method: 'post',
    data
  })
}

// 邮箱列表(无需权限)
// export function mailBoxManagerAllList(data = {}) {
//   return request({
//     url: '/userCenter/mailBoxManager/allList',
//     method: 'post',
//     data
//   })
// }

