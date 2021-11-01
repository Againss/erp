<!--
 * @Descripttion:染纱需求列表分录
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-16 17:32:37
-->
<template>
  <div id="demand_detail_com_cxp" class="analyse_detail_cxp" :class="isEdit ? '' : 'analyse_detail_disable1'">
    <div class="header-product">
      <cs-custom-form ref="product" :data-source="productData" :options="formOptions" :form-datas="formDatas" />
    </div>
    <div ref="materialList" class="order-items goods-order-items">
      <div v-if="getBtuShow" class="header-top">
        <div class="Info_div">
          <el-button class="Info_button" size="mini" @click="addAllInfo">添加</el-button>
          <el-button class="Info_button Info_remove" size="mini" @click="removeInfo">移除</el-button>
        </div>
      </div>
      <div class="material-datainfo">
        <cs-custom-form ref="materialData" class="page-table-border" :data-source="materialData" :reset-errors="isEdit" :options="tableFormOptions" edit-type="pop" />
      </div>
      <details-pup
        ref="codePop"
        :task-no="taskNo"
        :remove-array="multipleSelection"
        :sync-pop="syncPop"
      />
    </div>
  </div>
</template>

<script>
import { setOrderFun } from '../../public/mou'
import { inputFilter } from '@/views/processing-manage/public/index.js'
import detailsPup from './details-pup'
import * as apiPub from '@/views/processing-manage/public/api/index.js'
export default {
  components: {
    detailsPup
  },
  mixins: [setOrderFun],
  props: {
    isEdit: {
      type: Boolean
    },
    activeIndex: {
      type: String
    },
    orderData: {
      type: Object
    },
    data: {
      type: Object
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    },
    taskNo: {
      type: String
    }
  },
  data() {
    var BlurFactoryNum = (rule, value, callback) => {
      const i = rule.field.split('.')[1]
      const row = this.validateObj.tableForm[i]
      const fa = row.factoryNum // 排厂量
      const no = row.notQty // 未排总量
      const faCopy = row.factoryNumCopy // 一进入页面 默认的排厂量
      const im = this.$utils.getFloat(faCopy, 2) * 1 + this.$utils.getFloat(no, 2) * 1
      const ip = this.$utils.getFloat(fa, 2) * 1
      if (!fa) {
        return callback(new Error('请输入排厂量'))
      } else if ((Number(ip) > Number(im))) {
        return callback(new Error('排厂量不能大于未排总量'))
      } else {
        callback()
      }
    }
    const ismax999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/, message: '0~99999999.99', trigger: ['blur'] })
    const detailStyle = {
      width: '30%',
      'line-height': '20px',
      'margin-bottom': '0'
    }
    // 产品信息
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const productData = {
      _supplier: {
        prop: 'supplier',
        itemType: this.selectTypeChange,
        itemStyle: detailStyle,
        label: '染纱厂：',
        valueType: 'object',
        clearable: true,
        filterable: true,
        rules: [{ required: true, message: '染纱厂不能为空', trigger: 'change' }],
        disabled: true,
        visibleChange: value => {
          if (value) {
            this.getClothPropertyInfo()
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return `<div title='${value ? value.label : ''}' class='yarn-style'>${value ? value.label : ''}</div>`
          } else {
            return ''
          }
        }
      },
      _pmUser: {
        prop: 'pmUser',
        itemType: this.selectTypeChange,
        itemStyle: detailStyle,
        label: '跟单人员：',
        valueType: 'object',
        itemClassName: 'demandDetailRight',
        filterable: true,
        rules: [{ required: true, message: '跟单人员不能为空', trigger: 'change' }],
        clearable: true,
        disabled: true,
        visibleChange: value => {
          if (value) {
            this.getfollowOrder()
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _orderId: {
        prop: 'orderId',
        itemType: 'itemview',
        itemClassName: 'demandDetailRight',
        itemStyle: detailStyle,
        label: '染纱单号：',
        clearable: true,
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return `<div title='${value}' class='yarn-style'>${value}</div>`
          } else {
            return ''
          }
        }
      },
      _createdByName: {
        prop: 'createdByName',
        itemType: 'itemview',
        itemClassName: 'hide_18px',
        itemStyle: detailStyle,
        label: '排厂人：',
        clearable: true,
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return `<div title='${value}' class='yarn-style'>${value}</div>`
          } else {
            return ''
          }
        }
      },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'itemview',
        itemClassName: 'hide_18px demandDetailRight',
        itemStyle: detailStyle,
        label: '排厂时间：',
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return `<div class='yarn-style'>${value ? this.$filters.parseTime(value) : '-'}</div>`
          } else {
            return ''
          }
        }
      },
      _status: {
        prop: 'status',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '状态：',
        itemClassName: 'hide_18px demandDetailRight',
        clearable: true,
        disabled: true,
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return this.getStatus(value)
          } else {
            return ''
          }
        }
      }
    }
    const materialColumns = { // 原料信息
      _selectionc: {
        prop: 'iscodeIndex',
        type: 'selection',
        className: 'precautionscolor',
        isShow: (scope) => {
          return this.isEdit
        },
        label: ''
      },
      _code: {
        prop: 'yarnCode',
        label: '序号',
        minWidth: '50',
        itemClassName: 'tionsco',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '成品编码',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.skuId || ''
        }
      },
      _clothName: {
        prop: 'clothName',
        label: '布类',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.clothName || ''
        }
      },
      _yarnId: {
        prop: 'yarnId',
        label: '色纱编码',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnId || ''
        }
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱别',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnType || ''
        }
      },
      _yarnAttributes: {
        prop: 'yarnAttributes',
        label: '纱属性',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnAttributes || ''
        }
      },
      _dyeingColor: {
        prop: 'dyeingColor',
        label: '染纱颜色',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.dyeingColor || ''
        }
      },
      _planQty: {
        prop: 'planQty',
        label: '排产数量(KG)',
        width: '110',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.planQty)
        }
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划交期',
        minWidth: '110',
        align: 'center',
        rules: [commonBlurReg],
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.planDelivery ? this.$filters.parseTime(scope.row.planDelivery + '', '{y}-{m}-{d}') : '-'
        }
      },
      _dyeingDelivery: {
        prop: 'dyeingDelivery',
        label: '染纱交期',
        minWidth: '155',
        align: 'right',
        editOptions: {
          itemType: 'date',
          valueFormat: 'timestamp',
          labelWidth: '0',
          size: 'mini',
          clearable: true,
          itemProp: 'dyeingDelivery',
          placeholder: '请选择',
          rules: [
            { required: true, message: '请选择染纱交期', trigger: 'change' }
          ]
        },
        formater: (scope) => {
          return scope.row.dyeingDelivery ? this.$filters.parseTime(scope.row.dyeingDelivery + '', '{y}-{m}-{d}') : '-'
        }
      },
      _factoryNum: {
        prop: 'factoryNum',
        label: '排厂量(KG)',
        align: 'right',
        minWidth: '120',
        editOptions: {
          placeholder: '请输入',
          itemType: 'input',
          size: 'mini',
          labelWidth: '0',
          // clearable: true,
          itemProp: 'factoryNum',
          rules: [{ required: true, validator: BlurFactoryNum, trigger: 'blur' }, ismax999Reg],
          trim: (val) => { return inputFilter(val) }
        },
        handle: (scope) => {},
        formater: (scope) => {
          return this.DigitalVerification(scope.row.factoryNum)
        }
      },
      _arrangeQty: {
        prop: 'arrangeQty',
        label: '已排总量(KG)',
        width: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.arrangeQty)
        }
      },
      _notQty: {
        prop: 'notQty',
        label: '未排总量(KG)',
        width: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.notQty)
        }
      }
    }
    const materialData = {
      _tableForm: {
        prop: 'tableForm',
        rowKey: 'id',
        itemType: 'table-form',
        headerCellClassName: this.isSing,
        syncFormDatasToDataSource: false,
        getTable: (val) => {
          this.table = val
        },
        dataSource: [],
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        selectionChange: (val) => {
          this.multipleSelection = val
          const com = this.validateObj.tableForm || []
          const add = com.filter(item => this.multipleSelection.some(ele => ele.iscodeIndex === item.iscodeIndex))

          this.syncMoudleDataHandle('materialData', add)
        },
        size: 'mini',
        columns: materialColumns,
        operates: null
      }
    }
    return {
      multip: [],
      multipleSelection: [],
      tableFormOptions: {
        popError: true,
        syncDataHandle: (syncData) => {
          this.validateObj = syncData
          if (this.multipleSelection && this.multipleSelection.length) {
            const IndexData = this.$utils.deepClone(syncData.tableForm) || []
            const pu = []
            IndexData.forEach((im) => {
              this.multipleSelection.forEach((ic) => { if (im.iscodeIndex === ic.iscodeIndex) { pu.push(im) } })
            })
            this.syncMoudleDataHandle('materialData', pu || [])
          }
        }
      },
      productData,
      materialData,
      materialColumns,
      AllData: {},
      allArray: [],
      validateObj: null,
      removeInfoArray: [], // 用户点击删除
      formDatas: {},
      fresh: {},
      formOptions: {
        size: 'small',
        inline: true,
        labelWidth: '94px',
        className: 'detail-branch-detail-form',
        hideRequiredAsterisk: false,
        syncDataHandle: (syncData) => {
          this.syncMoudleDataHandle('productData', syncData)
        }
      }
    }
  },
  computed: {
    getBtuShow() {
      return this.data && Object.keys(this.data).length && (this.activeIndex === '2') && this.isEdit
    },
    getInfoData() {
      return this.materialData._tableForm.dataSource
    }
  },
  watch: {
    data: {
      handler(v) {
        if (v && Object.keys(v).length) {
          const AllData = this.$utils.deepClone(v)
          this.editChange(v)
          const sup = ['supplier', 'pmUser']
          sup.forEach(item => {
            this.$set(this.productData['_' + item], 'dataSource', v[item] && v[item].value ? [v[item]] : null)
          })
          const comData = AllData.demandDetailSubmitRequests || []
          comData.forEach((item) => {
            item.iscodeIndex = this.setIDCode(item)
            if (item.notQty === 0 || item.notQty === '0') { item.edit = false } else { item.edit = this.isEdit }
            if (this.isEdit) {
              // 编辑时候自动带出 纱染交期 等于计划交期
              item.dyeingDelivery = !item.dyeingDelivery && item.planDelivery || item.dyeingDelivery
            }
            item.factoryNumCopy = item.factoryNum || 0
          })
          this.materialData._tableForm.dataSource = comData
          delete AllData.demandDetailSubmitRequests
          const om = { value: '', label: '' }
          AllData.supplierCopy = AllData.supplier || om
          this.formDatas = AllData
        } else {
          this.multipleSelection = []
          this.materialData._tableForm.dataSource = []
          this.validateObj = {}
          this.formDatas = {}
        }
      }
    },
    isEdit: {
      handler(v) {
        this.editChange(v)
        if (v) {
          const comData = this.materialData._tableForm.dataSource || []
          comData.forEach((item) => {
            // 编辑时候自动带出 纱染交期 等于计划交期
            item.dyeingDelivery = !item.dyeingDelivery && item.planDelivery || item.dyeingDelivery
            item.iscodeIndex = this.setIDCode(item)
            if (this.activeIndex === '1' && (item.notQty === 0 || item.notQty === '0')) { item.edit = false } else { item.edit = v }
          })
        }
        // else {
        //   this.materialData.columns._dyeingDelivery.minWidth='110'
        // }
        this.formOptions.hideRequiredAsterisk = !v
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.multipleSelection = []
  },
  mounted() {
  },
  methods: {
    isSing(scope) {
      if (['dyeingDelivery', 'factoryNum'].includes(scope.column.property) && this.isEdit) {
        return 'isSing'
      }
    },
    addAllInfo() {
      this.$refs.codePop.popHandle()
    },
    removeInfo() {
      if (!this.multipleSelection.length) {
        this.$message({ type: 'error', message: '请先选中一条数据' })
        return false
      } else {
        const com = this.$utils.deepClone(this.validateObj.tableForm)
        const add = com.filter(item => !this.multipleSelection.some(ele => ele.iscodeIndex === item.iscodeIndex))
        this.materialData._tableForm.dataSource = add
        this.multipleSelection = []
        this.syncMoudleDataHandle('materialData', [])
        this.$nextTick(() => { this.$refs.materialData && this.$refs.materialData.form.clearValidate() })
      }
    },
    syncPop(key, data) {
      this.$nextTick(() => {
        if (key === 'servePop') { // 同步客样分析编号模块数据
          const IndexData = this.$utils.deepClone(data)
          const Tim = this.$utils.deepClone(this.validateObj.tableForm) || []
          IndexData.forEach((im) => {
            im.dyeingDelivery = im.planDelivery
            Tim.forEach((ic) => { if (im.iscodeIndex === ic.iscodeIndex) { im.ishowAtt = true } })
          })
          const com = Tim.concat(IndexData)
          const comData = com.filter(item => !item.hasOwnProperty('ishowAtt'))
          // 使用toggleRowSelection必须延迟
          this.materialData._tableForm.dataSource = comData
          comData.forEach((ix) => {
            this.multipleSelection.forEach(it => {
              if (ix.iscodeIndex === it.iscodeIndex) {
                setTimeout(() => { this.table.toggleRowSelection(ix, true) }, 0)
              }
            })
          })
          this.$nextTick(() => { this.$refs.materialData.form.clearValidate() })
        }
      })
    },
    // 编辑状态
    editChange() {
      this.productData._supplier.disabled = !this.isEdit
      this.productData._pmUser.disabled = !this.isEdit
    },
    // 染纱厂下拉
    async getClothPropertyInfo() {
      const obj = {
        isEnabled: '1',
        status: '5',
        supplierCategory: 1,
        supplierType: '10002'
      }
      const res = await apiPub.supplierList(obj)
      if (res.code === 200) {
        this.productData._supplier.dataSource = res.data && res.data.map(n => ({ label: n.supplierName, value: n.id + '' }))
      }
    },
    // 跟单人员下拉
    async getfollowOrder() {
      const res = await apiPub.sysOrgInfo({ functionTag: 'WAV' })
      if (res.code === 200) {
        const idsArr = []
        res.data && res.data.forEach(val => {
          idsArr.push(val.orgId)
        })
        const res1 = await apiPub.fllowOrderList({ 'orgIds': idsArr, requireOrgFlag: 1 })
        this.productData._pmUser.dataSource = res1.data && res1.data.list.map(n => ({ label: n.realName, value: n.id + '' }))
      }
    },
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return `<div class='yarn-style'>${value ? value.label : ''}</div>`
    },
    inputTypeChange() {
      if (this.isEdit) {
        return 'input'
      }
      return 'itemview'
    },
    selectTypeChange() {
      if (this.isEdit) {
        return 'select'
      }
      return 'itemview'
    }
  }
}
</script>
<style lang="scss">
 #demand_detail_com_cxp {
  .detail-branch-detail-form {
    background: #fff;
    .el-form-item--small{
      margin-bottom: 0 !important;
    }
  }
  .yarn-style{
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 300px;
    white-space: nowrap;
    color: #474747;
    display: flex;
    align-items: center;
  }
  table th.isSing div:before {
    content: '*';
    color: red;
  }
  .precautionscolor {
    .cell{
      padding-left: 20px;
    }
  }
  .demandDetailRight{
    margin-left: 26px;
    margin-right: 10px;
  }
}
.analyse_detail_disable1{
  .el-table__header-wrapper .ruleTip .cell::before {
    content: ''!important;
  }
  .material-datainfo{
    .el-table__header-wrapper .has-gutter tr th{
     padding: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
.analyse_detail_cxp{
  width: 100%;
  background: #fff;
  .header-product{
    border-top: 1px solid #F1F7FB;;
    padding: 15px;
  }
  .goods-order-items{
    border-top:16px solid #F1F7FB ;
    .header-top {
      padding: 15px 10px 5px 10px;
      .Info_div{
        .Info_button{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #0986FF;
          border: 1px solid #0986FF;
          border-radius: 4px;
          margin-right: 15px;
          margin-left: 0;
        }
        .Info_remove{
          color: #FF4444;
          border: 1px solid #FF4444;
        }
      }

    }
    .material-datainfo{
      margin: 0 10px;
      padding-top: 10px;
      /deep/.table tr:nth-child(even) {
        background: #fff;
      }
    }
    .page-table-border {
      /deep/ .el-table--mini{
        font-size: 14px !important;
      }
     /deep/ .el-table  {
        font-size: 14px;
        td{
          height: 50px;
          line-height: 50px;
          padding: 0;
        }
        th .cell {
          height: 44px;
          line-height: 44px;
        }
      }
    /deep/ th.ruleTip  .cell::before {
        display: block;
        content: '*';
        position: absolute;
        left: 4px;
        color: #FE4949;
      }
      /deep/tbody .el-table__row td {
        padding: 12px 0;
        .el-form-item.el-form-item{
          margin-bottom: 0 !important;
        }
      }

    }

  }
  /deep/ .hide_18px{
    margin-top: 4px;
  }

}
</style>
