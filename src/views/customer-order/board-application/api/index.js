/*
 * @Descripttion:列表接口
 * @Author: xj
 * @Date: 2021-03-04 14:03:07
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-01 17:04:14
 */
import request from '@/utils/request'

// 剪样申请 分页查询列表
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/customerOrder/spCutSampleApply/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 剪样申请 列表各个状态数量
export function orderStatusNum(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/customerOrder/spCutSampleApply/pageCount',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 剪板组 分页查询列表
export function listArray(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/customerOrder/cutSampleRecords/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 剪板组 列表各个状态数量
export function orderStatusNumArray(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/customerOrder/cutSampleRecords/pageCount',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 剪板组 剪板中==》布样接收  搜索
export function RecordsSearch(data = {}) {
  // return new Promise(function(resolve, reject) {
  //   resolve({
  //     code: 200,
  //     message: '成功',
  //     data: {
  //       orderId: Date.now(),
  //       receiveCode: 'W20210529005',
  //       sourceNumber: 'QS21080003-V2',
  //       productCode: 'dfasf111',
  //       productInfo: '',
  //       yarnInfo: '32S/2 棉 100，50D/36F/2 涤纶长纤',
  //       cylinderNumber: 'M20111025',
  //       cutClothQuantity: 30,
  //       unitId: '1',
  //       clothName: '花灰净色平纹',
  //       elementName: 'CVC 60/40',
  //       elementRatio: '',
  //       suggestWidth: '121',
  //       suggestWidthUnit: 'CM',
  //       suggestWeight: '100',
  //       suggestWeightUnit: 'g/㎡',
  //       customerColor: '红色',
  //       tagLanguage: 1
  //     }
  //   })
  // })
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/customerOrder/cutSampleRecords/scan',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 剪板组 剪板中==》确定按钮接口
export function RecordAdd(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/customerOrder/cutSampleRecords/add',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 剪板组 已剪板==》搜索接口
export function swatchSearch(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/customerOrder/cutSampleRecords/shearing',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 剪板组 已剪板==》确定按钮接口
export function swatchAdd(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/customerOrder/cutSampleRecords/finished',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 剪板组 打印标签
export function printLabel(data = []) { // receiveCodes: string[] 收布条码集合
  // return new Promise(function(resolve, reject) {
  //   resolve({
  //     code: 200,
  //     message: '成功',
  //     data: [
  //       {
  //         receiveCode: 'W20210529001',
  //         sourceNumber: 'QS21080003-V2',
  //         yarnInfo: '32S/2 棉 100，50D/36F/2 涤纶长纤',
  //         cylinderNumber: 'M20111025',
  //         clothName: '花灰净色平纹',
  //         elementName: 'CVC 60/40',
  //         elementRatio: '',
  //         suggestWidth: '121',
  //         suggestWidthUnit: 'CM',
  //         suggestWeight: '100',
  //         suggestWeightUnit: 'g/㎡',
  //         customerColor: '红色',
  //         tagLanguage: 1
  //       },
  //       {
  //         receiveCode: 'W20210529002',
  //         sourceNumber: 'QS21080003-V2',
  //         yarnInfo: '16S/1 棉 100，50D/36F/2 氨纶',
  //         cylinderNumber: 'M20111025',
  //         clothName: '花灰净色平纹',
  //         elementName: '棉/氨纶 70/30',
  //         elementRatio: '',
  //         suggestWidth: '200',
  //         suggestWidthUnit: 'CM',
  //         suggestWeight: '200',
  //         suggestWeightUnit: 'g/㎡',
  //         customerColor: '蓝色',
  //         tagLanguage: 2
  //       }
  //     ]
  //   })
  // })
  return request({
    url: '/customerOrder/cutSampleRecords/print',
    method: 'post',
    data: data
  })
}

