
import * as api from '@/views/srm/masic-data/appraisal-settings/api/index'
export const PublicSrm = PublicSrm || {
  methods: {
    /* 选择评估部门 */
    async getSysOrgList(params = {}) {
      const res = await api.getSysOrgListData(params)
      if (this.$pub.responseValidate(res)) {
        const list = res.data.list || []
        this.sysOrgList = list
        // console.log('this.sysOrgList', this.sysOrgList)
      }
    },
    // 判断当前值部门还在不在， 不在就清空重新选
    setFormDatasSysOrg(arr, callback) {
      let list = JSON.parse(JSON.stringify(arr))
      //  递归方法， 用选择的id获取id所在的对象
      const fn = (arr, id) => {
        const v = arr.find(e => e.orgId === id)
        if (v) return v
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].child && arr[i].child.length) {
            const res = fn(arr[i].child, id)
            if (res) return res
          }
        }
        return false
      }
      if (Array.isArray(list)) {
        list.forEach(ele => {
          const obj = fn(this.sysOrgList, ele.departmentId)
          if (!obj) {
            ele.departmentId = ''
          }
        })
      } else {
        const obj = fn(this.sysOrgList, list)
        list = obj ? list : ''
      }
      callback(list)
    },
    /* 选择用户列表 */
    async getSysUserList(params = {}) {
      let userList = []
      const res = await api.getSysUserListData(params)
      if (this.$pub.responseValidate(res)) {
        const list = res.data.list || []
        this.sysUserList = list
        userList = list
      }
      return userList
    }
  }
}
