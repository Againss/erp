import request from '@/utils/request'

// 纱线等级分页查询列表
export function yarnGradeConfigPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/qa/yarnGradeConfig/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 纱线等级保存
export function yarnGradeConfigAdd(data = {}) {
  return request({
    url: '/baseData/qa/yarnGradeConfig/add',
    method: 'post',
    data
  })
}

// 纱线等级修改
export function yarnGradeConfigModify(data = {}) {
  return request({
    url: '/baseData/qa/yarnGradeConfig/modify',
    method: 'post',
    data
  })
}

// 纱线等级详情
export function yarnGradeConfigInfo(data = {}) {
  return request({
    url: '/baseData/qa/yarnGradeConfig/info',
    method: 'post',
    data
  })
}

// 纱线等级新增提供的结构体
export function yarnGradeConfigAddinfo(data = {}) {
  return request({
    url: '/baseData/qa/yarnGradeConfig/addinfo',
    method: 'post',
    data
  })
}

// 物测分页查询列表
export function pysicalSurveyConfigPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/qa/pysicalSurveyConfig/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 物测项目列表
export function pysicalSurveyConfigList(data = {}) {
  return request({
    url: '/baseData/qa/pysicalSurveyConfig/list',
    method: 'post',
    data
  })
}

// 物测项目修改
export function pysicalSurveyConfigModify(data = {}) {
  return request({
    url: '/baseData/qa/pysicalSurveyConfig/modify',
    method: 'post',
    data
  })
}

// 物测项目保存
export function pysicalSurveyConfigAdd(data = {}) {
  return request({
    url: '/baseData/qa/pysicalSurveyConfig/add',
    method: 'post',
    data
  })
}

// 物测项目删除
export function pysicalSurveyConfigDelete(data = {}) {
  return request({
    url: '/baseData/qa/pysicalSurveyConfig/delete',
    method: 'post',
    data
  })
}

// 物测项目审核未审核
export function pysicalSurveyConfigAudited(data = {}) {
  return request({
    url: '/baseData/qa/pysicalSurveyConfig/audited',
    method: 'post',
    data
  })
}

// 物测项目详情
export function pysicalSurveyConfigInfo(data = {}) {
  return request({
    url: '/baseData/qa/pysicalSurveyConfig/info',
    method: 'post',
    data
  })
}

// 物测项目启用/禁用
export function pysicalSurveyConfigEnabled(data = {}) {
  return request({
    url: '/baseData/qa/pysicalSurveyConfig/enabled',
    method: 'post',
    data
  })
}

// 执行标准查询分页
export function executivsStandardConfigPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/qa/executivsStandardConfig/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 执行标准列表
export function executivsStandardConfigList(data = {}) {
  return request({
    url: '/baseData/qa/executivsStandardConfig/list',
    method: 'post',
    data
  })
}

// 执行标准修改
export function executivsStandardConfigModify(data = {}) {
  return request({
    url: '/baseData/qa/executivsStandardConfig/modify',
    method: 'post',
    data
  })
}

// 执行标准保存
export function executivsStandardConfigAdd(data = {}) {
  return request({
    url: '/baseData/qa/executivsStandardConfig/add',
    method: 'post',
    data
  })
}

// 执行标准删除
export function executivsStandardConfigDelete(data = {}) {
  return request({
    url: '/baseData/qa/executivsStandardConfig/delete',
    method: 'post',
    data
  })
}

// 执行标准审核未审核
export function executivsStandardConfigAudited(data = {}) {
  return request({
    url: '/baseData/qa/executivsStandardConfig/audited',
    method: 'post',
    data
  })
}

// 执行标准详情
export function executivsStandardConfigInfo(data = {}) {
  return request({
    url: '/baseData/qa/executivsStandardConfig/info',
    method: 'post',
    data
  })
}

// 执行标准启用/禁用
export function executivsStandardConfigEnabled(data = {}) {
  return request({
    url: '/baseData/qa/executivsStandardConfig/enabled',
    method: 'post',
    data
  })
}
