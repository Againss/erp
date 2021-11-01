<template>
  <div class="PickingManageConfirm page-main">
    <div class="form-main">
      <form-title :options="{ title: '基础信息' }" />
      <div class="form-box">
        <cs-custom-form
          ref="form"
          :options="options"
          :data-source="dataSourceBaseInfo"
          :form-datas="formDatasBaseInfo"
        />
      </div>
    </div>
    <div class="form-main">
      <form-title :options="{ title: '拣货明细' }">
        <div slot="content" class="clearfix">
          <el-button
            size="small"
            type="primary"
            class="fr"
            @click="dialogVisible = true"
          >添加拣货明细</el-button>
        </div>
      </form-title>
      <div class="form-box">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="待拣货明细" name="1" />
          <el-tab-pane label="已拣货明细" name="2" />
          <!-- 待拣货明细数据来源于预出货明细 -->
          <!-- 已拣货明细为添加明细后的数值 -->
          <cs-custom-table
            :columns="columns"
            :data-source="dataList"
            tooltip-effect="dark"
          />
        </el-tabs>
      </div>
    </div>
    <bottomBar :options="barOptions" />
    <AddDetail
      v-if="dialogVisible"
      :dialog-visible="dialogVisible"
      :code="formDatasBaseInfo.warehouseCode"
      @close="close"
    />
  </div>
</template>

<script>
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
import FormTitle from '@/views/wms/public/components/formTitle'
import { PublicWms } from '@/views/wms/public/index.js'
import { picking } from './components/index.js'
import { PRODUCT_TYPE } from '@/views/wms/public/constants.js'
import AddDetail from '@/views/wms/out-manage/picking-manage/components/addDetail.vue'
import bottomBar from '@/views/wms/public/components/bottomBar.vue'
import { fetchLog } from '@/views/wms/public/fetchLog.js'
import * as api from './api/index'

export default {
  name: 'PickingManageConfirm',
  components: { FormTitle, AddDetail, bottomBar },
  mixins: [PublicWms, picking, fetchLog],
  data() {
    var validatePicker = (rule, val, callback) => {
      if (val.value) {
        callback()
      }
      return callback(new Error('请选择拣货员'))
    }
    const options = {
      inline: true,
      validateOnRuleChange: false
    }
    const itemStyle = this.formItemStyle()
    const dataSourceBaseInfo = [
      {
        prop: 'outPickNo',
        itemType: 'input',
        label: '拣货单号',
        itemStyle: itemStyle,
        disabled: true
      },
      {
        prop: 'outReservationNo',
        itemType: 'input',
        label: '关联预出库单号',
        itemStyle: itemStyle,
        disabled: true
      },
      {
        prop: 'shipperName',
        itemType: 'input',
        label: '货主',
        itemStyle: itemStyle,
        disabled: true
      },
      {
        prop: 'productType',
        itemType: 'input',
        label: '货物类型',
        itemStyle: itemStyle,
        disabled: true
      },
      {
        prop: 'stockOutPlan',
        itemType: 'input',
        label: '出库件数',
        itemStyle: itemStyle,
        disabled: true
      },
      {
        prop: 'stockOutFact',
        itemType: 'input',
        label: '拣货数',
        itemStyle: itemStyle,
        disabled: true
      },
      {
        prop: 'pickCreateTime',
        itemType: 'input',
        label: '拣货生成时间',
        itemStyle: itemStyle,
        disabled: true
      },
      {
        prop: 'picker',
        itemType: 'select',
        label: '拣货员',
        itemStyle: itemStyle,
        disabled: false,
        dataSource: [],
        valueType: 'object',
        change: (val) => {
          this.picker = val
        },
        rules: [
          {
            required: true,
            message: '请选择拣货员',
            validator: validatePicker,
            trigger: 'change'
          }
        ]
      }
    ]
    const columns_1_base = [
      {
        prop: 'materiel',
        label: '产品编号',
        width: 160,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            placement: 'right',
            width: '500',
            content: propertyCard,
            trigger: 'click',
            mouseleave: true,
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
      },
      {
        prop: 'stockOutPlan',
        label: '拣货件数',
        align: 'right',
        maxWidth: 100,
        showOverflowTooltip: true
      },
      // {
      //   prop: 'property',
      //   label: '产品属性',
      //   align: 'center',
      //   width: 180,
      //   showOverflowTooltip: true
      // },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 100
      },
      {
        prop: 'weightOutPlan',
        label: '重量',
        align: 'right',
        maxWidth: 100,
        showOverflowTooltip: true
      }
    ]
    const columns_1_2 = [
      {
        prop: 'classification',
        label: '物料类型',
        align: 'center',
        minWidth: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'ballCountPlan',
        label: '球数',
        align: 'right',
        maxWidth: 100,
        showOverflowTooltip: true
      }
    ]
    const columns_1_1 = [
      {
        prop: 'materielType',
        label: '物料类型',
        showOverflowTooltip: true,
        width: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'productInfo',
        label: '产品信息',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'machineNo',
        label: '机台号',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'stitchNum',
        label: '针数',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'inchNum',
        label: '寸数',
        showOverflowTooltip: true,
        minWidth: 120
      }
    ]
    const columns_2_base = [
      {
        prop: 'path',
        label: '库位号',
        showOverflowTooltip: true,
        width: 160
      },
      {
        prop: 'serialNo',
        label: '条形码',
        showOverflowTooltip: true,
        width: 160
      },
      {
        prop: 'materiel',
        label: '产品编号',
        width: 160,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            placement: 'right',
            width: '500',
            content: propertyCard,
            trigger: 'click',
            mouseleave: true,
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
      },
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        width: 160
      },
      // {
      //   prop: 'property',
      //   label: '产品属性',
      //   showOverflowTooltip: true,
      //   width: 160
      // },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'center',
        minWidth: 120
      }
    ]
    const columns_2_2 = [
      {
        prop: 'materielType',
        label: '物料类型',
        showOverflowTooltip: true,
        width: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'leftWeight',
        label: '重量',
        align: 'right',
        minWidth: 100,
        showOverflowTooltip: true
      },
      {
        prop: 'ballCount',
        label: '球数',
        align: 'right',
        minWidth: 100,
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 100
      }
    ]
    const columns_2_1 = [
      {
        prop: 'materielType',
        label: '物料类型',
        showOverflowTooltip: true,
        width: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'productInfo',
        label: '产品信息',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'machineNo',
        label: '机台号',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'stitchNum',
        label: '针数',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'inchNum',
        label: '寸数',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'leftWeight',
        label: '重量',
        align: 'right',
        maxWidth: 100,
        showOverflowTooltip: true
      },
      // {
      //   prop: 'ballCount',
      //   label: '球数',
      //   align: 'right',
      //   maxWidth: '100'
      // },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'center',
        minWidth: 120
      }
    ]
    const barOptions = {
      submitText: '拣货确认',
      cancelText: '返回',
      submit: () => {
        this.submit()
      },
      cancelSubmit: () => {
        this.$router.go(-1)
      }
    }
    return {
      dialogVisible: false,
      activeName: '1',
      dataList: [],
      options,
      dataSourceBaseInfo,
      formDatasBaseInfo: {},
      columns_1_base,
      columns_1_1,
      columns_1_2,
      dataSourcePage: [],
      columns_2_base,
      columns_2_1,
      columns_2_2,
      list: [],
      pickerList: [],
      barOptions,
      picker: {}
    }
  },
  computed: {
    columns() {
      const arr = this['columns_' + this.activeName + '_' + this.productType]
      const arr_base = this['columns_' + this.activeName + '_base']
      return [...arr_base, ...arr]
    }
  },
  created() {
    const fn = (res) => {
      const productType = res.data.productType
      const index = PRODUCT_TYPE.findIndex((n) => n.value === productType)
      index !== -1 ? (res.data.productType = PRODUCT_TYPE[index].label) : ''
      res.data.pickCreateTime = res.data.pickCreateTime
        ? this.$utils.parseTime(res.data.pickCreateTime)
        : ''
      res.data.shipperName = res.data.shipper.label || ''
      this.formDatasBaseInfo = res.data || {}
    }
    this.getDetailBase({ outPickSubNo: this.id }, fn)
    this.getConfirmDetailPage({ outPickSubNo: this.id })
    this.getSysUserList()
  },
  methods: {
    // 货物类型
    getStatus(data) {
      let str = ''
      switch (data) {
        case '0101':
          str = '天然纤维'
          break
        case '0102':
          str = '化学纤维'
          break
        case '0103':
          str = '组合纱线'
          break
        case '0201':
          str = '坯布'
          break
        case '0202':
          str = '色布'
          break
        case '0203':
          str = '组合布'
          break
        case '0204':
          str = '花布'
          break
        default:
          break
      }
      return str
    },
    close() {
      this.dialogVisible = false
      if (this.activeName === '2') {
        this.getPage((res) => {
          this.dataList = res
        })
        this.list = this.dataList || []
      } else if (this.activeName === '1') {
        this.getConfirmDetailPage({ outPickSubNo: this.id })
      }
    },
    handleClick() {
      if (this.activeName === '2') {
        this.getPage((res) => {
          this.dataList = res
        })
        this.list = this.dataList || []
      } else if (this.activeName === '1') {
        this.getConfirmDetailPage({ outPickSubNo: this.id })
      }
    },
    async submit() {
      // 不切换tab判断是否 有已拣货明细
      const res =
        (
          await api.getPickedPage({
            outPickSubNo: this.id,
            pageSize: 2,
            pageNum: 1
          })
        ).data.list || []
      if (!res.length) {
        this.$message({
          type: 'warning',
          message: '请添加拣货明细'
        })
        return
      }
      const params = {
        picker: this.picker,
        outPickSubNo: this.id
      }
      this.$refs['form'].form.validate((valid) => {
        if (valid) {
          this.confirmSubmit(params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.PickingManageConfirm {
  .el-dialog__body {
    padding: 0;
    // height: 690px;
    background-color: #f1f7fb;
  }
  .form-box {
    padding: 15px 20px 9px;
  }
}
</style>
