/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
 */
/* eslint-disable*/
const code = `
<script>
// import uploadSlotTip from './components/upload-slot-tip'
// import uploadSlotTrigger from './components/upload-slot-trigger'
// import uploadNoSlot from './components/upload-no-slot'
import areaTel from './components/area-tel'
import popoverColumn from './components/popover-column'
import stateColumn from './components/state-column'
export default {
  components: {},
  data() {
    const nameReg = this.$getRules({ message: '请输入姓名' })
    const ruleRequire = this.$getRules({})
    const columns = [
      {
        prop: 'name',
        label: '姓名',
        align: 'center',
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
        align: 'center',
        editOptions: {
          itemType: 'date',
          rules: [
            { required: true, message: '日期不能为空', trigger: ['change'] }
          ]
        },
        // handle: scope => {
        //   console.log(scope)
        // }
      },
      {
        prop: 'subject',
        label: '跳转',
        width: '200',
        align: 'center',
        // handle: scope => {
        //   this.$router.push('/')
        // },
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
                align: 'center',
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
                  return \`格式化后-\${scope.row[scope.column.property]}\`
                }
              },
              {
                prop: 'title',
                label: '标题',
                align: 'center',
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
            align: 'center',
            editOptions: {
              itemType: 'input'
            }
          }
        ]
      },
      {
        prop: 'state',
        label: '状态',
        align: 'center',
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
    const searchData = [
      {
        prop: 'state',
        itemType: 'select',
        label: '状态',
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
      {
        prop: 'name',
        itemType: 'input',
        label: '姓名',
        placeholder: '请输入姓名'
      },
      // {
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
      {
        itemType: 'date',
        prop: 'date',
        label: '日期',
        placeholder: '请选择日期',
        // type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd'
        // rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }]
      },
      {
        itemType: 'operate',
        submitHandle: params => {
          console.log(params)
        },
        submitText: '查询',
        resetHandle: () => {
          console.log('重置')
        }
      }
    ]
    const popOperates = {
      label: '操作',
      width: '200',
      dataSource: [
        {
          label: '修改',
          isShow: true,
          handle: params => {
            console.log(params)
            this.setFormDatas({
              ...params.row
              // trees: [
              //   {
              //     id: 11,
              //     name: '三级 1-1-3'
              //   }
              // ]
            })
            this.PopDialogHandle()
          }
        },
        {
          label: '删除',
          isShow: true,
          handle: params => {
            console.log(params)
          }
        }
      ]
      // components: { operatesColumn }
    }
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
    const pagination = {
      currentPage: 1,
      pageSize: 15,
      dataTotal: dataSource.length,
      // layout: 'prev, pager, next, jumper, total',
      currentChange: val => {
        this.currentChange(val)
      }
    }
    const selection = {
      selection: true,
      selectionLabel: '全部'
    }
    const index = {
      indexMethod: index => {
        return index + 1
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
        tabs: '1'
      },
      formOptions: {
        // labelWidth: 'auto'
      },
      content: [
        {
          components: {
            areaTel
          }
        },
        {
          prop: 'state',
          itemType: 'select',
          label: '状态',
          change: value => {
            console.log(value)
          },
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
        {
          prop: 'name',
          itemType: 'input',
          label: '姓名',
          rules: [nameReg],
          placeholder: '请输入姓名'
        },
        // {
        //   prop: 'tabs',
        //   itemType: 'tabs',
        //   label: '',
        //   type: 'card',
        //   labelWidth: '0',
        //   placeholder: '请输入姓名',
        //   dataSource: [{
        //     label: '标签一',
        //     value: '1'
        //   }, {
        //     label: '标签二',
        //     value: '2'
        //   }]
        // },
        // {
        //   prop: 'table',
        //   itemType: 'table',
        //   label: '',
        //   labelWidth: '0',
        //   dataSource: csCustomPopConfig,
        //   columns: columnsInfos
        // },
        {
          prop: 'icon',
          itemType: 'icon',
          label: '图标',
          rules: [ruleRequire],
          placeholder: '请选择图标'
        },
        {
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
        {
          itemType: 'date',
          prop: 'date',
          label: '日期',
          rules: [
            { required: true, message: '日期不能为空', trigger: ['change'] }
          ]
        },
        {
          itemType: 'switch',
          prop: 'switchvalue',
          label: '开关',
          rules: [{ required: false, message: '请选择', trigger: ['change'] }]
        },
        {
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
        {
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
        {
          itemType: 'input',
          type: 'textarea',
          prop: 'shape',
          label: '活动形式',
          rules: [ruleRequire]
        }
      ],
      popDialogHandle: () => {
        this.PopDialogHandle()
      }
    }
    return {
      msg: 'table',
      popOptions,
      columns,
      searchFormDatas: { name: '张三' },
      formDatas: {},
      formOtions: {
        inline: true
      },
      popOperates,
      inlineOperates,
      searchData,
      selection,
      index,
      pagination,
      dataSource
    }
  },
  mounted() {
  },
  methods: {
    rowClick(row, column, event) {
      console.log(row, column, event)
    },
    show(params) {
      console.log(params)
    },
    handleClick(params) {
      console.log(params)
    },
    handleEdit(row) {
      console.log(row)
    },
    selectionChange(val) {
      console.log(val)
    },
    PopDialogHandle() {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
    },
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    currentChange(val) {
      console.log(val)
    },
    setinlineFormDatas(params) {
      this.$set(this.formDatas, params.key, params.value)
      console.log(this.formDatas)
    },
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
    }
  }
}
</script>
`
export default code
