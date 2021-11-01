<!--
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-01-12 14:03:53
 * @LastEditors: admin
 * @LastEditTime: 2021-01-27 10:31:28
-->
<template>
  <div class="colorschedule-detail">
    <!-- 状态栏信息 -->
    <div class="colorschedule-top">
      <div class="descripte">
        操作人：{{ formDatas.updatedBy }} &nbsp; 操作时间：{{
          formDatas.updatedTime
        }}&nbsp; 状态：<span style="color: #ff9214;">进行中</span>
      </div>
    </div>
    <!-- 基本信息 -->
    <div class="colorschedule-content">
      <div class="colorschedule-content-bsistitle">基本信息</div>
      <div class="colorschedule-content-info bsisStyle">
        <cs-custom-form
          ref="showData"
          :data-source="showInfoData"
          :options="formOtions"
          :form-datas="formDatas"
        />
      </div>
    </div>
    <!-- 选择工厂 -->
    <div class="colorschedule-content">
      <div v-if="type === 'factory'" class="colorschedule-content-bsistitle">
        选择工厂
      </div>
      <div v-if="type !== 'factory' && formDatas.dyeFactoryName" class="colorschedule-content-showinfo bsisStyle">
        <cs-custom-form
          ref="showSelectData"
          :data-source="selectInfoData"
          :options="formOtions"
          :form-datas="formDatas"
        />
      </div>
      <div v-if="type === 'factory'" class="colorschedule-select-info">
        <cs-custom-form
          ref="showEditSelectData"
          :data-source="editSelectInfoData"
          :options="formOtions"
          :form-datas="formDatas"
        />
      </div>
    </div>
    <!-- 生产进度 -->
    <div v-if="processInfoData[0].dataSource && processInfoData[0].dataSource.length !== 0" class="colorschedule-content">
      <div class="colorschedule-content-title">生产进度</div>
      <div class="colorschedule-process-info">
        <cs-custom-form ref="showProcessData" :data-source="processInfoData" />
      </div>
    </div>
    <!-- 订单分录弹框开始 -->
    <el-dialog
      title="更新订单分录进度"
      :visible.sync="DialogVisible"
      width="755px"
      center
    >
      <div class="colorschedule-code">色板单号：LD201010001</div>
      <cs-custom-table
        ref="inlineTable"
        :columns="orderColumns"
        :header-cell-style="headerCellStyle"
        :selection="selection"
        :data-source="dataSource"
        edit-type="inline"
        @selection-change="selectionChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="DialogSave">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 订单分录弹框结束 -->

    <!-- 收样记录 -->
    <div v-if="demoInfoData[0].dataSource && demoInfoData[0].dataSource.length !== 0" class="colorschedule-content">
      <div class="colorschedule-content-title">
        <div>收样记录</div>
        <div v-if="demoInfoData[0].dataSource.length === backupsDemo.length && type === 'demorecord' && formDatas.isChecked"><el-button type="primary" size="mini" @click="recordAdd">增加</el-button></div>
      </div>
      <div class="colorschedule-process-info">
        <cs-custom-form ref="showDemoData" :data-source="demoInfoData" />
      </div>
    </div>
    <!-- 客户审核 -->
    <div v-if="formDatas.checks && formDatas.checks.length !== 0" class="colorschedule-content">
      <div class="colorschedule-content-title">客户审核</div>
      <div class="colorschedule-process-info">
        <cs-custom-form ref="showExameData" :data-source="guestInfoData" />
      </div>
    </div>

    <div v-if="type !== 'show'" class="colorschedule-foot">
      <div class="btn-groups">
        <el-button type="primary" @click="colorSave">保存</el-button>
        <el-button @click="colorCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  colorDetail,
  colorFactorySave,
  colorProduceDown,
  colorProcessSave,
  colorOrderDetail,
  colorOrderSave,
  colorDemoSave,
  colorExameSave
} from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  mixins: [logMethods],
  data() {
    // 基本信息
    const showInfoData = [
      {
        prop: 'fabricColorNo',
        itemType: 'input',
        itemStyle: { width: '27.33%', margin: '0px 3%' },
        label: '智布色号:',
        readonly: true
      },
      {
        prop: 'colorModelApplyId',
        itemType: 'input',
        itemStyle: { width: '27.33%', margin: '0px 3%' },
        label: '色板单号:',
        readonly: true
      },

      {
        prop: 'customerServiceName',
        itemType: 'input',
        itemStyle: { width: '27.33%', margin: '0px 3%' },
        label: '客服:',
        readonly: true
      },
      {
        prop: 'customerColorName',
        itemType: 'input',
        itemStyle: { width: '27.33%', margin: '0px 3%' },
        label: '客户颜色:',
        readonly: true
      },
      {
        prop: 'delivery',
        itemType: 'input',
        itemStyle: { width: '27.33%', margin: '0px 3%' },
        label: '交期:',
        readonly: true
      },
      {
        prop: 'customerName',
        itemType: 'input',
        itemStyle: { width: '27.33%', margin: '0px 3%' },
        label: '客户:',
        readonly: true
      },

      {
        prop: 'clothName',
        itemType: 'input',
        itemStyle: { width: '27.33%', margin: '0px 3%' },
        label: '布类:',
        readonly: true
      },
      {
        prop: 'yarn',
        itemType: 'itemview',
        itemStyle: { width: '27.33%', margin: '0px 3%' },
        label: '纱支:',
        renderContent: (value) => {
          return `<div title='${this.yarnStr}' class='yarn-style'>${value}</div>`
        }
      },
      {
        prop: 'composition',
        itemType: 'input',
        itemStyle: { width: '27.33%', margin: '0px 3%' },
        label: '成份:',
        readonly: true
      },
      {
        prop: 'precautions',
        itemType: 'input',
        itemStyle: { width: '94%', margin: '0px 3%' },
        label: '注意事项:',
        readonly: true
      }
    ]
    // 选择工厂展示
    const selectInfoData = [
      {
        prop: 'dyeFactoryName',
        itemType: 'input',
        itemStyle: { margin: '12px 3%' },
        label: '染厂:',
        readonly: true
      }
    ]
    const facListData = [
      {
        label: '隆丰',
        value: '1'
      },
      {
        label: '港泰',
        value: '2'
      },
      {
        label: '信杭发',
        value: '3'
      },
      {
        label: '澳棉',
        value: '4'
      },
      {
        label: '浩之盛',
        value: '5'
      },
      {
        label: '晋泰',
        value: '6'
      },
      {
        label: '金纺',
        value: '7'
      },
      {
        label: '昊金',
        value: '8'
      },
      {
        label: '宝利发',
        value: '9'
      },
      {
        label: '港骏',
        value: '10'
      },
      {
        label: '沣泰',
        value: '11'
      },
      {
        label: '骏达',
        value: '12'
      },
      {
        label: '溢明',
        value: '13'
      }
    ]
    // 选择工厂编辑
    const editSelectInfoData = [
      {
        prop: 'dyeFactoryId',
        itemType: 'select',
        itemStyle: { margin: '10px 3%' },
        label: '染厂:',
        clearable: true,
        filterable: true,
        dataSource: facListData,
        multiple: true
      }
    ]
    // 当前时间之后的时间不能选择
    const pickerOptionsAfter = {
      disabledDate(time) {
        return time.getTime() > Date.now()
      }
    }
    // 当前时间之前的时间不能选择
    const pickerOptionsBefore = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }
    // 生产进度表格信息
    const columns = [
      {
        prop: 'index',
        label: '#',
        minWidth: '60',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'scheduleName',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        label: '进度',
        minWidth: '120',
        formDatas: {},
        valueKey: 'id',
        labelWidth: '0',
        editOptions: {
          itemType: 'select',
          filterable: true,
          labelWidth: '0',
          dataSource: [],
          visibleChange: (flag, scope) => {
            if (flag) {
              this.getproduceDown({})
            }
          }
        }
      },
      {
        prop: 'scheduleDate',
        label: '进度时间',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        minWidth: '120',
        formDatas: {},
        valueKey: 'id',
        labelWidth: '0',
        editOptions: {
          itemType: 'date',
          format: 'yyyy-MM-dd',
          placeholder: '请选择日期时间',
          valueFormat: 'yyyy-MM-dd',
          labelWidth: '0',
          pickerOptions: pickerOptionsAfter
        }
      },
      {
        prop: 'delivery',
        label: '复期',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        minWidth: '120',
        formDatas: {},
        valueKey: 'id',
        labelWidth: '0',
        editOptions: {
          itemType: 'date',
          format: 'yyyy-MM-dd',
          placeholder: '请选择日期时间',
          valueFormat: 'yyyy-MM-dd',
          labelWidth: '0',
          pickerOptions: pickerOptionsBefore
        }
      },
      {
        prop: 'updatedBy',
        label: '操作人',
        minWidth: '120'
      },
      {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '120'
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: '120',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 50
        }
      }
    ]
    // 生产进度
    const processInfoData = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: columns,
        operates: null
      }
    ]
    // 收样记录表格信息
    const democolumns = [
      {
        prop: 'index',
        label: '#',
        minWidth: '60',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'factoryColorNo',
        label: '工厂色号',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        minWidth: '120',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 20
        }
      },
      {
        prop: 'num',
        label: '打色次数',
        minWidth: '120',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'receiveSampleVersion',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        label: '收样版本',
        minWidth: '120',
        formDatas: {},
        valueKey: 'id',
        labelWidth: '0',
        editOptions: {
          itemType: 'select',
          filterable: true,
          labelWidth: '0',
          multiple: true,
          dataSource: [],
          visibleChange: (flag, scope) => {
            if (flag) {
              this.getBigLetter()
            }
          }
        }
      },
      {
        prop: 'isSend',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        label: '是否送样',
        minWidth: '120',
        formDatas: {},
        valueKey: 'id',
        labelWidth: '0',
        editOptions: {
          itemType: 'select',
          filterable: true,
          labelWidth: '0',
          dataSource: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]

        }
      },
      {
        prop: 'comment',
        label: '对色评语',
        minWidth: '120',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 50
        }
      },
      {
        prop: 'updatedBy',
        label: '操作人',
        minWidth: '120'
      },
      {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '120'
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: '120',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 50
        }
      }
    ]
    // 收样记录操作
    const popOperates = {
      label: '操作',
      width: '120',
      dataSource: [
        {
          label: '删除',
          isShow: (scope) => {
            // console.log(this.backupsDemo.length);
            return scope.$index === this.backupsDemo.length && this.backupsDemo.length !== 0
          },
          handle: (params) => {
            if (this.demoInfoData[0].dataSource) {
              this.demoInfoData[0].dataSource.splice(params.$index, 1)
            }
          }
        }
      ]
    }
    // 收样记录
    const demoInfoData = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: democolumns,
        operates: popOperates
      }
    ]
    // 客户审核表格信息
    const guestColumns = [
      {
        prop: 'index',
        label: '#',
        minWidth: '60',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'checked',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        label: '客批结果',
        minWidth: '120',
        formDatas: {},
        valueKey: 'id',
        labelWidth: '0',
        editOptions: {
          itemType: 'select',
          filterable: true,
          labelWidth: '0',
          dataSource: [
            {
              label: 'Approved',
              value: 'Approved'
            },
            {
              label: 'Rejected',
              value: 'Rejected'
            },
            {
              label: 'Dropped',
              value: 'Dropped'
            }
          ],
          change: (value, all, form, formDatas, scope) => {
            console.log(form)
            console.log(scope)
            this.guestInfoData[0].dataSource && this.guestInfoData[0].dataSource.forEach((item, index) => {
              // this.$set(this.guestInfoData[0], 'dataSource', form.tableForm)
              if (scope.$index === index) {
                const checkArr = item.sendSampleVesion.split('、').map((item, index) => {
                  return {
                    label: item,
                    value: item
                  }
                })
                if (value === 'Approved') {
                  // this.$set(this.guestInfoData[0], 'dataSource', form.tableForm)
                  item.edit = true
                  const options = {
                    itemType: 'select',
                    filterable: true,
                    labelWidth: '0',
                    dataSource: checkArr
                  }
                  this.$nextTick(() => {
                    this.$set(item, 'checkVersionEditOptions', options)
                  })
                } else {
                  this.$set(item, 'checkVersionEditOptions', null)
                }
                form.tableForm.forEach((items, indexs) => {
                  if (items.checked === 'Approved') {
                    this.guestInfoData[0].dataSource[indexs].checkVersion = items.checkVersion
                  } else {
                    this.guestInfoData[0].dataSource[indexs].checkVersion = ''
                  }
                })
                this.guestInfoData[0].dataSource[scope.$index].checked = value
              }
            })
          }
        }
      },
      {
        prop: 'checkVersion',
        label: '客批版本',
        minWidth: '120',
        formDatas: {},
        valueKey: 'id',
        labelWidth: '0',
        editOptions: {}
      },
      {
        prop: 'checkRemark',
        label: '客批备注',
        minWidth: '120',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 50
        }
      },
      {
        prop: 'checkTime',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        label: '客批日期',
        minWidth: '120',
        formDatas: {},
        valueKey: 'id',
        labelWidth: '0',
        editOptions: {
          itemType: 'date',
          format: 'yyyy-MM-dd',
          placeholder: '请选择日期时间',
          valueFormat: 'yyyy-MM-dd',
          labelWidth: '0',
          pickerOptions: pickerOptionsBefore
        }
      },
      {
        prop: 'dyeFactoryName',
        label: '染厂',
        minWidth: '120'
      },
      {
        prop: 'factoryColor',
        label: '工厂色号',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        minWidth: '120'
      },
      {
        prop: 'sendSampleVesion',
        label: '送样版本',
        minWidth: '120'
      },
      {
        prop: 'updatedBy',
        label: '操作人',
        minWidth: '120'
      },
      {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '120'
      }
    ]
    const guestInfoData = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: guestColumns,
        operates: null
      }
    ]
    const orderColumns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'customerColorName',
        label: '客户颜色',
        width: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricColorNo',
        label: '智布色号',
        width: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'odDyeName',
        label: '单双染',
        width: '180',
        showOverflowTooltip: true
      }
    ]
    const selection = {
      selection: true,
      selectionLabel: '全部'
    }
    const headerCellStyle = {
      'background': '#f5f7fa'
    }
    return {
      type: '',
      DialogVisible: false, // 控制弹框显示隐藏
      orderColumns, // 弹框表格信息
      selection, // 弹框多选
      headerCellStyle,
      dataSource: [],
      showInfoData,
      formOtions: {
        inline: true
      },
      formDatas: {},
      selectInfoData,
      editSelectInfoData,
      processInfoData,
      demoInfoData,
      guestInfoData,
      facListData, // 所有染厂数据
      factoryFormDatas: {},
      yarnStr: '', // 纱支
      processData: [], // 生产进度进度下拉数据
      colorModelScheduleIds: [], // 批量更新进度选中id
      backupsDemo: [], // 收样记录数据备份
      bigLetterarr: [], // 26个字母数组
      readyData: {} // 备份详情数据
      // checkArr: []
    }
  },
  created() {
    this.type = this.$route.params.type
    this.generateBig()
    this.getBigLetter()

    if (this.$route.params.id) {
      this.getDetail({ id: this.$route.params.id })
    }
  },
  mounted() {

  },
  methods: {
    // 获取详情数据
    async getDetail(data = {}) {
      const res = await colorDetail({ ...data })
      // console.log(res.data);
      this.formDatas = res.data || {}
      this.readyData = JSON.parse(JSON.stringify(res.data)) || {}
      console.log(this.readyData)
      this.formDatas.dyeFactoryId = this.formDatas.dyeFactoryId ? this.formDatas.dyeFactoryId.split(',') : []
      this.yarnStr = this.formDatas.yarn && this.formDatas.yarn.replace(/,/g, '\n')
      this.processInfoData[0].dataSource = res.data.date || []
      this.demoInfoData[0].dataSource = res.data.receiveRecords || []
      this.backupsDemo = res.data.receiveRecords ? [...res.data.receiveRecords] : [] // 收样记录备份
      this.guestInfoData[0].dataSource = res.data.checks || []
      this.processInfoData[0].dataSource && this.processInfoData[0].dataSource.forEach((items, indexs) => { // 处理生产进度进度数据
        items.scheduleName = items.schedule.label
      })
      this.demoInfoData[0].dataSource && this.demoInfoData[0].dataSource.forEach((item, index) => {
        item.isSend = item.isSend === 0 ? '否' : item.isSend === 1 ? '是' : ''
      })
      if (this.type !== 'show' && this.type === 'progress') { // 生产进度
        const day1 = new Date()
        const nowDay = day1.getFullYear() + '-' + (day1.getMonth() + 1) + '-' + day1.getDate()
        this.processInfoData[0].dataSource && this.processInfoData[0].dataSource.forEach((items, indexs) => {
          items.scheduleNameEdit = false
          items.scheduleDateEdit = false
          items.deliveryEdit = false
          items.edit = true
        })
        this.processInfoData[0].dataSource.push({
          delivery: this.processInfoData[0].dataSource.length ? this.processInfoData[0].dataSource[this.processInfoData[0].dataSource.length - 1].delivery : '',
          scheduleDate: nowDay,
          edit: true
        })
      } else if (this.type !== 'show' && this.type === 'demorecord') { // 收样记录
        this.demoInfoData[0].dataSource && this.demoInfoData[0].dataSource.forEach((item, index) => {
          if (index < this.demoInfoData[0].dataSource.length) {
            // 客户审核不为空时不能编辑，等后端加客户审核数据
            if (item.isCheck === 0 && item.isSend === 1 || item.isSend === 0) {
              item.factoryColorNoEdit = false
              item.receiveSampleVersionEdit = false
              item.edit = true
            }
          }
        })
        if (this.formDatas.isChecked) {
          this.demoInfoData[0].dataSource.push({
            factoryColorNo: this.demoInfoData[0].dataSource.length ? this.demoInfoData[0].dataSource[this.demoInfoData[0].dataSource.length - 1].factoryColorNo : '',
            edit: true
          })
        }
      } else if (this.type !== 'show' && this.type === 'examine') { // 客户审核
        this.guestInfoData[0].dataSource && this.guestInfoData[0].dataSource.forEach((item, index) => {
          item.edit = true
          if (item.checked === 'Approved') {
            const checkArr = item.sendSampleVesion.split('、').map((item, index) => {
              return {
                label: item,
                value: item
              }
            })
            const options = {
              itemType: 'select',
              filterable: true,
              labelWidth: '0',
              dataSource: checkArr
            }
            this.$nextTick(() => {
              this.$set(item, 'checkVersionEditOptions', options)
            })
            // console.log(item)
            // item.checkVersionEditOptions = options
          } else {
            this.$set(item, 'checkVersionEditOptions', null)
            // item.checkVersionEditOptions = {
            //   itemType: 'select',
            //   filterable: true,
            //   labelWidth: '0',
            //   dataSource: []

            // }
          }
        })
        // this.guestInfoData[0].dataSource.push({
        //   edit: true
        // })
      }
      // console.log(this.processInfoData[0].dataSource)
      // 批量更新详情
      if (this.formDatas.id && this.formDatas.dyeFactoryId.length !== 0) {
        this.getDialogData({ colorModelApplyId: this.formDatas.colorModelApplyId, dyeFactoryId: +this.formDatas.dyeFactoryId[0] })
      }
    },
    // 更新进度批量更新详情
    async getDialogData(data = {}) {
      const res = await colorOrderDetail({ ...data })
      this.dataSource = res.data || []
      this.dataSource && this.dataSource.forEach((item, index) => {
        item.index = index + 1
      })
    },
    // 订单分录默认全部选中
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$nextTick(() => {
            this.$refs.inlineTable.table.toggleRowSelection(row, true)
          })
        })
      }
    },
    // 订单分录选中
    selectionChange(val) {
      if (val) {
        val.map((item, index) => {
          this.colorModelScheduleIds.push(item.id)
        })
        return this.colorModelScheduleIds
      }
    },
    // 生产进度进度下拉
    async getproduceDown(data = {}) {
      const res = await colorProduceDown({ ...data })
      if (res.code !== 200) {
        return false
      }
      this.processData = res.data || []
      this.processData.map((item, index) => {
        item.label = item.name
        item.value = item.id
      })
      this.$set(
        this.processInfoData[0].columns[1].editOptions,
        'dataSource',
        this.processData
      )
    },
    // 选择工厂
    async factorySave() {
      const obj = {}
      obj.colorModelScheduleDetailId = +this.$route.params.id
      obj.colorModelScheduleId = +this.formDatas.colorModelScheduleId
      // console.log(this.formDatas.colorModelApplyId)
      const sobj =
          this.$refs.showEditSelectData.dynamicValidateFormRuleForm || {}
      const facListIds = sobj.dyeFactoryId
      // console.log(facListIds)
      const facList = []
      facListIds && facListIds.forEach((aitem, aindex) => {
        this.facListData.forEach((bitem, bindex) => {
          if (aitem === bitem.value) {
            facList.push({
              factoryId: bitem.value,
              factoryName: bitem.label

            })
          }
        })
      })
      obj.factoryList = facList
      const res = await colorFactorySave({ ...obj })
      if (res.code === 200) {
        this.fetchLog(
          this.getLogMessages('UPDATE', '/aps/colorModel/schedule/addDyeFactory', 'aps'),
          { id: this.$route.params.id },
          JSON.stringify({
            beforeText: `在'计划管理-生产进度-色板生产进度'修改一条记录`,
            beforeCode: { id: this.$route.params.id }
          })
        )

        this.$router.go(-1)
      } else {
        this.$message.error(res.message)
      }
    },
    // 更新进度
    async progressSave() {
      const objArray =
        this.$refs.showProcessData.dynamicValidateFormRuleForm.tableForm ||
        []
      const sobj = objArray[objArray.length - 1]
      if (this.processData) {
        this.processData.forEach((item, index) => {
          if (item.value === sobj.scheduleName) {
            sobj.schedule = item
          }
        })
      }
      sobj.colorModelScheduleDetailId = this.formDatas.id
      const res = await colorProcessSave({ ...sobj })
      if (res.code === 200) {
        this.$router.go(-1)
        this.fetchLog(
          this.getLogMessages('UPDATE', '/aps/colorModel/schedule/updateSchedule', 'aps'),
          { id: this.$route.params.id },
          JSON.stringify({
            beforeText: `在'计划管理-生产进度-色板生产进度'修改一条记录`,
            beforeCode: { id: this.$route.params.id }
          })
        )
      } else {
        this.$message.error(res.message)
      }
    },

    // 更新进度弹框保存
    async DialogSave() {
      // console.log(this.colorModelScheduleIds)
      const objArray =
        this.$refs.showProcessData.dynamicValidateFormRuleForm.tableForm ||
        []
      const sobj = objArray[objArray.length - 1]
      if (this.processData) {
        this.processData.forEach((item, index) => {
          if (item.value === sobj.scheduleName) {
            sobj.scheduleName = item.label
            sobj.scheduleId = item.value
          }
        })
      }
      sobj.colorModelScheduleIds = this.colorModelScheduleIds
      const res = await colorOrderSave({ ...sobj })
      if (res.code === 200) {
        this.$router.go(-1)
        this.fetchLog(
          this.getLogMessages('UPDATE', '/aps/colorModel/schedule/batchUpdateSchedule', 'aps'),
          { id: this.$route.params.id },
          JSON.stringify({
            beforeText: `在'计划管理-生产进度-色板生产进度'修改一条记录`,
            beforeCode: { id: this.$route.params.id }
          })
        )
      } else {
        this.$message.error(res.message)
      }
    },
    // 收样记录增加
    recordAdd() {
      this.demoInfoData[0].dataSource.push({
        factoryColorNo: this.demoInfoData[0].dataSource.length ? this.demoInfoData[0].dataSource[this.demoInfoData[0].dataSource.length - 1].factoryColorNo : '',
        edit: true
      })
    },
    // 收样记录保存
    async demoSave() {
      const objArray =
            this.$refs.showDemoData.dynamicValidateFormRuleForm.tableForm ||
            []
      if (!objArray[objArray.length - 1].factoryColorNo) {
        this.$message.error('工厂色号不能为空！')
      } else if (!objArray[objArray.length - 1].receiveSampleVersion) {
        this.$message.error('收样版本不能为空！')
      } else if (objArray[objArray.length - 1].isSend !== 0 && objArray[objArray.length - 1].isSend !== 1) {
        this.$message.error('是否送样不能为空！')
      } else {
        objArray && objArray.forEach((item, index) => {
          item.isSend = item.isSend === '否' ? 0 : item.isSend === '是' ? 1 : item.isSend
          if (Array.isArray(item.receiveSampleVersion)) {
            item.colorModelScheduleDetailId = +this.$route.params.id
            item.receiveSampleVersion = item.receiveSampleVersion.join('、')
          }
        })
        const res = await colorDemoSave(objArray)
        if (res.code === 200) {
          this.$router.go(-1)
          this.fetchLog(
            this.getLogMessages('UPDATE', '/aps/colorModel/schedule/receiveRecords', 'aps'),
            { id: this.$route.params.id },
            JSON.stringify({
              beforeText: `在'计划管理-生产进度-色板生产进度'修改一条记录`,
              beforeCode: { id: this.$route.params.id }
            })
          )
        } else {
          this.$message.error(res.message)
        }
      }
    },
    // 生成26个字母数组
    generateBig() {
      const str = []
      for (var i = 65; i < 91; i++) {
        str.push(String.fromCharCode(i))
      }
      this.bigLetterarr = str
    },
    // 26个字母下拉
    getBigLetter() {
      this.bigLetterData = this.bigLetterarr.map(item => {
        return {
          label: item,
          value: item
        }
      })
      this.$set(this.demoInfoData[0].columns[3].editOptions, 'dataSource', this.bigLetterData)
      // this.$set(this.guestInfoData[0].columns[2].editOptions, 'dataSource', this.bigLetterData)
    },

    // 客户审核保存
    async exameSave() {
      const objArray =
            this.$refs.showExameData.dynamicValidateFormRuleForm.tableForm ||
            []
            // console.log(objArray);
            // debugger
      if (!objArray[objArray.length - 1].checked) {
        this.$message.error('客批结果不能为空！')
      } else if (!objArray[objArray.length - 1].checkTime) {
        this.$message.error('客批日期不能为空！')
      } else if (!objArray[objArray.length - 1].factoryColor) {
        this.$message.error('工厂色号不能为空！')
      } else {
        const res = await colorExameSave(objArray)
        if (res.code === 200) {
          this.$router.go(-1)
          this.fetchLog(
            this.getLogMessages('UPDATE', '/aps/colorModel/schedule/customerCheck', 'aps'),
            { id: this.$route.params.id },
            JSON.stringify({
              beforeText: `在'计划管理-生产进度-色板生产进度'修改一条记录`,
              beforeCode: { id: this.$route.params.id }
            })
          )
        } else {
          this.$message.error(res.message)
        }
      }
    },
    // 保存
    colorSave() {
      if (this.type === 'factory') {
        this.factorySave()
      } else if (this.type === 'progress') {
        if (this.formDatas.dyeFactoryId.length === 0) {
          // 没有染厂时提示
          this.$message.error('请先选择染厂！')
        } else if (this.dataSource.length === 1) {
          // 更新进度只有一条时不弹出提示直接保存
          this.progressSave()
        } else {
          this.$confirm('是否批量更新订单分录进度？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              this.DialogVisible = true
              this.toggleSelection(this.dataSource)
            // this.$router.go(-1)
            })
            .catch(() => {
              this.progressSave()
            // this.$router.go(-1)
            })
        }
      } else if (this.type === 'demorecord') {
        this.demoSave()
      } else if (this.type === 'examine') {
        this.exameSave()
      }
    },
    // 取消
    colorCancel() {
      this.$confirm('确认取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customClass: 'customClass'
      })
        .then(() => {
          this.$router.go(-1)
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scope>
.colorschedule-detail{
  margin-bottom: 60px;
  .yarn-style{
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 20px;
    margin-top: 8px;
    margin-left: 15px;
    width: 100%;
    white-space: nowrap;
  }
  .bsisStyle {
    /deep/ .el-form-item__label-wrap .el-form-item__label {
      color: #888e9e;
      white-space: nowrap;
    }
  }
 .colorschedule-top {
    padding-top: 19px;
    .descripte {
      display: flex;
      justify-content: flex-end;
      line-height: 26px;
      height: 26px;
      padding: 0 30px;
      font-size: 12px;
      color: #777777;
    }
  }
  /deep/ .el-dialog__header{
    padding: 15px 25px;
    height: 64px;
    line-height: 32px;
    text-align: left !important;
  }
  /deep/ .el-dialog--center .el-dialog__body{
    padding: 22px 25px 30px;

  }
  /deep/ .el-table-column--selection .cell{
    padding-left: 10px;
  }
  .colorschedule-code{
    margin-bottom: 15px;
    font-size: 16px;
    color: #151222;
  }
  .colorschedule-content{
    margin: 15px 20px;
    color: #606266;
    background-color: #fff;
    .textStyle{
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .colorschedule-content-bsistitle{
      display: flex;
      justify-content: space-between;
      // line-height: 60px;
      padding: 0px 20px;
      padding-top: 20px;
      height: 59px;
      border-bottom: 1px solid #efefef;
      font-size: 16px;
      color: #3c4043;
    }
    .colorschedule-content-title {
      display: flex;
      justify-content: space-between;
      // line-height: 60px;
      // padding: 0px 20px;
      padding-top: 20px;
      height: 59px;
      margin: 0 20px;
      border-bottom: 1px solid #efefef;
      font-size: 16px;
      color: #3c4043;
      /deep/ .el-button{
        height: 32px;
      }
    }
    .colorschedule-content-info {
      padding: 20px;
      .el-input__inner,
      .el-textarea__inner {
        border: 0;
      }
    }
    .colorschedule-content-showinfo {
      padding-left: 44px;
      .el-input__inner,
      .el-textarea__inner {
        border: 0;
      }
    }
    .colorschedule-select-info {
      padding: 10px 20px;
    }
    .colorschedule-process-info {
      padding: 0 20px 20px;
      /deep/ .el-table .cell{
        font-size: 14px;
      }
    }

    .lableStyle::before {
      content: "*";
      margin-right: 4px;
      color: red;
    }
    .noLableStyle::before{
      display: none;
    }
  }

  .colorschedule-foot {
      bottom: 0;
      z-index: 2000;
      padding: 10px;
      width: 100%;
      background: #fff;
      border-top: 1px solid #ecf0f3;
      position: fixed;
      .btn-groups {
        position: relative;
        left: 40%;
      }
  }

  /deep/.table tr:nth-child(even) {
    background-color: #ffffff;
  }
  /deep/ .custom-form .el-form.el-form--inline .el-form-item__content {
        width: 60%;
  }

}
</style>
