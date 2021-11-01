import * as api from '../api/index'
export const Contacts = {
  methods: {

    // 获取联系人详情并显示
    async getContactsInfoDisplay(data = {}) {
      const res = await api.contactPersonInfo(data)
      //   console.log('详情', res)
      // this.customerId = res.data.customerId
      const gender = res.data.gender && res.data.gender === 'M' ? '男' : '女'
      const createdTime = res.data.createdTime && this.$filters.parseTime(res.data.createdTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const updatedTime = res.data.updatedTime && this.$filters.parseTime(res.data.updatedTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      this.detailsFormDatas = { ...res.data, createdTime, updatedTime, gender }
      //   this.setFormDatas(this.contactsPopOptions, res.data)
    },

    // 点击更改所有人
    async okClick(params) {
      // console.log(params)
      const res = await api.contactPersonModifyFollower({ ...params, id: this.routeId })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('更改所有人成功')
      // this.$emit('visibleClick', false)
      this.$set(this.OwnerPopOptions, 'visible', false)
      // console.log(this.visible)
      this.getContactsInfoDisplay({ contactPersonId: this.routeId })
    }
  }
}
