<template>
  <div class="finished-fabric-inspection-detail">
    <!--  状态栏  -->
    <status-bar ref="statusBar" :data="data" />
    <!--  查看批色  -->
    <view-batch-color ref="viewBatchColor" :data="data" />
    <!--  对色标准  -->
    <color-standard ref="colorStandard" :data="data" />
    <!--  批色要求  -->
    <batch-requirements ref="batchRequirements" :data="data" />
    <!--  批色信息  -->
    <batch-color-info ref="batchColorInfo" :data="data" :is-edit="isEdit" :sync-moudle-data-handle="syncMoudleDataHandle" />
    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <operate-buttons ref="operateButtons" :data="freshData" :is-edit="isEdit" @doEdit="doEdit" @doCancel="doCancel" @doSubmit="doSubmit" @doSave="doSave" @doExamine="doExamine" />
    </div>
    <!-- 审核弹框 -->
    <examine-dialog ref="examineDialog" :data="data" />
  </div>
</template>

<script>
import { qaFinishBatchColorInfo, qaFinishBatchColorInfoModify, qaFinishBatchColorInfoModifyNoAuth, exchange } from './api/index'
import statusBar from './components/status-bar'
import batchColorInfo from './components/batch-color-info'
import operateButtons from './components/operate-buttons'
import viewBatchColor from './components/view-batch-color'
import colorStandard from './components/color-standard'
import batchRequirements from './components/batch-requirements'
import examineDialog from './components/examine-dialog'
import logMethods from '@/views/product-center/mixin/log-methods'

export default {
  components: { statusBar, viewBatchColor, colorStandard, batchRequirements, batchColorInfo, operateButtons, examineDialog },
  mixins: [logMethods],
  data() {
    return {
      isEdit: false, // 默认不是编辑
      data: {
        informations: [], // 批色信息list
        qaGreigeInspectionInfoResponse: {}, // 加工基础信息
        qaCustomerOrderInfoResponse: {} // 客户订单基本信息
      },
      freshData: {
        informations: [], // 批色信息list
        qaGreigeInspectionInfoResponse: {}, // 加工基础信息
        qaCustomerOrderInfoResponse: {} // 客户订单基本信息
      }
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  created() {
    if (this.$route.params.id) {
      this.init(this.$route.params.id)
    }
  },
  methods: {
    syncMoudleDataHandle(key, data) { // 同步右侧各个模块的全量表单数据
      if (key === 'informations') {
        this.freshData = Object.assign({}, this.freshData, { [key]: data })
      }
    },
    // 编辑切换
    doEdit(flag) {
      this.isEdit = flag
    },
    // 提交:先调保存接口，在调修改状态的接口
    async doSubmit() {
      this.$refs['batchColorInfo'].$refs['batchColorForm'].form.validate(async valid => {
        if (valid) {
          const { informations = [] } = this.freshData
          if (!informations.length) {
            this.$message({ message: '批色信息不能为空', type: 'warning' })
            return
          }
          // 根据最后一行批色结果判断，Pass：保存后状态改为已处理，L/G：同Pass，Fail：弹窗提示质量不合格可以提交主管审核，点击确定状态改为审核中，点击取消关闭弹窗停留当前页面数据也不变
          if (informations && informations[informations.length - 1].batchColorResult === 0) { // 判断最后一行的状态 批色结果0.Fail 1.Pass 2.L/G
            this.$confirm('批色结果为Fail，不能提交已处理，是否提交主管审核', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async() => {
              // 这里先调保存接口
              const { code = 0 } = await qaFinishBatchColorInfoModifyNoAuth(this.freshData)
              if (code === 200) {
                this.isEdit = false
                const { code = 0 } = await exchange({ id: this.$route.params.id, batchColorResult: 0, commitStatus: 0 })
                if (code === 200) {
                  this.isEdit = false
                  this.$message({ message: '提交成功', type: 'success' })
                  this.load(this.$route.params.id)
                  this.fetchLog(
                    this.getLogMessages('UPDATE', '/qa/qaFinishBatchColor/exchange', 'qa'),
                    { id: this.$route.params.id },
                    JSON.stringify({
                      beforeText: `在"质量管理-成品检测-成品批色"提交成功一条记录`,
                      beforeCode: { id: this.$route.params.id }
                    }))
                }
              }
            }).catch(() => {
              this.$message({ type: 'info', message: '已取消' })
            })
          } else {
            // 这里先调保存接口，再调修改状态的接口
            const { code = 0 } = await qaFinishBatchColorInfoModifyNoAuth(this.freshData)
            if (code === 200) {
              this.isEdit = false
              const { code = 0 } = await exchange({ id: this.$route.params.id, batchColorResult: 1, commitStatus: 0 })
              if (code === 200) {
                this.isEdit = false
                this.$message({ message: '提交成功', type: 'success' })
                this.load(this.$route.params.id)
                this.fetchLog(
                  this.getLogMessages('UPDATE', '/qa/qaFinishBatchColor/exchange', 'qa'),
                  { id: this.$route.params.id },
                  JSON.stringify({
                    beforeText: `在"质量管理-成品检测-成品批色"提交成功一条记录`,
                    beforeCode: { id: this.$route.params.id }
                  }))
              }
            }
          }
        }
      })
    },
    // 保存
    async doSave() {
      this.$refs['batchColorInfo'].$refs['batchColorForm'].form.validate(async valid => {
        if (valid) {
          const { code = 0 } = await qaFinishBatchColorInfoModify(this.freshData)
          if (code === 200) {
            this.isEdit = false
            this.$message({ message: '保存成功', type: 'success' })
            this.load(this.$route.params.id)
            this.fetchLog(
              this.getLogMessages('UPDATE', '/qa/qaFinishBatchColor/modify', 'qa'),
              this.freshData,
              JSON.stringify({
                beforeText: `在"质量管理-成品检测-成品验布"保存成功一条记录`,
                afterText: '修改为',
                beforeCode: this.data,
                afterCode: this.freshData
              }))
          }
        }
      })
    },
    // 审核
    doExamine() {
      this.$nextTick(() => {
        this.$refs['examineDialog'].init()
      })
    },
    // 取消
    doCancel(flag) {
      this.isEdit = flag
      this.load(this.$route.params.id)
    },
    // 初始化
    init(id) {
      this.load(id)
    },
    // 加载数据
    async load(id = '') {
      const { code = 0, data = { informations: [] }} = await qaFinishBatchColorInfo({ id })
      if (code === 200) {
        this.data = data
        this.isEdit = false
        this.freshData = Object.assign({}, data)
      }
    },
    goBack() {
      this.$router.push(`/quality-manage/finished-product-testing/finished-fabric-inspection`)
    }
  }
}
</script>

<style lang='scss' scoped>
.finished-fabric-inspection-detail {
  padding: 20px;
  margin-bottom: 57px;
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
    right: 0;
    .button {
      margin-right: 12px;
    }
  }
}
</style>
<style lang="scss">
.finished-fabric-inspection-detail {
  .fixed-footer {
    width: calc(100% - 54px) !important;
  }
}
</style>
