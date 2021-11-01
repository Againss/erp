/**
 * @Description: DEMO 表格行内编辑不在维护，表格表单请使用 form 组件的元组件  table-form
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div class="table">
    <div class="custom-demo-title">cs-custom-table inline模式demo:</div>

    <cs-custom-table
      ref="inlineTable"
      :columns="columns"
      :selection="selection"
      :data-source="dataSource"
      :operates="inlineOperates"
      :pagination="pagination"
      :span-method="spanMethod"
      :form-datas="formDatas"
      edit-type="inline"
      @selection-change="selectionChange"
    />

  </div>
</template>

<script>

import popoverColumn from '@/views/demo/custom-tform/components/popover-column'
import stateColumn from '@/views/demo/custom-tform/components/state-column'

export default {
  components: {},
  data() {
    const columns = [
      {
        prop: 'name',
        label: '姓名',
        sortable: true,
        width: '200',
        editOptions: {
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
      {
        prop: 'date',
        label: '日期',
        width: '200',
        sortable: true,
        editOptions: {
          itemType: 'date',
          rules: [
            { required: true, message: '日期不能为空', trigger: ['change'] }
          ]
        },
        handle: scope => {
          console.log(scope)
        }
      },
      {
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
      {
        label: '标题/地址/信息',
        prop: '',
        child: [
          {
            label: '标题和地址',
            prop: '',
            child: [
              {
                prop: 'address',
                label: '地址',
                editOptions: {
                  itemType: 'input',
                  rules: [
                    {
                      required: true,
                      message: '地址不能为空',
                      trigger: ['change']
                    }
                  ]
                },
                formater: scope => {
                  return `格式化后-${scope.row[scope.column.property]}`
                }
              },
              {
                prop: 'title',
                label: '标题',
                width: '200',
                editOptions: {
                  itemType: 'input',
                  rules: [
                    {
                      required: true,
                      message: '标题不能为空',
                      trigger: ['change']
                    }
                  ]
                },
                components: {
                  popoverColumn
                }
              }
            ]
          },
          {
            prop: 'info',
            label: '描述',
            editOptions: {
              itemType: 'input'
            }
          }
        ]
      },
      {
        prop: 'state',
        label: '状态',
        width: '160',
        editOptions: {
          itemType: 'select',
          rules: [
            { required: true, message: '请选择状态', trigger: ['change'] }
          ],
          dataSource: [
            {
              value: '2',
              label: '成功'
            },
            {
              value: '1',
              label: '失败'
            }
          ]
        },
        components: {
          stateColumn
        },
        componentsOptions: {
          handle: () => {
            console.log()
          }
        }
      }
    ]
    const selection = {
      selection: true,
      selectionLabel: '全部'
    }
    const dataSource = [
      {
        date: '2016-05-02',
        name: '王小虎',
        subject: '跳转',
        address: '上海市普陀区金沙江路 1518 弄',
        title: '我是',
        info: '描述信息1',
        edit: false,
        state: '2'
      },
      {
        date: '2016-05-03',
        name: '王小虎',
        subject: '跳转',
        address: '上海市普陀区金沙江路 1518 弄',
        title: '我是',
        editRowType: 'pop',
        info: '描述信息2',
        edit: false,
        state: '2'
      },
      {
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
    const inlineOperates = {
      label: '操作',
      width: '200',
      fixed: 'right',
      dataSource: [
        {
          label: '修改',
          isShow: scope => {
            return !scope.row.edit
          },
          handle: params => {
            console.log(params)
            params.row.edit = !params.row.edit
            this.setinlineFormDatas({
              key: params.$index,
              value: { ...params.row }
            })
            // throw new Error('手动跑出异常')
          }
        },
        {
          isShow: scope => {
            return !scope.row.edit
          },
          label: '删除',
          handle: params => {
            console.log(params)
          }
        },
        {
          isShow: scope => {
            return scope.row.edit
          },
          label: '保存',
          handle: params => {
            this.$refs.inlineTable.form.validate(valid => {
              if (valid) {
                const formRowDatas = this.$refs.inlineTable
                  .dynamicValidateFormRuleForm
                for (const i in formRowDatas[params.$index]) {
                  if (i !== 'edit') {
                    params.row[i] = formRowDatas[params.$index][i]
                  }
                }
                params.row.edit = !params.row.edit
                console.log('inlineSave')
                console.log(params)
              }
            })
          }
        },
        {
          isShow: scope => {
            return scope.row.edit
          },
          label: '取消',
          handle: params => {
            console.log(params)
            params.row.edit = !params.row.edit
          }
        }
      ]
    }
    const pagination = {
      currentPage: 1,
      pageSize: 15,
      dataTotal: dataSource.length,
      // layout: 'prev, pager, next, jumper, total',
      currentChange: val => {
        this.currentChange(val)
      }
    }
    return {
      columns,
      selection,
      dataSource,
      inlineOperates,
      pagination,
      formDatas: {}
    }
  },
  mounted() {
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (rowIndex === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    selectionChange(val) {
      console.log(val)
    },
    setinlineFormDatas(params) {
      this.$set(this.formDatas, params.key, params.value)
      console.log(this.formDatas)
    },
    currentChange(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
    .table{ padding-bottom: 10px;}
    .custom-demo-title{ font-size: 16px; padding: 10px; font-weight: bold; padding: 10px}
</style>
