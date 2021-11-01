import request from '@/utils/request'

/* 流程详情*/
export const getWorkflowInfo = (params = {}) => {
  return request({
    method: 'post',
    url: '/workflow/info',
    data: params
  })
}
