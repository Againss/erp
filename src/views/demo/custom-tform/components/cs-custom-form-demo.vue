/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div class="search">
    <div class="custom-demo-title">cs-custom-form demo:</div>
    <cs-custom-form ref="searchForm" :form-datas="searchFormDatas" :data-source="searchData" :options="formOptions" />
    <div><el-button type="primary" @click="change">{{ info }}</el-button></div>
    <cs-custom-popsearch :options="popOptions" />
  </div>
</template>

<script>
import uploadSlotTip from './upload-slot-tip' // eslint-disable-line
import uploadSlotTrigger from './upload-slot-trigger' // eslint-disable-line
import uploadNoSlot from './upload-no-slot' // eslint-disable-line
import formCustom from './form-custom'
import { countryPage } from './api.js'
import { _debounce, debounceAsync, _debounceAsync } from '@/utils' // eslint-disable-line

export default {
  components: {},
  data() {
    const searchData = {
      // todo 注意此处的_state等其他key， 必须是下划线开头
      _state: {
        prop: 'state',
        itemType: this.selectTypeChange,
        label: '状态:',
        multiple: true,
        drag: true,
        valueType: 'object', // todo 当select取值需要是对象的时候必须传valueType且值为object，默认不传valueType select取值为string,可以注释改行看打印的值的区别
        itemStyle: { width: '25%' },
        valueKey: 'value', // todo 当select取值需要是对象的时候必须传valueKey,与dataSource里面的value对应
        renderOptions: (item) => {
          return `<span style="display: flex"><img src =${item.img} style="width: 28px;height:28px"/><span style="margin-left: 10px">${item.label}</span></span>`
        },
        renderContent: (item) => {
          let html = ''
          item.forEach(v => {
            html += v.label + ' '
          })
          return html
        },
        dataSource: [
          {
            value: '2',
            label: '成功',
            img: '/static/other/image/user.gif'
          },
          {
            value: '1',
            label: '胜利',
            img: '/static/other/image/user.gif'
          }
        ]
      },
      _name: {
        prop: 'name',
        itemType: this.inputTypeChange,
        itemStyle: { width: '25%' },
        label: '姓名:',
        // title: false,
        title: (value) => {
          return value + '123'
        },
        change: (value) => { // todo 此处是修改示例
          this.$set(this.searchData._name3, 'label', value)
          if (value === 'hide') {
            this.$set(this.searchData._name, 'isShow', false)
          }
        },
        placeholder: '输入hide试试'
      },
      _itemview: {
        prop: 'itemview',
        itemType: 'itemview',
        label: '图片',
        itemStyle: { width: '25%' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<a title="${value}" href=${value} target="_blank" style="color: #0f89f3;text-decoration: underline; ">点击打开</a>`
        }
      },
      _name3: {
        prop: 'name3',
        itemType: this.inputTypeChange,
        itemStyle: { width: '25%' },
        label: '姓名3:',
        placeholder: '请输入姓名',
        focus: (event, form, formDatas, setFormDatas, scope) => {
          event.target.blur()
          this.popHandle()
          this.getData()
        }
      },
      _name4: {
        rowStyle: { width: '25%' },
        // children可以为对象也可以为数组，如果业务逻辑较多需要对每个子元素进行属性修改 建议用对象会方便很多
        children: {
          _areaTelRowC1: {
            prop: 'nameRowC1',
            itemType: this.dateTypeChange,
            label: '行内:',
            span: 12,
            itemStyle: { paddingRight: '0px' },
            placeholder: '请选择',
            renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
              return `<span title=${formDatas.nameRowC1}-${formDatas.nameRowC3}>${formDatas.nameRowC1}-${formDatas.nameRowC3}</span>`
            }
          },
          _nameRowC2: {
            prop: 'nameRowC2',
            itemType: 'view',
            text: '-',
            span: 2,
            isShow: () => {
              if (this.type === 'edit') {
                return true
              }
              return false
            },
            style: { textAlign: 'center', lineHeight: '36px' },
            labelWidth: '0'
          },
          _nameRowC3: {
            prop: 'nameRowC3',
            span: 10,
            itemType: this.dateTypeChange,
            label: '',
            isShow: () => {
              if (this.type === 'edit') {
                return true
              }
              return false
            },
            labelWidth: '0',
            placeholder: '请选择'
          }
        }
        // children: [
        //   {
        //     prop: 'nameRowC1',
        //     itemType: 'input',
        //     label: '行内输入1',
        //     span: 12,
        //     itemStyle: { paddingRight: '0px' },
        //     placeholder: '请输入'
        //   },
        //   {
        //     prop: 'nameRowC2',
        //     itemType: 'view',
        //     text: '-',
        //     span: 1,
        //     style: { textAlign: 'center', lineHeight: '36px' },
        //     labelWidth: '0'
        //   },
        //   {
        //     prop: 'nameRowC3',
        //     span: 11,
        //     itemType: 'input',
        //     label: '',
        //     labelWidth: '0',
        //     placeholder: '请输入'
        //   }
        // ]
      },
      // _upload: {
      //   prop: 'upload',
      //   itemType: 'upload',
      //   label: '上传文件',
      //   autoUpload: false,
      //   content: [
      //     {
      //       slot: 'tip',
      //       component: uploadSlotTip
      //     },
      //     {
      //       component: uploadNoSlot
      //     },
      //     {
      //       slot: 'trigger',
      //       component: uploadSlotTrigger
      //     }
      //   ],
      //   placeholder: '请输入姓名'
      // },
      // {
      //   prop: 'inputNumberDemo',
      //   itemType: 'input-number',
      //   label: 'demo',
      //   placeholder: '请选择'
      // },
      _date: {
        itemType: this.dateTypeChange,
        itemStyle: { width: '25%' },
        prop: 'date',
        label: '日期:',
        placeholder: '请选择日期',
        // type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd'
        // rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }]
      },
      _custom: {
        popoverOptions: {
          placement: 'bottom'
        },
        // showMessage: false,
        itemType: this.inputTypeChange,
        itemStyle: { width: '25%' },
        prop: 'custom',
        label: '比例:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
        },
        components: [formCustom]
      },
      _operate: {
        itemType: 'operate',
        submitHandle: params => {
          console.log(params)
        },
        submitText: '查询',
        resetHandle: () => {
          console.log('重置')
        }
      }
    }
    const columns = {
      // todo 注意此处的_name等其他key， 必须是下划线开头
      _id: {
        prop: 'id',
        label: 'id',
        width: '50'
      },
      _name: {
        prop: 'name',
        label: '中文名',
        width: '200'
      },
      _nameEn: {
        prop: 'nameEn',
        label: '英文名',
        width: '200'
      },
      _abbr: {
        prop: 'abbr',
        label: '简称',
        width: '200'
      },
      _remark: {
        prop: 'remark',
        label: '备注'
      }
    }
    const pagination = {
      pageSizes: [10, 20, 50, 100],
      currentChange: val => {
        this.getData({ pageSize: this.popOptions.popTableOptions.pageSize || 10, page: val, currentPage: val })
      },
      sizeChange: val => {
        this.$set(this.popOptions.popTableOptions.pagination, 'currentPage', 1)
        this.getData({ page: 1, pageSize: val, currentPage: 1 })
      }
    }
    const popOptions = {
      visible: false,
      title: '搜索功能',
      footerOptions: {
        content: [
          {
            name: '确认',
            type: 'primary',
            handle: (formDatas, form, table) => {
              console.log(formDatas, form, table)
              if (!this.currentRow) {
                this.$message({
                  message: '请选择一条记录',
                  type: 'warning'
                })
                return
              }
              const row = { ...this.currentRow }
              this.currentRow = null
              console.log(row, this.currentRow)
              this.popHandle()
            }
          },
          {
            name: '取消',
            handle: (formDatas, form, table) => {
              console.log(formDatas, form, table)
              this.popHandle()
            }
          }
        ]
      },
      popFormOptions: {
        content: {
          _name: {
            prop: 'name',
            itemType: 'input',
            itemStyle: { width: '25%' },
            label: '姓名',
            placeholder: '请输入姓名'
          },
          _operate: {
            itemType: 'operate',
            submitHandle: params => {
              this.popsearchFormDatas = params
              this.getData(params)
            },
            submitText: '查询',
            resetHandle: (params) => {
              console.log('重置')
              this.popsearchFormDatas = {}
            }
          }
        },
        formOptions: {
          // layout: true,
          syncDataHandle: (syncData) => {
            console.log(syncData)
            // this.popsearchFormDatas = syncData
          },
          inline: true
          // popError: true
        }
      },
      popTableOptions: {
        columns,
        highlightCurrentRow: true,
        currentRowKey: 'id',
        rowClick: (row, column, event) => {
          this.currentRow = row
          console.log(row, column, event)
        },
        dataSource: [],
        pagination
      }
    }
    return {
      searchFormDatas: { name: '姓名', name3: 'cs', nameRowC1: '2021-04-06', nameRowC3: '2021-04-09', itemview: '/static/other/image/user.gif', state: [{ value: '2', label: '成功', img: '/static/other/image/user.gif' }], custom: '1/2/97' },
      searchData,
      popOptions,
      type: 'edit',
      popsearchFormDatas: {},
      pagination,
      formOptions: {
        layout: true,
        inline: true
      }
    }
  },
  computed: {
    info() {
      if (this.type === 'edit') {
        return '切换只读状态（防抖）'
      }
      return '切换编辑状态（防抖）'
    }
  },
  watch: {
    '$route': {
      handler(val, oldVal) {
        const { query } = val
        this.type = query.status === '1' ? 'edit' : 'read'
      },
      deep: true,
      immediate: true
    },
    type: {
      handler(val, oldVal) {
        let num = 12
        if (val !== 'edit') {
          num = 24
        }
        this.searchData._name4.children._areaTelRowC1.span = num
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    getType() {
      return this.type
    },
    inputTypeChange() {
      if (this.type === 'edit') {
        return 'input'
      }
      return 'itemview'
    },
    dateTypeChange() {
      if (this.type === 'edit') {
        return 'date'
      }
      return 'itemview'
    },
    selectTypeChange() {
      if (this.type === 'edit') {
        return 'select'
      }
      return 'itemview'
    },
    // todo 异步防抖(_debounceAsync)和同步防抖（_debounce）根据实际场景使用

    // todo 异步防抖(debounceFetch和@_debounceAsync)随便用哪一种
    // @_debounce(500)// todo 1、同步间隔防抖
    @_debounceAsync()// todo 2、异步装饰器防抖
    async change(val) {
      console.log('防抖开启')
      // this.$router.push({ path: '/tform', query: { status: this.type, timestamp: 123123 }})
      this.type = this.type === 'edit' ? 'read' : 'edit'
      await new Promise((resolve, reject) => { setTimeout(function() { resolve('ok') }, 1000) })
    },
    // todo 3、函数防抖使用方式
    // change: debounceAsync(async function() {
    //   console.log(123)
    //   // this.$router.push({ path: '/tform', query: { status: this.type, timestamp: 123123 }})
    //   this.type = this.type === 'edit' ? 'read' : 'edit'
    //   await new Promise((resolve, reject) => { setTimeout(function() { resolve('ok') }, 1000) })
    // }),
    popHandle() {
      this.popsearchFormDatas = {}
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
    },
    async getData(data = {}) {
      const params = { ...this.popsearchFormDatas, ...data }
      const tableData = await countryPage(params)
      const res = tableData.data
      const list = res.list || []
      const pagination = {
        ...this.popOptions.popTableOptions.pagination,
        ...data,
        dataTotal: res.total,
        currentPage: res.page,
        pageSize: res.pageSize,
        page: res.page
      }
      this.$set(this.popOptions.popTableOptions, 'dataSource', list)
      this.$set(this.popOptions.popTableOptions, 'pagination', pagination)
    }
  }
}
</script>

<style lang="scss" scoped>
    .table{ padding-bottom: 10px;}
    .custom-demo-title{ font-size: 16px; padding: 10px; font-weight: bold; padding: 10px}
</style>
