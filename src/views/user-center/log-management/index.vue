<template>
  <div class="logManagement">
    <!-- 搜索表单 -->
    <div class="search islayoutForm">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增角色按钮 -->
    <!-- <div class="button">
      <el-button type="primary" @click="addButton">新增按钮类型</el-button>
    </div> -->
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        tooltip-effect="dark"
        :data-source="dataSource"
        :operates="null"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
        :table-scrollx="true"
      />
    </div>
  </div>
</template>

<script>
// import { sysAppSystemList } from '../micro-services/api/index.js'
import { sysUserLogpage, appIdList } from './api/index.js'
import typeDataSource from './config/type-data-source.js'
import opratorTypeDataSource from './config/oprator-type-data-source.js'
import systemDataSource from './config/system-data-source.js'
import formatCode from './components/formatCode.vue'
import { _debounce } from '@/utils/index.js'
export default {
  name: 'LogManagement',
  data() {
    const pickerOptions = {
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }
      ],
      disabledDate(time) {
        return time.getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59).getTime() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 91
      }
    }
    const timeChange = (value) => {
      console.log(value)
    }
    const searchData = [
      {
        prop: 'description',
        itemType: 'input',
        label: '日志内容:',
        itemStyle: { width: '25%' },
        placeholder: '请输入日志关键词'
      },
      {
        prop: 'userName',
        itemType: 'input',
        label: '操作人:',
        itemStyle: { width: '25%' },
        placeholder: '请输入用户名/姓名'
      },
      {
        prop: 'type',
        itemType: 'select',
        label: '日志类型:',
        itemStyle: { width: '25%' },
        // placeholder: '请输入日志关键词'
        dataSource: [
          {
            label: '全部',
            value: null
          },
          {
            label: '登录日志',
            value: 'LOGIN'
          },
          {
            label: '操作日志',
            value: 'OP'
          },
          {
            label: '系统日志',
            value: 'SYS'
          }
        ]
      },
      {
        prop: 'opratorType',
        itemType: 'select',
        label: '操作类型:',
        itemStyle: { width: '25%' },
        dataSource: [
          {
            label: '全部',
            value: null
          },
          {
            label: '新增',
            value: 'INSERT'
          },
          {
            label: '修改',
            value: 'UPDATE'
          },
          {
            label: '设置',
            value: 'SET'
          },
          {
            label: '删除',
            value: 'DEL'
          },
          {
            label: '登录',
            value: 'LOGIN'
          },
          {
            label: '退出',
            value: 'LOGOUT'
          },
          {
            label: '导入',
            value: 'IMPORT'
          },
          {
            label: '导出',
            value: 'EXPORT'
          },
          {
            label: '审核',
            value: 'EXAMINE'
          }
        ]
      },
      {
        prop: 'appId',
        itemType: 'select',
        label: '所属系统:',
        filterable: true,
        itemStyle: { width: '25%' },
        dataSource: []
      },
      {
        itemType: 'date',
        type: 'daterange',
        prop: 'dateRange',
        label: '时间范围:',
        // style: { width: '300px' },
        itemStyle: { width: '25%' },
        pickerOptions: pickerOptions,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        change: timeChange
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log(params)
          const appSystemIds = params.appSystemIds && params.appSystemIds.length === 0 ? null : params.appSystemIds
          const startTime = params.dateRange && params.dateRange[0]
          const endTime = params.dateRange && params.dateRange[1]
          this.searchFormDatas = { ...params, appSystemIds, startTime, endTime }
          this.getLogPage({ ...params, appSystemIds, startTime, endTime })
        },
        resetHandle: () => {
          // console.log('重置')
          this.searchFormDatas = {}
        }
      }
    ]
    const columns = [
      {
        prop: 'id',
        label: '序号',
        width: '60'
        // formater: scope => {
        //   return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        // }
      },
      {
        prop: 'appId',
        label: '所属系统',
        width: '140',
        formater: scope => {
          // return this.systemDataSource[scope.row[scope.column.property]]
          return systemDataSource[scope.row[scope.column.property]]
        },
        showOverflowTooltip: true
      },
      {
        prop: 'description',
        label: '日志内容',
        minWidth: '200',
        components: {
          formatCode
        }
        // showOverflowTooltip: true
      },
      {
        prop: 'userName',
        label: '操作人',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (
            (scope.row.userName &&
              `${scope.row.userName}/${scope.row.realName}`)
          )
        }
      },
      // {
      //   prop: 'userName',
      //   label: '操作人用户名',
      //   minWidth: '120',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'realName',
      //   label: '操作人姓名',
      //   minWidth: '100',
      //   showOverflowTooltip: true
      // },
      {
        prop: 'ip',
        label: 'IP',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'type',
        label: '类型',
        minWidth: '100',
        formater: scope => {
          return typeDataSource[scope.row[scope.column.property]]
        },
        showOverflowTooltip: true
      },
      {
        prop: 'opratorType',
        label: '操作类型',
        minWidth: '100',
        formater: scope => {
          return opratorTypeDataSource[scope.row[scope.column.property]]
        },
        showOverflowTooltip: true
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        width: '140',
        formater: scope => {
          return this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}')
        }
      }
    ]
    // const popOperates = {
    //   label: '操作',
    //   width: '60',
    //   dataSource: [
    //     {
    //       label: '修改',
    //       isShow: true,
    //       handle: params => {
    //         console.log(params)
    //         this.setFormDatas({ ...params.row })
    //         this.PopDialogHandle('修改角色')
    //         this.type = 'edit'
    //       }
    //     },
    //     {
    //       label: '删除',
    //       isShow: true,
    //       handle: params => {
    //         console.log(params)
    //         this.$confirm('确认要删除选择的数据吗？', '提示', {
    //           confirmButtonText: '确定',
    //           cancelButtonText: '取消',
    //           type: 'warning'
    //         })
    //           .then(() => {
    //             this.deleteRole(params.row.roleId)
    //             this.$message({
    //               type: 'success',
    //               message: '删除成功!'
    //             })
    //           })
    //           .catch(() => {
    //             this.$message({
    //               type: 'info',
    //               message: '已取消删除'
    //             })
    //           })
    //       }
    //     }
    //   ]
    //   // components: { operatesColumn }
    // }
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getLogPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.getLogPage({ pageNum: 1, pageSize: val })
      }
    }
    return {
      formOtions: {
        size: 'small',
        layout: true,
        inline: true
      },
      typeDataSource,
      systemDataSource: {},
      searchData,
      columns,
      // dataSource: [],
      formDatas: {
        description: '',
        userName: ''
      },
      searchFormDatas: {
        description: '',
        userName: '',
        startTime: '',
        endTime: ''
      },
      pagination,
      // popOperates,
      appSystemIds: this.$store.state.user.userInfo.appSystemIds.length !== 0 ? this.$store.state.user.userInfo.appSystemIds : null
    }
  },
  computed: {
    dataSource: {
      get() {
        return this.$store.state.user.logData
      },
      set(data) {
        this.$store.commit('user/SET_LOGData', data)
      }
    }
  },
  created() {
    // 时间范围默认显示近3天
    const endTime = new Date().getTime()
    const startTime = new Date().getTime() - 3600 * 1000 * 24 * 3
    this.searchFormDatas = { startTime, endTime }
    this.formDatas.dateRange = [startTime, endTime]
    this.getLogPage()
    this.getSystemList()
  },
  activated() {
    this.getLogPage()
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
    // 获取系统列表
    async getSystemList(data = {}) {
      const appSystemIds = this.appSystemIds
      const res = await appIdList({ ...data, appSystemIds })
      console.log(res.data['USER_CENTER'])
      this.systemDataSource = res.data
      const systemList = Object.keys(res.data).map(item => {
        return { value: item, label: res.data[item] }
      })
      // console.log('系统列表', systemList)
      const list = systemList.length !== 0 ? [{ value: null, label: '全部' }, ...systemList] : []
      this.$set(this.searchData[4], 'dataSource', list)
    },
    // 获取日志分页列表
    @_debounce(50)
    async getLogPage(data = {}) {
      const appSystemIds = this.searchFormDatas.appSystemIds || this.appSystemIds
      const res = await sysUserLogpage({ ...this.searchFormDatas, ...data, appSystemIds })
      // console.log('日志列表', res)
      res.data.list && res.data.list.map((item, index) => { item.id = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      const userList = res.data.list || []
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.logManagement {
  /deep/ .el-table .cell{
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
.logManagement {
    padding: 20px;
    // padding-bottom: 0;
}
</style>
<style lang="scss">
  .logManagement {
    .el-form.el-form--inline .el-form-item__label-wrap {
      // margin-left: 0px !important;
    }
  }
</style>

