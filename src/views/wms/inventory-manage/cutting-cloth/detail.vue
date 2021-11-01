<template>
  <div class="CuttingClothDetail details">
    <div class="head-base">
      <div class="msg-lf">{{ `剪布单号：${baseDatas.cutClothNo}` }}</div>
      <div v-if="baseDatas.applyUser" class="msg-lr">
        <div>
          {{ `申请人：${baseDatas.applyUser}` }}
        </div>
      </div>
    </div>
    <div class="baseTop">
      <div class="baseTital">基本信息</div>
      <cs-custom-form
        :data-source="baseDataSource"
        :options="baseOptions"
        :form-datas="baseDatas"
      />
    </div>
    <div class="card card-top">
      <div
        class="card-title clearfix"
        :style="{padding: (status === 1 ? '15px 0 10px 20px' : '20px 0 15px 20px' )}"
      >
        剪布详情
        <div v-if="status === 1" class="fr box">
          <span>扫描</span>
          <el-input
            ref="searchInput"
            v-model="inputVal"
            v-focus
            size="small"
            placeholder="请扫描标签号"
            clearable
            @change="keyUp"
            @input="keyUp"
          >
            <svg-icon
              v-if="!inputVal || inputVal === 0"
              slot="prefix"
              icon-class="仓储管理-扫描"
              class-name="svg"
            />
          </el-input>
        </div>
      </div>
      <div class="detail card-content" style="margin-top: 0">
        <cs-custom-table
          :operates="popOperates"
          :columns="columns"
          :data-source="dataSource"
        />
      </div>
    </div>
    <div v-if="status === 3" class="card cancel">
      <div class="card-title">取消原因</div>
      <div class="card-content">{{ baseDatas.cancelReason }}</div>
    </div>
    <bottomBar :config="barConfig" />
  </div>
</template>

<script>
import * as api from './api/index.js'
import bottomBar from '@/components/button-bar/index.vue'
import { parseTime } from '@/utils'
import { fetchLog } from '@/views/wms/public/fetchLog'
export default {
  name: 'CuttingClothDetail',
  components: { bottomBar },
  directives: {
    focus: {
      inserted: function(el) {
        el.querySelector('input').focus()
      }
    }
  },
  mixins: [fetchLog],
  data() {
    const baseOptions = {
      inline: true,
      className: 'msg-content'
    }
    // 基本信息
    const baseDataSource = {
      _cutClothNo: {
        prop: 'cutClothNo',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '剪布单号：',
        readonly: true
      },
      _cutApplyNo: {
        prop: 'cutApplyNo',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '剪版申请单号：',
        readonly: true
      },
      _weightTotal: {
        prop: 'weightTotal',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '重量(KG)：',
        readonly: true,
        isShow: () => {
          return this.status === 2 || this.status === 3
        }
      },
      // _applyUser: {
      //   prop: 'applyUser',
      //   itemType: 'input',
      //   label: '申请人：',
      //   readonly: true
      // },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '生成时间：',
        readonly: true
      },
      _outOfTime: {
        prop: 'outOfTime',
        itemType: 'input',
        label: '要求送出时间：',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        readonly: true
      },
      _finishTime: {
        prop: 'finishTime',
        itemType: 'input',
        label: '完成时间：',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        readonly: true,
        isShow: () => {
          return this.status === 2
        }
      }
    }
    const columns = {
      _cutOrderNo: {
        prop: 'cutOrderNo',
        label: '来源单号',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _dyelotNo: {
        prop: 'dyelotNo',
        label: '缸号',
        minWidth: '150',
        showOverflowTooltip: true
      },
      _barCode: {
        prop: 'barCode',
        label: '条码号',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _productAttributes: {
        prop: 'productAttributes',
        label: '产品属性',
        minWidth: '200',
        showOverflowTooltip: true
      },
      _locationCode: {
        prop: 'locationCode',
        label: '库位号',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _sales: {
        prop: 'sales',
        label: '销售组织',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _numberOfCut: {
        prop: 'numberOfCut',
        label: '剪布数量 / 单位',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return `${scope.row.numberOfCut} /${scope.row.numberOfCutUnit} `
        }
      },
      _weight: {
        prop: 'weight',
        label: '重量（KG）',
        align: 'right',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _status: {
        prop: 'status',
        label: '当前状态',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          // 状态  0:待完成,1:已完成,2:已取消
          return scope.row.status === 0
            ? '<span style="color:#FF9214 ">待完成</span>'
            : scope.row.status === 1
              ? '<span style="color:#00BCC5 ">已完成</span>'
              : '<span style="color:#888E9E ">已取消</span>'
        },
        isShow: () => {
          return this.status === 1 || this.status === 2
        }
      },
      _remark: {
        prop: 'remark',
        label: '剪布要求',
        minWidth: '230',
        showOverflowTooltip: true
      }
    }
    const popOperates = {
      isShow: () => {
        return this.status === 1
      },
      label: '操作',
      width: '160',
      fixed: 'right',
      moreOptions: {
        maxLength: 4
      },
      dataSource: [
        {
          label: '完成',
          isShow: (scope) => {
            return scope.row.status === 0 && this.$permission(['wms:inner:cutCloth:orderComplete'])
          },
          handle: (scope) => {
            this.$confirm('确认完成该订单？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              customClass: 'CuttingClothDetail'
            })
              .then(() => {
                this.changeStatus(
                  {
                    printLabelNo: scope.row.printLabelNo,
                    status: 1
                  },
                  scope.row
                )
              })
              .catch(() => {})
          }
        },
        // {
        //   label: '取消',
        //   isShow: (scope) => {
        //     return scope.row.status === 0 && this.$permission(['wms:inner:cutCloth:orderCancel'])
        //   },
        //   handle: (scope) => {
        //     this.$confirm('确认取消该订单？', '提示', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning',
        //       customClass: 'CuttingClothDetail'
        //     })
        //       .then(() => {
        //         this.changeStatus(
        //           {
        //             printLabelNo: scope.row.printLabelNo,
        //             status: 2
        //           },
        //           scope.row
        //         )
        //       })
        //       .catch(() => {})
        //   }
        // },
        {
          label: '-',
          style: { color: '#888E9E' },
          isShow: (scope) => {
            return scope.row.status !== 0
          }
        }
      ]
    }
    const barConfig = {
      _submit: {
        type: 'primary',
        text: '全部完成',
        isShow: () => {
          return this.status === 1 && this.$permission(['wms:inner:cutCloth:finishAllOrders'])
        },
        submit: () => {
          this.allFinish()
        }
        // disabled: () => {
        //   for (var i = 0; i < this.dataSource.length; i++) {
        //     if (this.dataSource[i].status === 0) {
        //       return true
        //     }
        //   }
        //   return false
        // }
      },
      _print: {
        type: 'primary',
        text: '打印标签',
        isShow: () => {
          return this.status === 0 && this.$permission(['wms:inner:cutCloth:print'])
        },
        submit: () => {
          this.$router.push({
            path: '/wms/inventory-manage/cutting-cloth/print',
            query: {
              cutClothNo: this.cutClothNo,
              timestamp: new Date().getTime()
            }
          })
        }
      },
      _finishPrint: {
        type: 'primary',
        text: '打印完成',
        isShow: () => {
          return this.status === 0 && this.$permission(['wms:inner:cutCloth:print'])
        },
        submit: () => {
          this.finishPrint()
        },
        disabled: () => {
          console.log(this.getStatus)
          if (this.getStatus !== undefined) {
            return false
          }
          return true
        }
      },
      _back: {
        type: '',
        text: '返回',
        submit: () => {
          this.$router.push('/wms/inventory-manage/cutting-cloth/list')
        }
      }
    }
    return {
      barConfig,
      baseOptions,
      baseDataSource,
      baseDatas: {},
      columns,
      dataSource: [],
      popOperates,
      inputVal: '',
      status: undefined
    }
  },
  computed: {
    cutClothNo() {
      return this.$route.query.cutClothNo
    },
    // 从打印页面返回回来，，获得status
    getStatus() {
      return this.$route.query.status
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.searchInput && this.$refs.searchInput.focus()
    })
    this.init()
    this.getPage()
  },
  mounted() {

  },
  methods: {
    async keyUp() {
      if (this.inputVal) {
        if (this.inputVal.length !== 14) {
          return
        }
        // if (this.dataSource.find(e => e.printLabelNo !== this.inputVal)) {
        //   this.$message({
        //     type: 'info',
        //     message: '该标签号不属于此剪布单!'
        //   })
        //   return false
        // }
        const res = await api.finishOrder({
          printLabelNo: this.inputVal,
          cutClothNo: this.cutClothNo
        })
        this.inputVal = ''
        console.log('this.in', this.inputVal)
        this.$message({
          message:
          res.code === 200
            ? '扫描成功'
            : res.message
              ? res.message
              : '扫描失败',
          type: res.code === 200 ? 'success' : 'error'
        })
        if (res.code === 200) {
          this.getPage()
          this.outFun({
            oldData: { status: 0 },
            newData: { status: 1 },
            type: 'UPDATE',
            url: '/wms/cutCloth/order/finishOrder',
            pro: 'printLabelNo',
            remark: { printLabelNo: this.inputVal, status: 1 },
            beforeText: `在'仓储管理-库内管理-剪版管理'更新一条记录`,
            beforeCode: `: 成功更新条码号${this.inputVal}的状态为完成`
          })
        }
      }
    },
    async init() {
      const res = await api.info({ cutClothNo: this.cutClothNo })
      if (res.code === 200) {
        this.status = res.data.status
        res.data.createdTime = res.data.createdTime
          ? parseTime(res.data.createdTime)
          : '-'
        res.data.outOfTime = res.data.outOfTime
          ? parseTime(res.data.outOfTime)
          : '-'
        res.data.finishTime = res.data.finishTime
          ? parseTime(res.data.finishTime)
          : '-'
        this.baseDatas = res.data || {}
      }
    },
    async getPage() {
      const list = await api.infoList({ cutClothNo: this.cutClothNo })
      if (list.code === 200) {
        this.dataSource = list.data || []
      }
    },
    async changeStatus(obj, scope) {
      const res = await api.changeOrderStatus(obj)
      const type = obj.status === 1 ? '完成' : '取消'
      this.$message({
        message: res.code === 200 ? `${type}成功` : `${type}失败`,
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.getPage()
        this.outFun({
          oldData: scope,
          newData: { ...scope, ...{ status: obj.status }},
          type: 'UPDATE',
          url: '/wms/cutCloth/order/changeOrderStatus',
          pro: 'printLabelNo',
          remark: { ...scope, status: obj.status },
          beforeText: `在'仓储管理-库内管理-剪版管理'更新一条记录`,
          beforeCode: `: 成功更新单号${obj.printLabelNo}的状态为${
            obj.status === 2 ? '取消' : '完成'
          }`
        })
      }
    },
    async allFinish() {
      const res = await api.finish({ cutClothNo: this.cutClothNo })
      this.$message({
        message: res.code === 200 ? `全部完成成功` : '全部完成失败',
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.$router.push('/wms/inventory-manage/cutting-cloth/list')
        this.outFun({
          oldData: this.baseDatas,
          newData: { ...this.baseDatas, ...{ status: 2 }},
          type: 'UPDATE',
          url: '/wms/cutCloth/finishAllOrders',
          pro: 'cutOrderNo',
          remark: { ...this.baseDatas, ...{ status: 2 }},
          beforeText: `在'仓储管理-库内管理-剪版管理'更新一条记录`,
          beforeCode: `: 成功更新单号${this.cutClothNo}的状态为已剪布`
        })
      }
    },
    // 打印完成的按钮
    async finishPrint() {
      const res = await api.printChangeStatus({ cutClothNo: this.cutClothNo })
      this.$message({
        message: res.code === 200 ? '打印成功' : '打印失败',
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.$router.push('/wms/inventory-manage/cutting-cloth/list')
      }
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
.CuttingClothDetail {
  .svg {
    font-size: 16px;
    margin-top: 8px;
    margin-right: 8px;
  }
  .el-message-box__status {
    top: 0;
  }
  .card {
    .msg-content {
      background: #fff;
      padding: 0 20px 0;
      margin: 16px 0;
      > div {
        width: 30%;
      }
      .el-form-item {
        margin-bottom: 18px;
      }
      .el-input__inner {
        border: none;
      }
      .el-form-item__label {
        color: #888e9e;
        padding: 0;
      }
      .el-form-item__content {
        .el-input__inner {
          color: #474747;
          padding: 0;
        }
      }
    }
    .box {
      padding-right: 20px;
      display: flex;
      align-items: center;
      span {
        font-size: 14px;
        width: 40px;
      }
      .el-input {
        flex: 1;
        .el-input__inner {
          width: 200px;
        }
      }
    }
    .detail .el-table {
      th {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>

<style  scoped lang="scss">
.CuttingClothDetail {
  .head-base {
    display: flex;
    line-height: 65px;
    justify-content: space-between;
    .msg-lf {
      font-size: 18px;
      color: #151222;
    }
    .msg-lr {
      display: flex;
      font-size: 12px;
      color: #666666;
      > div {
        margin-left: 20px;
      }
    }
  }
  .card.cancel {
    margin: 16px 0;
  }
  .baseTop {
    background-color: #fff;
    margin-bottom: 20px;
    padding-bottom: 20px;
    .baseTital {
      padding: 20px 20px 10px 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e9eff2;
    }
    /deep/.el-input--medium .el-input__inner{
      border: none;
    }
  }
}
.card-top{
  /deep/.card-title{
    border:none !important;
  }
}

.details .card .card-content{
  padding: 0px 20px 20px 20px;
}
</style>
