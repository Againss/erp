<!--
 * @Descripttion:条形码添加弹窗
 * @version:
 * @Author: xj
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-03 10:07:27
-->
<template>
  <div ref="popOptionsCode" lass="pop">
    <cs-custom-popsearch
      ref="popOpForm"
      class="popOptions_codes"
      :options="popOptions"
      @close="popClose"
    />
  </div>
</template>

<script>
import moreShow from '@/views/customer-order/public/components/moreShow'
import { RecordsSearch, RecordAdd, swatchSearch, swatchAdd } from '../api/index'
export default {
  name: 'CodePop',
  components: {},
  props: {
    tab: {
      type: String
    },
    setParentDataHandle: {
      type: Function
    }
  },
  data() {
  // 纱线编码分页
    const pagination = {
      pageSizes: [10, 20, 50, 100],
      currentChange: val => {
        this.getData({ pageSize: this.popOptions.popTableOptions.pageSize || 10, pageNum: val, currentPage: val })
      },
      sizeChange: val => {
        this.$set(this.popOptions.popTableOptions.pagination, 'currentPage', 1)
        this.getData({ pageNum: 1, pageSize: val, currentPage: 1 })
      }
    }
    const columns = {
      _index: {
        prop: 'index',
        label: '序号',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _receiveCode: {
        prop: 'receiveCode',
        label: '收布条码',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.receiveCode || '-'
        }
      },
      _applyCode: {
        prop: 'applyCode',
        label: '申请单号',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.applyCode || '-'
        }
      },
      _productInfo: {
        prop: 'productInfo',
        label: '产品信息',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'productInfo'
        }
      },
      _cutSampleRequirements: {
        prop: 'cutSampleRequirements',
        label: '剪板要求',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cutSampleRequirements || '-'
        }
      },
      _tagLanguage: {
        prop: 'tagLanguage',
        label: '标签语言',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.tagLanguage === 1 ? '中文' : (scope.row.tagLanguage === 2 ? '英文' : '-')
        }
      },
      _proposerName: {
        prop: 'proposerName',
        label: '申请人',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.proposerName || '-'
        }
      }
    }
    const coYarnNaturalFiberSearchReq = {// 天然纤维请求参数 ,CoYarnNaturalFiberSearchReq
      _receiveCode: {
        prop: 'receiveCode',
        itemType: 'input',
        itemStyle: { width: '25%', 'padding-right': '15px;' },
        itemClassName: 'labeClassPadding',
        label: '收布条码:',
        clearable: true
      },
      _operate: {
        itemType: 'operate',
        submitHandle: params => {
          if (!params.receiveCode) {
            this.$message({ type: 'error', message: '条码不能为空' })
            return false
          } else if (this.SameBarcode(params.receiveCode)) {
            this.$message({ type: 'error', message: '已存在相同条码' })
            return false
          } else {
            this.getData(params)
            this.popsearchFormDatas = params
          }
        },
        submitText: '添加',
        resetHandle: (params) => {
          this.popsearchFormDatas = {}
        }
      }
    }
    const popOperatesDataSource = [
      {
        label: '删除',
        isShow: true,
        handle: (scope, form, formDatas, setFormDatas) => {
          this.$confirm('确认删除该收布条码？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              const som = this.$utils.deepClone(this.getPopForm)
              som.splice(scope.$index, 1)
              this.$set(this.popOptions.popTableOptions, 'dataSource', som)
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    // 列表操作栏按钮
    const operates = {
      label: '操作',
      width: '120',
      moreOptions: {
        maxLength: 2// 最大超过多少个显示more功能，默认为2
      },
      dataSource: popOperatesDataSource
    }
    // 纱线编码搜索组件
    const popOptions = {
      visible: false,
      title: '搜索功能',
      width: '1235px',
      footerOptions: {
        content: [
          {
            name: '确认',
            handle: (formDatas, form, table) => {
              this.OkClick()
            }
          },
          {
            name: '取消',
            handle: (formDatas, form, table) => {
              this.popHandle()
            }
          }

        ]
      },
      popFormOptions: {
        content: {},
        formOptions: {
          syncDataHandle: (syncData) => {
            // console.log('pm', syncData)
          },
          inline: true,
          labelWidth: '80px'
        }
      },
      popTableOptions: {
        columns,
        highlightCurrentRow: true,
        currentRowKey: 'id',
        rowClick: (row, column, event) => {
          this.currentRow = row
        },
        dataSource: [],
        pagination,
        operates
      }
    }
    return {
      activeName: '1',
      popOptions,
      pagination,
      operates,
      popsearchFormDatas: {}, // /弹窗搜索组件
      coYarnNaturalFiberSearchReq // 天然纤维请求参数 ,CoYarnNaturalFiberSearchReq
    }
  },
  computed: {
    getPopForm() { // 表格数据
      return this.popOptions.popTableOptions.dataSource
    }
  },
  watch: {
    tab: {// 深度监听，可监听到对象、数组的变化
      handler(val) {
        this.setmaterialInfoPage(val)
      },
      deep: true,
      immediate: true
    },
    'popOptions.visible': {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val) {
          this.getCloe()
        }
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    popHandle(activeName) { // 纱线编码显隐
      this.popsearchFormDatas = {}
      this.activeName = activeName
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
    },
    async getData(data = {}) {
      const params = { ...data, type: this.tab }
      let tableData = ''
      if (this.tab === '1') {
        tableData = await RecordsSearch(params)
      } else {
        tableData = await swatchSearch(params)
      }
      const res = tableData.data || ''
      const pagination = {
        ...this.popOptions.popTableOptions.pagination,
        ...data,
        dataTotal: res.total || 0,
        currentPage: res.pageNum || 0,
        pageSize: res.pageSize || 1,
        pageNum: res.pageNum || 1
      }
      if (!res) {
        this.$message({ message: '查询无结果', type: 'warning' })
        return false
      } else {
        this.getPopForm.unshift(res)
        this.$set(this.popOptions.popTableOptions, 'dataSource', this.getPopForm)
        this.$set(this.popOptions.popTableOptions, 'pagination', pagination)
      }
    },
    setmaterialInfoPage(val) { // 根据不同的状态
      const com = this.$utils.deepClone(this.popOptions)
      com.popFormOptions.content = this.coYarnNaturalFiberSearchReq
      if (val === '1') {
        const con = {
          name: '确认并打印',
          handle: (formDatas, form, table) => {
            this.OkClick('2')
          }
        }
        com.footerOptions.content.push(con)
      } else {
        if (com.footerOptions.content.length > 2) { com.footerOptions.content.splice(2, 1) }
      }
      this.$nextTick(() => { this.popOptions = com })
    },
    popClose() {
      this.currentRow = null
      this.popsearchFormDatas = {}
      this.popOptions.popTableOptions.dataSource = []
    },
    async OkClick(data = '1') { // 确定按钮
      if (!this.getPopForm.length) {
        this.$message({ message: '请先添加一条数据', type: 'warning' })
        return
      }
      // const test = [
      //   { receiveCode: '1', name: 'panmr' },
      //   { receiveCode: '2', name: 'panmr2' }
      // ]
      let res = ''
      if (this.activeName === '1') {
        res = await RecordAdd({ cutSampleRecords: this.getPopForm })
      } else {
        res = await swatchAdd({ receiveCodes: this.getPopForm.map(n => n.receiveCode) })
      }
      if (res.code !== 200) { return false }
      this.$message.success('添加成功')
      this.setParentDataHandle('OkClick', { cutSampleRecords: this.getPopForm, type: data })
      this.popHandle()
    },
    // 判断数据是否有相同条码
    SameBarcode(receiveCode) {
      const com = this.$utils.deepClone(this.getPopForm)
      if (!com.length) { return false } else {
        return com.some((item) => { return item.receiveCode === receiveCode })
      }
    },
    getCloe() {
      this.popOptions.popTableOptions.dataSource = []
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .popOptions_codes {
  .labeClassPadding {
    margin-right: 15px !important;
  }
}
</style>
