<template>
  <div class="wrap-flow-list">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>

    <div class="wrap-tabs">
      <!-- <el-scrollbar
        ref="tabsScrollContainer"
        class="scroll-container"
        @wheel.native.prevent="handleScroll"
      > -->
      <div class="tabs">
        <!-- @tab-click="" -->
        <el-tabs
          v-model="activeIdx"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="我提交的"
            name="myApply"
          />
          <el-tab-pane
            label="我审批的"
            name="myAudit"
          />
        </el-tabs>
      </div>
      <div
        class="tabs tabs2"
        style="margin: 0 10px"
      >
        <!-- @tab-click="" -->
        <el-tabs
          v-model="activeIdx2"
          @tab-click="handleClick"
        >
          <el-tab-pane
            v-for="(item, k) in (activeIdx === 'myApply' ? status : status2)"
            :key="k"
            :label="item.label"
            :name="item.value"
          />
        </el-tabs>
      </div>
    </div>
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="light"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <approve-detail
      v-if="config.visible"
      :config="config"
      @close="config.visible = false"
    />
  </div>
</template>

<script>
import { fetchLog } from '@/views/system-settings/common/fetchLog'
import approveDetail from '@/components/approveDetail/index.vue'
import {
  myAuditList, myApplyList, userPageList, queryAuditShift
} from './api/index'
// import enableSwitch from "./components/enableSwitch";
// import tableHeader from "./components/table-header";
export default {
  components: { approveDetail },
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    // const pickerOptions1 = {
    //   disabledDate(time) {
    //     if (this.$refs.searchForm.dynamicValidateFormRuleForm.end) {
    //       return time.getTime() > new Date(this.$refs.searchForm.dynamicValidateFormRuleForm.end).getTime() - 8 * 60 * 60 * 1000 || time.getTime() > Date.now()
    //     }
    //   }
    // }
    // const pickerOptions2 = {
    //   // shortcuts: [
    //   //   {
    //   //     text: '今天',
    //   //     onClick(picker) {
    //   //       picker.$emit('pick', new Date())
    //   //     }
    //   //   }
    //   // ],
    //   disabledDate(time) {
    //     if (this.$refs.searchForm.dynamicValidateFormRuleForm.start) {
    //       return time.getTime() < new Date(this.$refs.searchForm.dynamicValidateFormRuleForm.start).getTime() || time.getTime() > Date.now()
    //     }
    //   }
    // }
    // const timeChange1 = (value) => {
    //   console.log(value)
    // if (value === null) {
    //   this.searchData[1].children._end.pickerOptions.disabledDate = (time) => {
    //     return time.getTime() > Date.now()
    //   }
    // } else {
    //   this.searchData[1].children._end.pickerOptions.disabledDate = (time) => {
    //     return time.getTime() < new Date(value).getTime() - 8 * 60 * 60 * 1000 || time.getTime() > Date.now()
    //   }
    // }
    // }
    // const timeChange2 = (value) => {
    //   console.log(value)
    // }
    const searchData = [
      {
        prop: 'keyword',
        itemType: 'input',
        label: '关键字：',
        itemStyle: { width: '25%' },
        placeholder: '请输入审批名称或者业务对象的关键字'
      },
      {
        isShow: () => { return this.activeIdx === 'myAudit' },
        prop: 'applyUserId',
        itemType: 'select',
        label: '发起人：',
        filterable: true,
        className: 'commonRemoteSearch',
        remote: true,
        remoteMethod: this.getUserPage,
        clearable: true,
        maxlength: 50,
        placeholder: '请输入发起人',
        dataSource: []
        // loadMore: () => {
        // }
      },
      {
        rowStyle: { width: '35%' },
        // children可以为对象也可以为数组，如果业务逻辑较多需要对每个子元素进行属性修改 建议用对象会方便很多
        children: {
          _start: {
            prop: 'start',
            itemType: 'date',
            label: '发起时间：',
            span: 12,
            itemStyle: { paddingRight: '0px', marginRight: '0px' },
            placeholder: '请选择',
            pickerOptions: {}
            // change: timeChange1
          },
          _nameRowC2: {
            prop: 'nameRowC2',
            itemType: 'view',
            text: '-',
            span: 2,
            style: { textAlign: 'center', lineHeight: '36px' },
            labelWidth: '0'
          },
          _end: {
            prop: 'end',
            span: 10,
            itemType: 'date',
            label: '',
            labelWidth: '0',
            placeholder: '请选择',
            pickerOptions: {}
            // change: timeChange2
          }
        }
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = this.$utils.deepClone(params)
          if (this.searchFormDatas.start) {
            const day1 = new Date(this.searchFormDatas.start)
            this.searchFormDatas.start = day1.getTime() + ''
          }
          if (this.searchFormDatas.end) {
            const day2 = new Date(this.searchFormDatas.end)
            day2.setDate(day2.getDate() + 1)
            this.searchFormDatas.end = day2.getTime() + ''
          }
          this.getRulePage()
        },
        resetHandle: () => {

        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'workflowName',
        label: '审批名称',
        minWidth: '230',
        showOverflowTooltip: true,
        style: {
          color: '#0986FF',
          cursor: 'pointer'
        },
        handle: (scope) => {
          this.config.workflowId = scope.row.orderNumber
          this.config.procInstId = scope.row.procInstId
          const redirectUrl = scope.row.pcUrl.replace()
          this.config.redirectUrl = redirectUrl.replace('${id}', scope.row.orderNumber)
          this.config.visible = true
          // this.$router.push(`/system-settings/review-processr/detail/${scope.row.procInstId}?redirectUrl=${scope.row.pcUrl.replace('${id}', scope.row.orderNumber)}`)
        }
      },
      {
        prop: 'businessName',
        label: '业务对象',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'createdByName',
        label: '发起人',
        minWidth: '120',
        showOverflowTooltip: true,
        isShow: () => { return this.activeIdx === 'myAudit' }
      },
      {
        prop: 'createdTime',
        label: '发起时间',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}:{s}') : ''
        }
      },
      {
        prop: 'state',
        label: '状态',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getStatus(scope.row)
        }
      }
    ]
    // let popOperatesDataSource = []
    // popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    // const popOperates = {
    //   label: '操作',
    //   width: '200',
    //   fixed: 'right',
    //   dataSource: popOperatesDataSource
    // }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getRulePage({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getRulePage({ page: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    return {
      // 审核单状态 0审核中 1通过 2驳回(审核拒绝) 3撤销(外界直接处理)
      status: {
        '0': {
          value: '0',
          label: '审批中',
          color: '#00BCC5'
        },
        '1': {
          value: '1',
          label: '已通过',
          color: '#FF9B02'
        },
        '2': {
          value: '2',
          label: '已驳回',
          color: '#ff4545'
        },
        '3': {
          value: '3',
          label: '已撤销',
          color: '#1890ff'
        },
        '-1': {
          value: '-1',
          label: '全部'
        }
      },
      status2: {
        '0': {
          value: '0',
          label: '待办',
          color: '#00BCC5'
        },
        '2': {
          value: '2',
          label: '已办',
          color: 'blue'
        },
        '4': {
          value: '4',
          label: '抄送我的',
          color: 'yellow'
        }
      },
      activeIdx: 'myApply',
      activeIdx2: '0',
      searchData,
      formOtions: {
        size: 'small',
        inline: true
      },
      searchFormDatas: {},
      columns,
      dataSource: [],
      pagination,
      config: {
        visible: false,
        workflowId: '',
        procInstId: '',
        formDatas: {
          _approve: []
        },
        // start: (getInfo) => {
        //   console.log(getInfo.data, 'arr')
        //   this.$set(this.config.formDatas, '_approve', getInfo.data)
        // },
        pass: (res) => {
        },
        refuse: () => {
        },
        content: {
          _remark: {
            label: '备注11',
            maxlength: 2,
            showWordLimit: true
          }
        }
      },
      actions: {
        myAudit: myAuditList,
        myApply: myApplyList
      }
    }
  },
  computed: {
    ifCrm() {
      return window.location.hostname.includes('crm')
    }
  },
  created() {
    this.initData()
    console.log('this.$route.params.procInstId', this.$route.params.procInstId)
    this.searchData[2].children._start.pickerOptions.disabledDate = (time) => {
      if (this.$refs.searchForm.dynamicValidateFormRuleForm.end) {
        return time.getTime() > new Date(this.$refs.searchForm.dynamicValidateFormRuleForm.end).getTime() || time.getTime() > Date.now()
      } else {
        return time.getTime() > Date.now()
      }
    }
    this.searchData[2].children._end.pickerOptions.disabledDate = (time) => {
      if (this.$refs.searchForm.dynamicValidateFormRuleForm.start) {
        return time.getTime() < new Date(this.$refs.searchForm.dynamicValidateFormRuleForm.start).getTime() - 8 * 60 * 60 * 1000 || time.getTime() > Date.now()
      } else {
        return time.getTime() > Date.now()
      }
    }
    // this.getRulePage(params)
  },
  methods: {
    // 列表查询
    async getRulePage(data = {}, isSearch) {
      console.log('searchFormDatas', this.searchFormDatas)
      const params = this.activeIdx2 !== '-1' ? { state: this.activeIdx2 } : {}
      const res = await this.actions[this.activeIdx]({
        ...this.searchFormDatas,
        ...data,
        ...params
      })
      this.dataSource = (res.data && res.data.list) || []
      this.pagination = {
        ...this.pagination,
        dataTotal: (res.data && res.data.total) || 0,
        ...data,
        currentPage: (res.data && res.data.pageNum) || 1,
        pageSize: (res.data && res.data.pageSize) || 20
      }
      if (!isSearch) {
        // this.setSearchSelect();
      }
    },
    getStatus(row) {
      return `<span style="color:${this.status[row.state] && this.status[row.state].color}">${this.status[row.state] && this.status[row.state].label || '未知'}</span>`
    },
    handleClick(v) {
      if (v.name === 'myApply' || v.name === 'myAudit') {
        this.activeIdx2 = '0'
      }
      this.getRulePage()
    },
    // 获取用户分页列表
    async getUserPage(value) {
      if (value === '') return false
      const res = await userPageList({ realName: value })
      const userList = res.data.list || []
      this.searchData[1].dataSource = userList.map(item => {
        return {
          label: item.realName,
          value: item.userId
        }
      })
    },
    async initData() {
      const params = {}
      if (this.$route.params.procInstId) {
        const res = await queryAuditShift({ procInstId: this.$route.params.procInstId })
        // 有业务id，就想获取业务审批信息
        // 节点类型：1申请，2审核，3网关，4抄送
        // 是否完成 0审核中 1完成  2驳回(审核拒绝) 3撤销(外界直接处理)
        // 先控制列表页展示
        if (res.data.nodeType === 2 || res.data.nodeType === 4) {
          this.activeIdx = 'myAudit'
          this.activeIdx2 = res.data.nodeType === 4 ? '4' : '0'
          // 我审批的 传数组
          params.procInstIds = [this.$route.params.procInstId]
        } else if (res.data.nodeType === 1) {
          // 我提交的 传单个
          params.procInstId = this.$route.params.procInstId
          this.activeIdx2 = res.data.state + ''
        }
        // 再控制打开业务表单或者审批详情
        const redirectUrl = res.data.pcUrl.replace('${id}', res.data.orderNumber)
        if (res.data.state === 0 && res.data.orderNumber) {
          // 审核中打开业务表单详情
          // this.activeIdx2 = '0'
          if (this.ifCrm && !redirectUrl.includes('//')) {
            console.log(this.erpHost() + redirectUrl.trim())
            window.open(this.erpHost() + redirectUrl.trim())
          } else {
            console.log(redirectUrl)
            redirectUrl.includes('//') ? window.open(redirectUrl) : this.$router.push(redirectUrl)
          }
        } else {
          // 非审核中打开审批详情
          this.config.workflowId = res.data.orderNumber
          this.config.procInstId = this.$route.params.procInstId
          this.config.redirectUrl = redirectUrl
          this.config.visible = true
        }
        this.getRulePage(params)
      } else {
        this.getRulePage(params)
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
.wrap-flow-list {
  padding: 20px;
  padding-bottom: 0px;
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
    &.tabs2 /deep/ .el-tabs__item {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
  }
  .btn-read {
    position: absolute;
    right: 10px;
    top: 14px;
  }
  .dropdown-operate {
    padding-right: 20px;
  }
}
</style>

<style lang="scss">
</style>
