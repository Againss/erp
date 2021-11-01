import { getProductPage } from '../api/index'
export const StartPutStorage = {
  data() {
    const addColumns = [
      {
        prop: 'selection',
        type: 'selection',
        minWidth: '55'
      },
      {
        prop: 'code',
        label: '产品编号',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'materielType',
        label: '物料类型',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            '0101': '天然纤维',
            '0102': '化学纤维',
            '0103': '组合纱',
            '0201': '坯布',
            '0202': '色布',
            '0203': '组合布',
            '0204': '花布'
          }
          return obj[scope.row.materielType] || ''
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
      }
    ]
    // 分页配置信息
    const pagination = {
      style: { 'text-align': 'left' },
      currentChange: val => {
        this.getProductPageFn({ pageSize: this.addPopOptions.content[3].pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.getProductPageFn({ pageNum: this.addPopOptions.content[3].pagination.pageNum || 1, pageSize: val })
      }
    }
    const addPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '产品信息',
      width: '900px',
      okText: '确认',
      formOptions: {
        inline: true
      },
      formDatas: {},
      ok: params => {
        const arr = this.addPopDataSource.flat()
        if (!arr.length) {
          this.$message({
            type: 'warning',
            message: '请选择产品项'
          })
          return
        }
        const res = arr.filter(ele => !this.list.find(e => e.id === ele.id && e.materielType === ele.materielType))
        this.list.push(...res)
        this.$set(this.addPopOptions, 'visible', !this.addPopOptions.visible)
      },
      cancel: params => {
        this.$set(this.addPopOptions, 'visible', !this.addPopOptions.visible)
      },
      className: 'StartPutStorage',
      content: [
        {
          prop: 'materielType',
          itemType: 'select',
          label: '产品分类:',
          dataSource: []
        },
        {
          prop: 'materiel',
          // prop: 'materiel["value"]',
          // prop: 'materiel[value]',
          // prop: 'materiel',
          itemType: 'input',
          label: '产品编号:'
        },
        {
          itemType: 'view',
          text: '搜索',
          style: {
            'width': '90px',
            'height': '36px',
            'line-height': '36px',
            'background': '#1890ff',
            'margin-left': '20px',
            'text-align': 'center',
            'color': '#fff',
            'border-radius': '4px',
            'cursor': 'pointer'
          },
          handle: (form, formDatas, setFormDatas) => {
            const data = JSON.parse(JSON.stringify(formDatas))
            data.tableForm && delete data.tableForm
            this.addPopDataSource = this.addPopPageData = []
            this.$set(this.addPopOptions, 'formDatas', data)
            this.getProductPageFn(data)
          }
        },
        {
          prop: 'productList',
          itemType: 'table',
          maxHeight: '300',
          highlightCurrentRow: false,
          itemStyle: {
            width: '100%'
          },
          tooltipEffect: 'dark',
          dataSource: [],
          columns: [],
          size: 'small',
          pagination,
          getTable: table => {
            this.tableList = table
          },
          selectionChange: data => {
            const pageIndex = this.addPopOptions.content[3].pagination.pageNum || 1
            this.addPopPageData[pageIndex] = data
          }
        }
      ]
    }
    return {
      addPopOptions,
      addColumns,
      addPopDataSource: [],
      addPopPageData: [],
      tableList: null
    }
  },
  methods: {
    // 点击增加产品
    showProductInfoDialog() {
      this.$set(this.addPopOptions.content[3].pagination, 'currentPage', 1)
      const value = this.$refs.putStorageInfo.dynamicValidateFormRuleForm.productType
      if (!value) {
        this.$message.error('请先选择货物类型')
        return
      }
      const dataSource = [
        { value: '0101', label: '天然纤维' },
        { value: '0102', label: '化学纤维' },
        { value: '0103', label: '组合纱' },
        { value: '0201', label: '坯布' },
        { value: '0202', label: '色布' },
        { value: '0203', label: '组合布' },
        { value: '0204', label: '花布' }
      ]
      this.addPopDataSource = this.addPopPageData = []
      this.$set(this.addPopOptions.content[3], 'dataSource', [])
      const column = this.$utils.deepClone(this.addColumns)
      if (value === 2) {
        this.$set(this.addPopOptions.content[0], 'dataSource', dataSource.slice(0, 3))
        this.$set(this.addPopOptions.content[3], 'columns', column.slice(0, 5))
        this.$set(this.addPopOptions, 'formDatas', { materielType: '0101' })
      } else {
        column.splice(4, 1)
        column[3].label = '布分类'
        this.$set(this.addPopOptions.content[0], 'dataSource', dataSource.slice(3))
        this.$set(this.addPopOptions.content[3], 'columns', column)
        this.$set(this.addPopOptions, 'formDatas', { materielType: '0201' })
      }
      this.$set(this.addPopOptions, 'visible', !this.addPopOptions.visible)
      this.getProductPageFn(this.addPopOptions.formDatas)
    },
    /* 返回列表 */
    backListPage() {
      this.$router.push({ path: '/wms/enter-manage/booking-manage' })
    },
    // 获取产品信息分页列表
    async getProductPageFn(data = {}) {
      const res = await getProductPage({ ...this.addPopOptions.formDatas, ...data })
      this.$set(this.addPopOptions.content[3], 'dataSource', res.data.list || [])
      const pagination = {
        ...this.addPopOptions.content[3].pagination,
        dataTotal: res.data && res.data.total || 0,
        pageNum: res.data && res.data.pageNum || 1,
        pageSize: res.data && res.data.pageSize || 20,
        currentPage: res.data && res.data.pageNum || 1
      }
      this.$set(this.addPopOptions.content[3], 'pagination', pagination)
      this.$set(this.addPopOptions.content[3], 'pagination', pagination)
      // 页面数据选中
      this.addPopOptions.content[3].dataSource.forEach((ele, i) => {
        const arr = [...this.addPopDataSource].flat().filter(e => e)
        const result = arr.find(e => e.id === ele.id)
        if (result && this.tableList && this.tableList.$refs.table) {
          this.$nextTick(() => {
            this.tableList.$refs.table.toggleRowSelection(ele, true)
          })
        }
      })
    }
  }
}
