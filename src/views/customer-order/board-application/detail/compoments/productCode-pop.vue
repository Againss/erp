<!--
 * @name: 选择产品代码弹框
 * @description: 选择产品代码弹框
 * @author: panmr
 * @time: 2021-05-22 09:33:32
-->
<template>
  <div class="popOptionsCode">
    <cs-custom-popsearch ref="popOpForm" :options="popOptions" @close="popClose" />
  </div>
</template>
<script>
import { clothSelect, combinedSelect, assemblyIngredientSelect, pageRequirements } from '../api/index'
import LABEL from './label'

export default {
  name: 'ProducrtCode',
  components: {},
  mixins: [],
  data() {
    return {
      popOptions: {
        visible: false,
        title: '选择产品',
        width: '1280px',
        footerOptions: {
          content: [
            { name: '确认',
              type: 'primary',
              handle: (formDatas, form, table) => {
                if (this.currentRow && !this.currentRow.productCode) {
                  this.$message({ message: '请选择一条记录', type: 'warning' })
                  return
                }
                if (typeof this.currentRow === 'object') { // 删除id否则会造成编辑的时候新增数据
                  delete this.currentRow.id
                }
                this.$emit('save', this.currentRow)
                this.popOptions.visible = false
              }
            },
            { name: '取消',
              handle: (formDatas, form, table) => {
                this.popOptions.visible = false
                this.popOptions.popFormOptions.formDatas = {}
              }
            }
          ]
        },
        popFormOptions: {
          formDatas: {},
          formOptions: {
            // layout: true,
            syncDataHandle: (syncData) => {
              // console.log('pm', syncData)
            },
            inline: true,
            layout: true,
            labelWidth: '80px'
          },
          content: {
            _sourceNumber: { prop: 'sourceNumber', itemType: 'input', label: `${LABEL.sourceNumber}:`, itemStyle: { 'width': '25%', 'color': '#474747' }, placeholder: LABEL.placeholder.sourceNumber, clearable: true },
            _productCode: { prop: 'productCode', itemType: 'input', className: 'commonRemoteSearch', label: `${LABEL.productCode}:`, itemStyle: { 'width': '25%', 'color': '#474747' }, placeholder: LABEL.placeholder.productCode, clearable: true },
            _cylinderNumber: { prop: 'cylinderNumber', itemType: 'input', label: `${LABEL.cylinderNumber}:`, itemStyle: { 'width': '25%', 'color': '#474747' }, placeholder: LABEL.placeholder.cylinderNumber, clearable: true },
            _cloth: { prop: 'clothCategoryId', itemType: 'select', filterable: true, itemClassName: 'labelClassName', className: 'commonRemoteSearch', label: `${LABEL.cloth}:`, itemStyle: { 'width': '25%', 'color': '#474747' }, placeholder: LABEL.placeholder.cloth, clearable: true,
              dataSource: [], visibleChange: (value) => {
                if (value) {
                  this.getClothValue()
                }
              },
              rules: [{ required: true, message: '布类不能为空', trigger: 'change' }]
            },
            _element: { prop: 'ingredientsId', itemType: 'select', filterable: true, className: 'commonRemoteSearch', label: `${LABEL.element}:`, itemStyle: { 'width': '25%', 'color': '#474747' }, placeholder: LABEL.placeholder.element, clearable: true,
              dataSource: [], visibleChange: (value) => {
                if (value) {
                  this.getElementInfo()
                }
              }
            },
            _suggestWidth: { prop: 'clothWidth', itemType: 'input', label: `${LABEL.suggestWidth}:`, itemStyle: { 'width': '25%', 'color': '#474747' }, placeholder: LABEL.placeholder.suggestWidth, clearable: true },
            _suggestWeight: { prop: 'clothWeight', itemType: 'input', label: `${LABEL.suggestWeight}:`, itemStyle: { 'width': '25%', 'color': '#474747' }, placeholder: LABEL.placeholder.suggestWeight, clearable: true },
            _customerColor: { prop: 'customerColor', itemType: 'input', label: `${LABEL.customerColor}:`, itemStyle: { 'width': '25%', 'color': '#474747' }, placeholder: LABEL.placeholder.customerColor, clearable: true },
            _operate: { itemType: 'operate', submitText: '查询',
              submitHandle: params => {
                if (params && !Object.values(params).filter(n => n).length) {
                  this.$message({ message: '条件不能全为空', type: 'warning' })
                  return
                }
                if (!params.clothCategoryId) {
                  this.$message({ message: '布类不能为空', type: 'warning' })
                  return
                }
                this.popOptions.popFormOptions.formDatas = params
                this.load(this.popOptions.popFormOptions.formDatas)
              },
              resetHandle: () => {
                this.popOptions.popFormOptions.formDatas = {}
              }
            }
          }
        },
        popTableOptions: {
          loading: false,
          columns: [
            { prop: 'code', label: LABEL.code, minWidth: '50', showOverflowTooltip: true },
            { prop: 'sellerTeam', label: LABEL.sellerTeam, minWidth: '120', showOverflowTooltip: true, formater: scope => {
              return scope.row.sellerTeam ? scope.row.sellerTeam.label : '-'
            } },
            { prop: 'sourceNumber', label: LABEL.sourceNumber, minWidth: '140', showOverflowTooltip: true },
            { prop: 'productCode', label: LABEL.productCode, minWidth: '180', showOverflowTooltip: true },
            { prop: 'cylinderNumber', label: LABEL.cylinderNumber, minWidth: '120', showOverflowTooltip: true },
            { prop: 'yarnInfo', label: LABEL.yarnInfo, minWidth: '200', showOverflowTooltip: true },
            { prop: 'productInfo', label: LABEL.productInfo, minWidth: '200', showOverflowTooltip: true },
            { prop: 'barcode', label: LABEL.barcode, minWidth: '140', showOverflowTooltip: true },
            { prop: 'storageLocation', label: LABEL.storageLocation, minWidth: '100', showOverflowTooltip: true },
            { prop: 'availableQuantity', label: LABEL.availableQuantity, minWidth: '120', showOverflowTooltip: true }
          ],
          highlightCurrentRow: true,
          currentRowKey: 'id',
          rowClick: (row, column, event) => {
            this.currentRow = row
          },
          dataSource: [],
          pagination: {
            pageNum: 1,
            pageSize: 20,
            currentPage: 1,
            currentChange: val => this.load({ pageSize: this.popOptions.popTableOptions.pagination.pageSize || 20, pageNum: val }),
            sizeChange: val => this.load({ pageNum: this.popOptions.popTableOptions.pagination.page || 1, pageSize: val })
          }
        }
      },
      currentRow: {} // 当前单击行
    }
  },
  created() {
    // this.load()
  },
  methods: {
    popClose() {},
    // 布类下拉框
    async getClothValue() {
      const { code = 0, data = [] } = await clothSelect()
      if (code === 200) {
        this.popOptions.popFormOptions.content['_cloth'].dataSource = data.map(n => ({ label: n.name, value: n.uuid }))
      }
    },
    // 成份下拉框
    getElementInfo() {
      Promise.all([combinedSelect({ enabled: 'Y' }), assemblyIngredientSelect({ enabled: 'Y' })]).then((res = []) => {
        const arr = []
        if (res.length === 2) {
          const [first = { code: 0, data: [] }, second = { code: 0, data: [] }] = res
          if (first && first.code === 200) { // 第一个请求响应的成功
            for (const element of first.data) {
              // push之前查看在arr中是否存在相同的value值（uuid），存在就略过，不存在就push(去重)
              // const values = arr.map(n => n.value) // value 存的是uuid
              // if (element.uuid && !values.includes(element ? element.uuid : element.id)) {
              //   arr.push({ label: element.name, value: element.uuid })
              // }
              arr.push({ label: element.name, value: element.uuid })
            }
          }
          if (second && second.code === 200) { // 第二个请求响应的成功
            for (const element of second.data) {
              // push之前查看在arr中是否存在相同的value值（uuid），存在就略过，不存在就push(去重)
              // const values = arr.map(n => n.value) // value 存的是uuid
              // if (element.uuid && !values.includes(element.uuid)) {
              //   arr.push({ label: element.name, value: element.uuid })
              // }
              arr.push({ label: element.name, value: element.uuid })
            }
          }
        }
        this.popOptions.popFormOptions.content['_element'].dataSource = arr
      })
    },
    // 表格行单击
    rowClick(row, column, event) {
      this.currentRow = Object.assign({}, row)
    },
    save(callback) {
      // 把选择的那一行数据以回调函数传参的方式暴露到外面
      callback(this.currentRow)
    },
    // 获取列表数据
    async load(params = {}) {
      this.popOptions.popTableOptions.loading = true
      const { code = 0, data = { list: [], total: 0 }} = await pageRequirements(params)
      if (code === 200) {
        this.popOptions.popTableOptions.dataSource = data && data.list && data.list.map((item, index) => ({ code: (data.pageNum - 1) * data.pageSize + index + 1, ...item })) || []
        this.popOptions.popTableOptions.pagination = { ...this.popOptions.popTableOptions.pagination, dataTotal: data && data.total || 0, currentPage: data && data.pageNum || 1, pageSize: data && data.pageSize || 20 }
      } else {
        this.popOptions.popTableOptions.dataSource = []
        this.popOptions.popTableOptions.pagination = { ...this.popOptions.popTableOptions.pagination, dataTotal: 0, ...params, currentPage: params.pageNum }
      }
      this.popOptions.popTableOptions.loading = false
    },
    init() {
      this.popOptions.visible = true
      this.$nextTick(() => {
        this.popOptions.popTableOptions.dataSource = []
        this.popOptions.popTableOptions.pagination = {
          currentChange: val => this.load({ pageSize: this.popOptions.popTableOptions.pagination.pageSize || 20, pageNum: val }),
          sizeChange: val => this.load({ pageNum: this.popOptions.popTableOptions.pagination.page || 1, pageSize: val })
        }
        this.currentRow = {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.popOptionsCode {
  .labeClassPadding{
    padding-right: 0px !important;
  }
  .labeClassName{
    &.labeClassRight{
      padding-right: 0px !important;
    }
    &.labeClassCOM{
      padding-right: 30px !important;
    }
    label {
      line-height: 18px;
      margin-left: 10px;
      white-space: pre-line;
    }
  }
  /deep/ .labelClassName {
    padding-right: 15px
  }
}
</style>
