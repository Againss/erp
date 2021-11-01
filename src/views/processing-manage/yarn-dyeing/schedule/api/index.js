import request from '@/utils/request'

// 分页查询列表
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingProductionSchedule/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 计数
export function count(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingProductionSchedule/AllCountsGroupByStatus',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 染纱进度进度更新-列表接口
export function detailList(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingProductionSchedule/detail/list',
    method: 'post',
    data: data
  })
}

// 新增
export function add(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingProductionSchedule/detail/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function edit(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingProductionSchedule/detail/modify',
    method: 'post',
    data: data
  })
}

// 删除
export function del(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingProductionSchedule/detail/delete',
    method: 'post',
    data: data
  })
}

// 导入
export function upload(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingProductionSchedule/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf-8'
    }
  })
}
// 导出
export function download(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingProductionSchedule/download',
    method: 'post',
    data: data,
    responseType: 'arraybuffer'
  })
}
// 下载模板
export function downloadTemplate(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingProductionSchedule/download/template',
    method: 'post',
    data: data,
    responseType: 'arraybuffer'
  })
}
