// import * as api from '@/views/quality-manage/common/basisApi.js'
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
        dataSource: []

      },
      _nonPermutableColor: {
        prop: 'nonPermutableColor',
        itemType: 'select',
        valueType: 'object',
        // size: 'mini',
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
        rules: []

      },
      _dyeingAdaptabiy: {
        prop: 'dyeingAdaptabiy',
        itemType: 'select',
        valueType: 'object',
        // size: 'mini',
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
        dataSource: []

      },
      _noPermutableCloth: {
        prop: 'noPermutableCloth',
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
        rules: []

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
        rules: []

      },
      _reviewComments: {
        prop: 'reviewComments',
        itemType: 'input',
        // type: 'textarea',
        // autosize: { minRows: 2, maxRows: 4 },
        itemClassName: 'yarn-info-item info-item-disabled',
        // size: 'mini',
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
    //   // 颜色适应性
    //   const res2 = ((await api.getSelectData({ enabled: 'Y', categoryId: 6 })).data || []).map(item => ({ label: item.name, value: item.uuid }))
    //   this.$set(this.yarnCommon._dyeingAdaptabiy, 'dataSource', res2)
    // }
  }
}
