import * as api from '@/views/quality-manage/common/basisApi.js'
// import editColumn from '../common/edit-column.vue'
export const yarnInfo = {
  data() {
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const itemStyle = {
      marginRight: 0,
      border: '1px solid #dfe6ec',
      padding: '10px',
      borderRight: 'none',
      marginBottom: '-1px',
      alignItems: 'center'
    }

    const yarnCommon = {
      _yarnUuid: {
        prop: 'yarnUuid',
        itemType: 'view',
        text: `试纱信息`,
        style: {
          'width': '100%',
          'display': 'flex',
          'align-items': 'center',
          'font-size': '16px',
          'color': '#151222',
          'margin-right': 'auto',
          'height': '57px'
          // 'padding': '0 10px'
        }
      },

      _tableForm: {
        prop: 'tableForm',
        props: { edit: 'edit' },
        headerCellStyle: { 'background-color': '#F5F7FA' },
        className: 'pop-table',
        itemType: 'table-form',
        itemStyle: { 'width': '100%', 'margin-bottom': '-1px', 'margin-right': '0' },
        border: true,
        columns: [],
        dataSource: []
      },
      _productStatus: {
        prop: 'productStatus',
        itemType: 'select',
        valueType: 'object',
        // size: 'mini',
        label: '生产状态',
        className: 'commonRemoteSearch',
        itemClassName: 'yarn-info-item info-item-disabled',
        filterable: true,
        clearable: true,
        disabled: true,
        readonly: true,
        itemStyle: {
          ...itemStyle, width: '30%', padding: '0' },
        rules: [],
        placeholder: '',
        dataSource: [],
        select: [api.getProduceStates, {
          typical: 'DC',
          enabled: 'Y'
        }],
        visibleChange: (flag) => {
          flag && api.getProduceStates({
            typical: 'DC',
            enabled: 'Y'
          }).then(res => {
            this.$set(this.yarnCommon._productStatus, 'dataSource', res)
          })
        }
      },
      _nonPermutableColorName: {
        prop: 'nonPermutableColorName',
        itemType: 'select',
        valueType: 'object',
        label: '不可排颜色',
        filterable: true,
        clearable: true,
        multiple: true,
        disabled: true,
        readonly: true,
        className: 'commonRemoteSearch',
        itemClassName: 'yarn-info-item info-item-disabled',
        itemStyle: {
          ...itemStyle,
          width: '70%',
          padding: '0',
          borderRight: '1px solid #dfe6ec'
        },
        placeholder: '',
        dataSource: [],
        rules: [],
        select: [api.dyeColorTestConfig],
        visibleChange: (flag) => {
          flag && api.dyeColorTestConfig().then(res => {
            this.$set(this.yarnCommon._nonPermutableColorName, 'dataSource', res)
          })
        }
      },
      _dyeingAdaptabiy: {
        prop: 'dyeingAdaptabiy',
        itemType: 'select',
        valueType: 'object',
        label: '染色适应性',
        className: 'commonRemoteSearch',
        itemClassName: 'yarn-info-item info-item-disabled',
        filterable: true,
        clearable: true,
        disabled: true,
        readonly: true,
        itemStyle: {
          ...itemStyle, width: '30%', padding: '0' },
        rules: [],
        placeholder: '',
        dataSource: [],
        visibleChange: (flag) => {
          flag && api.getSelectData({ enabled: 'Y', categoryId: 6 }).then(res => {
            this.$set(this.yarnCommon._dyeingAdaptabiy, 'dataSource', res)
          })
        }
      },
      _noPermutableClothName: {
        prop: 'noPermutableClothName',
        itemType: 'select',
        valueType: 'object',
        label: '不可排布类',
        filterable: true,
        clearable: true,
        multiple: true,
        disabled: true,
        readonly: true,
        className: 'commonRemoteSearch',
        itemClassName: 'yarn-info-item info-item-disabled',
        itemStyle: {
          ...itemStyle,
          width: '70%',
          padding: '0',
          borderRight: '1px solid #dfe6ec'
        },
        placeholder: '',
        dataSource: [],
        rules: [],
        select: [api.getCloths],
        visibleChange: (flag) => {
          flag && api.getCloths().then(res => {
            this.$set(this.yarnCommon._noPermutableClothName, 'dataSource', res)
          })
        }
      },
      _reviewUser: {
        prop: 'reviewUser',
        itemType: 'select',
        valueType: 'object',
        label: '审核人',
        filterable: true,
        clearable: true,
        disabled: true,
        readonly: true,
        className: 'commonRemoteSearch',
        itemClassName: 'yarn-info-item info-item-disabled',
        itemStyle: {
          ...itemStyle,
          width: '30%',
          padding: '0'
        },
        placeholder: '',
        dataSource: [],
        rules: [],
        select: [api.getUserData],
        visibleChange: (flag) => {
          flag && api.getUserData().then(res => {
            this.$set(this.yarnCommon._reviewUser, 'dataSource', res)
          })
        }
      },
      _reviewComments: {
        prop: 'reviewComments',
        itemType: 'input',
        itemClassName: 'yarn-info-item info-item-disabled',
        label: '评审意见',
        maxlength: 200,
        disabled: true,
        readonly: true,
        rules: [],
        itemStyle: { ...itemStyle, ...{ width: '70%', flex: 'inherit', padding: '0', borderRight: '1px solid #dfe6ec' }},
        placeholder: ''
      }

    }
    return {
      yarnCommon
    }
  },
  mounted() {
    // this.getSelectList()
  },
  methods: {
    // async getSelectList() {
    //   // 不可排布类
    //   const res1 = await api.getCloths()
    //   this.$set(this.yarnCommon._noPermutableCloth, 'dataSource', res1)
    //   // 染色适应性
    //   const res2 = ((await api.getSelectData({ enabled: 'Y', categoryId: 6 })).data || []).map(item => ({ label: item.name, value: item.uuid }))
    //   this.$set(this.yarnCommon._dyeingAdaptabiy, 'dataSource', res2)
    // }
  }
}
