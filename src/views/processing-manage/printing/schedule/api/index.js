/*
 * @Date: 2021-06-04 08:52:21
 * @Author: anthony
 * @LastEditTime: 2021-07-08 15:03:43
 * @LastEditors: anthony
 * @Descripttion:
 */
import request from '@/utils/request'
// 进度列表分页查询
export function list(data = {}) {
  return request({
    url: '/processingMgr/printProductionSchedule/page',
    method: 'post',
    data: data
  })
}
// 计数
export function count(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/printProductionSchedule/pageGroupCount',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 染纱进度进度更新-列表接口
export function detailList(data = {}) {
  return request({
    url: '/processingMgr/printProductionScheduleDetail/list',
    method: 'post',
    data: data
  })
}

// 新增
export function add(data = {}) {
  return request({
    url: '/processingMgr/printProductionScheduleDetail/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function edit(data = {}) {
  return request({
    url: '/processingMgr/printProductionScheduleDetail/modify',
    method: 'post',
    data: data
  })
}
// 提交
export function submit(data = {}) {
  return request({
    url: '/processingMgr/printProductionScheduleDetail/submit',
    method: 'post',
    data: data
  })
}
// 删除
export function del(data = {}) {
  return request({
    url: '/processingMgr/printProductionScheduleDetail/delete',
    method: 'post',
    data: data
  })
}

// 导入
export function upload(data = {}) {
  return request({
    url: '/processingMgr/printProductionSchedule/upload',
    method: 'post',
    data: data
  })
}
// 导出
export function download(data = {}) {
  return request({
    url: '/processingMgr/printProductionSchedule/download',
    method: 'post',
    data: data,
    responseType: 'arraybuffer'
  })
}
// 下载模板
export function downloadTemplate(data = {}) {
  return request({
    url: '/processingMgr/printProductionSchedule/template',
    method: 'post',
    data: data,
    responseType: 'arraybuffer'
  })
}
