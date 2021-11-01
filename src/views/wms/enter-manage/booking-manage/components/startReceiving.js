// import * as api from '../api/index'
export const StartReceiving = {
  created() {
  },
  methods: {
    /* tab切换 */
    tabClick(tab, event) {
      console.log(tab, event)
    },
    backListPage() {
      this.$router.push({
        path: '/wms/enter-manage/booking-manage'
      })
    },
    /* 新增产品 */
    insertProduct() {
      this.dialogProductInfoVisible = true
    }
  }
}
