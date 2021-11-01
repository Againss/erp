// 成品验布表ipad详情
import request from '@/utils/request'

// 分页查询
export function pageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/qaFinishFabricTask/app/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 每个分组对应的数量
export function pageCount(data = {}) {
  return request({
    url: '/qa/finishFabricPhysical/AllCountsGroupByStatus',
    method: 'post',
    data: { ...data }
  })
}

// 编辑-(获取详情信息)
export function getClothData(id = '') {
  return request({
    url: '/qa/qaFinishFabricInspectionTask/info',
    method: 'post',
    data: {
      id
    }
  })
}

// 保存或提交
export function saveOrSubmitData(data = {}) {
  return request({
    url: '/qa/qaFinishFabricInspectionTask/modify',
    method: 'post',
    data
  })
}

// 获取问题类型数据
export async function getProblemType() {
  return request({
    url: '/baseData/qa/finishedFabricProblemType/list',
    method: 'post',
    data: {}
  })
}

// 获取疵点四分表列表数据
export function getFourListData() {
  return request({
    url: '/baseData/qa/finishedFabricPointsDeductedItems/list',
    method: 'post',
    data: {
      isEnabled: 1,
      status: 'Y'
    }
  })
}

// 获取疵点信息列表数据（单匹或整缸）单匹1 整缸2
export function getInformationListData(singleOrEntire = 1) {
  return request({
    url: '/baseData/qa/finishedFabricOtherProjects/list',
    method: 'post',
    data: {
      isEnabled: 1,
      status: 'Y',
      singleOrEntire
    }
  })
}
// 下载文件 新
export function downFile(data = {}) {
  return request({
    url: `/common/file/download/${data.url}`,
    responseType: 'arraybuffer',
    method: 'get',
    params: {}
  })
}
