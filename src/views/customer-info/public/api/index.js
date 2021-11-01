import request from '@/utils/request'

/* 选项配置下拉 */
export const optionConfigSelect = (params = {}) => {
  return request({
    url: '/basis/api/optionConfig/option', // /api/optionConfig/option
    method: 'post',
    data: params
  })
}
