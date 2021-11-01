
/**
 * @Description: 用户api接口方法
 * @author Roman
 * @date 2020/6/18
*/
import request from '@/utils/request'
// 获取用户信息接口
export function getInfo() {
  return request({
    url: '/userCenter/sysUser/currentUser/info',
    method: 'post'
  })
}
// 获取用户权限接口
export function getPermitList(types = ['N', 'M', 'B'], appSystemId = '1,7,8,9,10,11,12,13,14,15,16,17,20,19,21,22,23,24,25,26') {
  return request({
    url: '/userCenter/sysPermit/permitList',
    method: 'post',
    data: { types, appSystemId }
  })
}

export function menuList() {
  return request({
    url: '/userCenter/sysPermit/menuList',
    method: 'post',
    data: {

    }
  })
}
