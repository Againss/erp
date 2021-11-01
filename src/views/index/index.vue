<template>
  <div class="home_page">
    <div class="header">
      <h3 class="title">智布办公系统</h3>
      <p>
        让标准产品的生产数字化，自动化，智能化.连接<span class="high">5000亿</span>的生产产能，提升<span class="high">20%</span>的产能效率，创造<span class="high">1000亿</span>的价值。
      </p>
    </div>

    <div class="wrap-tables detail">
      <div class="item">
        <div class="header-table">
          <span class="text">待办任务({{ total1 }})</span>
          <span
            class="text2"
            @click="$router.push('/message-center')"
          >更多<i style="margin-left: 4px;" class="el-icon-arrow-right" /></span>
        </div>
        <cs-custom-table
          v-if="showTable1"
          :header-cell-style="{ backgroundColor: '#f2f4f6' }"
          tooltip-effect="dark"
          :columns="columns"
          :data-source="dataSource1"
          edit-type="pop"
        />
        <div
          v-else
          class="wrap-none"
        >
          <img
            src="../../assets/images/systems/img_notask.png"
            class="img-none"
          >
          <span>暂无待办任务</span>
        </div>
      </div>
      <div class="item">
        <div class="header-table">
          <span class="text">未读信息({{ total2 }})</span>
          <span
            class="text2"
            @click="$router.push({name: 'message-center', params: {messageType: '1'}})"
          >更多<i style="margin-left: 4px;" class="el-icon-arrow-right" /></span>
        </div>
        <cs-custom-table
          v-if="showTable2"
          :header-cell-style="{ backgroundColor: '#f2f4f6' }"
          tooltip-effect="dark"
          :columns="columns"
          :data-source="dataSource2"
          edit-type="pop"
        />
        <div
          v-else
          class="wrap-none"
        >
          <img
            src="../../assets/images/systems/img_nomessage.png"
            class="img-none"
          >
          <span>暂无未读信息</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import popoverColumn from './popover-column'
import { msgUserPage, userRead } from '@/views/user-center/message-center/api/index.js'
import { sysAppSystemList } from '../user-center/micro-services/api/index.js'
// import { setStorageToken, getStorageToken } from '@/utils/auth'
export default {
  name: 'IndexPage',
  props: {},
  data() {
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'title',
        label: '标题信息',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span style="cursor: pointer; color: #1890ff;">${scope.row[scope.column.property]}</span>`
        },
        handle: scope => {
          // console.log(scope)
          // scope.row.messageType === 1 ? this.$router.push(`/message-info?id=${scope.row.messageId}`) : window.open(scope.row.redirectUrl)
          // 普通消息: 101-系统消息; 102-审批消息     任务消息: 201-任务提醒
          if (scope.row.messageType === 101 || !scope.row.redirectUrl) {
            this.$router.push(`/message-info?id=${scope.row.messageId}`)
          } else {
            this.getOrderDetail(scope.row)
            // scope.row.redirectUrl ? (scope.row.redirectUrl.includes('//') ? window.open(scope.row.redirectUrl.trim()) : this.$router.push(scope.row.redirectUrl.trim())) : this.$router.push(`/message-info?id=${scope.row.messageId}`)
          }
          // scope.row.messageType === 201 || scope.row.messageType === 102 &&
          // `${this.needUri}/approval/my-submission`  /approval/submitted-to-me
          scope.row.messageType !== 201 && scope.row.messageStatus === 1 && this.clickRead(scope.row)
          // this.$router.push('/message-info')
        }
      },
      {
        prop: 'sendBy',
        label: '发起人',
        width: '100px',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedTime',
        label: '通知时间',
        showOverflowTooltip: true,
        width: '150px',
        formater: (scope) => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      }
    ]
    return {
      // user: '/user-center/micro-services'
      columns,
      dataSource1: [],
      dataSource2: [],
      total1: 0,
      total2: 0,
      showTable1: true,
      showTable2: true,
      flag: true,
      needUri: ''
      // 跳转逻辑
      // redirectInfo: {
      //   // 状态{0=草稿,1=新单待审,2=已审核,3=已废弃,4=已驳回,5=取消待审,6=取消会签中,7=已取消,8=变更待审,9=变更会签中,10=Hold单待审,11=Hold单会签中,12=Hold单,13=已完成}
      //   statusList: [1, 5, 8, 10], // 判断为审核中的状态
      //   urls: {
      //     1: '/customer-order/sample-orders/detail/:id/show', // 样板表单
      //     2: '/customer-order/goods-orders/detail/:id/show' // 大货表单
      //   }
      // }
      // qrOptions: {
      //   width: 100,
      //   height: 100,
      //   value: 'https://dev-erp.szhibu.com'
      // }
    }
  },
  computed: {
    unReadCount() {
      return this.$store.state.user.unreadCount
    },
    userId() {
      return this.$store.state.user.userInfo.userId
      // return 'd4dcdad6d6784f768975941e598ea480'
      // return '1c78f4c574d54d579bf50d9d4ec7666e'
    }
    // systemList() {
    //   return this.$store.state.user.menuData
    // }
  },
  watch: {
    unReadCount: {
      handler(v) {
        if (this.flag) {
          this.flag = false
          this.getMessagePage2()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async getMessagePage2() {
      await this.getMessagePage({ messageType: 2, messageStatus: 1 }, 1) // 待办
      await this.getMessagePage({ messageType: 1, messageStatus: 1 }, 2) // 未读消息
      this.flag = true
    },
    async getMessagePage(data, type) {
      // const clientId = this.searchFormDatas.clientId || this.clientId
      const res = await msgUserPage({ userId: this.userId, ...data })
      const userList = res.data.list || []
      if (!res.data.total) this.$set(this, 'showTable' + type, false)
      else {
        this.$set(this, 'total' + type, res.data.total)
        this.$set(this, 'dataSource' + type, userList)
      }
    },
    getOption(item) {
      // console.log(item)
      return {
        width: 165,
        height: 165,
        value: item.weChatUri
      }
    },
    // 获取CRM的uri用来判断环境是什么情况
    async getSysAppSystemList(data = {}) {
      const res = await sysAppSystemList(data)
      this.needUri = res.data.list.filter(item => item.appSysId === 9)[0].uri
      // console.log('needUri', this.needUri)
    },
    // 点击已读
    async clickRead(data = {}) {
      const mt = data.messageType === 101 || data.messageType === 102 ? 1 : 2
      const res = await userRead({ userId: this.userId, ...data, messageType: mt })
      if (res.code !== 200) {
        return false
      }
      this.$store.dispatch('user/getUnreadCount', { userId: this.userId })
      // this.getMessagePage()
    },
    // 获取流程 主要为了获取状态
    async getOrderDetail(data) {
      const redirectUrl = data.redirectUrl
      if (data.instanceId) {
        // const res = await queryAuditShift({ procInstId: data.instanceId })
        // if (res.data.state === 0) { // 0审核中 1完成  2驳回(审核拒绝) 3撤销(外界直接处理)
        //   // 审核中跳订单详情
        //   redirectUrl ? (redirectUrl.includes('//') ? window.open(redirectUrl.trim()) : this.$router.push(redirectUrl.trim())) : this.$router.push(`/message-info?id=${data.messageId}`)
        // } else {
        // 非审核中跳我的审批页面
        // 先跳到我的审批
        // console.log('我的审批', `/system-settings/review-processr/approve-list?status=${res.data.state}&nodeType=${res.data.nodeType}&instanceId=${data.instanceId}&bizId=${data.bizId}`)
        this.$router.push({ name: 'approve-list', params: { procInstId: data.instanceId }})
        // }
      } else {
        redirectUrl ? (redirectUrl.includes('//') ? window.open(redirectUrl.trim()) : this.$router.push(redirectUrl.trim())) : this.$router.push(`/message-info?id=${data.messageId}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    * {
        margin: 0;
        padding: 0;
        border: none 0;
        outline: none;
    }
    .mask {
        display: block;
    }
    .home_page {
        margin: 20px;
        .header {
            background: url("https://sfabric-exhibition.oss-cn-shenzhen.aliyuncs.com/user-center/static/other/image/banner.png") top left no-repeat #fff;
            background-size: cover;
            min-height: 144px;
            /* border-radius: 4px; */
            padding: 33px 20px 48px 40px;
            text-align: left;
            p {
                padding-top: 15px;
                letter-spacing: 2px;
                font-size: 16px;
                color: #888e9e;
                line-height: 22px;
                & .high {
                    color: #ffab00;
                }
            }
            h3.title {
                font-weight: 600;
                font-size: 18px;
                color: #151222;
            }
        }
        .wrap-tables {
            display: flex;
            margin-top: 15px;
            min-height: 65vh;
            .item {
                width: 49.5%;
                padding: 0 20px 20px;
                background: #fff;
                &:first-child {
                    margin-right: 20px;
                }
                .header-table {
                    line-height: 3.5;
                    font-size: 18px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .text2 {
                        color: #1890ff;
                        font-size: 14px;
                        cursor: pointer;
                    }
                }
                .wrap-none {
                    width: 100%;
                    height: 70%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-size: 14px;
                    .img-none {
                        margin-bottom: 20px;
                        width: 200px;
                        height: 117px;
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
    .home_page {
        .el-col {
            position: relative;
        }

        .box-card {
            // padding: 0;
            width: 256px;
            margin-bottom: 20px;
            // height: 400px;

            .el-card__body {
                padding: 0;
            }
        }

        // .wrap-tables {
        //   .el-table th {
        //     background-color: #f2f4f6;
        //   }
        // }
    }
</style>
