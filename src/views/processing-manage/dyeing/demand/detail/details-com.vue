<!--
 * @Descripttion:染整需求列表分录
 * @version:
 * @Author: hzq
 * @Date: 2021-06-1 10:53:03
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-19 09:41:19
-->
<template>
  <div class="dyeing_demand_detail_com">
    <div class="header-product">
      <cs-custom-form
        ref="product"
        :data-source="productData"
        :options="formOptions"
        :form-datas="formDatas"
      />
    </div>
    <div class="bg-sty" />
    <div ref="materialList" class="order-items goods-order-items">
      <div v-if="getBtnShow" class="header-top">
        <div class="Info_div">
          <el-button
            class="Info_button"
            size="mini"
            @click="addAllInfo"
          >添加</el-button>
          <el-button
            class="Info_button Info_remove"
            size="mini"
            @click="removeInfo"
          >移除</el-button>
        </div>
      </div>
      <div class="material-datainfo">
        <cs-custom-form
          ref="materialData"
          class="page-table-border"
          :data-source="materialData"
          :options="tableFormOptions"
          :reset-errors="isEdit"
          edit-type="pop"
        />
        <div v-if="activeIndex ==='N'" class="total-num">印花布总数量：<span>{{ totalPlanqty }}</span></div>
      </div>
    </div>
    <!-- 变更排厂弹窗 -->
    <details-pup
      ref="codePop"
      :index-code="indexCode"
      :order-data="taskNo"
      :remove-array="removeInfoArray"
      :sync-pop="syncPop"
    />
  </div>
</template>

<script>
import * as apiPub from '@/views/processing-manage/public/api/index.js'
import { inputFilter } from '@/views/processing-manage/public/index.js'
import { setOrderFun } from '../../public/mou'
import detailsPup from './details-pup'
import tech from '@/views/processing-manage/public/components/technology.vue'
import popoverColumn from '@/views/processing-manage/printing/public/componens/popover-column'
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
    indexCode: {
      type: String
    },
    totalPlanqty: {
      type: Number
    }
  },
  data() {
    // 排厂量输入规则校验
    const Blurqty = (rule, value, callback) => {
      const i = rule.field.split('.')[1]
      const row = this.validateObj.tableForm[i]
      let fa = 0
      let no = 0
      let faCopy = 0
      // 未排总量=排产数量-已排总量
      if (this.activeIndex === 'N') {
        fa = row.qty // 排厂量
        no = row.planQty - row.arrangeFactoryQty
        faCopy = row.qty
      } else if (this.activeIndex === 'O') {
        no = row.qty - row.arrangeFactoryQty
        faCopy = row.firstNum
        fa = row.planQty
      }
      if (!fa) {
        callback(new Error('请输入排厂量'))
      } else if (this.activeIndex === 'N' && Number(fa) > Number(no)) {
        callback(new Error('排厂量不能大于未排总量'))
      } else if (this.activeIndex === 'O') {
        // const faCopy = row.qty // 一进入页面 默认的排厂量
        const im = this.$utils.getFloat(faCopy, 2) * 1 + this.$utils.getFloat(no, 2) * 1
        const ip = this.$utils.getFloat(fa, 2) * 1
        if (ip > im) {
          callback(new Error('排厂量不能大于当前订单排厂量+未排总量'))
        }
      } else {
        callback()
      }
      callback()
    }
    const detailStyle = {
      'width': '32%',
      'line-height': '20px',
      'margin-bottom': '0'
    }
    // 产品信息
    const productData = {
      _supplier: {
        prop: 'supplier',
        itemType: this.selectTypeChange,
        itemStyle: detailStyle,
        label: '染厂：',
        valueType: 'object',
        clearable: true,
        rules: [{ required: true, message: '染厂不能为空', trigger: 'change' }],
        disabled: true,
        visibleChange: (value) => {
          if (value) {
            this.getClothPropertyInfo()
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _pmUser: {
        prop: 'pmUser',
        itemType: this.selectTypeChange,
        itemStyle: detailStyle,
        label: '跟单人员：',
        valueType: 'object',
        clearable: true,
        rules: [
          { required: true, message: '跟单人员不能为空', trigger: 'change' }
        ],
        disabled: true,
        visibleChange: (value) => {
          if (value) {
            this.getfollowOrder()
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _dyeNo: {
        prop: 'dyeNo',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '染订单号：',
        clearable: true,
        isShow: (scope) => {
          return this.activeIndex === 'O'
        },
        disabled: true,
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return `<div title='${value}' class='yarn-style'>${value}</div>`
          } else {
            return ''
          }
        }
      },
      _createdBy: {
        prop: 'createdBy',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '排厂人员：',
        clearable: true,
        itemClassName: 'hide_18px',
        isShow: (scope) => {
          return this.activeIndex === 'O'
        },
        disabled: true,
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return `<div title='${value}' class='yarn-style'>${value}</div>`
          } else {
            return ''
          }
        }
      },
      _planTime: {
        prop: 'planTime',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '排厂时间：',
        itemClassName: 'hide_18px',
        isShow: (scope) => {
          return this.activeIndex === 'O'
        },
        clearable: true,
        disabled: true,
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return `<div class='yarn-style'>${
              value
                ? this.$filters.parseTime(value + '', '{y}-{m}-{d} {h}:{i}')
                : '-'
            }</div>`
          } else {
            return ''
          }
        }
      },
      _status: {
        prop: 'status',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '染订单状态：',
        clearable: true,
        disabled: true,
        itemClassName: 'hide_18px',
        isShow: (scope) => {
          return this.activeIndex === 'O'
        },
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return this.getStatus(value)
          } else {
            return ''
          }
        }
      }
    }
    // 原料信息
    const materialColumns = {
      _selectionc: {
        prop: 'id',
        type: 'selection',
        isShow: (scope) => {
          return this.isEdit
        }
      },
      _index: {
        prop: 'index',
        label: '序号',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '色布编码',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.skuId || ''
        }
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cloth ? scope.row.cloth.label : ''
        }
      },
      _suggest: {
        prop: 'suggest',
        label: '规格',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.suggest || ''
        }
      },
      _factoryColorNo: {
        prop: 'factoryColorNo',
        label: '工厂色号',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.factoryColorNo || ''
        }
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱名',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnType || ''
        }
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnAttr || ''
        }
      },
      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.customerColor || ''
        }
      },
      _tech: {
        prop: 'tech',
        label: '染整工艺',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.tech || ''
        }
      },
      _planQty: {
        prop: 'planQty',
        label: '排产数量(KG)',
        width: '140',
        align: 'right',
        showOverflowTooltip: true,
        isShow: (scope) => {
          return this.activeIndex === 'N'
        },
        formater: (scope) => {
          return scope.row.planQty || ''
        }
      },
      _qtyPlan: {
        prop: 'qty',
        label: '排产数量(KG)',
        width: '140',
        align: 'right',
        isShow: (scope) => {
          return this.activeIndex === 'O'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.qty || ''
        }
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划交期',
        minWidth: '140',
        formater: (scope) => {
          return scope.row.planDelivery
            ? this.$filters.parseTime(
              scope.row.planDelivery + '',
              '{y}-{m}-{d}'
            )
            : '-'
        }
      },
      _dyeDelivery: {
        prop: 'dyeDelivery',
        label: '染整交期',
        className: 'ruleTip',
        // showOverflowTooltip: true,
        minWidth: '155',
        align: 'right',
        clear: true,
        editOptions: {
          itemType: 'date',
          size: 'mini',
          valueFormat: 'timestamp',
          labelWidth: '0',
          clearable: true,
          itemProp: 'dyeDelivery',
          change: (value, form, formDatas, setFormDatas) => {
            this.materialData._tableForm.dataSource = formDatas.tableForm
            this.syncMoudleDataHandle(
              'materialData',
              formDatas.tableForm || []
            )
          },
          rules: [
            { required: true, message: '请选择染整交期', trigger: ['change'] }
          ]
        },
        formater: (scope) => {
          return scope.row.dyeDelivery
            ? this.$filters.parseTime(scope.row.dyeDelivery + '', '{y}-{m}-{d}')
            : '-'
        }
      },
      _qty: {
        prop: 'qty',
        label: '排厂量(KG)',
        className: 'ruleTip',
        minWidth: '120',
        align: 'right',
        isShow: (scope) => {
          return this.activeIndex === 'N'
        },
        // showOverflowTooltip: true,
        editOptions: {
          itemType: 'input',
          size: 'mini',
          labelWidth: '0',
          itemProp: 'qty',
          rules: [{ required: true, validator: Blurqty, trigger: 'change' }],
          trim: (val) => {
            return inputFilter(val)
          },
          change: (value, form, formDatas, setFormDatas) => {
            this.syncMoudleDataHandle(
              'materialData',
              formDatas.tableForm || []
            )
          }
        },
        handle: (scope) => {},
        formater: (scope) => {
          return scope.row.qty
        }
      },
      _qtyplanFactory: {
        prop: 'planQty',
        label: '排厂量(KG)',
        className: 'ruleTip',
        minWidth: '120',
        align: 'right',
        isShow: (scope) => {
          return this.activeIndex === 'O'
        },
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          size: 'mini',
          itemProp: 'planQty',
          rules: [
            { required: true, validator: Blurqty, trigger: 'change' }
          ],
          trim: (val) => {
            return inputFilter(val)
          },
          change: (value, form, formDatas, setFormDatas) => {
            this.materialData._tableForm.dataSource = formDatas.tableForm
            this.syncMoudleDataHandle(
              'materialData',
              formDatas.tableForm || []
            )
          }
        },
        handle: (scope) => {},
        formater: (scope) => {
          return scope.row.planQty
        }
      },
      _arrangeQty: {
        prop: 'arrangeFactoryQty',
        label: '已排总量(KG)',
        align: 'right',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.arrangeFactoryQty || ''
        }
      },
      _notQty: {
        prop: 'notQty',
        label: '未排总量(KG)',
        width: '140',
        align: 'right',
        showOverflowTooltip: true,
        isShow: (scope) => {
          return this.activeIndex === 'N'
        },
        formater: (scope) => {
          return this.$utils.getFloat((scope.row.planQty - scope.row.arrangeFactoryQty), 2) || '0'
        }
      },
      _notQtyplan: {
        prop: 'notQty',
        label: '未排总量(KG)',
        width: '140',
        align: 'right',
        isShow: (scope) => {
          return this.activeIndex === 'O'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$utils.getFloat((scope.row.qty - scope.row.arrangeFactoryQty), 2) || '0'
        }
      }
    }
    const materialData = {
      _tableForm: {
        prop: 'tableForm',
        itemType: 'table-form',
        syncFormDatasToDataSource: false,
        getTable: (val) => {
          this.table = val
        },
        cellClassName: 'edit-table-item',
        dataSource: [],
        headerCellStyle: {
          background: '#F5F7FA!important',
          height: '44px'
        },
        selectionChange: (val) => {
          this.multipleSelection = val
          // this.setParentDataHandle('chechedArray', this.multipleSelection)
          // this.$emit('selectArr', val)
          // 详情列表全选
          if (this.multipleSelection && this.multipleSelection.length) {
            const IndexData = this.$utils.deepClone(this.validateObj.tableForm) || []
            const pu = []
            IndexData.forEach((im) => {
              this.multipleSelection.forEach((ic) => { if (im.uuid === ic.uuid) { pu.push(im) } })
            })
            this.setParentDataHandle('chechedArray', pu || [])
            this.$emit('selectArr', pu)
          } else {
            this.setParentDataHandle('chechedArray', [])
            this.$emit('selectArr', [])
          }
        },
        size: 'mini',
        columns: materialColumns,
        operates: null
      }
    }
    const techConfig = {
      style: {
        color: 'rgb(24, 144, 255)',
        cursor: 'pointer'
      },
      components: {
        popoverColumn
      },
      componentsOptions: {
        customOptions: {
          placement: 'right',
          style: {
            display: 'inline',
            color: '#0986FF',
            cursor: 'pointer'
          },
          width: '500',
          content: tech,
          contentOptions: {},
          trigger: 'click',
          mouseleave: true,
          formDatas: {},
          show: (scope) => {
            return scope.row.tech
          }
        }
      }
    }
    const techBasic = {
      prop: 'tech',
      label: '染整工艺',
      width: '140',
      showOverflowTooltip: true,
      formater: (scope) => {
        return scope.row.tech || ''
      }
    }

    return {
      techConfig,
      techBasic,
      tableFormOptions: {
        popError: true,
        syncDataHandle: (syncData) => {
          this.validateObj = syncData
          if (this.multipleSelection && this.multipleSelection.length) {
            const IndexData = this.$utils.deepClone(syncData.tableForm) || []
            const pu = []
            IndexData.forEach((im) => {
              this.multipleSelection.forEach((ic) => { if (im.uuid === ic.uuid) { pu.push(im) } })
            })
            this.setParentDataHandle('chechedArray', pu || [])
            this.$emit('selectArr', pu)
          } else {
            this.setParentDataHandle('chechedArray', [])
            this.$emit('selectArr', [])
          }
        }
      },
      productData,
      materialData,
      materialColumns,
      multipleSelection: [],
      AllData: [],
      allArray: [],
      validateObj: null,
      removeInfoArray: [], // 用户点击删除
      formDatas: {},
      taskNo: '',
      formOptions: {
        size: 'small',
        inline: true,
        className: 'detail-branch-detail-form',
        hideRequiredAsterisk: false,
        syncDataHandle: (syncData) => {
          this.syncMoudleDataHandle('productData', syncData)
        }
      }
    }
  },
  computed: {
    getorderDetailInfoResponses() {
      return this.AllData.orderDetailInfoResponses || []
    },
    getBtnShow() {
      return (
        this.AllData &&
        Object.keys(this.AllData).length &&
        this.activeIndex === 'O' &&
        this.isEdit
      )
    }
  },
  watch: {
    data: {
      handler(v) {
        if (v && Object.keys(v).length) {
          this.taskNo = v.taskNo
          this.AllData = this.$utils.deepClone(v)
          this.editChange(v)
          const sup = ['supplier', 'pmUser']
          sup.forEach((item) => {
            this.$set(
              this.productData['_' + item],
              'dataSource',
              v[item] && v[item].value ? [v[item]] : null
            )
          })
          // 被选中的
          // this.multipleSelection = this.AllData.orderDetailInfoResponses || []
          const comData = this.AllData.orderDetailInfoResponses || []
          comData.forEach((item) => {
            item.iscodeIndex = this.setIDCode(item)
            if (this.activeIndex === 'N') {
              if ((item.planQty - item.arrangeFactoryQty) === 0 || (item.planQty - item.arrangeFactoryQty) === '0') {
                item.edit = false
              } else {
                item.edit = this.isEdit
              }
            } else if (this.activeIndex === 'O') {
              if ((item.qty - item.arrangeFactoryQty) === 0 || (item.qty - item.arrangeFactoryQty) === '0') {
                item.edit = false
              } else {
                item.edit = this.isEdit
              }
            }
          })
          this.materialData._tableForm.dataSource = comData
          this.formDatas = this.AllData
          this.$nextTick(() => {
            this.$refs.product.form.clearValidate()
          })
        } else {
          this.multipleSelection = []
          this.AllData = {}
          this.formDatas = {}
          this.materialData._tableForm.dataSource = []
        }
      }
    },
    isEdit: {
      handler(v) {
        this.editChange(v)
        if (v) {
          const comData = this.materialData._tableForm.dataSource || []
          comData.forEach((item) => {
            item.iscodeIndex = this.setIDCode(item)
            if (this.activeIndex === 'N') {
              // // 编辑时候自动带出 纱整交期 等于计划交期
              item.dyeDelivery = !item.dyeDelivery && item.planDelivery || item.dyeDelivery
              if ((item.planQty - item.arrangeFactoryQty) === 0 || (item.planQty - item.arrangeFactoryQty) === '0') {
                item.edit = false
              } else {
                item.edit = v
              }
            } else if (this.activeIndex === 'O') {
              if ((item.qty - item.arrangeFactoryQty) === 0 || (item.qty - item.arrangeFactoryQty) === '0') {
                item.edit = false
              } else {
                item.edit = v
              }
            }
          })
          this.materialColumns._tech = this.techBasic
        } else {
          this.materialColumns._tech = {
            ...this.techBasic,
            ...this.techConfig
          }
        }
        this.formOptions.hideRequiredAsterisk = !v
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.removeInfoArray = []
  },
  mounted() {},
  methods: {
    // 已排厂添加弹窗
    async addAllInfo() {
      this.$refs.codePop.popHandle()
    },
    // 移除
    removeInfo() {
      if (!this.multipleSelection.length) {
        this.$message({ type: 'error', message: '请先选中一条数据' })
        return false
      } else {
        this.removeInfoArray = this.$utils.deepClone(this.multipleSelection)
        const com = this.$utils.deepClone(
          this.materialData._tableForm.dataSource
        )
        const add = com.filter(
          (item) => !this.removeInfoArray.some((ele) => ele.id === item.id)
        )
        this.materialData._tableForm.dataSource = add
        this.syncMoudleDataHandle(
          'materialData',
          this.materialData._tableForm.dataSource || []
        )
      }
    },
    // 同步客样分析编号模块数据
    syncPop(key, data) {
      this.$nextTick(() => {
        if (key === 'servePop') {
          const IndexData = this.$utils.deepClone(data)
          const Tim =
            this.$utils.deepClone(this.materialData._tableForm.dataSource) ||
            []
          IndexData.forEach((im) => {
            im.dyeDelivery = im.planDelivery
            Tim.forEach((ic) => {
              if (im.notQty) {
                im.edit = true
              }
              if (im.iscodeIndex === ic.iscodeIndex) {
                im.ishowAtt = true
                ic.dyeingDelivery = ic.dyeingDelivery > im.dyeingDelivery ? ic.dyeingDelivery : im.dyeingDelivery
                ic.planQty =
                  this.$utils.getFloat(im.planQty, 2) +
                  this.$utils.getFloat(ic.planQty, 2)
              }
            })
          })
          const com = Tim.concat(IndexData)
          const comData = com.filter(
            (item) => !item.hasOwnProperty('ishowAtt')
          )
          this.materialData._tableForm.dataSource = comData
          this.syncMoudleDataHandle(
            'materialData',
            this.materialData._tableForm.dataSource || []
          )
        }
      })
    },
    // 编辑状态
    editChange() {
      this.productData._supplier.disabled = !this.isEdit
      this.productData._pmUser.disabled = !this.isEdit
    },
    // 染整厂下拉
    async getClothPropertyInfo() {
      const obj = {
        isEnabled: '1',
        status: '5',
        supplierCategory: 1,
        supplierType: '10001'
      }
      const res = await apiPub.supplierList(obj)
      if (res.code === 200) {
        this.productData._supplier.dataSource =
          res.data &&
          res.data.map((n) => ({ label: n.supplierName, value: n.id }))
      }
    },
    // 跟单人员下拉
    async getfollowOrder() {
      const res = await apiPub.sysOrgInfo({ functionTag: 'DYE' })
      if (res.code === 200) {
        const idsArr = []
        res.data &&
          res.data.forEach((val) => {
            idsArr.push(val.orgId)
          })
        const res1 = await apiPub.fllowOrderList({
          orgIds: idsArr,
          requireOrgFlag: 1
        })
        this.productData._pmUser.dataSource =
          res1.data &&
          res1.data.list.map((n) => ({ label: n.realName, value: n.id }))
      }
    },
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return value ? value.label : ''
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
.dyeing_demand_detail_com {
  position: relative;
  background: #fff;;
  .el-message-box__status {
    top: 0;
  }
  .weaving-order-detail-form {
    > div:not(.dyeOrderDetailBranch) {
      padding-left: 30px;
      .el-form-item__content {
        line-height: 62px;
      }
    }
    .el-form-item__label {
      color: #888e9e;
    }
    .el-form-item__content {
      color: #474747;
    }
  }
  .detail {
    .el-table th.is-leaf,
    .el-table td {
      border-bottom: 1px solid #dfe6ec;
    }
    .el-table th.is-leaf {
      background: #f5f7fa;
    }
  }
}
</style>

<style lang="scss" scoped>
.dyeing_demand_detail_com {
  position: relative;
  width: 100%;
  .header-product {
    border-top: 1px solid #dfe6ec;
    padding: 20px;
  }
  .goods-order-items {
    .header-top {
      padding: 0px 10px;
      .Info_div {
        margin-bottom: 15px;
        margin-top: 15px;
        .Info_button {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #0986ff;
          border: 1px solid #0986ff;
          border-radius: 4px;
          margin-right: 15px;
          margin-left: 0;
        }
        .Info_remove {
          color: #ff4444;
          border: 1px solid #ff4444;
        }
      }
    }
    .material-datainfo{
      margin: 0 10px;
    }
    .page-table-border {
      /deep/ .el-table--mini {
        font-size: 14px !important;
      }
      /deep/tbody .el-table__row td {
        border-bottom-width: 1px !important;
        padding: 12px 0;
      }
      /deep/ th.ruleTip .cell::before {
        display: block;
        content: "*";
        position: absolute;
        left: 4px;
        color: #fe4949;
      }
    }
  }
  // /deep/ .hide_18px {
  //   margin-top: 18px;
  // }
  .total-num {
    text-align: left;
    padding: 0 20px 20px 0;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    span {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #FF9B02;
    }
  }
  .bg-sty {
    height: 16px;
    background: #F1F7FB;
    margin-bottom: 10px;
  }
  .edit-table-item{
    .el-form-item {
      margin-bottom:0
    }
  }
  /deep/.el-form-item .el-form-item{
    margin-bottom:0 !important
  }
  /deep/.el-form-item__label {
    color: #888e9e;
  }
  /deep/.el-form-item__content {
    color: #474747;
  }
  /deep/.el-table tr {
    background-color:#FFFFFF
  }
  /deep/.el-table th > .cell {
    width: auto;
  }
}
</style>
