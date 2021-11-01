<!--
 * @Author: xj
 * @Description: 样板开发==》质量要求
 * @Date: 2021-03-11 19:37:46
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-08 19:18:58
 * @FilePath: d:\yangban\src\views\customer-order\sample-orders\detail\compoments\qualityRequirement.vue
-->
<template>
  <div class="qualityrequ">
    <!-- 对色标准 -->
    <div class="table-item basic-data">
      <div class="header-top basic-top">
        <span>对色标准</span>
      </div>
      <cs-custom-form
        ref="basicData"
        :class="getEditClass"
        :data-source="baseData"
        :options="basicformOptions"
        :form-datas="formDatasData"
      />
    </div>
    <!-- 批色要求 -->
    <div class="table-item basic-data">
      <div class="header-top basic-top">
        <span>批色要求</span>
      </div>
      <cs-custom-form
        ref="batchColor"
        :class="getEditClass"
        :data-source="batchColor"
        :options="batchformOptions"
        :form-datas="formDatasColor"
      />
    </div>
    <!-- QC验货 -->
    <div class="table-item basic-data">
      <div class="header-top basic-top">
        <span>QC验货</span>
      </div>
      <cs-custom-form
        ref="Inspection"
        :class="getEditClass"
        :data-source="Inspection"
        :options="InspeformOptions"
        :form-datas="formDatasction"
      />
    </div>
    <!-- 测试要求 -->
    <div class="table-item basic-data">
      <div class="header-top">
        <span>测试要求</span>
        <el-button v-if="isEdit" class="addBtn" size="small" @click="addHandler">添加项目</el-button>
      </div>
      <!-- 测试要求表单 -->
      <div class="test-requirements">
        <cs-custom-form ref="testRequirements" :options="requirementsformOptions" :data-source="testRequirementsData" />
      </div>
      <!-- 测试备注 -->
      <div class="header-top">
        <span>测试备注:</span>
      </div>
      <div class="table-textarea">
        <div v-if="!isEdit" :title="testRemark" class="yarn-style">{{ testRemark || '' }}</div>
        <el-input
          v-else
          v-model="testRemark"
          type="textarea"
          placeholder="请输入内容"
          :title="testRemark"
          maxlength="100"
          trueshow-word-limit
        />
      </div>
    </div>
    <!-- 测试要求pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="treeOptions" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
import { organizationSelect, testItemOptions } from '../api/index'
export default {
  name: 'QualityRequirements',
  components: {},
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    brand: {
      type: [String, Object]
    },
    clothingType: {
      type: [String, Object]
    },
    orderData: {
      type: Object
    },
    syncDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    }
  },
  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const baseData = {
      _colorMatching: {
        prop: 'colorMatching',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        // labelWidth: '95px',
        label: '对色方式:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '对色方式' }, 'colorMatching')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}'>${value.label}</div>` : ''
        }
      },
      _colorData: {
        prop: 'colorData',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        // labelWidth: '92px',
        label: '对色资料:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: 'OK LD',
            value: '1'
          },
          {
            label: '原板',
            value: '2'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value === '1' ? 'OK LD' : '原板'}'>${value === '1' ? 'OK LD' : '原板'}</div>` : ''
        }
      },
      // _bodyAndBottom: {
      //   prop: 'bodyAndBottom',
      //   itemType: this.selectTypeChange,
      //   className: 'inputWidth',
      //   itemStyle: { 'width': '25%' },
      //   label: '衫身和下栏:',
      //   clearable: true,
      //   disabled: true,
      //   dataSource: [
      //     {
      //       label: '',
      //       value: ''
      //     },
      //     {
      //       label: '撞色',
      //       value: '1'
      //     },
      //     {
      //       label: '配色',
      //       value: '2'
      //     }
      //   ],
      //   renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
      //     return value ? `<div title='${value === '1' ? '撞色' : '配色'}'>${value === '1' ? '撞色' : '配色'}</div>` : ''
      //   }
      // },
      _tolerance: {
        prop: 'tolerance',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '对色公差:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '公差(对色)' }, 'tolerance')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}'>${value.label}</div>` : ''
        }

      },
      _lstLightSource: {
        prop: 'lstLightSource',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        // labelWidth: '98px',
        label: '1st对色光源:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getFirstLights()
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}'>${value.label}</div>` : ''
        }
      },
      _twondLightSource: {
        prop: 'twondLightSource',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%', 'margin-left': '0' },
        label: '2nd对色光源:',
        // labelWidth: '100px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getFirstLights()
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}'>${value.label}</div>` : ''
        }
      },
      _threerdLightSource: {
        prop: 'threerdLightSource',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '3rd对色光源:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getFirstLights()
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}'>${value.label}</div>` : ''
        }
      }
    }
    const batchColor = {
      _headCylinder: {
        prop: 'headCylinder',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '衫身头缸:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '客人批',
            value: '1'
          },
          {
            label: '卖家批',
            value: '2'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value === '1' ? '客人批' : '卖家批'}'>${value === '1' ? '客人批' : '卖家批'}</div>` : ''
        }
      },
      _dropHeadCylinder: {
        prop: 'dropHeadCylinder',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '下栏头缸:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '撞色',
            value: '1'
          },
          {
            label: '配色',
            value: '2'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value === '1' ? '撞色' : '配色'}'>${value === '1' ? '撞色' : '配色'}</div>` : ''
        }
      },
      _cylinderDifference: {
        prop: 'cylinderDifference',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '缸差:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '客人批每缸',
            value: '1'
          },
          {
            label: '客人批任一缸',
            value: '2'
          },
          {
            label: '卖家批',
            value: '3'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '客人批每缸', '2': '客人批任一缸', '3': '卖家批' }
          return value ? `<div title='${obj[value]}'>${obj[value]}</div>` : ''
        }
      },
      _pitch: {
        prop: 'pitch',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '匹差:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '客人批每匹',
            value: '1'
          },
          {
            label: '客人批任一匹',
            value: '2'
          },
          {
            label: '卖家批',
            value: '3'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '客人批每匹', '2': '客人批任一匹', '3': '卖家批' }
          return value ? `<div title='${obj[value]}'>${obj[value]}</div>` : ''
        }
      }
    }
    const Inspection = {
      _chabStandard: {
        prop: 'chabStandard',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        // labelWidth: '110px',
        label: '查布标准:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '国际四分制',
            value: '1'
          },
          {
            label: '国际十分制',
            value: '2'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '国际四分制', '2': '国际十分制' }
          return value ? `<div title='${obj[value]}'>${obj[value]}</div>` : ''
        }
      },
      _scoreStandard: {
        prop: 'scoreStandard',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        // labelWidth: '100px',
        label: '分数标准:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '20',
            value: '1'
          },
          {
            label: '22',
            value: '2'
          },
          {
            label: '24',
            value: '3'
          },
          {
            label: '25',
            value: '4'
          },
          {
            label: '26',
            value: '5'
          },
          {
            label: '28',
            value: '6'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '20', '2': '22', '3': '24', '4': '25', '5': '26', '6': '28' }
          return value ? `<div title='${obj[value]}'>${obj[value]}</div>` : ''
        }
      },
      _checkClothLanguage: {
        prop: 'checkClothLanguage',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '查布语言:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '中文',
            value: '1'
          },
          {
            label: '英文',
            value: '2'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '中文', '2': '英文' }
          return value ? `<div title='${obj[value]}'>${obj[value]}</div>` : ''
        }
      },
      _checkClothMethod: {
        prop: 'checkClothMethod',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '查布方式:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '抽查',
            value: '1'
          },
          {
            label: '全查',
            value: '2'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '抽查', '2': '全查' }
          return value ? `<div title='${obj[value]}'>${obj[value]}</div>` : ''
        }
      },
      _isGuestsCheck: {
        prop: 'isGuestsCheck',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '客人是否查验:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '2'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '是', '2': '否' }
          return value ? `<div title='${obj[value]}'>${obj[value]}</div>` : ''
        }
      },
      _checkClothReportJson: {
        prop: 'checkClothReportJson',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '验布报告:',
        clearable: true,
        disabled: true,
        multiple: true,
        dataSource: [
          {
            label: '系统数据',
            value: '1'
          },
          {
            label: '智布报告',
            value: '2'
          },
          {
            label: '第三方报告',
            value: '3'
          }
        ],
        change: (value) => {
          if (value.includes('3')) {
            this.$set(this.Inspection._assignInstitution, 'isShow', true)
          } else {
            this.$set(this.Inspection._assignInstitution, 'isShow', false)
          }
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '系统数据', '2': '智布报告', '3': '第三方报告' }
          let str = ''
          if (value && value.length && Array.isArray(value)) {
            const list = value
            for (let i = 0; i < list.length; i++) {
              str += obj[value[i]] + '，'
            }
            str = str.substring(0, str.length - 1)
          }
          return `<div title="${str}" class='yarn-style'>${str}</div>`
        }
      },
      _assignInstitution: {
        prop: 'assignInstitution',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        isShow: false,
        label: '检测机构:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value) => {
          if (value) {
            this.getOrganizationSelect()
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}'>${value.label}</div>` : ''
        }
      }
    }
    const basicformOptions = {
      size: 'small',
      inline: true,
      labelWidth: '102px',
      syncDataHandle: (formDatas) => {
        this.syncDataHandle('qualityRequirement_baseData', formDatas)
      }
    }
    const batchformOptions = {
      size: 'small',
      inline: true,
      labelWidth: '82px',
      syncDataHandle: (formDatas) => {
        this.syncDataHandle('qualityRequirement_batchColor', formDatas)
      }
    }
    const InspeformOptions = {
      size: 'small',
      inline: true,
      labelWidth: '110px',
      syncDataHandle: (formDatas) => {
        this.syncDataHandle('qualityRequirement_Inspection', { ...formDatas, checkClothReportJson: formDatas.checkClothReportJson && formDatas.checkClothReportJson.length ? JSON.stringify(formDatas.checkClothReportJson) : '', testRemark: this.testRemark })
      }
    }
    const testColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '50px',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _parentName: {
        prop: 'parentName',
        label: '一级项目',
        showOverflowTooltip: true
      },
      _testMethod: {
        prop: 'testMethod',
        label: '测试方法',
        showOverflowTooltip: true,
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 100,
          change: (value, form, formDatas, setFormDatas) => {
            // console.log(value)
            // const datas = formDatas.tableForm
            // console.log(datas)
            // if (datas && datas.length !== 0) {
            //   const map = new Map()
            //   for (let j = 0; j < datas.length; j++) {
            //     if (datas[j].testMethod) {
            //       map.set(datas[j].parentId, datas[j].testMethod)
            //     }
            //   }
            //   console.log(map)
            //   for (let i = 0; i < datas.length; i++) {
            //     datas[i].testMethod = map.get(datas[i].parentId)
            //   }
            //   console.log(datas)
            // }
            this.tempParentData = formDatas.tableForm
          }
        }
      },
      _itemName: {
        prop: 'itemName',
        label: '二级项目',
        showOverflowTooltip: true
      },
      _testRequirements: {
        prop: 'testRequirements',
        label: '测试要求',
        className: 'ruleTip',
        showOverflowTooltip: true,
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 100,
          rules: [commonBlurReg],
          change: (value, form, formDatas, setFormDatas) => {
            this.tempParentData = formDatas.tableForm
          }
        }
      },
      _remark: {
        prop: 'remark',
        label: '备注',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 100,
          change: (value, form, formDatas, setFormDatas) => {
            this.tempParentData = formDatas.tableForm
          }
        },
        showOverflowTooltip: true
      }
    }
    const operates = {
      label: '操作',
      width: '120',
      isResetOperateWidth: true,
      dataSource: [
        {
          label: '删除',
          isShow: true,
          style: { 'color': '#FE4949' },
          handle: scope => {
            this.$confirm('确认删除该条测试要求数据？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              cancelButtonClass: 'btn-cancel'
            })
              .then(() => {
                this.tempParentData.splice(scope.$index, 1)
                this.dataPretreatment(this.tempParentData, 'parentId')
              })
              .catch(() => {
                this.$message({ type: 'info', message: '已取消删除' })
              })
          }
        }
      ]
    }
    const testRequirementsData = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        border: true,
        columns: testColumns,
        spanMethod: this.spanMethod,
        operates: operates,
        tooltipEffect: 'dark'
      }
    ]
    const requirementsformOptions = {
      popError: true
    }
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '选择检测项目',
      okText: '确认',
      ok: params => {
        if (!params.testItems) {
          this.$message.error('请至少选择一条检查项目')
          return
        }
        const arr = this.treeOptionsData.length && this.treeOptionsData.filter(item => {
          return (params.testItems).includes(item.id)
        })
        // this.tempParentData = []
        arr.length && arr.forEach(item => {
          const childObj = {
            itemId: item.testItemsId,
            orderId: '',
            itemName: item.secondardItemsName,
            testMethod: item.testMethod,
            grade: 1,
            parentId: item.firstItemsId,
            parentName: item.firstItemsName,
            testRequirements: item.claim,
            remark: item.remarks,
            sort: item.firstOrders,
            secondSort: item.secondardOrders,
            edit: true
          }
          this.tempParentData.push(childObj)
        })
        this.tempParentData.sort(this.sortFn)
        this.$set(this.testRequirementsData[0], 'dataSource', this.tempParentData)
        this.dataPretreatment(this.tempParentData, 'parentId')
        this.popHandle()
      },
      cancel: params => {
        this.popHandle()
      },
      formDatas: {},
      formOptions: {
        labelWidth: '0px',
        size: 'small',
        inline: true
      },
      content: [
        {
          prop: 'testItems',
          itemType: 'tree',
          ref: 'treeOptions',
          treeOptions: {
            // 父关联子  子不关联父
            // searchNeedChild: false,
            checkNeedParent: true,
            checkNeedChild: true,
            checkStrictly: false,
            bindParentTags: false,
            defaultExpandAll: false,
            // nodeKey: 'id',
            props: {
              // parentId: 'id',
              label: 'name',
              children: 'child'
            },
            showCheckbox: true,
            isPopTree: false,
            // treeSelectTitle: '',
            span: [24, 0],
            selectedHidden: true,
            // treeSelectedTitle: '已选择',
            data: [],
            expandOnClickNode: true
          },
          placeholder: '请选择部门'
        }
      ]
    }
    return {
      headerCellStyle,
      baseData, // 对色标准信息
      batchColor, // 批色要求
      Inspection, // QC验货
      isEditType: false, // 页面IED
      basicData: {},
      basicformOptions,
      batchformOptions,
      InspeformOptions,
      formDatasData: {}, // 对色标准
      formDatasColor: {}, // 批色要求
      formDatasction: {}, // QC验货
      testColumns,
      dataSource: [],
      operates,
      testRequirementsData,
      requirementsformOptions,
      popOptions,
      testRemark: '',
      treeOptionsData: [], // 根据品牌、成衣类型查到的下拉树平铺数据
      tempParentData: [], // 带父级的数据
      tempParentDataCopy: [], // 详情的数据，用来赋值id
      rows: [],
      pos: 0
    }
  },
  computed: {
    getEditClass() {
      if (this.isEdit) {
        return 'editClass'
      } else {
        return 'detailClass'
      }
    },
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  watch: {
    orderData: {
      handler(val, oldVal) {
        if (val !== null && val && Object.keys(val).length) {
          this.initializationCom(val)
        }
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(val, oldVal) {
        if (val) {
          this.editChange()
        } else {
          this.editChange(true)
        }
      },
      deep: true,
      immediate: true
    },
    tempParentData: {
      handler(val, oldVal) {
        if (val) {
          const arr = []
          if (val && val.length) {
            val.forEach(item => {
              if (!arr.find(items => items.itemId * 1 === item.parentId * 1)) {
                arr.push({
                  itemId: item.parentId,
                  orderId: '',
                  itemName: item.parentName,
                  testMethod: item.testMethod,
                  grade: 0,
                  parentId: -1,
                  parentName: item.parentName,
                  testRequirements: item.testRequirements,
                  remark: item.remark,
                  sort: item.sort
                  // edit: true
                })
              }
            })
          }
          arr.length && arr.forEach(item => {
            this.tempParentDataCopy.length && this.tempParentDataCopy.forEach(items => {
              if (item.itemId * 1 === items.itemId * 1) {
                item.id = items.id
                item.orderId = items.orderId
              }
            })
          })
          this.syncDataHandle('qualityRequirement_testItems', [...val, ...arr])
        }
      },
      deep: true,
      immediate: true
    },
    testRemark: {
      handler(val, oldVal) {
        this.setParentDataHandle('testRemark', { testRemark: val })
      },
      immediate: true
    }
  },
  created() {
    this.init()// 初始化数据
  },
  mounted() {},
  methods: {
    // 排序
    sortFn(a, b) {
      if (a.sort === b.sort) {
        return a.secondSort - b.secondSort
      } else if (b.sort > a.sort) {
        return a.sort - b.sort
      } else if (b.sort < a.sort) {
        return a.sort - b.sort
      }
    },
    inputTypeChange() {
      return this.isEdit ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.isEdit ? 'select' : 'itemview'
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        res.unshift({ value: '', label: '' })
        if (type === 'colorMatching') { // 对色方式
          this.$set(this.baseData._colorMatching, 'dataSource', res)
        } else if (type === 'tolerance') { // 公差
          this.$set(this.baseData._tolerance, 'dataSource', res)
        }
      })
    },
    // 检测机构下拉
    async getOrganizationSelect(data = {}) {
      const res = await organizationSelect(data)
      if (this.$pub.responseValidate(res)) {
        const organizationList = res.data && res.data.length && res.data.map(item => {
          return {
            label: item.name,
            value: '' + item.id
          }
        }) || []
        this.$set(this.Inspection._assignInstitution, 'dataSource', organizationList)
      }
    },
    // 编辑状态
    editChange(type = false) {
      for (const key in this.baseData) { // 对色标准信息
        this.baseData[key].disabled = type
      }
      for (const key in this.batchColor) { // 批色要求
        this.batchColor[key].disabled = type
      }
      for (const key in this.Inspection) { // QC验货
        this.Inspection[key].disabled = type
      }
      if (type) {
        this.$set(this.testRequirementsData[0], 'operates', null)
      } else {
        this.tempParentData.forEach(item => {
          item.edit = true
        })
        this.$set(this.testRequirementsData[0], 'operates', this.operates)
      }
    },
    // 页面初始化
    initializationCom(data) {
      const that = this
      if (this.$route.query.requireId) {
        return false
      }
      that.formDatasData = {
        colorMatching: that.setValue(data.colorStandard.colorMatching), // 对色方式
        tolerance: that.setValue(data.colorStandard.tolerance), // 公差
        colorData: data.colorStandard.colorData, // 对色资料{1=OKLD，2=原板}
        // bodyAndBottom: data.colorStandard.bodyAndBottom, // 衫身和下栏{1=撞色，2=配色}
        lstLightSource: that.setValue(data.colorStandard.lstLightSource), // lst对色光源
        twondLightSource: that.setValue(data.colorStandard.twondLightSource), // 2nd对色光源
        threerdLightSource: that.setValue(data.colorStandard.threerdLightSource), // 3rd对色光源
        colorStandardId: data.colorStandard.colorStandardId || ''
      }
      this.$set(this.baseData._lstLightSource, 'dataSource', that.formDatasData.lstLightSource ? [that.formDatasData.lstLightSource] : [])
      this.$set(this.baseData._twondLightSource, 'dataSource', that.formDatasData.twondLightSource ? [that.formDatasData.twondLightSource] : [])
      this.$set(this.baseData._threerdLightSource, 'dataSource', that.formDatasData.threerdLightSource ? [that.formDatasData.threerdLightSource] : [])
      this.$set(this.baseData._colorMatching, 'dataSource', that.formDatasData.colorMatching ? [that.formDatasData.colorMatching] : [])
      this.$set(this.baseData._tolerance, 'dataSource', that.formDatasData.tolerance ? [that.formDatasData.tolerance] : [])
      that.formDatasColor = {// 批色要求
        headCylinder: data.batchColorRequirements.headCylinder, // 衫身头缸{1=客人批，2=卖家批}
        dropHeadCylinder: data.batchColorRequirements.dropHeadCylinder, // 下拉头缸{1=撞色，2=配色}
        cylinderDifference: data.batchColorRequirements.cylinderDifference, // 缸差{1=客人批每缸，2=客人批任一缸，3=卖家批}
        pitch: data.batchColorRequirements.pitch, // 匹差{1=客人批每缸，2=客人批任一缸，3=卖家批}
        batchColorId: data.batchColorRequirements.batchColorId || ''// 批色要求ID
      }
      that.formDatasction = {// QC验货
        chabStandard: data.qcInspection.chabStandard || '', // 查布标准{1=国际四分制，2=国际十分制}
        scoreStandard: data.qcInspection.scoreStandard || '', // 分数标准{0，20，22，24，25，26，28}
        isGuestsCheck: data.qcInspection.isGuestsCheck || '', // 客人是否查验{1=是，2=否}
        checkClothReportJson: data.qcInspection.checkClothReportJson ? JSON.parse(data.qcInspection.checkClothReportJson) : '', // 验布报告
        assignInstitution: that.setValue(data.qcInspection.assignInstitution), // 检测机构
        checkClothMethod: data.qcInspection.checkClothMethod || '', // 查布方式{1=抽查，2=全查}
        checkClothLanguage: data.qcInspection.checkClothLanguage || '', // 查布语言{1=中文，2=英文}
        qcInspectionId: data.qcInspection.qcInspectionId || '', // QC验货表ID
        testRemark: data.qcInspection.testRemark || '' // 测试要求
      }
      console.log(that.formDatasction)
      this.testRemark = data.qcInspection && data.qcInspection.testRemark ? data.qcInspection.testRemark : '' // 测试要求
      this.$set(this.Inspection._assignInstitution, 'dataSource', that.formDatasction.assignInstitution ? [that.formDatasction.assignInstitution] : [])
      if (that.formDatasction.checkClothReportJson && that.formDatasction.checkClothReportJson.includes('3')) {
        this.$set(this.Inspection._assignInstitution, 'isShow', true)
      } else {
        this.$set(this.Inspection._assignInstitution, 'isShow', false)
      }
      this.tempParentDataCopy = data.qaTestItems ? JSON.parse(JSON.stringify(data.qaTestItems)) : []
      this.tempParentData = data.qaTestItems && data.qaTestItems.length && data.qaTestItems.filter(item => {
        return item.parentId * 1 !== -1
      }) || []
      this.$set(this.testRequirementsData[0], 'dataSource', this.tempParentData)
      this.dataPretreatment(this.tempParentData, 'parentId')
    },
    // 对色光源下拉
    async getFirstLights() {
      this.getFirstLight({ enabled: 'Y' }).then(res => {
        res.unshift({ value: '', label: '' })
        this.$set(this.baseData._lstLightSource, 'dataSource', res)
        this.$set(this.baseData._twondLightSource, 'dataSource', res)
        this.$set(this.baseData._threerdLightSource, 'dataSource', res)
      })
    },
    init() {
      const that = this
      that.formDatasData = {
        colorMatching: '', // 对色方式
        tolerance: '', // 公差
        colorData: '', // 对色资料{1=OKLD，2=原板}
        // bodyAndBottom: '', // 衫身和下栏{1=撞色，2=配色}
        lstLightSource: '', // lst对色光源
        twondLightSource: '', // 2nd对色光源
        threerdLightSource: '' // 3rd对色光源
      } // 对色标准
      that.formDatasColor = {// 批色要求
        headCylinder: '', // 衫身头缸{1=客人批，2=卖家批}
        dropHeadCylinder: '', // 下拉头缸{1=撞色，2=配色}
        cylinderDifference: '', // 缸差{1=客人批每缸，2=客人批任一缸，3=卖家批}
        pitch: '' // 匹差{1=客人批每缸，2=客人批任一缸，3=卖家批}
      }
      that.formDatasction = {// QC验货
        chabStandard: '', // 查布标准{1=国际四分制，2=国际十分制}
        scoreStandard: '', // 分数标准{0，20，22，24，25，26，28}
        isGuestsCheck: '', // 客人是否查验{1=是，2=否}
        checkClothReportJson: ['1'], // 验布报告
        assignInstitution: '', // 检测机构
        checkClothMethod: '', // 查布方式{1=抽查，2=全查}
        checkClothLanguage: ''// 查布语言{1=中文，2=英文}
      }
    },
    // 纯数据展示
    setValue(it) {
      if (it && it.value) {
        it.value = it.value !== null ? it.value : ''
      } else {
        it = ''
      }
      return it
    },
    addHandler() {
      if (!this.brand) {
        this.$message.error('请先选择品牌商')
        return
      }
      if (!this.clothingType) {
        this.$message.error('请先选择成衣类型')
        return
      }
      this.getTestItemOptions()
      this.popHandle()
    },
    async getTestItemOptions() {
      if (this.brand.label && this.clothingType.label) {
        const res = await testItemOptions({ brandName: this.brand.label, clothesTypeName: this.clothingType.label })
        if (this.$pub.responseValidate(res)) {
          if (res.data && res.data.length) {
            this.treeOptionsData = res.data
            const checkedItemIds = []
            this.tempParentData.length && this.tempParentData.forEach(item => {
              checkedItemIds.push(item.itemId * 1)
            })
            const showTreeOptions = this.treeOptionsData.filter(item => {
              return !checkedItemIds.includes(item.testItemsId)
            })
            const arr = this.handelTreeData(JSON.parse(JSON.stringify(showTreeOptions)))
            // const arr = this.handelTreeData(JSON.parse(JSON.stringify(res.data)))
            this.$set(this.popOptions.content[0].treeOptions, 'data', arr || [])
          }
        }
      } else {
        this.$message.error('数据错误')
        return
      }
    },
    handelTreeData(array) {
      const newObj = {}
      while (array.length) {
        const current = array.shift()
        current.firstItemsId = current.firstItemsId + ''
        newObj[current.firstItemsId] = newObj[current.firstItemsId] || []
        newObj[current.firstItemsId].push({ ...current, name: current.secondardItemsName })
      }
      return Object.values(newObj).map(item => {
        return {
          id: item[0].testItemsId,
          orderId: item[0].id,
          itemName: item[0].firstItemsName,
          name: item[0].firstItemsName,
          testMethod: item[0].testMethod,
          grade: 1,
          parentId: '-1',
          testRequirements: item[0].claim,
          remark: item[0].remarks,
          child: item
        }
      })
    },
    // 检测项目弹出层
    popHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 合并的列
    spanMethod({ row, column, rowIndex, columnIndex }) {
      // 第一列
      if ([1, 2].includes(columnIndex) && this.rows.length) {
        const _row = this.rows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 处理要合并的数据
    dataPretreatment(data, prop) {
      this.rows = []
      this.pos = 0
      for (let i = 0; i < data.length; i++) {
        // data传入的表格数据源
        if (i === 0) {
          this.rows.push(1)
          this.pos = 0
        } else {
          if (data[i].hasOwnProperty(prop) && data[i][prop] && data[i - 1][prop]) {
            // 哪些数据是要合并的 合并的条件是什么
            if (data[i][prop] * 1 === data[i - 1][prop] * 1) {
              this.rows[this.pos] += 1
              this.rows.push(0)
            } else {
              this.rows.push(1)
              this.pos = i
            }
          } else {
            this.rows.push(1)
            this.pos = i
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.qualityrequ {
  padding-bottom: 60px;
  // margin-top: 20px;
  .table-item {
    background: #ffffff;
    margin: 20px 20px 0;
    margin-bottom: 20px;
    .header-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 15px 20px;
      span {
        font-size: 16px;
        display: flex;
        font-weight: 400;
      }
      .el-button {
        display: flex;
        span {
          font-size: 14px;
        }
      }
      .addBtn {
        color: #0986FF;
        border-color: #0986FF;
      }
    }
    .basic-top {
      border-bottom: 1px solid #eeeff0;
      margin-bottom: 20px;
    }
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    color: #666666;
  }
  /deep/ .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .detailClass /deep/.el-input__inner {
    padding: 0;
    border: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #fff;
    font-size: 14px;
  }
  .detailClass /deep/ .el-form-item {
    margin-bottom: 14px;
  }
  .editClass /deep/ .el-form-item {
    margin-bottom: 20px;
  }
  .detailClass /deep/ .el-input__icon {
    display: none;
  }
  .basic-data .el-input.is-disabled .el-input__suffix {
    display: none;
  }
  .basic-data {
    margin-top: 0;
    padding-bottom: 20px;
    .custom-form {
      margin: 0 20px;
    }
  }
  .table-textarea {
    padding: 0 20px;
    /deep/ textarea {
      color: #000 !important;
      min-height: 60px !important;
    }
  }
  /deep/ .table tr {
    background: #ffffff;
  }
  /deep/ .customScrollbar .el-form-item {
    width: 100%;
  }
  /deep/ .el-table__header tr {
    height: 44px;
  }
  /deep/ .el-table .cell {
    font-size: 14px;
  }
  /deep/ .el-table__header .ruleTip .cell::before {
    display: block;
    content: '*';
    position: absolute;
    left: 4px;
    color: #FE4949;
  }
  /deep/ .el-form-item input {
    height: 28px;
    line-height: 28px;
  }
  /deep/ .custom-form .defaultOperates {
    padding: 0!important;
  }
}
</style>
