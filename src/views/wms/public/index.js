import { getSysUserListData } from '@/views/srm/public/api';
import * as api from './api/index'
export const PublicWms = PublicWms || {
  methods: {
    /* 详情页表单样式 */
    formItemStyle () {
      return {
        width: '25%',
        marginRight: '5%',
        marginLeft: '2%'
      }
    },
    /* 搜索页表单样式 */
    searchFormItemStyle () {
      return {
        width: '25%'
      }
    },
    backPage () {
      this.$router.go(-1);
    },
    moneyFormat (num) {
      if (!num) {
        return ''
      }
      num = num.split('.') // 分隔小数点
      var arr = num[0].split('').reverse() // 转换成字符数组并且倒序排列
      var res = []
      for (var i = 0, len = arr.length; i < len; i++) {
        if (i % 3 === 0 && i !== 0) {
          res.push(',') // 添加分隔符
        }
        res.push(arr[i])
      }
      res.reverse() // 再次倒序成为正确的顺序
      if (num[1]) { // 如果有小数的话添加小数部分
        res = res.join('').concat('.' + num[1])
      } else {
        res = res.join('')
      }
      if (res.indexOf(".") != -1) {
        let b = res.split('.')
        if (b[1].length == 1) {
          b = b.join('.')
          b += '0'
          res = b
        }
      } else {
        res += '.00'
      }
      return res
    },
    /* 库位下拉列表 */
    async getWarehouseLocationList (params = {}) {
      const res = await api.getWarehouseLocationData(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data.list
        if (list && list.length > 0) {
          formaterList = list.filter(it => it.isDefault === false).map(item => ({ value: item.path, label: item.path }))
        }
      }
      return formaterList;
    },
    /* 仓库调用的下拉列表 */
    async getLocationWarehouseList (params = {}) {
      const res = await api.locationWarehouseData(params)
      let locationWarehouseList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data.list
        if (list && list.length > 0) {
          locationWarehouseList = list.map(item => ({ value: item.code, label: item.name }))
        }
      }
      return locationWarehouseList;
    },
    /* 用户列表查询 */
    async getSysUserList (params = {}) {
      const res = await api.getSysUserListData(params)
      let userList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data.list
        if (list && list.length > 0) {
          userList = list.map(item => ({ value: item.id, label: item.realName }))
        }
      }
      return userList;
    }
  }
}