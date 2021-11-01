/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div class="table">
    <div class="custom-demo-title">cs-custom-table pop模式demo:</div>
    <div class="page-table">
      <cs-custom-table
        row-key="id"
        :columns="columns"
        :col-drag="colDrag"
        :row-drag="rowDrag"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :static-page="true"
        edit-type="pop"
        @selection-change="selectionChange"
        @header-contextmenu="headerContextmenu"
      />
    </div>

    <div class="pop">
      <cs-custom-pop ref="pop" :options="popOptions" />
    </div>
  </div>
</template>

<script>

import popoverColumn from '@/views/demo/custom-tform/components/popover-column'
import tableFormCustom from '@/views/demo/custom-tform/components/table-form-custom'
import stateColumn from '@/views/demo/custom-tform/components/state-column'
import areaTel from '@/views/demo/custom-tform/components/area-tel'
import selectSourceConfig from '@/views/demo/custom-tform/config/select-source-config'
import selectColumns from '@/views/demo/custom-tform/config/select-columns'

export default {
  components: {},
  data() {
    const columns = {
      // todo 注意此处的_name等其他key， 必须是下划线开头
      _name: {
        prop: 'name',
        label: '姓名',
        sortable: true,
        width: '200',
        popoverOptions: {
          formater: (scope) => { return `我是格式化后的内容 ${scope.row[scope.column.property]}` }
        }
      },
      _date: {
        prop: 'date',
        label: '日期',
        width: '200',
        sortable: true,
        handle: scope => {
          console.log(scope)
        }
      },
      _subject: {
        prop: 'subject',
        label: '跳转',
        width: '200',
        handle: scope => {
          this.$router.push('/')
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      _children: {
        label: '标题/地址/信息',
        prop: 'children',
        child: [
          {
            label: '标题和地址',
            prop: 'children',
            child: [
              {
                prop: 'address',
                label: '地址',
                formater: scope => {
                  return `格式化后-${scope.row[scope.column.property]}`
                }
              },
              {
                prop: 'title',
                label: '标题',
                width: '200',
                components: {
                  popoverColumn
                }
              }
            ]
          },
          {
            prop: 'info',
            label: '描述'
          }
        ]
      },
      _state: {
        prop: 'state',
        label: '状态',
        width: '160',
        components: {
          stateColumn
        },
        componentsOptions: {
          handle: () => {
            console.log()
          }
        }
      }
    }
    const selection = {
      selection: true,
      selectionLabel: '全部'
    }
    const dataSource = [
      {
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        subject: '跳转1',
        address: '上海市普陀区金沙江路 1518 弄',
        title: '我是1',
        info: '描述信息1',
        edit: false,
        state: '2'
      },
      {
        id: 2,
        date: '2017-05-03',
        name: '王二虎',
        subject: '跳转2',
        address: '上海市普陀区金沙江路 1517 弄',
        title: '我是2',
        editRowType: 'pop',
        info: '描述信息2',
        edit: false,
        state: '2'
      },
      {
        id: 3,
        date: '2016-05-03',
        name: '王小虎',
        subject: '跳转',
        editRowType: 'jump',
        address: '上海市普陀区金沙江路 1518 弄',
        title: '我是',
        info: '描述信息3',
        edit: false,
        state: '1'
      }
    ]
    const popOperates = {
      label: '操作',
      width: '200',
      moreOptions: {
        maxLength: 2// 最大超过多少个显示more功能，默认为2
      },
      dataSource: [
        {
          label: '修改',
          isShow: (scope) => {
            return true
          },
          handle: params => {
            console.log(params)
            this.PopDialogHandle()
            this.setFormDatas({
              ...params.row
              // trees: [
              //   {
              //     id: 11,
              //     name: '三级 1-1-3'
              //   }
              // ]
            })
          }
        },
        {
          label: '删除',
          isShow: true,
          handle: async(params) => {
            console.log(params)
            const res = await this.$uiUtils.confirmMsg()
            if (res) {
              console.log('确认删除')
            } else {
              console.log('取消删除')
            }
          }
        },
        {
          label: '其他1',
          isShow: true,
          handle: params => {
            console.log(params)
          }
        },
        {
          label: '其他2',
          isShow: (scope) => {
            return true
          },
          handle: params => {
            console.log(params)
          }
        }
      ]
      // components: { operatesColumn }
    }
    const pagination = {
      pageSize: 2,
      pageSizes: [2, 5, 10, 20, 50, 100]
      // layout: 'prev, pager, next, jumper, total',
    }
    const nameReg = this.$getRules({ message: '请输入姓名' })
    const ruleRequire = this.$getRules({})
    // const validator = (rule, value, callback) => {
    //   console.log(this.validatas)
    //   console.log(rule, value, callback)
    //   callback()
    // }
    const tableFormDataSource = [
      {
        id: 1,
        date: '2016-05-01',
        name: '王1虎',
        title: '1',
        custom: '1/1/98',
        titleEdit: false,
        edit: true
      },
      {
        id: 2,
        date: '2016-05-02',
        name: '王2虎',
        title: '2',
        custom: [7, 1, 92],
        edit: true
      },
      {
        id: 3,
        date: '2016-05-03',
        name: '王3虎',
        title: '3',
        custom: { a: 2, b: 3, c: 95 },
        edit: true
      }
    ]
    const tableFormColumns = {
      _selection: {
        align: 'center',
        prop: 'selection',
        type: 'selection',
        label: '多选'
      },
      _name: {
        prop: 'name',
        label: '姓名',
        // sortable: true,
        // width: '200',
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          rules: [
            { required: true, message: '姓名不能为空', trigger: ['change'] }
          ],
          dataSource: [
            {
              value: '王小虎',
              label: '王小虎'
            },
            {
              value: '王二虎',
              label: '王二虎'
            }
          ]
        }
      },
      _title: {
        prop: 'title',
        label: '标题',
        popoverOptions: {
          formater: (scope) => { return `我是格式化后的内容 ${scope.row[scope.column.property]}` }
        },
        // width: '200',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          rules: [
            ruleRequire
          ]
        }
      },
      _custom: {
        popoverOptions: {
          placement: 'left'
        },
        prop: 'custom',
        label: '自定义组件',
        rules: [ruleRequire],
        components: [tableFormCustom]
      },
      _date: {
        prop: 'date',
        label: '日期',
        width: '160',
        // sortable: true,
        editOptions: {
          labelWidth: '0px',
          itemType: 'date',
          rules: [
            { required: true, message: '日期不能为空', trigger: ['change'] }
          ]
        },
        handle: scope => {
          console.log(scope)
        }
      }
    }
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      // okHidden: true,
      okText: '提交',
      cancelText: '取消',
      // cancelHidden: true,
      ok: params => {
        console.log(params)
      },
      // saveAndadd: params => {
      //   console.log(params)
      // },
      cancel: params => {
        this.PopDialogHandle()
        console.log(params)
      },
      formDatas: {
        // trees: [12, 13]
      },
      formOptions: {
        syncDataHandle: (syncData) => {
          console.log(syncData)
          this.validatas = syncData
          // this.popsearchFormDatas = syncData
        },
        validate: (flag, res, err) => {
          // console.log(flag, res, err)
        },
        popError: true
        // labelWidth: 'auto'
      },
      content: {
        _areaTelrow: {
          // children可以为对象也可以为数组，如果业务逻辑较多需要对每个子元素进行属性修改 建议用对象会方便很多
          children: {
            _areaTelRowC1: {
              prop: 'areaTelRowC1',
              itemType: 'input',
              label: '行内输入',
              rules: [ruleRequire],
              span: 12,
              placeholder: '请输入'
            },
            _areaTelRowC2: {
              prop: 'areaTelRowC2',
              itemType: 'view',
              text: '-',
              span: 1,
              style: { textAlign: 'center', lineHeight: '36px' },
              labelWidth: '0'
            },
            _areaTelRowC3: {
              prop: 'areaTelRowC3',
              span: 11,
              itemType: 'input',
              label: '',
              labelWidth: '0',
              rules: [ruleRequire],
              placeholder: '请输入'
            }
          }
          // children: [
          //   {
          //     prop: 'areaTelRowC1',
          //     itemType: 'input',
          //     label: '行内输入1',
          //     rules: [ruleRequire],
          //     span: 12,
          //     placeholder: '请输入'
          //   },
          //   {
          //     prop: 'areaTelRowC2',
          //     itemType: 'view',
          //     text: '-',
          //     span: 1,
          //     style: { textAlign: 'center', lineHeight: '36px' },
          //     labelWidth: '0'
          //   },
          //   {
          //     prop: 'areaTelRowC3',
          //     span: 11,
          //     itemType: 'input',
          //     label: '',
          //     labelWidth: '0',
          //     rules: [ruleRequire],
          //     placeholder: '请输入'
          //   }
          // ]
        },
        _areaTel: {
          components: {
            areaTel
          }
        },
        _state: {
          prop: 'state',
          itemType: 'select',
          label: '状态',
          loadMore: () => {
            console.log('滚动到底部触发')
            const newData = [...this.popOptions.content._state.dataSource]
            const len = newData.length
            this.popOptions.content._state.dataSource.forEach((v, i) => {
              const value = len + i + 1
              const label = '成功' + value
              newData.push({ label, value })
            })
            this.$set(this.popOptions.content._state, 'dataSource', newData)
          },
          change: value => {
            console.log(value)
          },
          rules: [
            { required: true, message: '请选择状态', trigger: ['change'] }
          ],
          dataSource: [
            {
              value: '1',
              label: '成功'
            },
            {
              value: '2',
              label: '成功2'
            },
            {
              value: '3',
              label: '成功3'
            },
            {
              value: '4',
              label: '成功4'
            },
            {
              value: '5',
              label: '成功5'
            },
            {
              value: '6',
              label: '成功6'
            },
            {
              value: '7',
              label: '成功7'
            },
            {
              value: '8',
              label: '成功8'
            },
            {
              value: '9',
              label: '成功9'
            },
            {
              value: '10',
              label: '成功10'
            }
          ]
        },
        _name: {
          prop: 'name',
          itemType: 'input',
          label: '姓名',
          rules: [nameReg],
          placeholder: '请输入姓名'
        },
        _color: {
          prop: 'color',
          itemType: 'color-picker',
          label: '颜色选择器'
        },
        _tableFormV: {
          prop: 'tableFormV',
          rowKey: 'id',
          itemType: 'table-form',
          // label: '表格表单',
          props: { edit: 'edit' },
          // rowClick: (...rest) => {
          //   console.log(...rest)
          // },
          colDrag: {
            onEnd: (evt, newColumns) => {
              this.popOptions.content._tableFormV.columns = newColumns
            }
          },
          rowDrag: {
            onEnd: (evt, newDataSource) => {
              this.popOptions.content._tableFormV.dataSource = newDataSource
            }
          },
          syncFormDatasToDataSource: false,
          dataSource: tableFormDataSource,
          columns: tableFormColumns
        },
        _tabsV: {
          prop: 'tabsV',
          itemType: 'tabs',
          label: '',
          type: 'card',
          labelWidth: '0',
          placeholder: '请输入姓名',
          dataSource: [{
            label: '标签一',
            value: '1'
          }, {
            label: '标签二',
            value: '2'
          }]
        },
        _tableSearchV: {
          prop: 'tableSearchV',
          itemType: 'table-search',
          label: '表格数据',
          // labelWidth: '0',
          tableOptions: {
            rowKey: 'id',
            useDefaultOperate: true,
            operates: {
              label: '请选择'
            },
            selectedType: 'object',
            isPopTable: true,
            selectedTitle: '已选择',
            selectTitle: '待选择',
            needSearch: true,
            props: { label: 'info' },
            dataSource: selectSourceConfig,
            columns: selectColumns
          },
          searchOptions: {
            inputChange: (value) => {
              console.log(value)
            },
            type: 'textarea'
          }
        },
        _icon: {
          prop: 'icon',
          itemType: 'icon',
          label: '图标',
          rules: [ruleRequire],
          placeholder: '请选择图标'
        },
        _trees: {
          prop: 'trees',
          itemType: 'tree',
          label: '选择',
          popoverOptions: {
            width: '800',
            title: '选择部门'
          },
          treeOptions: {
            props: {
              label: 'name',
              children: 'child'
            },
            isPopTree: true,
            checkStrictly: false,
            treeSelectTitle: '请选择',
            span: [12, 12],
            treeSelectedTitle: '已选择',
            data: [
              {
                id: 1,
                name: '一级 1',
                child: [
                  {
                    id: 4,
                    name: '二级 1-1',
                    child: [
                      {
                        id: 9,
                        name: '三级 1-1-1',
                        child: [
                          {
                            id: 12,
                            name: '三级 1-1-1-1',
                            isLayout: true
                          },
                          {
                            id: 13,
                            name: '三级 1-1-1-2',
                            isLayout: true
                          }
                        ]
                      },
                      {
                        id: 10,
                        name: '三级 1-1-2'
                      },
                      {
                        id: 11,
                        name: '三级 1-1-3'
                      }
                    ]
                  }
                ]
              },
              {
                id: 2,
                name: '一级 2',
                child: [
                  {
                    id: 5,
                    name: '二级 2-1',
                    isLayout: true
                  },
                  {
                    id: 6,
                    name: '二级 2-2',
                    isLayout: true
                  }
                ]
              },
              {
                id: 3,
                name: '一级 3',
                child: [
                  {
                    id: 7,
                    name: '二级 3-1',
                    isLayout: true
                  },
                  {
                    id: 8,
                    name: '二级 3-2',
                    isLayout: true
                  }
                ]
              }
            ],
            showCheckbox: true
          },
          rules: [{ required: true, message: '请选择', trigger: ['change'] }],
          placeholder: '请选择'
        },
        _dateV: {
          itemType: 'date',
          prop: 'dateV',
          label: '日期',
          rules: [
            { required: true, message: '日期不能为空', trigger: ['change'] }
          ]
        },
        _switchvalue: {
          itemType: 'switch',
          prop: 'switchvalue',
          label: '开关',
          rules: [{ required: false, message: '请选择', trigger: ['change'] }]
        },
        _singlebox: {
          itemType: 'radio-group',
          prop: 'singlebox',
          label: '单选框',
          rules: [{ required: true, message: '请选择', trigger: ['change'] }],
          dataSource: [
            {
              value: '1',
              label: '选项一'
            },
            {
              value: '2',
              label: '选项二'
            }
          ]
        },
        _checkboxs: {
          itemType: 'checkbox-group',
          prop: 'checkboxs',
          label: '多选框',
          rules: [{ required: true, message: '请选择', trigger: ['change'] }],
          dataSource: [
            {
              value: '1',
              label: '选项一'
            },
            {
              value: '2',
              label: '选项二'
            }
          ]
        },
        _shape: {
          itemType: 'input',
          type: 'textarea',
          prop: 'shape',
          label: '活动形式',
          rules: [ruleRequire]
        }
      },
      popDialogHandle: () => {
        this.PopDialogHandle()
      }
    }
    const colDrag = {
      onEnd: (evt, newColumns) => {
        console.log(Object.keys(newColumns))
        this.columns = newColumns
      }
    }
    const rowDrag = {
      onEnd: (evt, newDataSource) => {
        this.dataSource = newDataSource
      }
    }
    return {
      colDrag,
      rowDrag,
      columns,
      selection,
      dataSource,
      popOperates,
      pagination,
      popOptions
      // tableFormDataSource,
      // tableFormColumns
    }
  },
  mounted() {

  },
  methods: {
    selectionChange(val) {
      console.log(val)
    },
    headerContextmenu(column, event) {
      // console.log(column, event)
      // document.oncontextmenu = () => false
      // this.buttonStyle = { ...this.buttonStyle, left: event.clientX + 'px', top: event.clientY + 'px' }
      // this.showButton = true
    },
    setFormDatas(params) {
      setTimeout(() => {
        const data = { ...this.popOptions.formDatas, ...params }
        this.$set(this.popOptions, 'formDatas', data)
      }, 0)
    },
    PopDialogHandle() {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
    }
  }
}
</script>

<style lang="scss" scoped>
    .table{ padding-bottom: 10px;}
    .custom-demo-title{ font-size: 16px; padding: 10px; font-weight: bold; padding: 10px}
</style>
