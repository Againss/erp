<template>
  <div class="wrap-review-process-edit">
    <div
      v-if="pageType !== 'add'"
      class="header-title"
    >
      {{ formDatas.workflowName }}
    </div>
    <div class="t-tab-container tab-wrap">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="基础设置"
          name="A"
        />
        <el-tab-pane
          label="流程设计"
          name="B"
        />
      </el-tabs>
      <div
        v-show="activeName === 'A'"
        class="wrap-pane"
      >
        <div class="info">
          <div class="title">基础信息</div>
          <cs-custom-form
            ref="editForm"
            class="form-detail-review-process"
            :data-source="formDataOptions"
            :form-datas="formDatas"
            :options="formOptions"
          />
        </div>
      </div>

      <div
        v-show="activeName === 'B'"
        class="wrap-pane"
        :class="pageType==='detail'?'detail':''"
      >
        <div v-if="pageType==='detail'" class="mask" />
        <flowChart
          ref="flow"
          :msg-notify-type="msgNotifyType"
          :flow-config-prop="formDatas.workflowNodes"
        />
      </div>
    </div>
    <!-- 底部按钮 -->
    <div
      :class="{ 'fixed-footer': !sidebar }"
      class="button-group"
    >
      <!-- <el-button
        v-if="pageType !== 'detail'"
        @click="handleView"
      >预览</el-button>
      <el-button
        v-if="tempPageType === 'view'"
        @click="handleView"
      >返回</el-button> -->
      <el-button
        v-if="pageType !== 'detail'"
        type="primary"
        @click="handleSubmit"
      >发布</el-button>
    </div>
  </div>
</template>

<script>
import { fetchLog } from '@/views/system-settings/common/fetchLog'
import { workflow, addWorkflow, modifyWorkflow, businessNoList } from './api/index'
import { getWorkflowGroup } from '../review-process-list/api/index'
import flowChart from '@/views/system-settings/review-process/components/flowChart.vue'
export default {
  components: { flowChart },
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    const formDataOptions = [
      {
        prop: 'workflowId',
        itemType: 'input',
        label: '流程ID：',
        disabled: false,
        // readonly: true,
        // isShow: true,
        itemStyle: { width: '40%' },
        rules: [commonBlurReg],
        placeholder: '流程ID'
      },
      {
        prop: 'workflowName',
        itemType: 'input',
        label: '流程名称：',
        disabled: false,
        maxlength: 20,
        itemStyle: { width: '40%' },
        rules: [commonBlurReg],
        placeholder: '请输入流程名称'
      },
      {
        prop: 'business',
        itemType: 'select',
        label: '业务表单：',
        disabled: false,
        filterable: true,
        valueType: 'object',
        valueKey: 'value',
        itemStyle: { width: '40%' },
        rules: [commonBlurReg],
        placeholder: '请选择关联业务表单',
        dataSource: [],
        loadMore: () => {
          this.getBusinessList()
        }
      },
      {
        prop: 'msgNotifyType',
        itemType: this.inputTypeChange,
        label: '发起人通知设置',
        itemClassName: 'line-label',
        itemStyle: {
          width: '100%',
          marginBottom: '20px',
          paddingTop: '20px',
          marginTop: '15px',
          borderTop: '1px solid #DCDFE6'
        },
        rules: [commonBlurReg],
        placeholder: '请选择发起人通知设置',
        dataSource: [
          {
            label: '全节点通知',
            value: 0
          },
          {
            label: '审批完结通知',
            value: 1
          },
          {
            label: '节点自定义',
            value: 2
          }
        ],
        change: (value) => {
          this.msgNotifyType = value
        },
        renderContent: (value) => {
          return this.formDataOptions[3].dataSource[value].label
        }
      },
      {
        prop: 'groupId',
        itemType: this.selectTypeChange,
        label: '所在分组',
        // props: {
        //   label: 'groupName',
        //   value: 'groupId'
        // },
        itemClassName: 'line-label',
        itemStyle: {
          marginBottom: '20px',
          width: '100%'
          // paddingTop: '20px',
          // marginTop: '15px',
          // borderTop: '1px solid #DCDFE6'
        },
        rules: [commonBlurReg],
        placeholder: '请选择所在分组',
        dataSource: []
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        itemClassName: 'line-label',
        label: '流程说明',
        showWordLimit: true,
        maxlength: 100,
        rows: 3,
        itemStyle: { width: '100%' },
        rules: [],
        placeholder: '请输入流程说明（最多100个字）'
      }
    ]
    return {
      activeName: 'A',
      formOptions: {
        size: 'small',
        layout: false,
        inline: false
      },
      formDataOptions,
      originOption: formDataOptions,
      formDatas: {
        msgNotifyType: 0
      },
      msgNotifyType: 0,
      oldForm: {},
      // 业务表单列表
      businessList: {
        data: [],
        pageSize: 20,
        pageNum: 1
      },
      tempPageType: ''
    }
  },
  computed: {
    ifEdit() {
      return this.$route.params.hasOwnProperty('id')
    },
    pageType() {
      if (this.tempPageType === 'view') {
        return 'detail'
      } else if (this.$route.path.includes('edit')) {
        return 'edit'
      } else if (this.$route.path.includes('add')) {
        return 'add'
      } else return 'detail'
    },
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  mounted() { },
  created() {
    this.businessList.pageNum = 1
    this.initPage()
    this.getGroupList()
    this.getBusinessList()
  },
  methods: {
    initPage() {
      this.formDataOptions = this.$utils.deepClone(this.originOption)
      if (this.pageType !== 'add') {
        // !this.formDatas.hasOwnProperty('id') 这个条件是为了 预览 -> 返回，隐藏预览按钮后这个条件没有意义
        if (this.tempPageType !== 'view' && !this.formDatas.hasOwnProperty('id')) this.getWorkflow()
        // this.formDataOptions[2].itemType = 'input'
        this.formDataOptions[2].disabled = true
        let length = 3
        if (this.pageType === 'detail') {
          length = this.formDataOptions.length
          // this.formDataOptions[3].itemType = 'itemview'
          // this.formDataOptions[3].itemType = 'input'
          this.formDataOptions[4].disabled = true
          this.formDataOptions[4].filterable = true
          this.formDataOptions[5].type = 'text'
          this.formDataOptions[5].placeholder = ''
          this.formDataOptions[3].itemStyle = {}
          this.formDataOptions[4].itemStyle = {
            marginBottom: '10px'
          }
          this.formDataOptions[3].itemClassName = ''
          this.formDataOptions[4].itemClassName = ''
          this.formDataOptions[3].label += '：'
          this.formDataOptions[4].label += '：'
        } else {
          // this.formDataOptions[3].itemStyle = {
          //   width: "100%",
          //   paddingTop: "20px",
          //   marginTop: '15px',
          //   borderTop: "1px solid #DCDFE6",
          // };
          // this.formDataOptions[3].itemStyle.width = "100%";
          // this.formDataOptions[4].itemStyle = {
          //   marginTop: '20px'
          // }
        }
        for (let i = 0; i < length; i++) {
          this.formDataOptions[i].readonly = true
        }
      } else {
        for (let i = 0; i < this.formDataOptions.length; i++) {
          this.formDataOptions[i].itemStyle.marginBottom = i === 1 || i === 2 ? '24px' : '20px'
          // this.formDataOptions[i].itemStyle.marginBottom = '20px'
        }
        this.formDataOptions[0].isShow = false
      }
    },
    async loadMore() {
      console.log('loadmore')
    },
    async getGroupList() {
      const res = await getWorkflowGroup()
      const tempList = (res.data && res.data.list) || []
      tempList.reverse()
      // console.log(this.formDataOptions[3].dataSource)
      for (let i = 0; i < tempList.length; i++) {
        tempList[i].label = tempList[i].groupName
        tempList[i].value = tempList[i].groupId + ''
        if (this.pageType === 'detail' && this.formDatas.groupId === tempList[i].value) {
          this.formDatas.groupId = tempList[i].label
        }
        // 不显示已停用分组
        // if (tempList[i].groupName === '已停用' && parseInt(this.formDatas.groupId) !== tempList[i].groupId) { tempList.splice(i--, 1) }
        // tempList[i].disabled = 'disabled'
      }
      this.$set(this.formDataOptions[4], 'dataSource', tempList)
      this.originOption[4].dataSource = tempList
    },
    async getBusinessList() {
      const res = await businessNoList(/* { pageNum: this.businessList.pageNum++, pageSize: this.businessList.pageSize }*/)
      console.log(res)
      const businessList = (res.data && res.data.list) || []
      for (let i = 0; i < businessList.length; i++) {
        businessList[i].label = businessList[i].name
        businessList[i].value = businessList[i].id
      }
      this.formDataOptions[2].dataSource = businessList
      this.originOption[2].dataSource = businessList
    },
    async getWorkflow() {
      const res = await workflow({ workflowId: this.$route.params.id })
      this.formDatas = res.data || {}
      this.formDatas.business = this.formDatas.businessName
      if (this.formDatas.status === 1) this.formDataOptions[4].disabled = true
      this.msgNotifyType = this.formDatas.msgNotifyType
      this.oldForm = { ...this.formDatas }
    },
    handleClick() { },
    handleSubmit() {
      this.formDatas = { ...this.$refs.editForm.form.model }
      this.formDatas.icon = this.formDatas.icon || '#'
      this.formDatas.url = this.formDatas.url || '#'
      const res = this.$refs.flow.getData()
      if (!res) {
        if (this.activeName === 'A') this.activeName = 'B'
        return false
      } else this.formDatas.workflowNodes = res
      // 验证至少一个审核人
      const res1 = JSON.parse(res)
      const tip = res1.find(i => i.type === '2')
      if (!tip) {
        this.$message({
          message: '请至少选择一个审批人',
          type: 'warning'
        })
        if (this.activeName === 'A') this.activeName = 'B'
        return
      }
      this.$refs.editForm.form.validate(async(valid) => {
        if (valid) {
          this.formDatas.businessId = this.formDatas.business.value
          this.formDatas.businessName = this.formDatas.business.label
          if (this.pageType === 'edit') {
            this.formDatas.isModifyWorkflow = this.formDatas.workflowNodes !== this.oldForm.workflowNodes ? 1 : 0
            await modifyWorkflow(this.formDatas)
            const { beforeCode, afterCode } = this.compareData(
              this.oldForm,
              this.formDatas,
              'id'
            )
            const flag =
              JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag &&
              this.fetchLog(
                this.getLogMessages('UPDATE', '/workflow/modify'),
                this.formDatas,
                JSON.stringify({
                  beforeText: `在'系统设置-审核流程,将${JSON.stringify(
                    { id: this.formDatas.id }
                  )}`,
                  afterText: '修改为',
                  ...{ beforeCode, afterCode }
                })
              )
          } else {
            await addWorkflow(this.formDatas)
            this.fetchLog(
              this.getLogMessages('INSERT', '/workflow/add'),
              this.formDatas,
              JSON.stringify({
                beforeText: `在'系统设置-审核流程,新增一条记录`,
                beforeCode: this.formDatas
              })
            )
          }
          // this.$router.push('/system-settings/review-processr/review-processr-list')
          this.$router.push({ name: 'review-processr-list' })
        } else {
          if (this.activeName === 'B') this.activeName = 'A'
        }
      })
    },
    handleCancel() {
      this.$router.go(-1)
    },
    handleView() {
      this.tempPageType = this.tempPageType === 'view' ? '' : 'view'
      this.initPage()
    },
    inputTypeChange() {
      return this.pageType === 'detail' ? 'itemview' : 'radio-group'
    },
    selectTypeChange() {
      return this.pageType === 'detail' ? 'itemview' : 'select'
    }
  }
}
</script>

<style lang="scss" scoped>
.header-title {
  font-size: 16px;
  font-family: PingFangSC-Medium;
  padding: 20px 20px 0;
}
.tab-wrap {
  position: relative;
  padding: 20px;
  /deep/.el-tabs__nav-wrap {
    padding-left: 20px;
    background: #fff;
    &::after {
      height: 1px;
    }
  }
  /deep/ .el-tabs__header {
    margin-bottom: 1px;
  }
  /deep/ .el-tabs__item {
    height: 60px;
    line-height: 60px;
  }

  .wrap-pane {
    background-color: #fff;
    padding: 30px 60px;
    position: relative;
    .info {
      padding: 0 20px;
      // background-color: #f0f2f5;
    }
    .title {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      margin-bottom: 20px;
      color: #3c4043;
      font-weight: bolder;
    }
    .mask {
      position: absolute;
      z-index: 100;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .header {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 3;
    padding: 15px;
  }
}
.button-group {
  width: calc(100% - 210px);
  transition: width 0.28s;
  position: fixed;
  text-align: center;
  bottom: 0;
  padding: 10px;
  background: #ffffff;
  border-top: 1px solid #ecf0f3;
  z-index: 999;
}
.fixed-footer {
  width: calc(100% - 54px) !important;
}
</style>

<style lang="scss">
.form-detail-review-process {
  .el-form-item {
    margin-bottom: 0;
    .el-form-item__content > .el-input [readonly="readonly"],
    .el-form-item__content
      .el-input
      [readonly="readonly"][disabled="disabled"] {
      padding: 0;
      border: 0;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      background: transparent;
      color: #606266 !important;
      cursor: text;
      & + .el-input__suffix {
        display: none;
      }
    }
    &.itemview .el-form-item__content{
      font-size: 14px;
      color: #606266 !important;
    }
    .el-form-item__label-wrap {
      margin-left: 0 !important;
    }
    &.line-label {
      .el-form-item__label-wrap {
        .el-form-item__label {
          color: #3c4043;
          font-weight: bolder;
        }
      }
      .el-form-item__content {
        font-family: PingFangSC-Regular;
        margin-left: 0 !important;
      }
      .el-radio-group {
        width: 100%;
      }
    }
  }
}
// .wrap-review-process-edit {
//   .wrap-pane.detail {
//     .add-node-btn .btn.el-popover__reference {
//       display: none;
//     }
//   }
// }
</style>
