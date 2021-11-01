<!--
 * @Descripttion:染纱需求列表分录
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-19 14:16:57
-->
<template>
  <div id="demand_detail_com_cxp" class="analyse_detail_cxp">
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
      <div
        v-if="activeIndex === '2' && !getorderDetailInfoResponses.lenght && isEdit"
        class="header-top"
      >
        <div class="Info_div">
          <el-button
            v-if="isEdit"
            class="Info_button"
            size="mini"
            @click="addAllInfo"
          >添加</el-button>
          <el-button
            v-if="isEdit"
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
        <div v-if="activeIndex ==='1'" class="total-num">印花布总数量：<span>{{ totalPlanqty }}</span></div>
      </div>
      <details-pup
        ref="codePop"
        :index-code="indexCode"
        :order-data="taskNo"
        :remove-array="removeInfoArray"
        :sync-pop="syncPop"
      />
    </div>
  </div>
</template>

<script>
import { inputFilter } from '@/views/processing-manage/public/index.js'
import detailsPup from './details-pup'
import { setOrderFun } from '../../public/mou'
import * as apiPub from '@/views/processing-manage/public/api/index.js'
import tech from '@/views/processing-manage/public/components/technology.vue'
import printImgItem from '../components/printImg'
import popoverColumn from '../../public/componens/popover-column'
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
    var BlurFactoryNum = (rule, value, callback) => {
      const i = rule.field.split('.')[1]
      const row = this.validateObj.tableForm[i]
      let fa = 0
      let no = 0
      let faCopy = 0
      // 未排总量=排产数量-已排总量
      if (this.activeIndex === '1') {
        fa = row.qty // 排厂量
        no = row.planQty - row.arrangeFactoryQty
        faCopy = row.qty
      } else if (this.activeIndex === '2') {
        no = row.qty - row.arrangeFactoryQty
        faCopy = row.firstNum
        fa = row.planQty
      }
      // const faCopy = row.qty // 一进入页面 默认的排厂量
      const im =
        this.$utils.getFloat(faCopy, 2) * 1 + this.$utils.getFloat(no, 2) * 1
      const ip = this.$utils.getFloat(fa, 2) * 1
      if (!fa) {
        return callback(new Error('请输入排厂量'))
      } else if (this.activeIndex === '1' && Number(fa) > Number(no)) {
        return callback(new Error('排厂量不能大于未排总量'))
      } else if (this.activeIndex === '2') {
        if (ip > im) {
          callback(new Error('排厂量不能大于当前订单排厂量+未排总量'))
        }
      } else {
        callback()
      }
      callback()
    }
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 产品信息
    const productData = {
      _supplier: {
        prop: 'supplier',
        itemType: this.selectTypeChange,
        itemStyle: { width: '30%', 'margin-right': '3%' },
        label: '印花厂：',
        valueType: 'object',
        clearable: true,
        rules: [
          { required: true, message: '印花厂不能为空', trigger: 'change' }
        ],
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
        itemStyle: { width: '30%', 'margin-right': '3%' },
        label: '跟单人员：',
        valueType: 'object',
        filterable: true,
        rules: [
          { required: true, message: '跟单人员不能为空', trigger: 'change' }
        ],
        clearable: true,
        disabled: true,
        visibleChange: (value) => {
          if (value) {
            this.getfollowOrder()
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _printNo: {
        prop: 'printNo',
        itemType: 'itemview',
        itemStyle: { width: '30%', 'margin-right': '3%' },
        label: '印花单号：',
        clearable: true,
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        disabled: true
      },
      _createdBy: {
        prop: 'createdBy',
        itemType: 'itemview',
        itemClassName: 'hide_18px',
        itemStyle: { width: '30%', 'margin-right': '3%' },
        label: '排厂员：',
        clearable: true,
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        disabled: true
      },
      _planTime: {
        prop: 'planTime',
        itemType: 'itemview',
        itemClassName: 'hide_18px',
        itemStyle: { width: '30%', 'margin-right': '3%' },
        label: '排厂日期：',
        isShow: (scope) => {
          return this.activeIndex === '2'
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
        itemStyle: { width: '30%', 'margin-right': '3%' },
        label: '状态：',
        itemClassName: 'hide_18px',
        clearable: true,
        disabled: true,
        isShow: (scope) => {
          return this.activeIndex === '2'
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
    const materialColumns = {
      // 原料信息
      _selectionc: {
        prop: '',
        type: 'selection',
        isShow: (scope) => {
          return this.isEdit
        },
        label: ''
      },
      _code: {
        prop: 'yarnCode',
        label: '序号',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '花布编码',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.skuId || ''
        }
      },
      _clothId: {
        prop: 'clothId',
        label: '布类',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cloth ? scope.row.cloth.label : ''
        }
      },
      _suggest: {
        prop: 'suggest',
        label: '成品规格',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.suggest || ''
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
      _factoryColor: {
        prop: 'factoryColor',
        label: '客户花号',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.factoryColor || ''
        }
      },
      _colorPath: {
        prop: 'colorPath',
        label: '印花图型',
        width: '140',
        components: {
          printImgItem
        }
      },
      _tech: {
        prop: 'tech',
        label: '工艺',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.tech || ''
        }
      },
      _printQty: {
        prop: 'printQty',
        label: '排产数量(KG)',
        align: 'right',
        width: '110',
        isShow: (scope) => {
          return this.activeIndex === '1'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.planQty || ''
        }
      },
      _qtyPlan: {
        prop: 'qty',
        label: '排产数量(KG)',
        align: 'right',
        width: '110',
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.qty || ''
        }
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划交期',
        width: '140',
        rules: [commonBlurReg],
        // showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.planDelivery
            ? this.$filters.parseTime(
              scope.row.planDelivery + '',
              '{y}-{m}-{d}'
            )
            : '-'
        }
      },
      _printDelivery: {
        prop: 'printDelivery',
        label: '印花交期',
        className: 'ruleTip',
        minWidth: '155',
        align: 'right',
        editOptions: {
          itemType: 'date',
          size: 'mini',
          valueFormat: 'timestamp',
          labelWidth: '0',
          clearable: true,
          itemProp: 'printDelivery',
          placeholder: '请选择',
          change: (value, form, formDatas, setFormDatas) => {
            this.materialData._tableForm.dataSource = formDatas.tableForm
            this.syncMoudleDataHandle(
              'materialData',
              formDatas.tableForm || []
            )
          },
          rules: [
            { required: true, message: '请选择印花交期', trigger: 'change' }
          ]
        },
        formater: (scope) => {
          return scope.row.printDelivery
            ? this.$filters.parseTime(
              scope.row.printDelivery + '',
              '{y}-{m}-{d}'
            )
            : '-'
        }
      },
      _qty: {
        prop: 'qty',
        label: '排厂量(KG)',
        align: 'right',
        className: 'ruleTip',
        minWidth: '120',
        isShow: (scope) => {
          return this.activeIndex === '1'
        },
        editOptions: {
          itemType: 'input',
          size: 'mini',
          labelWidth: '0',
          itemProp: 'qty',
          placeholder: '请输入',
          rules: [
            { required: true, validator: BlurFactoryNum, trigger: 'change' }
          ],
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
          // this.$set(scope.row, 'edit', true)
          return this.DigitalVerification(scope.row.qty)
        }
      },
      _qtyplanFactory: {
        prop: 'planQty',
        align: 'right',
        label: '排厂量(KG)',
        className: 'ruleTip',
        minWidth: '120',
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          size: 'mini',
          itemProp: 'planQty',
          rules: [
            { required: true, validator: BlurFactoryNum, trigger: 'change' }
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
          // this.$set(scope.row, 'edit', true)
          return this.DigitalVerification(scope.row.planQty)
        }
      },
      _arrangeQty: {
        prop: 'arrangeFactoryQty',
        label: '已排总量(KG)',
        width: '120',
        align: 'right',
        showOverflowTooltip: true,
        // isShow: (scope) => {
        //   return this.activeIndex === '1'
        // },
        formater: (scope) => {
          return scope.row.arrangeFactoryQty || ''
        }
      },
      // _arrangeFactoryQty: {
      //   prop: 'arrangeFactoryQty',
      //   label: '已排总量(KG)',
      //   width: '120',
      //   align: 'right',
      //   isShow: (scope) => {
      //     return this.activeIndex === '2'
      //   },
      //   showOverflowTooltip: true,
      //   formater: (scope) => {
      //     return scope.row.arrangeFactoryQty || ''
      //   }
      // },
      _notQty: {
        prop: 'notQty',
        label: '未排总量(KG)',
        width: '120',
        align: 'right',
        isShow: (scope) => {
          return this.activeIndex === '1'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$utils.getFloat((scope.row.planQty - scope.row.arrangeFactoryQty), 2) || '0'
        }
      },
      _notQtyplan: {
        prop: 'notQty',
        label: '未排总量(KG)',
        width: '120',
        align: 'right',
        isShow: (scope) => {
          return this.activeIndex === '2'
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
          // this.setParentDataHandle('chechedArray', this.multipleSelection)
          // this.$emit('selectArr', val)
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
      label: '工艺',
      width: '140',
      showOverflowTooltip: true,
      formater: (scope) => {
        return scope.row.tech
      }
    }
    return {
      techBasic,
      techConfig,
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
        className: 'detail-branch-detail-form inputWidth',
        hideRequiredAsterisk: false,
        syncDataHandle: (syncData) => {
          this.syncMoudleDataHandle('productData', syncData)
        }
      },
      pupData: []
    }
  },
  computed: {
    getorderDetailInfoResponses() {
      return this.AllData.orderDetailInfoResponses || []
    },
    getBtuShow() {
      return (
        this.AllData &&
        Object.keys(this.AllData).length &&
        this.activeIndex === '2' &&
        this.isEdit
      )
    },
    getInfoData() {
      return this.materialData._tableForm.dataSource
    }
  },
  watch: {
    data: {
      handler(v) {
        if (v && Object.keys(v).length) {
          this.taskNo = v.taskNo
          this.AllData = this.$utils.deepClone(v)
          console.log(this.AllData, 'this.AllData')
          this.editChange(v)
          const sup = ['supplier', 'pmUser']
          sup.forEach((item) => {
            this.$set(
              this.productData['_' + item],
              'dataSource',
              v[item] && v[item].value ? [v[item]] : null
            )
          })
          const comData = this.AllData.orderDetailInfoResponses || []
          comData.forEach((item) => {
            item.iscodeIndex = this.setIDCode(item)
            if (this.activeIndex === '1') {
              if ((item.planQty - item.arrangeFactoryQty) === 0 || (item.planQty - item.arrangeFactoryQty) === '0') {
                item.edit = false
              } else {
                item.edit = this.isEdit
              }
            } else if (this.activeIndex === '2') {
              if ((item.qty - item.arrangeFactoryQty) === 0 || (item.qty - item.arrangeFactoryQty) === '0') {
                item.edit = false
              } else {
                item.edit = this.isEdit
              }
            }
            // 写死测试，后端还没返回
            item.colorPath = 'https://oss-exhibition.sfabric.com/customerOrder/so_print/dT0xMTgwOTkxNjA3LDI2NDU3NTgzMDQmZm09MjYmZ3A9MA==_1608863703069-IxxEGE.jpg'
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
          // this.materialData._tableForm.dataSource = []
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
            if (this.activeIndex === '1') {
              if ((item.planQty - item.arrangeFactoryQty) === 0 || (item.planQty - item.arrangeFactoryQty) === '0') {
                item.edit = false
              } else {
                item.edit = v
              }
            } else if (this.activeIndex === '2') {
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
        // this.ClickSelectAll(v) // 全选按钮
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
    syncPop(key, data) {
      this.$nextTick(() => {
        if (key === 'servePop') {
          // 同步客样分析编号模块数据
          const IndexData = this.$utils.deepClone(data)
          const Tim =
            this.$utils.deepClone(this.materialData._tableForm.dataSource) ||
            []
          IndexData.forEach((im) => {
            im.printDelivery = im.planDelivery
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
    // 染纱厂下拉
    async getClothPropertyInfo() {
      const obj = {
        isEnabled: '1',
        status: '5',
        supplierCategory: 1,
        supplierType: '10004'
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
#demand_detail_com_cxp {
  .detail-branch-detail-form {
    background: #fff;
    .el-form-item--small {
      margin-bottom: 0 !important;
    }
  }
  .yarn-style {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 300px;
    white-space: nowrap;
    color: #666666;
    display: flex;
    align-items: center;
  }
}
</style>

<style lang="scss" scoped>
.analyse_detail_cxp {
  width: 100%;
  .header-product {
    border-top: 1px solid #dfe6ec;
    padding: 20px;
  }
  .goods-order-items {
    margin: 0 10px;
    .header-top {
      padding: 5px 10px 15px 0px;
      .Info_div {
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
    .page-table-border {
      /deep/ .el-table--mini {
        font-size: 14px !important;
      }
      /deep/tbody .el-table__row td {
        border-bottom-width: 1px !important;
        padding: 12px 0;
        // padding: 1px  0 !important;
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
