import request from '@/utils/request'

const PUBLIC_PATH = '/sysSettings'

/* 选项配置下拉 */
export const optionConfigSelect = (params = {}) => {
  return request({
    url: '/basis/api/optionConfig/option', // /api/optionConfig/option
    method: 'post',
    data: params
  })
}

// 获取参数信息表格数据
export const getSettings = (params = {}) => {
  return request({
    url: PUBLIC_PATH + '/template/parameter/setting/batchList',
    method: 'post',
    data: params
  })

  // return new Promise((resolve, reject) => resolve({
  //   'code': -875682,
  //   'message': 'c',
  //   'data': [
  //     {
  //       'targetField': 'nostrud',
  //       'settingType': 14804031,
  //       'sourceKey': '283',
  //       'sourceVal': 'AD',
  //       'targetList': [
  //         {
  //           value: '290',
  //           label: '批色'
  //         }
  //       ]
  //     },
  //     {
  //       'targetField': '',
  //       'settingType': 23226507,
  //       'sourceKey': '282',
  //       'sourceVal': 'PP',
  //       'targetList': []
  //     }
  //   ]
  // }))
}

// 保存单条参数信息
export const saveSettings = (params = {}) => {
  return request({
    url: PUBLIC_PATH + '/template/parameter/setting/batchAdd',
    method: 'post',
    data: params
  })
}

// 计量单位通用下拉
export const unitSelect = (params = {}) => {
  return request({
    url: '/basis/api/units/option',
    method: 'post',
    data: { ...params, enabled: 'Y' }
  }).then(res => {
    const list = res.data || []

    return list.map(item => ({
      value: item.uuid,
      label: item.name,
      typeId: item.type && item.type.id,
      typeVal: item.type && item.type.name
    }))
  })
}
