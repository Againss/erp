<!--
 * @Author: Do not edit
 * @Date: 2021-04-01 09:13:35
 * @LastEditTime: 2021-06-09 13:52:07
 * @LastEditors: admin
 **  送货计划页面
 -->
<template>
  <div class="page-main delivery-plan">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="formDatas"
      />
    </div>

    <!-- table表格 -->
    <div class="page-content">
      <el-tabs v-model="activeName" @tab-click="activeClick">
        <el-tab-pane :label="`全部(${totalNum.allCount || 0})`" name="all" />
        <el-tab-pane :label="`草稿(${totalNum.draftCount || 0})`" name="1" />
        <el-tab-pane
          :label="`待开单(${totalNum.notBillCount || 0})`"
          name="2"
        />
        <el-tab-pane :label="`已开单(${totalNum.billedCount || 0})`" name="3" />
      </el-tabs>
      <div class="tab-btns">
        <el-button
          v-permission="['pms:deliveryNote:add']"
          size="small"
          type="primary"
          class="createBtn"
          @click="createList"
        >生成送货单</el-button>
        <el-button
          v-permission="['pms:deliveryPlan:add']"
          size="small"
          type="primary"
          @click="addBtn"
        >添加送货计划</el-button>
      </div>
    </div>
    <div class="page-table only-table">
      <cs-custom-table
        :key="activeName"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        @selection-change="selectionChange"
      />
    </div>
    <!-- 添加采购清单的弹框 -->
    <div class="detail">
      <cs-custom-pop
        ref="addPopOptions"
        :options="addOptions"
        @close="addOptions.visible = false"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="editPop" :options="editPopOptions" />
    </div>
  </div>
</template>

<script>
import {
  planPage,
  planCount,
  planUpdate,
  planAdd,
  planDetail,
  planDelete,
  dialogPage,
  planCheckModify
} from './api/index.js'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
import * as apiPub from '@/views/pms/public/api/index.js'
import { dataComparision } from '@/views/pms/public/dialog'
import { fetchLog } from '@/views/pms/public/fetchLog'
import card from '@/views/pms/delivery-plan/components/delivery-card.vue'
export default {
  name: 'DeliveryPlan',
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const bagBlurReg = this.$getRules({ type: 'number', pattern: /^(?:[1-9]\d*|0)+(.[0-9]{1,2})?$/, message: '只能输入正数，两位小数', trigger: ['change'] })
    // const bagBlurReg = this.$getRules({ type: 'number', pattern: /^[0-9]+(.[0-9]{2})?$/, message: '请输入最多两位小数的正数', trigger: ['change'] })

    const itemStyle = { width: '27%' }
    const style1 = {
      'font-size': '14px',
      'color': '#333',
      'background-color': '#eee',
      'padding': '10px',
      'border-radius': '2px',
      'margin-bottom': '15px'
    }
    // const ruleTrim = (rule, value, callback) => {

    //   var reg = /^[-]?[0-9]+(\.[0-9]{1,2})?$/
    //   this.valueWord = value
    //   if (
    //     (!reg.test(value) && value) ||
    //     value === '0' ||
    //     value === '0.0' ||
    //     value === '0.00'
    //   ) {
    //     callback(new Error('请输入最多2位小数的正数'))
    //   } else if (parseInt(value) > 99999999.99) {
    //     callback(new Error('输入数值不能大于99999999.99'))
    //   } else {
    //     callback()
    //   }
    // }
    // var filterVal = (val) => {
    //   val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    //   val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
    //   val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    //   val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
    //   return val
    // }
    // 当前时间之前的时间不能选择
    const timeBefore = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }
    const searchStyle = { width: '33%' }
    const otherStyle = { width: '33%', marginTop: '1px' }
    // 查询/重置表单配置信息
    const searchData = {
      _purchaseOrderNumber: {
        prop: 'purchaseOrderNumber',
        itemType: 'input',
        label: '采购订单号',
        placeholder: '请输入采购订单号',
        clearable: true,
        itemStyle: searchStyle
      },
      _materiel: {
        prop: 'materiel',
        itemType: 'input',
        label: '纱线编码',
        placeholder: '请输入纱线编码',
        clearable: true,
        itemStyle: searchStyle
      },
      _demandNumber: {
        prop: 'demandNumber',
        itemType: 'input',
        label: '需求编码',
        placeholder: '请输入需求编码',
        clearable: true,
        itemStyle: searchStyle
      },
      _supplier: {
        prop: 'supplier',
        itemType: 'select',
        label: '供应商',
        valueType: 'object',
        // valueKey: 'id',
        clearable: true,
        filterable: true,
        itemStyle: otherStyle,
        placeholder: '请选择',
        dataSource: []
      },
      _dateRange: {
        itemType: 'date',
        type: 'daterange',
        prop: 'dateRange',
        label: '交期',
        itemStyle: otherStyle,
        // itemStyle: { width: '365px' },
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
      },
      _datePlan: {
        itemType: 'date',
        type: 'daterange',
        prop: 'datePlan',
        label: '预计送货日期',
        itemStyle: otherStyle,
        // itemStyle: { width: '365px' },
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          // 交期时间
          if (params.dateRange) {
            params.deliveryStartDate = params.dateRange[0]
            params.deliveryEndDate = params.dateRange[1]
          } else {
            params.deliveryStartDate = null
            params.deliveryEndDate = null
          }
          // 预计送货时间
          if (params.datePlan) {
            params.deliveryPlanStartDate = params.datePlan[0]
            params.deliveryPlanEndDate = params.datePlan[1]
          } else {
            params.deliveryPlanStartDate = null
            params.deliveryPlanEndDate = null
          }
          this.getRulePage(params)
          this.searchFormDatas = params
        },
        resetHandle: (params) => {
          this.searchFormDatas = {}
        }
      }
    }
    const selection = {
      selection: true,
      selectionLabel: '全部',
      itemStyle: {
        marginLeft: '100px'
      }
    }
    // 表格表头的配置信息
    const columns = {
      _selection: {
        prop: 'ids',
        type: 'selection',
        fixed: 'left',
        minWidth: '35',
        selectable: (scope) => {
          return scope.status === 2 && !scope.tableDisabled
        }
      },
      _index: {
        prop: 'index',
        label: '序号',
        minWidth: '50'
      },
      _deliveryPlanNumber: {
        prop: 'deliveryPlanNumber',
        label: '计划号',
        minWidth: '150',
        showOverflowTooltip: true
      },
      _purchaseOrderNumber: {
        prop: 'purchaseOrderNumber',
        label: '采购订单号',
        minWidth: '180'
      },
      _materiel: {
        prop: 'materiel',
        label: '纱线编码',
        width: '160',
        showOverflowTooltip: true,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer'
            },
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            showContent: (scope) => {
              return `<span style='display: inline-block;width:140px;overflow:hidden;color:#0986FF;cursor:pointer'>${scope.row.materiel || ''}</span>`
            },
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
      },
      _materielName: {
        prop: 'materielInfo.materielName',
        label: '纱名',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.materielName
          } else {
            return '-'
          }
        }
      },
      _materielProperty: {
        prop: 'materielInfo.materielProperty',
        label: '纱属性',
        minWidth: '150',
        formater: (scope) => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.materielProperty
          } else {
            return '-'
          }
        },
        showOverflowTooltip: true
      },
      _deliveryDate: {
        prop: 'deliveryDate',
        label: '交期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.deliveryDate || 0,
            '{y}-{m}-{d}'
          )
        }
      },
      _purchaseWeight: {
        prop: 'purchaseWeight',
        label: '采购重量（KG）',
        // align: 'right',
        minWidth: '160'
      },
      _supplierName: {
        prop: 'supplierName',
        label: '供应商',
        minWidth: '130',
        showOverflowTooltip: true
      },
      _yarnCard: {
        prop: 'yarnCard',
        label: '纱牌/批号',
        minWidth: '150',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName !== '1'
        }
      },
      _deliveryPlanDate: {
        prop: 'deliveryPlanDate',
        label: '预计送货日期',
        minWidth: '160',
        isShow: () => {
          return this.activeName !== '1'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.deliveryPlanDate || 0,
            '{y}-{m}-{d}'
          )
        }
      },
      _deliveryPlanWeight: {
        prop: 'deliveryPlanWeight',
        label: '预计送货重量（KG）',
        minWidth: '180',
        align: 'right',
        isShow: () => {
          return this.activeName !== '1'
        }
      },
      _packageWeight: {
        prop: 'packageWeight',
        label: '包装数（KG）',
        minWidth: '150',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName !== '1'
        }
      },
      _deliveryPlanCount: {
        prop: 'deliveryPlanCount',
        label: '预计送货件数',
        minWidth: '150',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName !== '1'
        }
      },
      _planerName: {
        prop: 'planerName',
        label: '添加人',
        minWidth: '120'
      },
      _planDate: {
        prop: 'planDate',
        label: '添加时间',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.planDate
            ? this.$filters.parseTime(
              scope.row.planDate || 0,
              '{y}-{m}-{d} {h}:{i}:{s}'
            )
            : '-'
        }
      },
      _drawWeight: {
        prop: 'drawWeight',
        label: '开单重量（KG）',
        minWidth: '160',
        align: 'right',
        isShow: () => {
          return this.activeName !== '1'
        }
      },
      _deliveryNoteList: {
        prop: 'deliveryNoteList',
        label: '送货单号',
        width: '180',
        isShow: () => {
          return this.activeName !== '1'
        },
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer'
            },
            content: card,
            contentOptions: {},
            trigger: 'click',
            // mouseleave: true,
            formDatas: {},
            showContent: (scope) => {
              var res = scope.row.deliveryNoteList
              var arr = []
              res.forEach((i) => {
                arr.push(i.deliveryNumber)
              })
              return arr.length ? `<span style='display: inline-block;width:140px;overflow:hidden;color:#0986FF;cursor:pointer'>${arr.join()}</span>` : `<span>-</span>`
            },
            show: (scope) => {
              return scope.row['deliveryNoteList']
            }
          }
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '110',
        formater: (scope) => {
          return this.getStatus(scope.row)
        },
        isShow: () => {
          return this.activeName === 'all'
        }
      }
    }
    // 弹框中的表格
    const tableColumns = {
      _index: {
        prop: 'index',
        label: '序号',
        minWidth: '50'
      },
      _purchaseOrderNumber: {
        prop: 'purchaseOrderNumber',
        label: '采购订单号',
        minWidth: '150'
      },
      _materiel: {
        prop: 'materiel',
        label: '纱线编码',
        formater: (scope) => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.materiel
          } else {
            return '-'
          }
        },
        minWidth: '150'
      },
      _materielName: {
        prop: 'materielInfo.materielName',
        label: '纱名',
        minWidth: '130',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.materielName
          } else {
            return '-'
          }
        }
      },
      _materielProperty: {
        prop: 'materielInfo.materielProperty',
        label: '纱属性',
        minWidth: '130',
        formater: (scope) => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.materielProperty
          } else {
            return '-'
          }
        },
        showOverflowTooltip: true
      },
      _deliveryDate: {
        prop: 'deliveryDate',
        label: '交期',
        minWidth: '150',
        formater: (scope) => {
          return scope.row.deliveryDate
            ? this.$filters.parseTime(
              scope.row.deliveryDate || 0,
              '{y}-{m}-{d}'
            )
            : '-'
        }
      },
      _purchaseWeight: {
        prop: 'purchaseWeight',
        label: '采购重量（KG）',
        minWidth: '160',
        align: 'right'
      },
      _supplierName: {
        prop: 'supplierName',
        label: '供应商',
        minWidth: '150',
        showOverflowTooltip: true
      }
    }
    // 弹窗送货明细表头设置
    const popTableColumns = {
      _unitWeight: {
        prop: 'unitWeight',
        label: '单件重量（KG）',
        className: 'ruleTip',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          change: (value, b, params, d) => {
            console.log(params, 'params')
            this.getUnitweightBlur(value, params)
            this.popTableData = params.detailList
            params.deliveryPlanWeight = this.deliveryPlanWeight
            params.deliveryPlanCount = this.planNumber
            this.$set(this.editPopOptions, 'formDatas', params)
          }
          // blur: (form, b, params) => {
          //   // console.log(form.target.value, b, params.tableForm, 'abc')
          //   this.getUnitweightBlur(form, params)
          //   params.deliveryPlanWeight = this.deliveryPlanWeight
          //   params.yarnCardbb = this.planNumber
          //   this.$set(this.editPopOptions, 'formDatas', params)
          // }
          // rules: [
          //   {
          //     required: true,
          //     message: '单件重量不能为空',
          //     trigger: ['blur']
          //   }
          // ]
        }
      },
      _unitCount: {
        prop: 'unitCount',
        label: '件数',
        className: 'ruleTip',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          change: (value, b, params, d) => {
            const numberReg = /(^[1-9]\d*$)/
            if (value) {
              if (!numberReg.test(value)) {
                this.$message.error('件数为正整数！')
              }
            }
            this.popTableData = params.detailList
            params.deliveryPlanWeight = this.deliveryPlanWeight
            params.deliveryPlanCount = this.planNumber
            this.$set(this.editPopOptions, 'formDatas', params)
          }
          // blur: (form, b, params) => {
          //   const numberReg = /(^[1-9]\d*$)/
          //   if (form.target.value) {
          //     if (!numberReg.test(form.target.value)) {
          //       this.$message.error('件数为正整数！')
          //     }
          //   }
          //   params.deliveryPlanWeight = this.deliveryPlanWeight
          //   params.yarnCardbb = this.planNumber
          //   this.$set(this.editPopOptions, 'formDatas', params)
          // }
        }
      }
    }
    // 弹出框表格操作信息
    const configPopOperates = [
      {
        label: '新增',
        isShow: (scope) => {
          if (scope.$index === this.popTableData.length - 1) {
            return true
          }
        },
        handle: (params, form, formDatas, setformdatas) => {
          console.log(params, form, formDatas, setformdatas, '121212')
          const popTableParams = {
            unitWeight: '', // 第一行数据的单件重量等于包装数
            unitCount: '',
            edit: true
          }
          const data = [...formDatas['detailList']]
          // data.splice(params.$index + 1, 0, popTableParams)
          data.push(popTableParams)
          this.popTableData = data
          if (this.editPopOptions.visible) {
            this.$set(this.copyContent._tableForm, 'dataSource', data)
          }
        }
      }
      // {
      //   label: '删除',
      //   isShow: (scope) => {
      //     return true
      //   },
      //   style: { 'color': '#FE4949' },
      //   handle: (params, form, formDatas, setformdatas) => {
      //     this.$confirm('确认删除该条送货明细？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning',
      //       center: true,
      //       customClass: 'customClass'
      //     })
      //       .then(() => {
      //         const data = [...formDatas['tableForm']]
      //         data.splice(params.$index, 1)
      //         if (this.editPopOptions.visible) {
      //           this.$set(this.copyContent._tableForm, 'dataSource', data)
      //         }
      //       })
      //       .catch(() => {
      //         this.$message({ type: 'info', message: '已取消删除' })
      //       })
      //   }
      // }
    ]
    // 编辑时弹窗中的字段
    const commonContent = {
      _materiel: {
        prop: 'materiel',
        itemType: 'input',
        label: '纱线编码'
      },
      _materielName: {
        prop: 'materielName',
        itemType: 'input',
        label: '纱名'
      },
      _materielProperty: {
        itemType: 'input',
        prop: 'materielProperty',
        label: '纱属性'
      },
      _deliveryDate: {
        itemType: 'input',
        prop: 'deliveryDate',
        label: '交期'
      },
      _purchaseWeight: {
        itemType: 'input',
        prop: 'purchaseWeight',
        label: '采购重量（KG）'
      },
      _supplierName: {
        itemType: 'input',
        prop: 'supplierName',
        label: '供应商'
      },

      _yarnCard: {
        itemType: 'input',
        prop: 'yarnCard',
        label: '纱牌/批号',
        clearable: true,
        maxlength: 100,
        rules: [commonBlurReg]
        // change: (a,b,c,d) =>{
        //   console.log(a,b,c,d,"abcd");
        // }
      },
      _deliveryPlanDate: {
        itemType: 'date',
        prop: 'deliveryPlanDate',
        label: '预计送货日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        placeholder: '请选择日期',
        clearable: true,
        pickerOptions: timeBefore,
        rules: [commonBlurReg]
      },
      _packageWeight: {
        itemType: 'input',
        prop: 'packageWeight',
        label: '包装数(KG)',
        clearable: true,
        rules: [commonBlurReg, bagBlurReg],
        change: (value, b, params) => {
          // console.log(value,params.yarnCardaa,"value")

          this.popTableData = JSON.parse(JSON.stringify(params.detailList))
          this.popTableData[0].unitWeight = value

          this.$set(this.copyContent._tableForm, 'dataSource', this.popTableData)
          console.log(this.$refs.editPop.$refs.popComponents.formDatas.detailList, 'this.$refs.editPop.$refs.popComponents.formDatas.detailList')
          params.deliveryPlanCount = this.planNumber
          params.deliveryPlanWeight = this.deliveryPlanWeight
        }
      },
      _shmx: {
        itemType: 'view',
        text: '预计送货明细',
        style: style1
        // prop: 'shmx',
        // className: 'shmxStyle',
        // label: '预计送货明细'

      },
      _tableForm: {
        prop: 'detailList',
        itemType: 'table-form',
        // label: '表格表单',
        className: 'popTableForm',
        props: { edit: 'edit' },
        border: true,
        // dataSource: popTableData,
        dataSource: [],
        columns: popTableColumns,
        operates: {
          label: '操作',
          width: '80',
          dataSource: configPopOperates
        }
      },
      _deliveryPlanWeight: {
        itemType: 'input',
        prop: 'deliveryPlanWeight',
        label: '预计送货重量（KG）',
        clearable: true,
        disabled: true
      },
      _deliveryPlanCount: {
        itemType: 'input',
        prop: 'deliveryPlanCount',
        label: '预计送货件数',
        disabled: true,
        clearable: true

      }
    }
    const copyContent = {
      ...commonContent
    }
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['pms:deliveryPlan:modify'],
        isShow: (scope) => {
          return scope.row.status === 1
        },
        handle: async(scope) => {
          // debugger
          // this.$set(this.editPopOptions, 'visible', false)
          await planCheckModify(scope.row)
          this.PopDialogHandle('编辑送货计划')
          this.$set(this.copyContent._materiel, 'disabled', true)
          this.$set(this.copyContent._materielName, 'disabled', true)
          this.$set(this.copyContent._materielProperty, 'disabled', true)
          this.$set(this.copyContent._deliveryDate, 'disabled', true)
          this.$set(this.copyContent._purchaseWeight, 'disabled', true)
          this.$set(this.copyContent._supplierName, 'disabled', true)
          this.$set(this.editPopOptions, 'content', copyContent)
          this.editList({ id: scope.row.id }, scope.row.index)
          // this.$set(this.editPopOptions.formDatas,'deliveryPlanWeight',this.deliveryPlanWeight)
          // this.editPopOptions.formDatas.deliveryPlanWeight = this.deliveryPlanWeight
          // this.$set(
          //   this.copyContent['_deliveryPlanWeight']['children']['_tip'],
          //   'isShow',
          //   false
          // )
          // this.$set(this.copyContent._words, 'className', wordsInput)
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        permitTag: ['pms:deliveryPlan:delete'],
        isShow: (scope) => {
          return scope.row.status === 1
        },
        handle: (scope) => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.deleteData(scope.row.id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getRulePage({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.getRulePage({ pageNum: this.pagination.pageNum, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const editPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '编辑送货计划',
      okText: '保存',
      ok: (params) => {
      //   if (!this.popTableData.length) {
      //   this.$message({
      //     type: 'error',
      //     message: '预计送货明细不能为空！'
      //   })
      //   return
      //  }
        let isAdd = false // 单件重量不能大于包装数
        let isUnitWeight = false // 单件重量不能为空
        let isUnitCount = false // 件数不能为空
        this.popTableData && this.popTableData.forEach((item, index) => {
          if ((item.unitWeight * 1) > (params.packageWeight * 1)) {
            // this.$message.error('单件重量不能大于包装数！')
            isAdd = true
            return isAdd
          }
          if (!item.unitWeight && item.unitCount) {
            isUnitWeight = true
            return isUnitWeight
            // this.$message.error('单件重量不能为空！')
          }
          if (!item.unitCount && item.unitWeight) {
            isUnitCount = true
            return isUnitCount
            // this.$message.error('件数不能为空！')
          }
        })
        // console.log(params, '343667')
        params.detailList && params.detailList.forEach((ditem, dindex) => {
          if (!ditem.unitWeight && !ditem.unitCount) {
            // delete ditem
            params.detailList.splice(dindex, 1)
          }
        })
        if (isAdd) {
          this.$message.error('单件重量不能大于包装数！')
        } else if (!this.checkValue(this.popTableData)) {
          this.$message.error('单件重量不能重复！')
        } else if (isUnitWeight) {
          this.$message.error('单件重量不能为空！')
        } else if (isUnitCount) {
          this.$message.error('件数不能为空！')
        } else {
          this.addOrEdit(params)
        }
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, 'edit')
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        // console.log(this.oldForm, params,"old")
        const flag = dataComparision(this.oldForm, params, 'edit')
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: copyContent
    }
    // 添加采购清单的弹框
    const addOptions = {
      itemType: 'dialog',
      visible: false,
      title: '采购清单',
      width: '1200px',
      okText: '添加至送货计划',
      ok: (params) => {
        this.okDialog()
      },
      close: () => {
        this.addOptions.visible = false
      },
      cancel: (params) => {
        this.addOptions.visible = false
      },
      formDatas: {},
      formOptions: {
        size: 'small',
        // layout: true,
        inline: true
      },
      content: {
        _selection: {
          prop: 'ids',
          type: 'selection'
        },
        _purchaseOrderNumber: {
          prop: 'purchaseOrderNumber',
          itemType: 'input',
          label: '采购订单',
          clearable: true,
          placeholder: '请输入采购订单',
          itemStyle,
          edit: true
        },
        _materiel: {
          prop: 'materiel',
          itemType: 'input',
          label: '纱线编码',
          clearable: true,
          placeholder: '请输入纱线编码',
          itemStyle
        },
        _supplier: {
          prop: 'supplier',
          itemType: 'select',
          label: '供应商',
          valueType: 'object',
          // valueKey: 'id',
          dataSource: [],
          placeholder: '请选择',
          itemStyle,
          filterable: true,
          clearable: true
        },
        _operate: {
          itemType: 'operate',
          submitText: '查询',

          submitHandle: (params) => {
            this.searchDialog(params)
          },
          resetHandle: () => {}
        },
        _materielName: {
          prop: 'materielName',
          itemType: 'input',
          label: '纱名',
          placeholder: '请输入纱名',
          itemStyle,
          formater: (scope) => {
            return scope.row.materielInfo.materielName || ''
          }
        },
        _materielProperty: {
          prop: 'materielProperty',
          itemType: 'input',
          label: '纱属性',
          placeholder: '请输入纱属性',
          itemStyle,
          formater: (scope) => {
            return scope.row.materielInfo.materielProperty || ''
          }
        },
        _deliveryTable: {
          // tooltipEffect: 'light',
          width: '1200px',
          height: '300px',
          layout: true,
          prop: 'deliveryTable',
          itemType: 'table',
          selectionChange: (val) => {
            this.selectionDialog = val
            this.selectionSort(val)
          },
          columns: {
            _selection: {
              prop: 'id',
              type: 'selection'
              // selectable: (scope) => {
              //   return !scope.dialogDisabled
              // }
            },
            ...tableColumns
          },
          dataSource: [],
          itemStyle: {
            width: '100%'
          }
        }
      }
    }

    return {
      activeName: '1',
      formOptions: {
        layout: true,
        size: 'small',
        inline: true
      },
      formDatas: {},
      selectionData: [], // 存储勾选的数据
      selectionDialog: [], // 弹框中勾选的数据
      searchData,
      selection,
      columns,
      copyContent,
      dataSource: [], // 外面表格的数据
      selectDataSource: [], // 弹框表格的数据
      pagination,
      popOperates,
      popOperatesDataSource,
      detailWeight: '', // 弹框中的采购重量
      valueWord: '', // 预计送货重量的值
      // wordsInput,
      editPopOptions, // 编辑的弹框
      addOptions, // 采购清单的弹框
      visible: false,
      totalNum: {}, // 总数量
      rowInfoMessages: {}, // 日志先后拿到的信息
      oldForm: {}, // 旧详情数据
      popTableColumns, // 计划送货明细表头
      popTableData: [], // 计划送货明细数据
      weightTableForm: [] // 计算预计送货重量时的预计送货明细数据
    }
  },
  computed: {
    // 计算预计送货重量
    deliveryPlanWeight() {
      console.log('111')
      // debugger
      // this.weightTableForm = []
      // this.weightTableForm = this.$refs.editPop.$refs.popComponents.formDatas.tableForm || []
      // const weightTableForm = this.$refs.editPop.$refs.popComponents.formDatas.tableForm || []
      let allWeight = 0
      // console.log(this.popTableData,"popTableData")
      this.popTableData && this.popTableData.forEach((item, index) => {
        if (item.unitWeight && item.unitCount) {
          allWeight += (item.unitWeight * 1) * (item.unitCount * 1)
        }
      })
      // console.log(allWeight,"allWeight")
      return this.$utils.getFloat(allWeight, 2) || 0
    },
    // 计算预计送货件数
    planNumber() {
      const tableForm = this.$refs.editPop.$refs.popComponents.formDatas.detailList || []
      let allNumber = 0
      tableForm && tableForm.forEach((item, index) => {
        if (item.unitCount) {
          allNumber += item.unitCount * 1
        }
      })
      return allNumber || 0
    }
  },
  created() {
    this.getRulePage()
    this.supplierList()
  },
  mounted() {},
  methods: {
    // 单件重量取值唯一性验证
    checkValue(data) {
      console.log(data)
      const obj = {}
      let isRepeat = false
      const flag = data.every(item => {
        if (item.unitWeight) {
          isRepeat = obj[item.unitWeight] ? false : obj[item.unitWeight] = true
        }
        return isRepeat
      })
      return flag
    },
    // 单件重量校验
    getUnitweightBlur(value, params) {
      // const UnitweightTest = /^([1-9]\d)(\.\d{1,2})?$/
      // console.log(form, params, 'form')
      if (!value) {
        this.$message.error('单件重量不能为空！')
      } else if ((value * 1) > (params.packageWeight * 1)) {
        // console.log(form.target.value,params.yarnCardaa,"form.target.value")
        this.$message.error('单件重量不能大于包装数！')
      } else if (!this.checkValue(params.detailList)) {
        this.$message.error('单件重量不能重复！')
      }
      // else if(value && UnitweightTest.test(value)){
      //   this.$message.error('只能输入正数，两位小数！')
      // }
    },

    // 状态的返回
    getStatus(data) {
      let status = ''
      switch (data.status) {
        case 1:
          status = `<span style="color:#888E9E">草稿</span>`
          break
        case 2:
          status = `<span style="color:#FF9214">待开单</span>`
          break
        case 3:
          status = `<span style="color:#00BCC5">已开单</span>`
          break
      }
      return status
    },
    activeClick() {
      // 操作栏的显隐
      if (this.activeName === '2' || this.activeName === '3') {
        this.popOperates = null
      } else {
        this.popOperates = {
          label: '操作',
          width: '120',
          fixed: 'right',
          dataSource: this.popOperatesDataSource
        }
      }
      this.getRulePage()
    },
    addBtn() {
      this.addOptions.visible = true
      // 搜索表格中的数据
      this.searchDialog()
      // 还是需要再次调用供应商的下拉
      this.supplierList()
    },
    // 供应商下拉的内容--采购
    async supplierList() {
      const res = await apiPub.getAllSupplier({ supplierCategory: 0 })
      if (res.code === 200) {
        // 把搜索中的供应商填充
        const supplierData = (res.data || []).map((item) => {
          return { value: item.id, label: item.supplierName }
        })
        this.$set(this.searchData._supplier, 'dataSource', supplierData)
        // 填充弹框中的数据
        this.$set(
          this.addOptions.content._supplier,
          'dataSource',
          supplierData
        )
      }
    },
    // 弹框中列表的数据
    async searchDialog(params = {}) {
      // , filterFlag: true
      const res = await dialogPage({ ...params, filterFlag: true })
      this.selectDataSource = res.data.list
      if (res.code === 200) {
        this.$set(
          this.addOptions.content._deliveryTable,
          'dataSource',
          (res.data.list &&
            res.data.list.map((item, index) => {
              item.index =
                (res.data.pageNum - 1) * res.data.pageSize + index + 1
              return item
            })) ||
            []
        )
      }
      // this.total = res.data.total || {}
      // this.pagination = {
      //   ...this.pagination,
      //   dataTotal: res.data ? res.data.total : 0,
      //   ...data,
      //   currentPage: res.data.pageNum,
      //   pageSize: res.data.pageSize
      // }
    },
    // 弹框勾选的数据
    selectionSort(val) {
      this.selectionDialog = val
      if (this.selectionDialog.length > 0) {
        this.selectDataSource.forEach((item) => {
          // console.log('val[0].supplierId', val[0].supplierId)
          if (item.supplierId !== val[0].supplierId) {
            item.dialogDisabled = true
          } else {
            item.dialogDisabled = false
          }
        })
      } else {
        this.selectDataSource.forEach((item) => {
          item.dialogDisabled = false
        })
      }
    },
    // 弹框添加送货计划按钮
    async okDialog() {
      if (!this.selectionDialog.length) {
        this.$message({
          type: 'info',
          message: '请选择采购清单'
        })
        return
      }
      // console.log(this.selectionDialog,"this.selectionDialog")
      // const billList = this.selectionDialog.map((item) => {
      //   return item.id
      // })
      this.selectionDialog.forEach((item) => {
        item.materiel = item.materielInfo.materiel || ''
      })
      const res = await planAdd([...this.selectionDialog])
      if (res.code !== 200) {
        return false
      }
      this.addOptions.visible = false
      this.outFun({
        type: 'INSERT',
        url: '/pms/deliveryPlan/batchAdd',
        remark: this.selectionDialog,
        beforeText: `在'采购管理-送货计划'新增一条记录`,
        beforeCode: `: 成功新增${this.selectionDialog}`
      })
      this.getRulePage({
        pageNum: this.pagination.pageNum || 1,
        pageSize: this.pagination.pageSize || 20
      })
    },
    PopDialogHandle(val) {
      this.$set(this.editPopOptions, 'visible', !this.editPopOptions.visible)
      if (val) {
        this.$set(this.editPopOptions, 'title', val)
      }
    },
    // 编辑或修改弹出框点击确认按钮的接口事件
    addOrEdit(params) {
      // console.log(params,"params111")
      const obj = {}
      const pamraskey = [
        'id',
        'materiel',
        'materielName',
        'materielProperty',
        'deliveryDate',
        'purchaseWeight',
        'supplierName',
        'yarnCard',
        'deliveryPlanDate',
        'deliveryPlanWeight',
        'packageWeight',
        'detailList',
        'deliveryPlanCount'
      ]
      pamraskey.forEach((v) => {
        obj[v] = params[v]
      })
      this.addUpdate(obj)
    },
    // 列表查询
    async getRulePage(data = {}) {
      let obj
      if (this.activeName === 'all') {
        obj = {}
      } else {
        obj = { status: this.activeName - 0 }
      }
      const res = await planPage({ ...this.searchFormDatas, ...data, ...obj })
      this.dataSource =
        (res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
            return item
          })) ||
        []
      this.dataSource.forEach((val) => {
        val.materiel = val.materielInfo ? val.materielInfo.materiel : ''
      })
      this.total = res.data.total || {}
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      // 总数量接口
      const numRes = await planCount({
        ...this.searchFormDatas,
        ...data
      })
      this.totalNum = numRes.data || {}
    },
    // 勾选数据
    selectionChange(val) {
      this.selectionData = val
      console.log('打印勾选的数据', val)
      // console.log('打印数组', this.dataSource)
      // 拿勾选的数据和整个数组中的数据进行比较，，找出供应商不一样的数据，，并进行置灰操作
      if (this.selectionData.length > 0) {
        this.dataSource.forEach((item) => {
          // console.log(item.supplierId)
          // console.log('val[0].supplierId', val[0].supplierId)
          if (item.supplierId !== val[0].supplierId) {
            item.tableDisabled = true
          } else {
            item.tableDisabled = false
          }
        })
      } else {
        this.dataSource.forEach((item) => {
          item.tableDisabled = false
        })
      }
    },
    // 生成送货单
    createList() {
      // console.log('打印生产', this.selectionData)
      if (!this.selectionData.length) {
        this.$message({
          type: 'info',
          message: '请选择送货计划单'
        })
        return
      }
      // 把勾选的数据放在localStorage中，然后带到送货订单详情页面，放置到送货清单列表中
      const createData = JSON.stringify({ createOrder: this.selectionData })
      localStorage.setItem('noteDetail', createData)
      console.log(
        'noteDetail',
        JSON.parse(localStorage.getItem('noteDetail')).createOrder
      )
      this.$router.push('/pms/delivery-note/detail')
      this.$router.push({
        path: '/pms/delivery-note/detail',
        query: { pageType: 'create' }
      })
    },
    // 点击编辑获取详情
    async editList(data = {}, code) {
      const res = await planDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      const editData = res.data || {}
      editData.deliveryDate = editData.deliveryDate
        ? this.$filters.parseTime(editData.deliveryDate + '', '{y}-{m}-{d}')
        : ''
      if (editData.materielInfo) {
        editData.materiel = editData.materielInfo.materiel
          ? editData.materielInfo.materiel
          : ''
        editData.materielName = editData.materielInfo.materielName
          ? editData.materielInfo.materielName
          : ''
        editData.materielProperty = editData.materielInfo.materielProperty
          ? editData.materielInfo.materielProperty
          : ''
      }
      this.popTableData = [] // 暂时先清掉
      // 设置计划送货明细数据
      if (this.popTableData.length === 0 || this.popTableData.length === 1) {
        this.popTableData = [
          {
            unitWeight: editData.packageWeight || '', // 第一行数据的单件重量等于包装数
            unitCount: editData.unitCount || '',
            edit: true,
            unitWeightEdit: false
          }
        ]
      }
      this.$set(this.copyContent._tableForm, 'dataSource', this.popTableData)
      // 获取采购重量
      // console.log('采购重量', editData.purchaseWeight)
      this.detailWeight = editData.purchaseWeight
      editData.words = '预计送货重量>采购重量'
      editData.detailList = this.popTableData || []
      editData.deliveryPlanCount = 0
      this.rowInfoMessages = { ...editData }
      this.oldForm = { ...editData, index: code }

      this.setFormDatas({ ...editData, index: code, deliveryPlanWeight: this.deliveryPlanWeight, deliveryPlanCount: this.planNumber })
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.editPopOptions, 'formDatas', params)
      }, 0)
    },
    // 弹框取消数据比较回调
    CompaCallback(hadInput) {
      if (hadInput) {
        this.$confirm('您已经输入内容，确认退出吗？', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then((_) => {
            this.$set(this.editPopOptions, 'visible', false)
          })
          .catch((_) => {
            this.$set(this.editPopOptions, 'visible', true)
          })
      } else {
        this.$set(this.editPopOptions, 'visible', false)
      }
    },
    // 更新
    async addUpdate(data = {}) {
      const res = await planUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      // 日志--修改
      const { beforeCode, afterCode } = this.compareData(
        this.rowInfoMessages,
        data,
        'id'
      )
      this.fetchLog(
        this.getLogMessages('UPDATE', '/pms/deliveryPlan/modify'),
        data,
        JSON.stringify({
          beforeText: `在'采购管理-送货计划,修改一条记录`,
          ...{ beforeCode, afterCode }
        })
      )
      this.$set(this.editPopOptions, 'visible', false)
      this.getRulePage({
        pageNum: this.pagination.pageNum || 1,
        pageSize: this.pagination.pageSize || 20
      })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 删除
    async deleteData(id) {
      const res = await planDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      // 日志--删除
      this.fetchLog(
        this.getLogMessages('DEL', '/pms/deliveryPlan/delete'),
        id,
        JSON.stringify({
          beforeText: `在'采购管理-送货计划, 删除一条记录`,
          beforeCode: { id: id }
        })
      )
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRulePage({
        pageNum: this.pagination.pageNum || 1,
        pageSize: this.pagination.pageSize || 20
      })
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/ .el-table__row .cell > div {
  height: 23px;
  overflow: hidden;
}
/deep/ .el-table-column--selection .cell {
  padding-left: 20px;
}
.delivery-plan {
  .createBtn {
    background-color: #fff;
    color: #666;
    border: 1px solid #d0d8e0;
  }
  /deep/.el-tabs__header{
      margin-bottom: 1px;
    }
  /deep/ .el-table th > .cell {
    > :first-child {
      // padding-left: 4px;
      // display: none;
      visibility: hidden;
    }
  }
  /deep/.el-tabs__nav-wrap {
    padding-left: 20px;
    margin-left: 0;
    margin-right: 0;
  }
  /deep/ .el-form-item__error {
    width: 230px;
  }
  /deep/.el-form-item__content {
    line-height: 20px;
  }
  .pop  {
    // /deep/ .itemview .el-form-item__label-wrap{
    //   margin-left: 0 !important;
    // }
    /deep/ .el-table th > .cell {
        font-size: 14px !important;
        color: #44494C !important;
        font-weight: normal;
    }
  }
}
</style>

<style lang="scss">
.detail {
  // /deep/.el-form-item--medium .el-form-item__content{
  //   line-height: 20px;
  // }
  // padding: 0px 10px 20px;
  .el-table th {
    background-color: #f5f7fa;
  }

}
.itemview .el-form-item__label-wrap > .el-form-item__label:before {
      display: block;
      content: '*';
      position: absolute;
      left: 40px;
      color: #FE4949;
}
.popTableForm {
    .table tr:nth-child(even) {
      background: #fff;
    }
    .el-table__header .ruleTip .cell::before {
      display: block;
      content: '*';
      position: absolute;
      left: 4px;
      color: #FE4949;
    }
}
.page-main {
    .page-content{
      border-radius: 0px;
      -webkit-border-radius: 0px;
  }
  }
</style>
