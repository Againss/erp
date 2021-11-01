<!--
 * @Descripttion: 印花SO生产进度详情
 * @Author: shujing
 * @Date: 2020-12-14 15:10:35
 * @LastEditors: admin
 * @LastEditTime: 2021-01-27 14:32:24
-->
<template>
  <div class="printschedule-detail">
    <div class="printschedule-top">
      <div class="product-item-codeinfo">
        <div class="code-item">
          印花SO申请单号：{{ formDatas.printSoApplyId }}
        </div>
      </div>
      <div v-if="type === 'show'" class="descripte">
        操作人：{{ formDatas.updatedBy }} &nbsp; 操作时间：{{
          formDatas.updatedTime
        }}&nbsp; 状态：<span style="color: #ff9214;">进行中</span>
      </div>
    </div>

    <div class="printschedule-content">
      <div class="printschedule-content-bsistitle">基本信息</div>
      <div class="printschedule-content-info bsisStyle">
        <cs-custom-form
          ref="showData"
          :data-source="showInfoData"
          :options="formOtions"
          :form-datas="formDatas"
        />
      </div>
    </div>

    <div class="printschedule-content">
      <div v-if="type === 'factory'" class="printschedule-content-title">
        选择工厂
      </div>
      <div
        v-if="type !== 'factory' && formDatas.printFactoryName"
        class="printschedule-content-showinfo bsisStyle"
      >
        <cs-custom-form
          ref="showSelectData"
          :data-source="selectInfoData"
          :options="formOtions"
          :form-datas="factoryFormDatas"
        />
      </div>
      <div v-if="type === 'factory'" class="printschedule-select-info">
        <cs-custom-form
          ref="showEditSelectData"
          :data-source="editSelectInfoData"
          :options="formOtions"
          :form-datas="factoryFormDatas"
        />
      </div>
    </div>

    <div
      v-if="formDatas.date && formDatas.date.length !== 0"
      class="printschedule-content"
    >
      <div class="printschedule-content-title">生产进度</div>
      <div class="printschedule-process-info">
        <cs-custom-form ref="showProcessData" :data-source="processInfoData" />
      </div>
    </div>

    <div
      v-if="formDatas.checks && formDatas.checks.length !== 0"
      class="printschedule-content"
    >
      <div class="printschedule-content-title">客户审核</div>
      <div class="printschedule-process-info">
        <cs-custom-form ref="showGuestData" :data-source="guestInfoData" />
      </div>
    </div>

    <div v-if="type !== 'show'" class="printschedule-foot">
      <!-- <div class="btn-groups">
        <el-button type="primary">编辑</el-button>

      </div> -->
      <div class="btn-groups">
        <el-button type="primary" @click="soPrintSave">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  soPrintDetail,
  soPrintTypeDown,
  soPrintProcessSave,
  soPrintExamineSave,
  soPrintFactoryDetail,
  soPrintFactorySave
} from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
// import detailMoreShow from './components/detailMoreShow'
export default {
  mixins: [logMethods],
  data() {
    // 基本信息
    const showInfoData = [
      {
        prop: 'fabricFlowerNo',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '智布花号:',
        readonly: true
      },
      {
        prop: 'customerServiceName',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '客服:',
        readonly: true
      },
      {
        prop: 'orgName',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '销售团队:',
        readonly: true
      },
      {
        prop: 'delivery',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '交期:',
        readonly: true
      },
      {
        prop: 'customerName',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '客户:',
        className: 'textStyle',
        title: true,
        readonly: true
      },
      {
        prop: 'brandName',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '品牌商:',
        readonly: true
      },
      {
        prop: 'clothName',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '布类:',
        className: 'textStyle',
        title: true,
        readonly: true
      },
      {
        prop: 'finishedProductWeightName',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '克重:',
        readonly: true
      },
      // {
      //   prop: 'yarn',
      //   itemType: 'input',
      //   itemStyle: { width: '21%', margin: '0px 2%' },
      //   label: '纱支:',
      //   readonly: true
      // },
      {
        prop: 'yarn',
        itemType: 'itemview',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '纱支:',
        renderContent: (value) => {
          // return `<div style='white-space:pre;text-overflow: ellipsis;overflow: hidden;line-height: 20px; margin-top: 8px;margin-left: 16px;'>${value}</div>`
          return `<div title='${this.yarnStr}' class='print-craft-style'>${value}</div>`
        }
      },
      {
        prop: 'composition',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '成份:',
        readonly: true
      },
      {
        prop: 'clothStyle',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '成衣款式:',
        readonly: true
      },
      {
        prop: 'printCraft',
        itemType: 'itemview',
        itemStyle: { width: '21%', margin: '0 2%' },
        label: '印花工艺:',
        renderContent: (value) => {
          return `<div title='${this.printStr}' class='print-craft-style'>${value}</div>`
        }
      },

      // {
      //   itemStyle: { width: '21%', margin: '0 2%' },
      //   label: '印花工艺:',
      //   components: {
      //     detailMoreShow
      //   },
      //   componentsOptions: {
      //     type: 'printCraft'
      //   }
      // },
      {
        prop: 'printWay',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '印花方式:',
        readonly: true
      },
      {
        prop: 'printColorName',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '印花颜色名:',
        className: 'textStyle',
        title: true,
        readonly: true
      },
      {
        prop: 'printBaseColor',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '印花底色:',
        className: 'textStyle',
        title: true,
        readonly: true
      },
      {
        prop: 'printNestedColor',
        itemType: 'input',
        itemStyle: { width: '21%', margin: '0px 2%' },
        label: '印花套色:',
        readonly: true
      },
      {
        prop: 'printColorDesign',
        itemType: 'itemview',
        itemStyle: { width: '94%', margin: '0px 2%' },
        label: '印花图案:',
        renderContent: (value) => {
          return `<img style='margin-top: 12px;margin-left: 16px;width: 200px;' src='${value}'>`
        }
        // readonly: true
      },
      {
        prop: 'precautions',
        itemType: 'input',
        itemStyle: { width: '94%', margin: '0px 2%' },
        label: '注意事项:',
        readonly: true
      }
    ]
    // 选择工厂展示
    const selectInfoData = [
      {
        prop: 'printFactoryName',
        itemType: 'input',
        itemStyle: { margin: '12px 2%' },
        label: '印花厂:',
        readonly: true
      }
    ]
    const facListData = [
      {
        label: '东臻',
        value: '1'
      },
      {
        label: '骏联',
        value: '2'
      },
      {
        label: '源生',
        value: '3'
      },
      {
        label: '宏华',
        value: '4'
      },
      {
        label: '浩之盛',
        value: '5'
      },
      {
        label: '金纺',
        value: '6'
      },
      {
        label: '和顺璟',
        value: '7'
      },
      {
        label: '超时',
        value: '8'
      },
      {
        label: '如意',
        value: '9'
      }
    ]
    // 选择工厂编辑
    const editSelectInfoData = [
      {
        prop: 'printFactoryId',
        itemType: 'select',
        itemStyle: { margin: '10px 2%' },
        label: '印花厂:',
        clearable: true,
        filterable: true,
        dataSource: facListData,
        multiple: true
      }
    ]

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
        prop: 'type',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        label: '类型',
        minWidth: '120',
        formDatas: {},
        valueKey: 'id',
        labelWidth: '0',
        editOptions: {
          itemType: 'select',
          filterable: true,
          labelWidth: '0',
          rules: [
            { required: true, message: '类型不能为空', trigger: ['change'] }
          ],
          dataSource: [], // 联动需要清空值
          change: (value, form, formDatas, setFormDatas, scope) => {
            const data = [...formDatas.tableForm]
            data[scope.$index].produceName = ''
            this.$set(this.processInfoData[0], 'dataSource', data)
          },
          visibleChange: (flag) => {
            if (flag) {
              this.getProgressDown({})
            }
          }
        }
      },
      {
        prop: 'produceName',
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
            const processObj =
              this.$refs.showProcessData.dynamicValidateFormRuleForm || []
            var typename = null
            // console.log(scope)
            // console.log(processObj);
            if (this.typeData) {
              this.typeData.forEach((item, index) => {
                if (item.value === processObj.tableForm[scope.$index].type) {
                  typename = item.label
                }
              })
            }
            if (flag && typename) {
              this.getproduceDown({ type: typename })
            }
          }
        }
      },
      {
        prop: 'produceDate',
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
          labelWidth: '0'
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
          ]
        }
      },
      {
        prop: 'checkRemark',
        label: '客批备注',
        minWidth: '120',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 500
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
          labelWidth: '0'
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
    return {
      showInfoData,
      selectInfoData,
      editSelectInfoData,
      formOtions: {
        inline: true
      },
      formDatas: {},
      processInfoData,
      guestInfoData,
      type: '',
      typeData: [],
      processData: [],
      facListData,
      originFactorys: [],
      printStr: '',
      yarnStr: '',
      // originFactorys: [
      //   {
      //     facotryId: 1,
      //     facotryName: '东臻'
      //   },
      //   {
      //     facotryId: 2,
      //     facotryName: '骏联'
      //   }
      // ],
      factoryFormDatas: {},
      oldFactoryDatas: []
    }
  },
  created() {
    if (this.$route.params.id && this.$route.params.antitype === 'AllWalks') { // 获取详情数据 更新进度 客户审核 用此接口
      this.getDetail({ id: this.$route.params.id })
      // this.getPrintDatas()
    }
    if (this.$route.params.factoryid && this.$route.params.antitype === 'DEI') { // 获取印花厂数据 选择工厂用此接口
      this.getPrintDatas({ id: +this.$route.params.factoryid, printProProDetId: +this.$route.params.id })
    }
    this.type = this.$route.params.type
    // if(this.type !== 'factory'){
    //   this.showInfoData.push({
    //     prop: 'select',
    //     itemType: 'input',
    //     itemStyle: { 'width': '94%','margin': '10px 2%' },
    //     label: '印花厂:',
    //     readonly: true
    //   })
    // }
    // if (this.type !== 'show' && this.type === 'progress') {
    //   console.log(this.processInfoData[0].dataSource);
    //   this.processInfoData[0].dataSource.push({
    //     edit: true
    //   })
    // } else if (this.type !== 'show' && this.type === 'examine') {
    //   this.guestInfoData[0].dataSource.push({
    //     edit: true
    //   })
    // }
  },
  methods: {
    // 处理印花工艺
    getprintCraft(data) {
      let str = ''
      data = JSON.parse(data)
      //  console.log(data);
      data &&
        data.forEach((item, index) => {
          str = str + item.printCraftName + ','
        })
      // str = '印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺' + ',' + '印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺' + ','
      // str = '印花工艺' + ',' + '印花工艺' + ','

      //  console.log(str);
      str = str.slice(0, str.length - 1)
      return str
    },
    // 处理成衣款式
    getclothStyle(style) {
      let str = ''
      if (style === '1') {
        str = '男装'
      } else if (style === '2') {
        str = '女装'
      } else if (style === '3') {
        str = '童装'
      } else if (style === '4') {
        str = '婴幼儿装'
      } else {
        str = ''
      }
      return str
    },
    // 获取详情数据 更新进度 客户审核 用此接口
    async getDetail(data = {}) {
      const res = await soPrintDetail({ ...data })
      this.formDatas = res.data || {}
      this.formDatas.printCraft = this.getprintCraft(this.formDatas.printCraft)
      this.printStr = this.formDatas.printCraft && this.formDatas.printCraft.replace(/,/g, '\n')
      this.formDatas.clothStyle = this.getclothStyle(this.formDatas.clothStyle)
      this.yarnStr = this.formDatas.yarn && this.formDatas.yarn.replace(/,/g, '\n')
      this.processInfoData[0].dataSource = res.data.date || []
      this.guestInfoData[0].dataSource = res.data.checks || []
      if (this.type !== 'show' && this.type === 'progress') {
        this.processInfoData[0].dataSource.push({
          edit: true
        })
      } else if (this.type !== 'show' && this.type === 'examine') {
        this.guestInfoData[0].dataSource.push({
          edit: true
        })
      }
      if (res.data && res.data.printFactoryId) {
        let sm = ''
        this.facListData.forEach((item, index) => { // 印花厂id
          if (res.data.printFactoryId === item.value) {
            sm = item.label
          }
        })
        this.factoryFormDatas = { printFactoryName: sm }
      }
    },
    // 获取印花厂数据 选择工厂用此接口
    async getPrintDatas(data = {}) {
      const res = await soPrintFactoryDetail({ ...data })
      // start
      this.formDatas = res.data || {} // 主表数据相同直接复制
      this.formDatas.printCraft = this.getprintCraft(this.formDatas.printCraft)
      this.printStr = this.formDatas.printCraft && this.formDatas.printCraft.replace(/,/g, '\n')
      this.formDatas.clothStyle = this.getclothStyle(this.formDatas.clothStyle)
      this.yarnStr = this.formDatas.yarn && this.formDatas.yarn.replace(/,/g, '\n')
      this.processInfoData[0].dataSource = res.data.date || []
      this.guestInfoData[0].dataSource = res.data.checks || []
      if (this.type !== 'show' && this.type === 'progress') {
        this.processInfoData[0].dataSource.push({
          edit: true
        })
      } else if (this.type !== 'show' && this.type === 'examine') {
        this.guestInfoData[0].dataSource.push({
          edit: true
        })
      }
      // end
      this.oldFactoryDatas = res.data.oldFactoryList
      // this.factoryFormDatas.printFactoryId = [res.data.printFactoryId]
      // this.factoryFormDatas.printFactoryName = res.data.printFactoryName
      this.factoryFormDatas = {
        printFactoryId: [res.data.printFactoryId],
        printFactoryName: res.data.printFactoryName
      }
      // console.log(this.factoryFormDatas);
      // this.originFactorys = res.data.oldFactoryList
      // console.log(res.data)
      // const ids = []
      // let names = ''
      // this.originFactorys.forEach((item, index) => {
      //   ids.push(item.facotryId)
      //   names = names + item.facotryName + ','
      // })
      // names = names.slice(0, names.length - 1)
      // this.factoryFormDatas = {
      //   printFactoryId: ids,
      //   printFactoryName: names
      // }
      // console.log(this.factoryFormDatas);
    },
    // 生产进度类型下拉
    async getProgressDown(data = {}) {
      // 后台说只有2个固定死
      // const res = await soPrintTypeDown({ ...data })
      // if (res.code !== 200) {
      //   return false
      // }
      // this.typeData = res.data.list || []
      // this.typeData.map((item, index) => {
      //   item.label = item.type
      //   item.value = item.id
      // })
      const sm = [
        { label: '印花', value: '印花' },
        { label: '底布', value: '底布' }
      ]
      this.typeData = sm || []
      this.$set(
        this.processInfoData[0].columns[1].editOptions,
        'dataSource',
        sm
      )
    },
    // 生产进度进度下拉
    async getproduceDown(data = {}) {
      const res = await soPrintTypeDown({ ...data })
      if (res.code !== 200) {
        return false
      }
      this.processData = res.data.list || []
      this.processData.map((item, index) => {
        item.label = item.name
        item.value = item.id
      })
      this.$set(
        this.processInfoData[0].columns[2].editOptions,
        'dataSource',
        this.processData
      )
    },
    // 保存
    async soPrintSave() {
      if (this.type === 'progress') {
        const objArray =
          this.$refs.showProcessData.dynamicValidateFormRuleForm.tableForm ||
          []
        // console.log(obj)
        const sobj = objArray[objArray.length - 1]
        if (this.typeData) {
          this.typeData.forEach((item, index) => {
            if (item.value === sobj.type) {
              sobj.type = item.label
            }
          })
        }
        if (this.processData) {
          this.processData.forEach((item, index) => {
            if (item.value === sobj.produceName) {
              sobj.produceName = item.label
            }
          })
        }
        sobj.printProProDetId = +this.$route.params.id
        sobj.printProduceProgressId = this.formDatas.id
        console.log(sobj)
        const res = await soPrintProcessSave({ ...sobj })
        if (res.code === 200) {
          this.fetchLog(
            this.getLogMessages('UPDATE', '/aps/soPrint/printProduceProgress/add/progress', 'aps'),
            { id: this.$route.params.id },
            JSON.stringify({
              beforeText: `在'计划管理-生产进度-印花SO生产进度'修改一条记录`,
              beforeCode: { id: this.$route.params.id }
            })
          )
          this.$router.go(-1)
        } else {
          this.$message.error(res.message)
        }
      } else if (this.type === 'factory') {
        const sobj =
          this.$refs.showEditSelectData.dynamicValidateFormRuleForm || {}

        const facListIds = sobj.printFactoryId
        const facList = []
        const obj = {}
        facListIds &&
          facListIds.forEach((aitem, aindex) => {
            this.facListData.forEach((bitem, bindex) => {
              if (aitem === bitem.value) {
                facList.push({
                  printFactoryId: bitem.value,
                  printFactoryName: bitem.label,
                  facotryId: bitem.value,
                  facotryName: bitem.label
                })
              }
            })
          })
        // obj.printProProDetId = +this.$route.params.id
        // obj.printProduceProgressId = this.formDatas.id
        obj.printProduceProgressDetailId = +this.$route.params.id // 生产进度明细id
        obj.printProduceProgressId = this.formDatas.id // 生产进度明细id
        // obj.facList = facList
        obj.factoryList = facList // 新工厂列表
        // obj.oldFactoryList = this.oldFactoryDatas
        const oldFactoryLists = []
        this.oldFactoryDatas &&
          this.oldFactoryDatas.forEach((aitem, aindex) => {
            // 后台需要前端传递有效值
            if (aitem.facotryName) {
              oldFactoryLists.push({
                facotryId: aitem.facotryId,
                facotryName: aitem.facotryName
              })
            }
          })
        obj.oldFactoryList = oldFactoryLists
        const res = await soPrintFactorySave({ ...obj })
        if (res.code === 200) {
          this.fetchLog(
            this.getLogMessages('UPDATE', '/aps/soPrint/printProduceProgress/add/fac', 'aps'),
            { id: this.$route.params.id },
            JSON.stringify({
              beforeText: `在'计划管理-生产进度-印花SO生产进度'修改一条记录`,
              beforeCode: { id: this.$route.params.id }
            })
          )
          this.$router.go(-1)
        } else {
          this.$message.error(res.message)
        }
      } else if (this.type === 'examine') {
        const guestArray =
          this.$refs.showGuestData.dynamicValidateFormRuleForm.tableForm || []
        const guestObj = guestArray[guestArray.length - 1]
        guestObj.printProProDetId = +this.$route.params.id
        guestObj.printProduceProgressId = this.formDatas.id
        console.log(guestObj)
        const res = await soPrintExamineSave({ ...guestObj })
        if (res.code === 200) {
          this.fetchLog(
            this.getLogMessages('UPDATE', '/aps/soPrint/printProduceProgress/customer/check', 'aps'),
            { id: this.$route.params.id },
            JSON.stringify({
              beforeText: `在'计划管理-生产进度-印花SO生产进度'修改一条记录`,
              beforeCode: { id: this.$route.params.id }
            })
          )
          this.$router.go(-1)
        } else {
          this.$message.error(res.message)
        }
      }
    },
    // 取消
    cancel() {
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
<style>
.paintStyle .cell span{
  display: flex;
}
.printschedule-content .el-input--medium .el-input__inner{
    text-overflow: ellipsis !important;
    overflow: hidden !important;
    white-space: nowrap !important;
}
</style>
<style lang="scss" scope>
.printschedule-detail {
  margin-bottom: 60px;
  .print-craft-style {
    // white-space: pre;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 20px;
    margin-top: 8px;
    margin-left: 15px;
    width: 100%;
    white-space: nowrap;
  }
  // .craft-title{
  //  /deep/ .el-form-item__label{
  //    width: 71.89px !important;
  //  }
  // }
  .bsisStyle {
    /deep/ .el-form-item__label-wrap .el-form-item__label {
      color: #888e9e;
      white-space: nowrap;
    }
  }
  .printschedule-top {
    padding-top: 19px;
    display: flex;
    justify-content: space-between;
    .product-item-codeinfo {
      padding: 0 19px;
      display: flex;
      .code-item {
        font-size: 18px;
        color: #151222;
        line-height: 26px;
        height: 26px;
        // padding: 0 10px;
      }
    }
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
  .printschedule-content {
    margin: 15px 20px;
    color: #606266;
    background-color: #fff;
    .textStyle{
      text-overflow: ellipsis;
      overflow: hidden;
    }
    /* /deep/ .el-input--medium .el-input__inner{
      text-overflow: ellipsis !important;
      overflow: hidden !important;
      white-space: nowrap !important;
    } */
    .printschedule-content-bsistitle{
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
    .printschedule-content-title {
      display: flex;
      justify-content: space-between;
      // line-height: 60px;
      padding-top: 20px;
      height: 59px;
      margin: 0 20px;
      border-bottom: 1px solid #efefef;
      font-size: 16px;
      color: #3c4043;
    }
    .printschedule-content-info {
      padding: 20px;
      /deep/ .el-input__inner,
      .el-textarea__inner {
        border: 0;
      }
    }
    .printschedule-content-showinfo {
      padding-left: 44px;
      /deep/ .el-input__inner,
      .el-textarea__inner {
        border: 0;
      }
    }
    .printschedule-select-info {
      padding: 10px 20px;
    }
    .printschedule-process-info {
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
  .printschedule-foot {
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
//  /deep/ .paintStyle{
//    border-bottom: 1px solid red;
//    .cell{
//     span{
//        display: flex;
//      }
//    }
//  }

}

</style>

