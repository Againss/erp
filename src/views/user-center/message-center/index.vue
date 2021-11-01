<template>
  <div class="wrap-message-center">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <!-- 新增角色按钮 -->
    <!-- <div class="button">
          <el-button
            size="small"
            :type="messageStatus===1?'primary':''"
            @click="agencyMessage"
          >待办</el-button>
          <el-button
            size="small"
            :type="messageStatus===2?'primary':''"
            @click="readMessage"
          >已读</el-button>
          <el-button
            size="small"
            :type="!messageStatus?'primary':''"
            @click="allMessage"
          >全部</el-button>
          <el-button
            size="small"
            type="primary"
            style="float: right"
            @click="oneClickRead"
          >一键已读</el-button>
        </div> -->
    <div class="wrap-tabs">
      <div class="tabs">
        <!-- @tab-click="" -->
        <el-tabs
          v-model="messageType"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="我的任务"
            name="2"
          />
          <el-tab-pane
            label="我的消息"
            name="1"
          />
        </el-tabs>
      </div>
      <div
        class="tabs"
        style="margin: 0 10px"
      >
        <!-- @tab-click="" -->
        <el-tabs
          v-model="messageStatus"
          class="tabs2"
          @tab-click="handleClick"
        >
          <el-tab-pane
            :label="messageType === '2' ? '待办' : '未读'"
            name="1"
          />
          <el-tab-pane
            :label="messageType === '2' ? '已办' : '已读'"
            name="2"
          />
          <el-tab-pane
            label="全部"
            name="-1"
          />
        </el-tabs>
      </div>
      <el-button
        class="btn-read"
        size="small"
        type="primary"
        @click="oneClickRead"
      >一键{{ messageType === '2' ? '已办' : '已读' }}</el-button>
    </div>
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
      />
    </div>
  </div>
</template>

<script>
// import { userList } from '../employee-management/api/index.js'
import { msgUserPage, userRead } from './api/index.js'
// import { appIdList } from '../log-management/api/index.js'
// import systemDataSource from '../log-management/config/system-data-source.js'
import { sysAppSystemList } from '../micro-services/api/index.js'
// import { getDetail } from '@/views/customer-order/goods-orders/api/index.js' // 获取订单详情
export default {
  components: {
  },
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const searchData = [
      {
        prop: 'keyword',
        itemType: 'input',
        // itemStyle: { width: '25%' },
        label: '关键字:',
        placeholder: '请输入消息关键字'
      },
      // {
      //   prop: 'messageType',
      //   itemType: 'select',
      //   // itemStyle: { width: '25%' },
      //   label: '消息类型:',
      //   dataSource: [
      //     {
      //       label: '全部',
      //       value: null
      //     },
      //     {
      //       label: '系统消息',
      //       value: 1
      //     },
      //     {
      //       label: '任务提醒',
      //       value: 2
      //     }
      //   ]
      // },
      // {
      //   prop: 'appSystemId',
      //   itemType: 'select',
      //   // itemStyle: { width: '25%' },
      //   label: '所属系统:',
      //   dataSource: []
      // },
      {
        itemType: 'date',
        type: 'daterange',
        // itemStyle: { width: '25%' },
        prop: 'dateRange',
        label: '时间范围:',
        // style: { width: '300px' },
        // itemStyle: { width: '315px' },
        // pickerOptions: pickerOptions,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
        // change: timeChange
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log(params)
          // const clientId = params.clientId && params.clientId.length === 0 ? null : params.clientId
          const startTime = params.dateRange && params.dateRange.length !== 0 ? this.$filters.parseTime(params.dateRange[0] + '', '{y}-{m}-{d} {h}:{i}:{s}') : null
          const endTime = params.dateRange && params.dateRange.length !== 0 ? this.$filters.parseTime(params.dateRange[1] + '', '{y}-{m}-{d} {h}:{i}:{s}') : null
          this.searchFormDatas = { ...params, startTime, endTime }
          this.getMessagePage({ ...params, startTime, endTime })
        },
        resetHandle: () => {
          console.log('重置')
          this.searchFormDatas = {}
        }
      }
    ]
    const columns = [
      {
        prop: 'title',
        label: '消息标题',
        minWidth: '300',
        formater: scope => {
          return `<span style="cursor: pointer; color: #1890ff;">${scope.row[scope.column.property]}</span>`
        },
        handle: scope => {
          console.log(scope)
          // 普通消息: 101-系统消息; 102-审批消息     任务消息: 201-任务提醒
          if (scope.row.messageType === 101 || !scope.row.redirectUrl) {
            this.$router.push(`/message-info?id=${scope.row.messageId}`)
          } else {
            this.getOrderDetail(scope.row)
          }
          // scope.row.messageType === 201 || scope.row.messageType === 102 &&
          // `${this.needUri}/approval/my-submission`
          scope.row.messageType !== 201 && scope.row.messageStatus === 1 && this.clickRead(scope.row)
        }
        // align: 'center',
        // sortable: true
      },
      {
        prop: 'sendBy',
        label: '发起人',
        width: '155',
        showOverflowTooltip: true
        // align: 'center',
      },
      {
        prop: 'sendTime',
        label: '通知时间',
        width: '205',
        formater: scope => {
          return this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}')
        }
      },
      {
        prop: 'dealTime',
        label: '处理时间',
        width: '205',
        formater: scope => {
          return scope.row[scope.column.property] && this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}')
        }
      },
      {
        prop: 'messageStatus',
        label: '状态',
        width: '80',
        formater: scope => {
          const status = scope.row[scope.column.property]
          return status === 1 ? `<span style="color: #FF9214;">${this.messageType === '2' ? '待办' : '未读'}</span>` : `<span style="color: #00BCC5;">${this.messageType === '2' ? '已办' : '已读'}</span>`
        }
      }
    ]
    const pagination = {
      // currentPage: 1,
      pageSizes: [10, 20, 50, 100],
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getMessagePage({ pageSize: this.pagination.pageSize || 10, pageNum: val })
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.getMessagePage({ pageNum: 1, pageSize: val })
      }
    }
    return {
      formOtions: {
        // layout: true,
        size: 'small',
        inline: true
      },
      searchFormDatas: {
        keyword: ''
      },
      formDatas: {
        keyword: '',
        dateRange: []
      },
      searchData,
      columns,
      dataSource: [],
      pagination,
      flag: true,
      needUri: '',
      messageStatus: '1', //  1 待办 2 已办 空 全部
      messageType: '-1' // 1 消息 2 任务
      // 跳转逻辑
      // redirectInfo: {
      //   // 状态{0=草稿,1=新单待审,2=已审核,3=已废弃,4=已驳回,5=取消待审,6=取消会签中,7=已取消,8=变更待审,9=变更会签中,10=Hold单待审,11=Hold单会签中,12=Hold单,13=已完成}
      //   statusList: [1, 5, 8, 10], // 判断为审核中的状态
      //   urls: {
      //     1: '/customer-order/sample-orders/detail/:id/show', // 样板表单
      //     2: '/customer-order/goods-orders/detail/:id/show' // 大货表单
      //     // 4: '/pms/order-management/detail?id=:id' // pms 采购
      //   }
      // }
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.userInfo.userId
      // return 'd4dcdad6d6784f768975941e598ea480'
      // return '1c78f4c574d54d579bf50d9d4ec7666e'
      // return 'd1083abf9d0b4a87ae3e35e04e9e6619'
    },
    unReadCount() {
      return this.$store.state.user.unreadCount
    },
    ifCrm() {
      return window.location.hostname.includes('crm')
    }
  },
  watch: {
    unReadCount: {
      handler(v) {
        if (this.flag) {
          this.flag = false
          if (this.messageType === '-1') { this.messageType = this.$route.params.messageType || '2' }
          this.getMessagePage()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.getSystemList()
    // this.getMessagePage()
    // this.getSysAppSystemList()
  },
  methods: {
    // 获取消息分页列表
    async getMessagePage(data = {}) {
      // const clientId = this.searchFormDatas.clientId || this.clientId
      const res = await msgUserPage({ ...this.searchFormDatas, ...data, userId: this.userId, messageStatus: this.messageStatus === '-1' ? null : this.messageStatus, messageType: this.messageType })
      this.flag = true
      console.log('消息列表', res)
      const userList = res.data.list || []
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },
    // 获取系统列表
    // async getSystemList(data = {}) {
    //   //   const appSystemIds = this.appSystemIds
    //   const res = await appIdList(data)
    //   const systemList = Object.keys(res.data).map(item => {
    //     return { value: item, label: res.data[item] }
    //   })
    //   // console.log('系统列表', systemList)
    //   const list = systemList.length !== 0 ? [{ value: null, label: '全部' }, ...systemList] : []
    //   this.$set(this.searchData[2], 'dataSource', list)
    //   //   const tempData = this.searchData[0].dataSource.find(item => item.value * 1 === this.systemId * 1)
    //   //   this.systemName = tempData && tempData.label
    // },
    // 获取CRM的uri用来判断环境是什么情况
    async getSysAppSystemList(data = {}) {
      const res = await sysAppSystemList(data)
      this.needUri = res.data.list.filter(item => item.appSysId === 9)[0].uri
      // console.log('needUri', this.needUri)
    },
    // 按钮代办的点击事件
    agencyMessage() {
      if (this.messageStatus === 1) {
        return false
      }
      this.messageStatus = 1
      this.getMessagePage()
    },
    // 按钮已读的点击事件
    readMessage() {
      if (this.messageStatus === 2) {
        return false
      }
      this.messageStatus = 2
      this.getMessagePage()
    },
    // 按钮全部的点击事件
    allMessage() {
      if (!this.messageStatus) {
        return false
      }
      this.messageStatus = null
      this.getMessagePage()
    },
    // 按钮一键已读的点击事件
    oneClickRead() {
      this.clickRead({ updateAll: 1 })
      // this.getMessagePage()
    },
    // 点击已读
    async clickRead(data = {}) {
      const res = await userRead({ userId: this.userId, ...data, messageType: this.messageType })
      if (res.code !== 200) {
        return false
      }
      this.$store.dispatch('user/getUnreadCount', { userId: this.userId })
      // this.getMessagePage()
    },
    handleClick() {
      this.getMessagePage()
    },
    // 获取流程 主要为了获取状态
    async getOrderDetail(data) {
      const redirectUrl = data.redirectUrl
      if (data.instanceId) {
        // const res = await queryAuditShift({ procInstId: data.instanceId })
        // if (res.data.state === 0) { // 0审核中 1完成  2驳回(审核拒绝) 3撤销(外界直接处理)
        //   // 审核中跳订单详情
        //   if (this.ifCrm && !redirectUrl.includes('//')) {
        //     window.open(this.erpHost() + redirectUrl.trim())
        //   } else {
        //     redirectUrl ? (redirectUrl.includes('//') ? window.open(redirectUrl.trim()) : this.$router.push(redirectUrl.trim())) : this.$router.push(`/message-info?id=${data.messageId}`)
        //   }
        // } else {
        // 非审核中跳我的审批页面
        // 先跳到我的审批
        console.log('我的审批', `/approve-list?procInstId=${data.instanceId}`)
        // this.$router.push(`/system-settings/review-processr/approve-list?procInstId=${data.instanceId}`)
        this.$router.push({ name: 'approve-list', params: { procInstId: data.instanceId }})
        // }
      } else {
        redirectUrl ? (redirectUrl.includes('//') ? window.open(redirectUrl.trim()) : this.$router.push(redirectUrl.trim())) : this.$router.push(`/message-info?id=${data.messageId}`)
      }
    },
    erpHost() {
      const origin = window.location.origin || window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
      return origin.replace('crm', 'erp')
    }
  }
}
</script>

<style lang='scss' scoped>
    .wrap-message-center {
        padding: 20px;
        .page-table /deep/ .el-table {
            th > .cell, .cell {
                padding-left: 20px;
            }
        }
    }
    .wrap-tabs {
        position: relative;
        padding-bottom: 0;
        min-height: 60px;
        background-color: #fff;
        .tabs {
            padding-bottom: 1px;
            border-bottom: 1px solid #dfe6ec;
            display: flex;
            // width: 100%;
            flex: 2;
            overflow-x: auto;
            overflow-y: hidden;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #3c4043;
            text-align: center;
            /deep/ .el-tabs__header {
                margin-bottom: 0px;
            }
            /deep/ .el-tabs__nav-wrap::after {
                height: 0px !important;
            }
            /deep/ .el-tabs__item {
                height: 60px;
                line-height: 60px;
                padding: 0 26px;
            }
            .tabs2 /deep/ .el-tabs__item {
                height: 50px;
                line-height: 50px;
                padding: 0 20px;
            }
        }
        .btn-read {
            position: absolute;
            right: 20px;
            top: 14px;
        }
        .dropdown-operate {
            padding-right: 20px;
        }
    }
</style>
