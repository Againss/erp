<template>
  <div class="buttonType">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <!-- 新增角色按钮 -->
    <inputVagueSearch :options="selectOption" />
    <div class="button">
      <el-button type="primary" @click="addButton">新增按钮类型</el-button>
    </div>
    <!-- 表格 -->
    <div class="table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
      />
    </div>
    <!-- 动态添加行列 -->
    <dynamicAddDeleteRow :options="addDeleteRowoption" />
    <!-- 自定义表单分页列表 -->
    <formDetailsDisplay :option="formDetailsOptions" />

    <!-- 列表tab栏切换 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="1" />
      <el-tab-pane label="待提交" name="2" />
      <el-tab-pane label="待审核" name="3" />
      <el-tab-pane label="进行中" name="4" />
      <el-tab-pane label="已完结" name="5" />
      <el-tab-pane label="已取消" name="6" />
      <div class="btn-group">
        <el-button type="primary" size="mini">新建</el-button>
        <listFields />
        <!-- <el-button type="primary" size="mini">新增</el-button> -->
      </div>
    </el-tabs>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import inputVagueSearch from '../../../components/inputVagueSearch/index.vue'
import { userList } from '../employee-management/api/index.js'
import dynamicAddDeleteRow from './components/dynamic-add-delete-row.vue'
import formDetailsDisplay from './components/form-details-display'
import stockInput from './components/stock-input.vue'
import listFields from './components/list-fields.vue'
export default {
  components: {
    inputVagueSearch,
    dynamicAddDeleteRow,
    formDetailsDisplay,
    listFields
  },
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const searchData = [
      {
        prop: 'role',
        itemType: 'input',
        label: '类型名称:',
        placeholder: '请输入类型名称'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log(params)
        },
        resetHandle: () => {
          console.log('重置')
        }
      }
    ]
    const tableFormColumns = [
      {
        prop: 'name',
        label: '姓名',
        // sortable: true,
        width: '200'
        // editOptions: {
        //   labelWidth: '0',
        //   itemType: 'select',
        //   rules: [
        //     { required: true, message: '姓名不能为空', trigger: ['change'] }
        //   ],
        //   dataSource: [
        //     {
        //       value: '王小虎',
        //       label: '王小虎'
        //     },
        //     {
        //       value: '王二虎',
        //       label: '王二虎'
        //     }
        //   ]
        // }
      },
      {
        prop: 'title',
        label: '标题',
        width: '200',
        editOptions: {
          popError: true,
          labelWidth: '0',
          itemType: 'input',
          rules: [
            {
              required: true,
              message: '标题不能为空',
              trigger: ['change']
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
          popError: true,
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
    ]
    const tableFormDataSource = [
      {
        date: '2016-05-01',
        name: '王1虎',
        title: '我是1',
        edit: true
      },
      {
        date: '2016-05-02',
        name: '王2虎',
        title: '我是2',
        edit: true
      },
      {
        date: '2016-05-03',
        name: '王3虎',
        title: '我是3',
        edit: true
      }
    ]
    const selectOption = {
      prop: 'zzz',
      type: 'input',
      multiple: false,
      collapseTags: true,
      longRangeSearch: false,
      placeholder: '请选择',
      popoverOptions: {},
      props: {
        label: 'name'
      },
      dataSource: [
        {
          label: '一',
          id: 1
        },
        {
          label: '二个',
          id: 2
        },
        {
          label: '第三个',
          id: 3
        },
        {
          label: '这是四个',
          id: 4
        },
        {
          label: '第一个',
          id: 5
        },
        {
          label: '第二个',
          id: 6
        },
        {
          label: '第三个',
          id: 7
        },
        {
          label: '第四个',
          id: 8
        },
        {
          label: '第一个',
          id: 9
        },
        {
          label: '第二个',
          id: 10
        },
        {
          label: '第三个',
          id: 11
        },
        {
          label: '第四个',
          id: 12
        },
        {
          label: '第一个',
          id: 13
        },
        {
          label: '第二个',
          id: 14
        },
        {
          label: '第三个',
          id: 15
        },
        {
          label: '第四个',
          id: 16
        },
        {
          label: '第一个',
          id: 17
        },
        {
          label: '第二个',
          id: 18
        },
        {
          label: '第三个',
          id: 19
        },
        {
          label: '第四个',
          id: 20
        },
        {
          label: '第一个',
          id: 21
        },
        {
          label: '第二个',
          id: 22
        },
        {
          label: '第三个',
          id: 23
        },
        {
          label: '第四个',
          id: 24
        }
      ],
      submitHandle: scoped => {
        console.log(scoped)
      },
      resetHandle: () => {
        console.log('重置')
      }
    }
    const addDeleteRowoption = {
      formOtions: {
        // inline: true,
        popError: true,
        showMessage: false
      },
      formDatas: {

      },
      searchData: [
        {
          prop: 'tableForm',
          itemType: 'table-form',
          label: '表格表单',
          dataSource: tableFormDataSource,
          columns: tableFormColumns,
          operates: {
            label: '选择',
            width: '100px',
            dataSource: [
              {
                label: '添加',
                isShow: true,
                handle: (params, form, formDatas, setformdatas) => {
                  console.log(params, form, formDatas, setformdatas)
                  this.addALine(params.$index, formDatas)
                  setTimeout(() => {
                    form.clearValidate()
                  }, 0)
                }
              },
              {
                label: '删除',
                isShow: true,
                handle: (params, form, formDatas, setformdatas) => {
                  console.log(params, form, formDatas, setformdatas)
                  this.deleteALine(params.$index, formDatas)
                }
              }
            ]
          }
        }
      ]
    }
    const columns = [
      {
        prop: 'id',
        label: '编号',
        align: 'center',
        sortable: true
      },
      {
        prop: 'name',
        label: '类型名称',
        align: 'center',
        handle: scope => {
          console.log(scope)
        }
      },
      {
        prop: 'remark',
        label: '备注',
        align: 'center'
      }
    ]
    const dataSource = [
      {
        id: 1,
        name: '新增',
        remark: '描述信息1'
      },
      {
        id: 2,
        name: '删除',
        remark: '描述信息2'
      },
      {
        id: 3,
        name: '编辑',
        remark: '描述信息3'
      },
      {
        id: 4,
        name: '查看',
        remark: '描述信息4'
      },
      {
        id: 5,
        name: '审核',
        remark: '描述信息5'
      },
      {
        id: 6,
        name: '指派',
        remark: '描述信息6'
      }
    ]
    const popOperates = {
      label: '操作',
      width: '300',
      dataSource: [
        {
          label: '修改',
          isShow: true,
          handle: params => {
            console.log(params)
            this.setFormDatas({ ...params.row })
            this.PopDialogHandle('修改角色')
            this.type = 'edit'
          }
        },
        {
          label: '删除',
          isShow: true,
          handle: params => {
            console.log(params)
            this.$confirm('确认要删除选择的数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.deleteRole(params.row.roleId)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          }
        }
      ]
      // components: { operatesColumn }
    }
    const pagination = {
      currentPage: 1,
      pageSize: 20,
      dataTotal: dataSource.length
    //   currentChange: val => {
    //     this.getRoleList({ currentPage: val })
    //   },
    //   sizeChange: val => {
    //     this.getRoleList({ pageSize: val })
    //   }
    }
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      ok: params => {
        console.log('params', params)
      },
      cancel: params => {
        this.PopDialogHandle()
        console.log(params)
      },
      formDatas: {
        tableForm: tableFormDataSource// 必须给表单初始值
      },
      formOptions: {
        // labelWidth: '100px'
      },
      content: [
        {
          prop: 'id',
          itemType: 'input',
          label: '标号:',
          placeholder: '系统生成',
          disabled: true
        },
        {
          prop: 'name',
          itemType: 'input',
          label: '类型名称:',
          rules: [commonBlurReg],
          placeholder: '请输入类型名称'
        },
        {
          itemType: 'input',
          type: 'textarea',
          prop: 'remark',
          label: '备注:',
          placeholder: '请输入备注'
        },
        {
          prop: 'tableForm',
          itemType: 'table-form',
          label: '表格表单',
          dataSource: tableFormDataSource,
          columns: tableFormColumns
        }
      ],
      popDialogHandle: () => {
        this.PopDialogHandle()
      }
      // component: PopDialog
    }

    // 自定义表单头部列表
    const headerList = {
      '_z1': {
        label: '订单号: ',
        prop: 'z1',
        formater: scope => {
          console.log(scope)
        }
      },
      '_z2': {
        label: '产品编号: ',
        prop: 'z2'
      },
      '_z3': {
        label: '布类: ',
        prop: 'z3'
      },
      '_z4': {
        label: '客户: ',
        prop: 'z4'
      },
      '_z5': {
        label: '交期: ',
        prop: 'z5'
      },
      '_z6': {
        label: '纱名: ',
        prop: 'z6'
      },
      '_z7': {
        label: '纱属性: ',
        prop: 'z7'
      },
      '_z8': {
        label: '生产流程: ',
        prop: 'z8'
      },
      '_z9': {
        label: '销售团队: ',
        prop: 'z9'
      },
      '_z10': {
        label: '数量: ',
        prop: 'z10'
      },
      '_z11': {
        label: '订单号: ',
        prop: 'z11'
      }
    }
    // 自定义表单表头
    const contentHead = {
      'zz1': {
        label: '工序',
        prop: 'zz1',
        formater: (scope, index) => {
          // console.log(scope, index)
          return scope.$index + 1 + '、' + scope.row.zz1
        }
      },
      'zz2': {
        label: '编码',
        prop: 'zz2'
      },
      'zz3': {
        label: '订单需求量',
        prop: 'zz3'
      },
      'zz4': {
        label: '需生产量',
        prop: 'zz4'
      },
      'zz5': {
        label: '可用库存',
        prop: 'zz5',
        customInput: true,
        components: {
          stockInput
        },
        componentsOptions: {}
        // customInput: true
      }
    }
    // 所有数据内容
    const formDetailsDataSource = [
      {
        z1: '公司看看刚好四个活动开始敢肯定',
        z2: '公司看看刚好四个活动开始敢肯定',
        z3: '公司看看刚好四个活动开始敢肯定',
        z4: '公司看看刚好四个活动开始敢肯定',
        z5: '公司看看刚好四个活动开始敢肯定',
        z6: '公司看看刚好四个活动开始敢肯定',
        z7: '公司看看刚好四个活动开始敢肯定',
        z8: '公司看看刚好四个活动开始敢肯定',
        z9: '公司看看刚好四个活动开始敢肯定',
        z10: '公司看看刚好四个活动开始敢肯定',
        z11: '公司看看刚好四个活动开始敢肯定',
        checked: false,
        expandFlag: false,
        dataSource: [
          {
            zz1: '印花',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '染整',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '织布',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          }
        ]
      },
      {
        checked: false,
        expandFlag: false,
        dataSource: [
          {
            zz1: '印花',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '染整',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '织布',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          }
        ]
      },
      {
        checked: false,
        expandFlag: false,
        dataSource: [
          {
            zz1: '印花',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '染整',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '织布',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          }
        ]
      },
      {
        checked: false,
        expandFlag: false,
        dataSource: [
          {
            zz1: '印花',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '染整',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '织布',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          }
        ]
      },
      {
        checked: false,
        expandFlag: false,
        dataSource: [
          {
            zz1: '印花',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '染整',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '织布',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          }
        ]
      },
      {
        checked: false,
        expandFlag: false,
        dataSource: [
          {
            zz1: '印花',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '染整',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          },
          {
            zz1: '织布',
            zz2: 'JSP',
            zz3: '1000KG',
            zz4: '1000KG',
            zz5: '288'
          }
        ]
      }

    ]
    // 分页配置信息
    const formDetailsPagination = {
      // currentPage: 1,
      // pageSize: 20,
      pageSizes: [5],
      dataTotal: dataSource.length,
      currentChange: val => {
        console.log('currentChange', val, this.pagination)
        // this.getCustomerPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('sizeChange', val, this.pagination)
        // this.getCustomerPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // const tableFormColumns = {}
    // 定义基础组件表单内容
    const customFormData = {
      '_table': {
        prop: 'tableForm',
        itemType: 'table-form',
        className: 'pop-table',
        headerCellStyle: { 'background-color': '#F5F7FA', height: '44px' },
        // cellMouseEnter: (row, column, cell, event) => {
        //   console.log(row, column, cell, event)
        // },
        // label: '表格表单',
        dataSource: [],
        columns: contentHead
      }
    }
    // 自定义表单分页列表配置项
    const formDetailsOptions = {
      headerList: headerList, // 头部list
      checkShow: false, // 是否显示多选框
      rightButtonShow: true, // 右边button是否显示
      rightButtonText: '确认数量', // 右边button文字内容
      rightButtonClick: (scope, index) => {
        console.log(scope, index)
      },
      customFormData: customFormData, // 表单内容
      contentHead: contentHead, // 内容表头
      dataSource: formDetailsDataSource, // 内容
      pagination: formDetailsPagination // 分页内容
    }
    return {
      formOtions: {
        inline: true
      },
      searchData,
      selectOption,
      columns,
      dataSource,
      pagination,
      popOperates,
      popOptions,
      tableFormColumns,
      addDeleteRowoption,
      emptyRowData: {
        date: '',
        name: '',
        title: '',
        edit: true
      },
      formDetailsOptions,
      formDetailsPagination,

      activeName: '1'
    }
  },
  created() {
    this.viewUser()
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 修改按钮
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 新增角色
    addButton() {
      this.PopDialogHandle('新增按钮类型')
      this.type = 'add'
    },
    // 查看用户(左边数据)
    async viewUser(data = {}) {
      const res = await userList({ ...data, requireOrgFlag: 1 })
      // console.log('查看用户', res)
      const userLists = res.data.list || []
      const userArray = userLists.filter(item => {
        item.isLeaf = true
        return item.realName !== null && item.realName !== ''
      })
      this.$set(this.selectOption, 'dataSource', userArray)
      // this.$set(this.viewPopOptions.content[0].treeOptions.data[0], 'children', userArray)
    },
    // 添加一行
    addALine(index, formDatas) {
      const data = [...formDatas['tableForm']]
      data.splice(index + 1, 0, this.emptyRowData)
      this.addDeleteRowoption.searchData[0]['dataSource'] = data
    },
    // 删除一行
    deleteALine(index, formDatas) {
      const data = [...formDatas['tableForm']]
      data.splice(index, 1)
      this.addDeleteRowoption.searchData[0]['dataSource'] = data
    },

    // tab栏切换事件
    handleClick() {
      console.log(this.activeName)
    }
  }
}
</script>

<style lang='scss' scoped>
.buttonType {
    padding: 20px;

    .button {
      // margin-bottom: 15px;
      // margin-top: 10px;
    }
}
</style>
<style lang="scss">
  .pop-table {
    tbody {
      .el-table__row:hover {
        background-color: rgba(0, 0, 0, 0) !important;
      }
      tr:hover>td {
        background-color:#fff !important;
      }

      .el-table__row {
        td {
          border-bottom: 0px solid #EEEFF0;
        }
      }
    }
    th.is-leaf {
      border-bottom: 0px solid #EEEFF0;
    }
    &::before {
      height: 0px;
    }
    .el-table__header-wrapper th, .el-table__body td {
      padding: 0;
    }

    .el-tabs__nav-wrap::after {
      height: 1px;
      background-color: #d0d6da;
    }
  }
</style>
