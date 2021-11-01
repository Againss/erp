<template>
  <div class="departmentManagement">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 点击按钮功能 -->
    <div class="button">
      <el-button v-permission="['userCenter:sysOrg:addCompany']" size="small" type="primary" @click="addCompany">添加公司</el-button>
      <el-button v-permission="['userCenter:sysOrg:addDepartment']" size="small" @click="addDepartment('添加部门')">新增部门</el-button>
      <el-button v-permission="['userCenter:sysOrg:wecom:sync']" size="small" @click="syncWechat">企业微信同步</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :tree-props="{children: 'child'}"
        row-key="orgId"
        lazy
        :columns="columns"
        :expand-row-keys="['1']"
        :data-source="dataSource"
        :operates="popOperates"
        :cell-class-name="tableRowClassName"
        :pagination="pagination"
        edit-type="pop"
        :table-scrollx="true"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="departmentPopOptions" />
    </div>
    <!-- 导入pop弹出层(查看用户) -->
    <div class="userPop pop">
      <cs-custom-pop :options="viewPopOptions" />
    </div>
  </div>
</template>

<script>
// 导入表格操作组件
// import departmentTableHandle from './components/departmentTableHandle.vue'
import { orgPage, sysOrgAdd, sysOrgModify, sysOrgDelete, sysOrgList, sysOrgInfo, sysOrgUserModify, getUserListOption, getSysOrgTypeOption, sysOrgSync } from './api/index.js'
import { userList, userPageList } from '../employee-management/api/index.js'
import { _debounce } from '@/utils/index.js'
export default {
  name: 'DepartmentManagement',
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 部门名称验证正则
    const departmentReg = this.$getRules({ type: 'department', trigger: ['blur'] })
    // 部门名称校验字符串不包含 '-'
    const departmentReg2 = this.$getRules({ type: 'department', trigger: ['blur'], message: '部门或公司名称不能包含 "-"', pattern: /^((?!-).)*$/ })
    // 公用组件样式
    const style = {
      'font-size': '14px',
      'color': '#333',
      'background-color': '#eee',
      'padding': '10px',
      'border-radius': '2px',
      'margin-bottom': '15px'
    }
    const patentTreeChange = (value, form, formDatas, setFormDatas) => {
      // console.log('value', value)
      // console.log(this.recursionFatherOrSon(this.allOrgList, value[0]).join('-'))
      const orgIds = []

      orgIds[0] = value[0]

      if (this.type === 'add') {
        this.viewUser({ orgIds })
        setFormDatas({ leader: [] })
      } else {
        if (this.orgDataInfo.orgId === value[0]) {
          this.$message.error('当前部门不能选为上级部门')
          setFormDatas({ parentId: [this.orgDataInfo.parentId] })
        }
        const currentPath = this.recursionFatherOrSon(this.allOrgList, value[0]).join('-')
        if (currentPath !== this.orgDataInfo.path && currentPath.indexOf(this.orgDataInfo.path) !== -1) {
          this.$message.error('当前部门的下级部门，不可以选择为上级部门')
          setFormDatas({ parentId: [this.orgDataInfo.parentId] })
        }
      }
    }
    const leaderTreeChange = (value, form, formDatas, setFormDatas) => {
      // console.log('value2', value)
      // console.log('data', this.leaderTree.treeOptions.data)
    }
    // 主管树结构
    const leaderTree = {
      prop: 'leader',
      itemType: 'tree',
      label: '设置主管:',
      change: leaderTreeChange,
      // labelWidth: '100px',
      popoverOptions: {
        trigger: 'click',
        width: '560',
        title: '选择主管'
      },
      treeOptions: {
        maxLength: 5,
        checkStrictly: false,
        // defaultExpandAll: true,
        nodeKey: 'userId',
        props: {
          label: 'realName',
          children: 'child'
        },
        checkedTagsRenderContent: (item) => { return this.checkedTagsRenderContent(item) },
        renderContent: this.renderContent,
        showCheckbox: true,
        isPopTree: true,
        treeSelectTitle: '请选择(最多选择5个)',
        span: [12, 12],
        treeSelectedTitle: '已选择',
        data: [
          // {
          //   userId: 1,
          //   realName: '全部',
          //   child: []
          // }
        ]
      },
      placeholder: '请选择主管'
    }
    // 上级部门树结构
    const patentTree = {
      prop: 'parentId',
      itemType: 'tree',
      label: '上级部门:',
      change: patentTreeChange,
      popoverOptions: {
        trigger: 'click',
        width: '560',
        title: '选择部门'
      },
      treeOptions: {
        checkStrictly: false,
        defaultExpandAll: false,
        nodeKey: 'orgId',
        props: {
          label: 'name',
          children: 'child'
        },
        showCheckbox: false,
        isPopTree: true,
        treeSelectTitle: '请选择',
        span: [12, 12],
        treeSelectedTitle: '已选择',
        data: []
      },
      rules: [commonChangeReg],
      placeholder: '请选择上级部门'
    }
    // 添加公司弹框的内容
    const addCompanyContent = [
      {
        itemType: 'view',
        text: '基本信息',
        style
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '公司名称:',
        labelWidth: '100px',
        rules: [commonBlurReg, departmentReg, departmentReg2],
        placeholder: '请输入公司名称'
      }
    ]
    // 编辑公司弹框的内容
    const editFirstCompanyContent = [
      ...addCompanyContent,
      { ...leaderTree, labelWidth: '100px' }
    ]
    // 查询表单的配置信息
    const searchData = {
      _orgIds: {
        prop: 'orgIds',
        itemType: 'tree',
        clearable: true,
        itemStyle: { width: '25%' },
        // type: 'input',
        rows: '1',
        label: '部门名称:',
        popoverOptions: {
          placement: 'bottom',
          trigger: 'click',
          width: '320',
          title: '选择部门'
        },
        treeOptions: {
          checkNeedChild: false,
          checkNeedParent: false,
          searchNeedChild: false,
          selectedHidden: true,
          isPopTree: true,
          defaultExpandAll: false,
          nodeKey: 'orgId',
          props: {
            label: 'name',
            children: 'child'
          },
          // treeSelectTitle: '请选择',
          span: [24, 0],
          treeSelectedTitle: '已选择',
          data: [],
          showCheckbox: true,
          expandOnClickNode: true
        },
        placeholder: '请选择部门'
      },
      _leaderUserId: {
        prop: 'leaderUserId',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '部门主管',
        itemStyle: { width: '25%' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        filterMethod: (value) => {
          const tempData = this.userListOptions && this.userListOptions.filter(item => {
            return item.label && item.label.includes(value) || item.name && item.name.includes(value)
          })
          this.searchData._leaderUserId.dataSource = tempData
        },
        clear: (form, formDatas, setFormDatas, scope) => {
          this.formDatas.leaderUserId = ''
        },
        dataSource: []
      },
      _functionTag: {
        prop: 'functionTag',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '部门类型',
        itemStyle: { width: '25%' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.formDatas.functionTag = ''
        },
        dataSource: []
      },
      _userId: {
        prop: 'userId',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '用户名称',
        itemStyle: { width: '25%' },
        valueKey: 'value',
        filterMethod: (value) => {
          const tempData = this.userListOptions && this.userListOptions.filter(item => {
            return item.label && item.label.includes(value) || item.name && item.name.includes(value)
          })
          this.searchData._userId.dataSource = tempData
        },
        clearable: true,
        filterable: true,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.formDatas.userId = ''
        },
        dataSource: []
      },
      // {
      //   props: 'orgType',
      //   itemType: 'select',
      //   label: '部门类型',
      //   dataSource: [
      //     {
      //       value: 1,
      //       label: '销售'
      //     },
      //     {
      //       value: 2,
      //       label: '财务'
      //     },
      //     {
      //       value: 3,
      //       label: '客服'
      //     },
      //     {
      //       value: 4,
      //       label: '其他'
      //     }
      //   ]
      // },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        size: 'small',
        submitHandle: params => {
          const data = { ...params }
          this.getOrgList(data)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    // 表格头配置信息/以下五个都是table的配置信息
    const columns = [
      {
        prop: 'name',
        label: '部门名称',
        align: 'left',
        minWidth: '300',
        width: '400',
        formater: scope => {
          // debugger
          let isnowechat = ''
          let isnoleader = ''
          if (!scope.row.leaderList) {
            isnoleader = '<span class="isnoleader"></span>'
          }
          if (!scope.row.weComDeptId) {
            isnowechat = '<span class="isnowechat"></span>'
          }
          return `<span ><span ><span class="box">${scope.row.employeeCount ? `${scope.row.name}(${scope.row.employeeCount})` : scope.row.name}</span><div class="icon-box">${isnoleader}${isnowechat}</div></span>`
        },
        handle: scope => {
          // console.log(scope)
        }
      },
      {
        prop: 'orgId',
        label: '部门ID',
        width: '150'
      },
      {
        prop: 'leaderList',
        label: '主管',
        minWidth: '200',
        formater: scope => {
          return scope.row[scope.column.property] && scope.row[scope.column.property].filter(item => item.isEnabled === 1).map(item => item.realName).join(' , ')
        }
      },
      {
        prop: 'functionTag',
        label: '部门类型',
        width: '150',
        formater: scope => {
          const data = this.departmentPopOptions.content._functionTag.dataSource.find(item => item.value === scope.row[scope.column.property])
          return data && data.label || (scope.row[scope.column.property] || '')
        }
      }
    ]
    // 操作栏修改isShow为方法使得修改按钮木有
    const modifyIsShow = scope => {
      // console.log('modifyIsShow', scope)
      const tempArray = [2, 5, 6]
      // return true
      if (tempArray.includes(scope.row.appSystemId)) {
        return false
      } else {
        return true
      }
    }
    // 表格操作栏的配置信息
    let dataList = [
      {
        label: '添加子部门',
        permitTag: ['userCenter:sysOrg:addSubDepartment'],
        isShow: true,
        handle: async(params) => {
          this.addDepartment('添加部门')
          const orgIds = params.row.orgId
          await this.viewUser({ orgIds: [orgIds] })
          const parentId = []
          parentId[0] = params.row.orgId
          this.departmentSetFormDatas({ parentId })
        }
      },
      {
        label: '设置用户',
        permitTag: ['userCenter:sysOrg:user:modify'],
        isShow: modifyIsShow,
        handle: params => {
          // console.log('查看用户', params)
          this.viewPopDialogHandle('设置用户')
          this.getUserPage()
          this.viewUser({ orgIds: [params.row.orgId] })
          this.orgId = params.row.orgId
        }
      },
      {
        label: '修改',
        isShow: true,
        permitTag: ['userCenter:sysOrg:modify'],
        handle: async params => {
          // console.log('编辑', params)
          this.getSysOrgInfo({ orgId: params.row.orgId })
          // 根据部门id获取用户(员工)
          // const orgIds = []
          // const leader = params.row.leaderList ? params.row.leaderList.map(item => item.userId) : []
          if (params.row.orgType === 1) {
          //   this.$set(this.popOptions, 'content', this.editFirstCompanyContent)
            this.editCompany()
          //   orgIds[0] = params.row.orgId
          //   this.viewUser({ orgIds })
          //   this.$set(this.editFirstCompanyContent[2].treeOptions, 'nodeKey', 'userId')
          //   // this.setFormDatas({ ...params.row, leader })
          //   this.getSysOrgInfo({ orgId: params.row.orgId })
          } else {
            this.editDepartment()
          //   const parentId = []
          //   parentId[0] = params.row.parentId
          //   orgIds[0] = this.type === 'add' ? params.row.parentId : params.row.orgId
          //   this.viewUser({ orgIds })
          //   // this.departmentSetFormDatas({ ...params.row, parentId, leader })
          //   this.getAllOrgList()
          //   this.getSysOrgInfo({ orgId: params.row.orgId })
          }
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['userCenter:sysOrg:delete'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该部门数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteDepartment(params.row.orgId)
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
    dataList = this.$filterPermission(dataList)
    const popOperates = {
      label: '操作',
      width: '280',
      fixed: 'right',
      dataSource: dataList
    }
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getOrgList({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.getOrgList({ pageNum: 1, pageSize: val })
      }
    }
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      okText: '保存',
      ok: async params => {
        // console.log('zzz', params)
        const leader = params.leader && params.leader.join(',')
        const parentId = params.parentId && params.parentId !== -1 ? params.parentId[0] : -1
        const otherOrgIds = params.otherOrgIdList && params.otherOrgIdList.join(',')
        const weComDeptId = params.weComDeptId ? params.weComDeptId : ''
        if (this.flag) {
          this.flag = false
          this.addOrEditCompanyOrDepartment({ ...params, leader, parentId, otherOrgIds, weComDeptId })
        }
      },
      cancel: params => {
        this.PopDialogHandle()
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        // labelWidth: '130px'
      },
      content: addCompanyContent
    }
    // 部门pop弹出框配置信息
    const departmentPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      okText: '保存',
      ok: async params => {
        // console.log('zzz', params)
        const leader = params.leader && params.leader.join(',')
        const parentId = params.parentId && params.parentId !== -1 ? params.parentId[0] : -1
        const otherOrgIds = params.otherOrgIdList && params.otherOrgIdList.join(',')
        if (this.flag) {
          this.flag = false
          this.addOrEditCompanyOrDepartment({ ...params, leader, parentId, otherOrgIds })
        }
      },
      cancel: params => {
        this.departmentPopDialogHandle()
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        // labelWidth: '130px'
      },
      content: {
        _view: {
          itemType: 'view',
          text: '基本信息',
          style
        },
        _name: {
          prop: 'name',
          itemType: 'input',
          label: '部门名称:',
          rules: [commonBlurReg, departmentReg, departmentReg2],
          placeholder: '请输入部门名称'
        },
        _parentId: patentTree,
        _leaderTree: leaderTree,
        _functionTag: {
          prop: 'functionTag',
          itemType: 'select',
          label: '部门类型:',
          rules: [commonChangeReg],
          dataSource: []
        }
      }
    }
    // 设置用户弹出框配置信息
    const viewPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      okText: '保存',
      ok: params => {
        // console.log('111', params)
        const ids = params.role && params.role.length !== 0 ? params.role.map(item => item.userId) : []
        const addUserIds = ids.filter(item => !this.userList.includes(item))
        const deleteUserIds = this.userList.filter(item => !ids.includes(item))
        this.saveUser({ orgId: this.orgId, addUserIds, deleteUserIds })
      },
      cancel: params => {
        this.$set(this.viewPopOptions, 'visible', false)
        // this.userValue = ''
      },
      formDatas: {},
      formOptions: {
        className: 'pop-table'
        // labelWidth: '0px'
      },
      content: [
        {
          prop: 'role',
          itemType: 'table-search',
          tooltipEffect: 'dark',
          pagination: {
            // currentPage: 1,
            // pageSize: 20,
            // dataTotal: dataSource.length,
            layout: 'pager',
            currentChange: val => {
              this.getUserPage({ pageSize: 20, pageNum: val })
            },
            sizeChange: val => {
              // this.getUserPage({ pageNum: this.userPagination.pageNum || 1, pageSize: val })
            }
          },
          // label: '表格数据',
          // labelWidth: '0',
          tableOptions: {
            rowKey: 'userId',
            useDefaultOperate: true,
            span: [14, 10],
            operates: {
              label: '选择'
            },
            selectedType: 'object',
            headerCellStyle: { 'background-color': '#F5F7FA' },
            isPopTable: false,
            selectedTitle: '已选择',
            selectTitle: '待选择',
            needSearch: true,
            tooltipEffect: 'dark',
            props: { label: 'info' },
            dataSource: [],
            checkedTagsRenderContent: (item) => { return this.checkedTagsRenderContent(item) },
            columns: [
              {
                prop: 'realName',
                label: '姓名',
                width: '80px',
                showOverflowTooltip: true,
                formater: scope => {
                  // console.log('姓名', scope)
                  if (scope.row.isEnabled === 1) {
                    return scope.row[scope.column.property]
                  } else if (scope.row.isEnabled === 0) {
                    return `<span style="color: #FE4949">！</span>${scope.row[scope.column.property]}`
                  }
                }
              },
              {
                prop: 'orgs',
                label: '部门',
                showOverflowTooltip: true,
                formater: scope => {
                  const orgs = scope.row[scope.column.property]
                  return orgs && orgs.length !== 0 ? orgs.map(item => item.name).join(' / ') : ''
                }
              }
            ]
          },
          searchOptions: {
            inputChange: (value) => {
              this.userValue = value
              if (!this.getData) {
                this.getData = this.$utils.debounce(this.getUserPage, 300)
              }
              this.getData({ realName: value })
            },
            type: 'textarea'
          }
        }
      ]
    }
    return {
      formOtions: {
        size: 'small',
        layout: true,
        inline: true
      },
      searchData,
      columns,
      // dataSource: [],
      popOperates,
      pagination,
      popOptions,
      viewPopOptions,
      departmentPopOptions,
      addCompanyContent,
      editFirstCompanyContent,
      orgType: 1,
      type: 'add',
      switch: false,
      leaderTree,
      patentTree,
      flag: true,
      searchFormDatas: {},
      formDatas: {
        orgIds: []
      },
      orgId: '',
      orginDatas: [],
      allOrgList: [],
      orgDataInfo: {},
      rowInfoMessages: {},
      userValue: ''
    }
  },
  computed: {
    dataSource: {
      get() {
        return this.$store.state.user.departmentData
      },
      set(data) {
        this.$store.commit('user/SET_DEPARTMENTData', data)
      }
    }
  },
  created() {
    this.getAllOrgList()
    this.getOrgList()
    this.userListOption()
    this.sysOrgTypeOption()
  },
  activated() {
    this.getOrgList()
  },
  methods: {
    // 部门主管查询
    async userListOption() {
      const res = await getUserListOption({ isEnabled: 1 })
      let data = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          data = list.map(item => ({ value: item.userId, label: item.realName, name: item.name }))
        }
      }
      this.userListOptions = data
      this.$set(this.searchData._userId, 'dataSource', data)
      this.$set(this.searchData._leaderUserId, 'dataSource', data)
    },
    // 部门类型查询
    async sysOrgTypeOption() {
      const res = await getSysOrgTypeOption({})
      let data = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          data = list.map(item => ({ value: item.abbr, label: item.typeName }))
        }
      }
      this.departmentPopOptions.content._functionTag.dataSource = data
      this.$set(this.searchData._functionTag, 'dataSource', data)
    },
    tableRowClassName({ row, column, rowIndex, columnIndex }) {
      // if (column.label === '部门名称') {
      //   if (!row.weComDeptId && row.leaderList) {
      //     return 'isnowechat'
      //   } else if (row.weComDeptId && !row.leaderList) {
      //     return 'isnoleader'
      //   } else if (!row.weComDeptId && !row.leaderList) {
      //     return 'isnoleader isnowechat'
      //   }
      //   if (!row.leaderList) {
      //     return 'isnoleader'
      //   }
      // }
      return ''
    },
    // 回调函数修改表格的表头居中
    // headerCellStyle({ row, column, rowIndex, columnIndex }) {
    //   if (column.label === '部门名称') {
    //     return { 'text-align': 'center' }
    //   }
    // },
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 修改按钮
    setFormDatas(params) {
      // console.log('修改', params)
      // setTimeout(() => {
      this.$set(this.popOptions, 'formDatas', params)
      // }, 0)
    },
    // 修改弹出层的判断
    departmentPopDialogHandle(val) {
      this.$set(this.departmentPopOptions, 'visible', !this.departmentPopOptions.visible)
      if (val) {
        this.$set(this.departmentPopOptions, 'title', val)
      }
    },
    // 修改按钮
    departmentSetFormDatas(params) {
      // console.log('修改', params)
      // setTimeout(() => {
      this.$set(this.departmentPopOptions, 'formDatas', params)
      // }, 0)
    },
    // 修改查看用户弹出层的判断
    viewPopDialogHandle(val) {
      this.userValue = ''
      this.$set(this.viewPopOptions, 'visible', !this.viewPopOptions.visible)
      if (val) {
        this.$set(this.viewPopOptions, 'title', val)
      }
    },
    async syncWechat() {
      const res = await this.$uiUtils.confirmMsg({ message: '是否开始企业微信部门及员工同步', cancelMessage: '已取消操作' })
      if (res) {
        const data = await sysOrgSync({})
        if (this.$pub.responseValidate(data)) {
          this.$message.success('同步任务开启成功!')
        }
      } else {
        console.log('取消同步')
      }
    },
    // 添加公司
    addCompany() {
      this.$set(this.popOptions, 'content', this.addCompanyContent)
      this.PopDialogHandle('添加公司')
      this.$set(this.popOptions, 'formDatas', {})
      this.orgType = 1
      this.type = 'add'
    },
    // 编辑公司
    editCompany() {
      this.orgType = 1
      this.type = 'edit'
      // this.$set(this.popOptions, 'content', this.editFirstCompanyContent)
      this.PopDialogHandle('编辑公司')
      // this.getAllOrgList()
    },
    // 添加部门
    addDepartment(val) {
      this.orgType = 2
      this.type = 'add'
      // console.log('223', this.leaderTree)
      this.departmentSetFormDatas({ leader: [], parentId: [] })
      // console.log(111, this.addDepartmentContent)
      // this.$set(this.popOptions, 'content', this.addDepartmentContent)
      this.$set(this.leaderTree.treeOptions, 'data', [])
      this.getAllOrgList()
      this.departmentPopDialogHandle(val)
    },
    // 编辑部门
    editDepartment() {
      this.orgType = 2
      this.type = 'edit'
      this.departmentPopDialogHandle('编辑部门')
      // this.getAllOrgList()
    },
    // 弹出框确认按钮事件
    addOrEditCompanyOrDepartment(data) {
      if (this.type === 'add') {
        this.addCompanyOrDepartment(data)
      } else if (this.type === 'edit') {
        this.editCompanyOrDepartment(data)
      }
    },
    // 添加公司或部门
    async addCompanyOrDepartment(data = {}) {
      const res = await sysOrgAdd({ ...data, orgType: this.orgType }).catch(() => {
        this.flag = true
      })
      this.flag = true
      if (!res || res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('INSERT', '/userCenter/sysOrg/add'), data, JSON.stringify({ beforeText: `在'用户中心-组织架构'新增一条记录`, beforeCode: data }))
      this.orgType === 1 ? this.$set(this.popOptions, 'visible', false) : this.$set(this.departmentPopOptions, 'visible', false)
      this.$message.success(`添加${this.orgType === 1 ? '公司' : '部门'}成功`)
      this.getOrgList()
    },
    // 编辑公司或部门
    async editCompanyOrDepartment(data = {}) {
      const res = await sysOrgModify({ ...data, orgType: this.orgType }).catch(() => {
        this.flag = true
      })
      this.flag = true
      if (!res || res.code !== 200) {
        return false
      }
      this.rowInfoMessages.leader = this.rowInfoMessages.leaderList ? this.rowInfoMessages.leaderList.map(item => item.userId) : []
      data.leader = data.leader ? data.leader.split(',') : []
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'orgId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysOrg/modify'), data, JSON.stringify({ beforeText: `在'用户中心-组织架构'将${JSON.stringify({ 'orgId': data.orgId })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      this.orgType === 1 ? this.$set(this.popOptions, 'visible', false) : this.$set(this.departmentPopOptions, 'visible', false)
      this.$message.success(`修改${this.orgType === 1 ? '公司' : '部门'}成功`)
      this.getOrgList()
    },
    // 删除部门
    async deleteDepartment(id) {
      const res = await sysOrgDelete({ orgId: id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('DEL', '/userCenter/sysOrg/delete'), { orgId: id }, JSON.stringify({ beforeText: `在'用户中心-组织架构'删除一条记录`, beforeCode: { orgId: id }}))
      this.$message.success('删除成功')
      this.getOrgList()
    },
    // 分页查询组织结构列表
    @_debounce(50)
    async getOrgList(data = {}) {
      const res = await orgPage({ ...this.searchFormDatas, ...data })
      // console.log('组织机构列表', res)
      const orgList = res.data.list || []
      console.log(orgList, 'orgList----')
      this.dataSource = orgList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },
    // 获取所有组织机构(部门)
    async getAllOrgList(data = {}) {
      const res = await sysOrgList(data)
      console.log('部门列表', res)
      const AllOrgList = res.data.list || []
      this.allOrgList = AllOrgList
      console.log(AllOrgList, 'AllOrgList---')
      const orgIdList = AllOrgList.map(item => item.orgId)
      console.log(orgIdList, 'orgIdList----')
      this.$set(this.searchData._orgIds.treeOptions, 'defaultExpandedKeys', orgIdList)
      this.$set(this.patentTree.treeOptions, 'defaultExpandedKeys', orgIdList)
      this.$set(this.searchData._orgIds.treeOptions, 'data', AllOrgList)
      this.$set(this.patentTree.treeOptions, 'data', AllOrgList)
      // this.$set(this.patentTreeTwo.treeOptions, 'data', AllOrgList)
    },
    // 获取用户分页列表
    async getUserPage(data = {}) {
      // const res = await userPageList({ ...this.searchFormDatas, ...data, requireOrgFlag: 1, requireDataGroupFlag: 1 })
      const res = await userPageList({ ...data, requireOrgFlag: 1, requireDataGroupFlag: 1, realName: this.userValue || '' })
      // console.log('用户列表', res)
      const userList = res.data.list || []
      // this.dataSource = userList
      this.$set(this.viewPopOptions.content[0].tableOptions, 'dataSource', userList)
      this.$set(this.viewPopOptions.content[0], 'pagination', {
        ...this.viewPopOptions.content[0].pagination,
        dataTotal: res.data.total || 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      })
    },
    // 查看用户(左边数据)
    async viewUser(data = {}) {
      const res = await userList({ ...data, requireOrgFlag: 1 })
      console.log('查看用户', res)
      const userLists = res.data.list || []
      this.$set(this.viewPopOptions.formDatas, 'role', userLists)
      this.userList = userLists.length !== 0 ? userLists.map(item => item.userId) : []
      this.$set(this.leaderTree.treeOptions, 'data', userLists)
    },
    // 设置用户
    async saveUser(data = {}) {
      const res = await sysOrgUserModify(data)
      if (res.code !== 200) {
        return false
      }
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'roleId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('SET', '/userCenter/sysRole/user/modify'), data, JSON.stringify({ beforeText: `在'用户中心-角色管理'做了设置操作`, afterCode }))
      // this.viewPopDialogHandle()
      this.$set(this.viewPopOptions, 'visible', false)
      this.$message.success('保存成功')
    },
    // 部门一行显示
    sortDepartment(data) {
      if (data.orgs && data.orgs.length !== 0) {
        return `（ ${data.orgs && data.orgs.map(item => item.name).join(' / ')} ）`
      } else {
        return ''
      }
    },
    // 树形
    renderContent(h, { node, data, store }) {
      // console.log('node', node, data, store)
      if (data.realName === '全部') {
        return <span class='hidden-checkBox'>{data.realName}</span>
      } else {
        return (
          <span class='custom-tree-node-department'>
            <div>{data.realName }</div>
            <div class='spot color' title={this.sortDepartment(data)}>{this.sortDepartment(data)}</div>
          </span>
        )
      }
    },
    checkedTagsRenderContent(item) {
      if (item.isEnabled === 1) {
        return `<div class="custom-tree-node"><span class="spot" title="${this.sortDepartment(item)}">${item.realName} ${this.sortDepartment(item)}<span></div>`
      } else if (item.isEnabled === 0) {
        return `<div class="custom-tree-node"><span style="color: #FE4949">！</span><span class="spot" title="${this.sortDepartment(item)}">${item.realName} ${this.sortDepartment(item)}<span></div>`
      }
    },
    // 获取组织机构详情
    async getSysOrgInfo(data = {}) {
      const res = await sysOrgInfo(data)
      console.log('详情', res)
      if (res.code !== 200) {
        return false
      }
      const dataList = res.data || {}
      this.rowInfoMessages = dataList
      this.orgDataInfo = dataList
      const orgIds = []
      const leader = dataList.leaderList ? dataList.leaderList.map(item => item.userId) : []
      if (dataList.orgType === 1) {
        this.$set(this.popOptions, 'content', this.editFirstCompanyContent)
        // this.editCompany()
        orgIds[0] = dataList.orgId
        await this.viewUser({ orgIds })
        this.$set(this.editFirstCompanyContent[2].treeOptions, 'nodeKey', 'userId')
        this.setFormDatas({ ...dataList, leader })
      } else {
        // this.editDepartment()
        const parentId = []
        parentId[0] = dataList.parentId
        orgIds[0] = this.type === 'add' ? dataList.parentId : dataList.orgId
        await this.viewUser({ orgIds })
        this.departmentSetFormDatas({ ...dataList, parentId, leader })
        this.getAllOrgList()
      }
      // this.setFormDatas({ ...res.data })
    },
    // 递归查找数据
    recursionFatherOrSon(array, id) {
      const newArray = []
      // console.log('array', array, id)
      function recursion(array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].orgId === id) {
            newArray.push(array[i].orgId)
            return newArray
          }
          if (array[i].child && array[i].child.length) {
            newArray.push(array[i].orgId)
            const res = recursion(array[i].child)
            if (res) {
              return res
            } else {
              newArray.splice(newArray.indexOf(array[i].orgId), 1)
            }
          }
        }
        return false
      }
      return recursion(array)
    },
    // 传日志信息到卡夫卡
    fetchLog(messages, data, description) {
      this.$store.dispatch('app/fetchLog', { ...messages, params: JSON.stringify(data), description })
    },
    // 日志描述新老数据比对
    compareData(oldData, newData, id) {
      const comparedKeys = Object.keys(newData).filter(item => {
        if (Array.isArray(newData[item])) {
          return JSON.stringify(oldData[item] || []) !== JSON.stringify(newData[item])
        } else {
          return oldData[item] !== newData[item]
        }
      })
      const oldObj = {}
      const newObj = {}
      comparedKeys.forEach(item => {
        oldObj[item] = oldData[item]
        newObj[item] = newData[item]
      })
      console.log(oldObj, newObj)
      return {
        beforeCode: { ...oldObj, [id]: newData[id] },
        afterCode: { ...newObj, [id]: newData[id] }
      }
    },
    // 获取需要传过去的日志信息
    getLogMessages(opratorType, api) {
      const { userInfo, topic } = this.$store.state.user
      const baseURL = this.$store.state.app.baseURL
      const logcommonMessages = {
        type: 'OP',
        appId: 'userCenter',
        handleResult: 'SUCCESS',
        userId: userInfo.userId,
        realName: userInfo.realName,
        userName: userInfo.name,
        topic: topic,
        description: '',
        createTime: new Date().getTime()
      }
      return {
        ...logcommonMessages,
        opratorType: opratorType,
        api: baseURL + api
      }
    }
  }
}
</script>

<style lang='scss'>
.departmentManagement {
  padding: 20px;
  // padding-bottom: 0;

  .table {
    // background-color: #fff;
    // padding: 0 10px 20px;
  }

  .noData {
    padding-top: 120px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    color: #ccc;
  }

  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>
<style lang='scss'>
.custom-tree-node-department {
  width: 188px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  .color {
    color:#aaa;
  }
  .spot {
    // width:160px;
    flex: 1;
    font-size:14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.custom-tree-node {
  display: flex;
  padding-right: 15px;

  .spot {
    flex: 1;
    font-size:14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.isnowechat  {
  display: inline-block;
  height: 20px;
  width: 20px;
  background: url('../../../assets/images/nowechat.png');
  background-size: 100%;
  background-position: inherit;
  margin-left: 5px;
}
.isnoleader  {
  display: inline-block;
  height: 20px;
  width: 20px;
  background: url('../../../assets/images/noleader.png');
  background-size: 100%;
  background-position: inherit;
}
.box {
   display: inline-block;
    width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: bottom;
}
.icon-box {
  text-align: right;
      position: absolute;
    top: 0;
    right: 50px;
    width: 50px;
    height: 20px;
}
.isnowechat .cell {
  word-break: inherit;
}
.isnoleader .cell {
  word-break: inherit;
}
</style>
