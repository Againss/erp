import request from '@/utils/request'

// 合同分页查询
export function contractPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/contract/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 合同详情
export function contractInfo(data) {
  return request({
    url: '/crm/contract/info',
    method: 'post',
    data
  })
}

// 合同新增
export function contractAdd(data) {
  return request({
    url: '/crm/contract/add',
    method: 'post',
    data
  })
}

// 合同删除
export function contractDelete(data) {
  return request({
    url: '/crm/contract/delete',
    method: 'post',
    data
  })
}

// 合同修改
export function contractModify(data) {
  return request({
    url: '/crm/contract/modify',
    method: 'post',
    data
  })
}

// 合同更改所有人
export function contractModifyFollower(data) {
  return request({
    url: '/crm/contract/modify/follower',
    method: 'post',
    data
  })
}

// 合同附件更改所有人
export function fileModifyFollower(data) {
  return request({
    url: '/crm/file/modify/follower',
    method: 'post',
    data
  })
}

// 合同附件上传
// export function fileUpload(data) {
//   return request({
//     url: '/crm/file/upload',
//     method: 'post',
//     data
//   })
// }

// 合同附件下载
export function fileDownload(data) {
  return request({
    url: '/crm/file/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

// 合同附件pdf预览
export function filePreview(data) {
  return request({
    url: '/crm/file/preview',
    method: 'post',
    data
  })
}

// 合同附件删除
export function fileDelete(data) {
  return request({
    url: '/crm/file/delete',
    method: 'post',
    data
  })
}

// 合同附件列表
export function fileList(data) {
  return request({
    url: '/crm/file/list',
    method: 'post',
    data
  })
}

// 合同附件分页
export function filePage(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/file/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
