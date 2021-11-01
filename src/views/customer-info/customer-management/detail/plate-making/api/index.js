import request from '@/utils/request'

const PUBLIC_PATH = '/customerCenter'

// 获取制板要求数据
export function getPlateMakingInfo(data = {}) {
  return request({
    url: PUBLIC_PATH + '/customer/template/manager/info',
    method: 'post',
    data
  })

  // return new Promise((resolve, reject) => {
  //   resolve({
  //     'code': -13219204,
  //     'message': 'quis ea',
  //     'data': {
  //       'customerId': 'e1901f2bde2f420d8859ee670e784131',
  //       'brandTemplateRelateList': [
  //         {
  //           'customerBrandTemplateRel': {
  //             'customerId': 'e1901f2bde2f420d8859ee670e784131',
  //             'brandId': 582,
  //             'brandName': '品牌333'
  //           },
  //           'requirementList': [
  //             {
  //               'brandId': 582,
  //               'customerId': 'e1901f2bde2f420d8859ee670e784131',
  //               'batchRequireId': 'BA201',
  //               'batchRequireName': '测试批次要求',
  //               'templateTypeId': 'ZA123',
  //               'templateTypeName': '制板类型测试',
  //               'handoverTypeId': 'CA123',
  //               'handoverTypeName': '交接类型测试',
  //               'standardId': 'ST123',
  //               'standardName': '规格测试',
  //               'unitId': 'KG',
  //               'unitName': 'KG',
  //               'unitTypeId': 'type',
  //               'unitTypeName': '长度',
  //               'orderContain': 1,
  //               'charge': 1,
  //               'quantity': 100.12,
  //               'remark': '简单的一个测试'
  //             }
  //           ],
  //           'templateSendRequirementList': [
  //             {
  //               'brandId': 582,
  //               'customerId': 'e1901f2bde2f420d8859ee670e784131',
  //               'customerAddressId': 'eeb974299e6f475aa3c25e7a54ed88f5',
  //               'recipient': '收件人测试',
  //               'receiveCompany': '收件公司测试',
  //               'mobile': '测试电话',
  //               'address': '测试地址134',
  //               'handoverTypeId': 'CA123',
  //               'handoverTypeName': '交接类型测试',
  //               'paymentMethodId': 'PA123',
  //               'paymentMethodName': '付款方式123',
  //               'labelLanguageId': 'LA123',
  //               'labelLanguageName': '标签语言123',
  //               'logisticsCompanyId': 'LOG1',
  //               'logisticsCompanyName': '物流公司123',
  //               'remark': '简单的测试',
  //               'sendTemplateList': [
  //                 {
  //                   'brandId': 582,
  //                   'customerId': 'e1901f2bde2f420d8859ee670e784131',
  //                   'batchRequireId': 'BA201',
  //                   'batchRequireName': '测试批次要求',
  //                   'templateTypeId': 'ZA123',
  //                   'templateTypeName': '制板类型测试',
  //                   'standardId': 'ST123',
  //                   'standardName': '规格测试'
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   })
  // })
}

export function savePlateMakingInfo(data = {}) {
  return request({
    url: PUBLIC_PATH + '/customer/template/manager/save',
    method: 'post',
    data
  })
}

// 获取客户关联品牌列表
export function getRelatedBrand(data = {}) {
  const defaultData = { dataTag: 'ALL' }

  return request({
    url: PUBLIC_PATH + '/brand/page/relate/customer',
    method: 'post',
    data: { ...defaultData, ...data }
  })

  // return new Promise((resolve, reject) => {
  //   resolve({
  //     'code': -65300607,
  //     'message': 'cu',
  //     'data': {
  //       'list': [
  //         {
  //           'brandCustomerId': 17349417,
  //           'id': -36991806,
  //           'name': '安踏',
  //           'provinceId': 'consequat labore occaecat sit',
  //           'cityId': 'aliqua qui',
  //           'areaId': 'minim reprehenderit mollit',
  //           'address': 'adipisicing elit laborum aliquip',
  //           'description': 'Duis',
  //           'remark': 'minim dolor incididunt a',
  //           'follower': 'ipsum officia',
  //           'isDeleted': 49842859,
  //           'revision': -96231477,
  //           'createdBy': 'ut quis tempor',
  //           'createdTime': '1974-07-15',
  //           'updatedBy': 'tempor commodo',
  //           'updatedTime': '2019-10-30'
  //         },
  //         {
  //           'brandCustomerId': 56822022,
  //           'id': 55516449,
  //           'name': '李宁',
  //           'provinceId': 'reprehenderit nisi deserunt cillum velit',
  //           'cityId': 'dolor ex',
  //           'areaId': 'ut fugiat eu elit anim',
  //           'address': 'sed',
  //           'description': 'Excepte',
  //           'remark': 'cupidatat',
  //           'follower': 'commodo in eiu',
  //           'isDeleted': 54547930,
  //           'revision': -38876419,
  //           'createdBy': 'nostru',
  //           'createdTime': '1989-07-24',
  //           'updatedBy': 'Lorem nisi',
  //           'updatedTime': '2007-02-06'
  //         },
  //         {
  //           'brandCustomerId': 84040956,
  //           'id': 91412757,
  //           'name': '耐克',
  //           'provinceId': 'amet eu labore Ut',
  //           'cityId': 'incididunt Ut',
  //           'areaId': 'qui ut',
  //           'address': 'Ut eiusmod veniam',
  //           'description': 'ipsum Lorem',
  //           'remark': 'cillum ex in con',
  //           'follower': 'pariatur aliquip ut tempor dolor',
  //           'isDeleted': -28321834,
  //           'revision': -65953003,
  //           'createdBy': 'dolore nulla',
  //           'createdTime': '1976-07-24',
  //           'updatedBy': 'Excepteur reprehenderit',
  //           'updatedTime': '2013-07-29'
  //         }
  //       ],
  //       'total': 78138549,
  //       'pageSize': 43450048,
  //       'pageNum': 85991668
  //     }
  //   })
  // })
}

// 全量获取客户地址列表
export function getAddressList(data = {}) {
  return request({
    url: PUBLIC_PATH + '/customer/address/list',
    method: 'post',
    data
  })

  // return new Promise((resolve, reject) => {
  //   resolve({
  //     'code': 50829742,
  //     'message': 'reprehenderit aliqua consequat',
  //     'data': {
  //       'list': [
  //         {
  //           'id': 23229051,
  //           'customerAddressId': 'fugiat ullamco proident',
  //           'customerId': 'labore',
  //           'recipient': 'qui labore adipisicing',
  //           'receiveCompany': 'dolor reprehenderit',
  //           'mobile': 'fugiat',
  //           'address': 'anim in minim',
  //           'remark': 'ad nostrud ut culpa',
  //           'isDeleted': 50349499,
  //           'revision': -22888016,
  //           'createdBy': 'et sunt',
  //           'createdTime': '2013-10-11',
  //           'updatedBy': 'tempor',
  //           'updatedTime': '1991-08-01'
  //         },
  //         {
  //           'id': 84495865,
  //           'customerAddressId': 'cillum',
  //           'customerId': 'veniam magna',
  //           'recipient': 'dolore',
  //           'receiveCompany': 'fugiat Ut do',
  //           'mobile': 'dolor in amet',
  //           'address': 'laborum anim dolore',
  //           'remark': 'commodo eiusmod et enim nostrud',
  //           'isDeleted': 76826525,
  //           'revision': 53443085,
  //           'createdBy': 'dolor non',
  //           'createdTime': '1988-03-03',
  //           'updatedBy': 'culpa',
  //           'updatedTime': '2019-08-20'
  //         },
  //         {
  //           'id': -98090537,
  //           'customerAddressId': 'anim Ut in eiusmod',
  //           'customerId': 'dolore sint culpa occaecat Lorem',
  //           'recipient': 'non culpa',
  //           'receiveCompany': 'veniam ad Ut sed in',
  //           'mobile': 'Lorem mol',
  //           'address': 'sed',
  //           'remark': 'adipisicing nisi',
  //           'isDeleted': 62852680,
  //           'revision': -11343793,
  //           'createdBy': 'id ea',
  //           'createdTime': '1995-02-17',
  //           'updatedBy': 'in reprehenderit',
  //           'updatedTime': '2009-10-16'
  //         }
  //       ],
  //       'total': 333,
  //       'pageSize': 20,
  //       'pageNum': 10
  //     }
  //   })
  // })
}

// 获取参数信息数据
export const getTemplateParam = (params = {}) => {
  if (!params.sourceKey) {
    return new Promise(resolve => resolve([]))
  }

  return request({
    url: '/sysSettings/template/parameter/setting/batchList',
    method: 'post',
    data: params
  }).then(res => {
    const data = res.data && res.data[0] || {}

    return data.targetList || []
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
