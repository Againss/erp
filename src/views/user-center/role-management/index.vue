<template>
  <!-- 角色管理页面 -->
  <div class="role">
    <!-- 新增角色按钮 -->
    <div v-if="systemId" class="system-button">
      <span class="systemName"><span class="system-text">当前微服务/系统：</span>{{ systemName }}</span>
    </div>
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['userCenter:sysRole:add']" size="small" type="primary" @click="addRole">新增角色</el-button>
    </div>
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        :table-scrollx="true"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
    <!-- 导入pop弹出层(查看用户) -->
    <div class="userPop pop">
      <cs-custom-pop :options="viewPopOptions" />
    </div>
  </div>
</template>

<script>
import { rolePageList, roleAdd, roleDelete, roleModify, roleUserModify, roleUserList, companyAccountTypesList, companyAccountsList, roleInfo } from './api/index.js'
import { sysPermitList } from '../menu-management/api/index.js'
import { sysAppSystemList } from '../micro-services/api/index.js'
import { userList, userPageList } from '../employee-management/api/index.js'
export default {
  name: 'RoleManagementIndex',
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 角色用户名规则
    const roleReg = this.$getRules({ type: 'role', trigger: ['blur'] })
    // 是否为ERP switch change事件
    // const switchChange = value => {
    //   if (value === 1) {
    //     this.$set(this.popOptions, 'content', EPRContent)
    //   } else {
    //     this.$set(this.popOptions, 'content', content)
    //   }
    // }
    const companyChange = value => {
      // console.log(value)
      if (value[0] === -1) {
        this.$set(this.popOptions.formDatas, 'companyId', [])
      }
    }
    // 公共弹出框内容
    const content = [
      {
        prop: 'appSystemId',
        itemType: 'select',
        label: '所属系统:',
        filterable: true,
        rules: [commonChangeReg],
        dataSource: []
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '角色名称:',
        rules: [commonBlurReg, roleReg],
        placeholder: '请输入角色名称'
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'remark',
        maxlength: 30,
        label: '描述:',
        placeholder: '请输入描述内容'
      }
      // {
      //   itemType: 'switch',
      //   prop: 'isErp',
      //   change: switchChange,
      //   label: '是否为布行ERP:',
      //   activeValue: 1,
      //   inactiveValue: 0
      // }
    ]
    // 所属系统为用户中心没打开switch开关的内容
    const userCenterContent = [
      ...content,
      {
        prop: 'systemId',
        itemType: 'select',
        label: '指定系统:',
        placeholder: '请选择系统',
        multiple: true,
        collapseTags: true,
        rules: [commonChangeReg],
        dataSource: []
      }
    ]
    // 打开ERP switch开关后的内容
    const EPRContent = [
      ...content,
      {
        prop: 'companyTypes',
        itemType: 'select',
        label: '公司类型:',
        placeholder: '请选择公司类型',
        multiple: true,
        collapseTags: true,
        rules: [commonChangeReg],
        dataSource: []
      },
      {
        prop: 'companyId',
        change: companyChange,
        itemType: 'tree',
        label: '所属公司:',
        popoverOptions: {
          trigger: 'click',
          width: '560',
          title: '选择公司'
        },
        treeOptions: {
          checkStrictly: false,
          defaultExpandAll: false,
          nodeKey: 'id',
          props: {
            label: 'name'
            // children: 'child'
          },
          // checkedTagsRenderContent: (item) => { return this.ParentCheckedTagsRenderContent(item) },
          // renderContent: this.ParentenderContent,
          showCheckbox: false,
          isPopTree: true,
          treeSelectTitle: '请选择',
          span: [12, 12],
          treeSelectedTitle: '已选择',
          data: [
            {
              id: -1,
              name: '全部',
              // disabled: true,
              children: []
            }
          ]
        },
        rules: [commonChangeReg],
        placeholder: '请选择所属公司'
      },
      {
        prop: 'isShared',
        itemType: 'radio-group',
        label: '是否共享:',
        rules: [commonChangeReg],
        dataSource: [{ value: 1, label: '是' }, { value: 0, label: '否' }]
      }
    ]
    // 所属系统为用户中心打开switch开关的内容
    const userCenterEPRContent = [
      ...EPRContent,
      {
        prop: 'systemId',
        itemType: 'select',
        label: '指定系统:',
        placeholder: '请选择系统',
        multiple: true,
        collapseTags: true,
        rules: [commonChangeReg],
        dataSource: []
      }
    ]
    // 查询/重置表单配置信息
    const searchData = {
      _name: {
        prop: 'name',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '角色名称:',
        clearable: true,
        placeholder: '请输入角色名称查询'
      },
      _realName: {
        prop: 'realName',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '员工姓名:',
        clearable: true,
        placeholder: '请输入员工姓名'
      },
      _appSystemIds: {
        prop: 'appSystemIds',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '所属系统:',
        valueKey: 'value',
        clearable: true,
        filterable: true,
        dataSource: [],
        change: (value, form, formDatas, setFormDatas) => {
          this.searchData._permitIds.isShow = false
          setFormDatas({ permitIds: [] })
          if (value) {
            this.getSysPermitList({ appSystemId: value })
          } else {
            this.$set(this.searchData._permitIds, 'options', [])
          }
          this.$nextTick(() => {
            this.searchData._permitIds.isShow = true
          })
        }
      },
      _permitIds: {
        isShow: true,
        prop: 'permitIds',
        itemStyle: { width: '25%' },
        itemType: 'cascader',
        collapseTags: true,
        label: '菜单权限:',
        options: [],
        props: {
          checkStrictly: true,
          multiple: true,
          value: 'permitId',
          label: 'name',
          children: 'child'
        },
        placeholder: '请先选择所属系统'
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const data = params.permitIds && params.permitIds.flat() || []
          const appSystemIds = params.appSystemIds && [params.appSystemIds] || []
          this.searchFormDatas = { ...params, permitIds: [...new Set(data)], appSystemIds }
          this.getRoleList(this.searchFormDatas)
        },
        resetHandle: (params) => {
          this.searchData._permitIds.isShow = false
          this.formDatas = { permitIds: [] }
          this.searchFormDatas = {}
          this.$set(this.searchData._permitIds, 'options', [])
          this.systemId && this.$set(this.formDatas, 'appSystemIds', this.systemId)
          this.systemId && this.getSysPermitList({ appSystemId: this.systemId })
          this.$nextTick(() => {
            this.searchData._permitIds.isShow = true
          })
        }
      }
    }
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'roleId',
        label: '角色ID',
        width: '150'
      },
      {
        prop: 'name',
        label: '角色名称',
        minWidth: '280',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '状态',
        width: '80',
        formater: scope => {
          return scope.row[scope.column.property] !== null && scope.row[scope.column.property] === 1
            ? `<span style="color: #00BCC5;">已授权</span>`
            : `<span style="color: #FF9214;">未授权</span>`
        }
      },
      {
        prop: 'appSystemName',
        label: '所属系统',
        minWidth: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        width: '150',
        formater: scope => {
          return this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}')
        }
      }
    ]
    // 当从微服务系统管理点击过来表格内容会换 这是复制的一个版本 用来返回数据的
    const cpColumns = [
      ...columns
    ]
    // 操作栏修改isShow为方法使得修改按钮木有
    const modifyIsShow = scope => {
      // console.log('modifyIsShow', scope.row.appSystemId)
      const tempArray = [2, 5, 6]
      if (tempArray.includes(scope.row.appSystemId)) {
        return false
      } else {
        return true
      }
    }
    const modifyIsShow1 = scope => {
      // console.log('modifyIsShow', scope.row.appSystemId)
      const tempArray = [2, 5, 6]
      if (tempArray.includes(scope.row.appSystemId)) {
        return false
      } else {
        if (scope.row.status === 3) {
          return false
        } else {
          return true
        }
      }
    }
    let dataList = [
      {
        label: '设置用户',
        permitTag: ['userCenter:sysRole:user:modify'],
        isShow: modifyIsShow,
        handle: params => {
          // console.log('查看用户', params)
          this.viewPopDialogHandle('查看用户')
          // this.getUserList(params.row.roleId)
          this.getUserPage()
          this.viewUser({ roleIds: [params.row.roleId] })
          this.roleId = params.row.roleId
        }
      },
      {
        label: '授权',
        permitTag: ['userCenter:sysRole:permit:modify'],
        isShow: modifyIsShow1,
        handle: params => {
          // console.log(params)
          this.$router.push({ path: '/user-center/role-management/role-authorization/' + params.row.roleId, params: { id: params.row.roleId }})
        }
      },
      {
        label: '修改',
        permitTag: ['userCenter:sysRole:modify'],
        isShow: modifyIsShow1,
        handle: params => {
          // console.log('修改', params)
          this.type = 'edit'
          this.$set(this.content[0], 'disabled', this.isDisabled())
          this.$set(this.popOptions.content[0], 'dataSource', this.sysList)
          if (params.row.isErp === 1) {
            this.$set(this.popOptions, 'content', this.EPRContent)
          } else {
            this.$set(this.popOptions, 'content', this.content)
          }
          this.PopDialogHandle('修改角色')
          this.getRoleInfo({ roleId: params.row.roleId })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['userCenter:sysRole:delete'],
        isShow: modifyIsShow1,
        handle: params => {
          // console.log(params)
          this.$confirm(' 你确认要删除该角色数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteRole(params.row.roleId)
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
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '240',
      fixed: 'right',
      dataSource: dataList
    }
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getRoleList({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.getRoleList({ pageNum: 1, pageSize: val })
      }
    }
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('ok', params)
        // console.log('system', system)
        const isErp = params.isErp ? params.isErp * 1 : 0
        const pamrasObj = {
          0: ['appSystemId', 'name', 'remark', 'isErp'],
          1: ['appSystemId', 'name', 'remark', 'isErp', 'companyTypes', 'companyId', 'isShared']
        }
        const data = {}
        pamrasObj[isErp].forEach(v => {
          data[v] = params[v]
        })
        if (this.type === 'edit') {
          data['roleId'] = params['roleId']
        }
        const companyTypes = data.companyTypes ? data.companyTypes.join(',') : ''
        const companyId = data.companyId ? data.companyId[0] : null
        this.roleAddOrEdit({ ...data, companyTypes, companyId })

        // console.log(this.roleAddOrEdit({ ...params, companyTypes }))
      },
      cancel: params => {
        this.PopDialogHandle()
      },
      formDatas: {},
      formOptions: {
        // labelWidth: '120px'
      },
      content: content
    }
    // 设置用户弹出框配置信息
    const viewPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      okText: '保存',
      ok: params => {
        const ids = params.role && params.role.length !== 0 ? params.role.map(item => item.userId) : []
        const addUserIds = ids.filter(item => !this.userList.includes(item))
        const deleteUserIds = this.userList.filter(item => !ids.includes(item))
        this.saveUser({ roleId: this.roleId, addUserIds, deleteUserIds })
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
        // {
        //   prop: 'role',
        //   itemType: 'tree',
        //   label: '',
        //   popoverOptions: {
        //     title: '选择角色'
        //   },
        //   treeOptions: {
        //     checkStrictly: false,
        //     defaultExpandAll: false,
        //     nodeKey: 'userId',
        //     lazy: false,
        //     props: {
        //       label: 'realName',
        //       isLeaf: 'isLeaf'
        //       // children: 'child'
        //     },
        //     checkedTagsRenderContent: (item) => { return this.checkedTagsRenderContent(item) },
        //     renderContent: this.renderContent,
        //     showCheckbox: true,
        //     isPopTree: false,
        //     treeSelectTitle: '请选择',
        //     span: [12, 12],
        //     treeSelectedTitle: '已选择',
        //     data: []
        //   }
        // }
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
            headerCellStyle: { 'background-color': '#F5F7FA' },
            span: [14, 10],
            operates: {
              label: '选择'
            },
            selectedType: 'object',
            isPopTable: false,
            selectedTitle: '已选择',
            clearHandler: async() => {
              const res = await this.$uiUtils.confirmMsg({ message: '是否清空所有用户', cancelMessage: '已取消操作' })
              if (res) {
                this.$set(this.viewPopOptions.formDatas, 'role', [])
              } else {
                console.log('取消清空')
              }
            },
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
                  console.log('姓名', scope)
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
      cpColumns,
      // dataSource: [],
      pagination,
      popOperates,
      popOptions,
      viewPopOptions,
      type: 'add',
      sysList: [],
      formDatas: {
        name: '',
        realName: '',
        appSystemIds: '',
        permitIds: []
      },
      content,
      userCenterContent,
      EPRContent,
      userCenterEPRContent,
      systemId: null,
      systemName: null,
      searchFormDatas: {
        name: '',
        realName: ''
      },
      userList: [],
      appSystemIds: this.$store.state.user.userInfo.appSystemIds.length !== 0 ? this.$store.state.user.userInfo.appSystemIds : null,
      rowInfoMessages: {},
      rowSetMessages: [],
      userValue: ''
    }
  },
  computed: {
    dataSource: {
      get() {
        return this.$store.state.user.roleData
      },
      set(data) {
        this.$store.commit('user/SET_ROLEData', data)
      }
    }
  },
  watch: {
    // 监听路由是否带有id
    $route: {
      handler(v) {
        if (v.name !== this.$options.name) return
        if (v.query.id) {
          this.$set(this.formDatas, 'appSystemIds', v.query.id * 1)
          this.$set(this.formDatas, 'permitIds', [])
          this.columns = this.cpColumns.filter(item => item.prop !== 'appSystemName')
          this.$set(this.searchData._appSystemIds, 'disabled', true)
          this.systemId = v.query.id
          const tempData = this.sysList.find(item => item.value * 1 === this.systemId * 1)
          this.systemName = tempData && tempData.label
          this.getSysPermitList({ appSystemId: v.query.id })
          this.getRoleList({ appSystemIds: v.query.id ? [v.query.id] : [], permitIds: [] })
        } else {
          this.columns = this.cpColumns
          // this.$nextTick(() => {
          //   this.formDatas = { appSystemIds: '' }
          // })
          this.$set(this.searchData._appSystemIds, 'disabled', false)
          this.systemId = null
        }
        // this.formDatas.permitIds = []
        this.getRoleList()
        this.$set(this.content[0], 'disabled', this.isDisabled())
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getSysAppSystemList()
    // this.$permission(['userCenter:sysRole:user:modify']) && this.viewUser()
    // this.$permission(['userCenter:sysRole:user:modify']) && this.getUserPage()
    this.$permission(['userCenter:sysRole:modify', 'userCenter:sysRole:add']) && this.getCompanyType()
    this.$permission(['userCenter:sysRole:modify', 'userCenter:sysRole:add']) && this.getCompanyList()
  },
  mounted() {
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
    // 修改查看用户弹出层的判断
    viewPopDialogHandle(val) {
      this.userValue = ''
      this.$set(this.viewPopOptions, 'visible', !this.viewPopOptions.visible)
      if (val) {
        this.$set(this.viewPopOptions, 'title', val)
      }
    },
    // 查看用户按钮
    viewSetFormDatas(params) {
      // console.log('111', params)
      setTimeout(() => {
        this.$set(this.viewPopOptions, 'formDatas', params)
      }, 0)
    },
    // 角色列表查询
    async getRoleList(data = {}) {
      if (this.systemId && this.appSystemIds && !this.appSystemIds.includes(this.systemId)) {
        this.$message.error('您无权限查看此系统下的角色')
        this.$router.push('/user-center/role-management')
      }
      // const appSystemIds = this.systemId ? [this.systemId] : this.searchFormDatas.appSystemIds && [this.searchFormDatas.appSystemIds] || this.appSystemIds
      let appSystemIds = []
      if (this.searchFormDatas.appSystemIds) {
        appSystemIds = this.searchFormDatas.appSystemIds
      }
      if (data.appSystemIds && data.appSystemIds.length) {
        appSystemIds = data.appSystemIds
      }
      // const appSystemIds = data.appSystemIds ? data.appSystemIds||(this.searchFormDatas.appSystemIds) : []
      const res = await rolePageList({ ...this.searchFormDatas, ...data, appSystemIds })
      // console.log('角色列表', res)
      const listData = res.data.list || []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },
    // 新增角色
    addRole() {
      this.type = 'add'
      this.PopDialogHandle('新增角色')
      this.$set(this.popOptions, 'content', this.content)
      this.$set(this.content[0], 'disabled', this.isDisabled())
      this.$set(this.popOptions.content[0], 'dataSource', this.sysList.filter(item => ![2, 5, 6].includes(item.value)))
      this.setFormDatas({ isShared: 0, companyId: [] })
      this.$set(this.popOptions, 'formDatas', { appSystemId: this.systemId ? this.systemId * 1 : undefined })
    },
    // 新增或修改弹出框点击确认按钮的接口事件
    roleAddOrEdit(params) {
      // console.log('修改新增角色', params)
      // 走新增接口
      if (this.type === 'add') {
        this.newlyAddedRole(params)
      } else if (this.type === 'edit') { // 走编辑接口
        this.editRole(params)
      }
    },
    // 角色新增
    async newlyAddedRole(data = {}) {
      const res = await roleAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('INSERT', '/userCenter/sysRole/add'), data, JSON.stringify({ beforeText: `在'用户中心-角色管理'新增一条记录`, beforeCode: data }))
      this.$set(this.popOptions, 'visible', false)
      this.getRoleList()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    // 角色修改
    async editRole(data = {}) {
      const res = await roleModify(data)
      if (!res || res.code !== 200) {
        // console.log(1)
        return false
      }
      const rowInfoMessages = this.rowInfoMessages
      rowInfoMessages.isErp = rowInfoMessages.isErp === null ? 0 : rowInfoMessages.isErp
      data.isErp = data.isErp === null ? 0 : data.isErp
      rowInfoMessages.companyId = rowInfoMessages.companyId && rowInfoMessages.companyId * 1
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'roleId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysRole/modify'), data, JSON.stringify({ beforeText: `在'用户中心-角色管理'将${JSON.stringify({ 'roleId': data.roleId })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      this.$set(this.popOptions, 'visible', false)
      this.getRoleList()
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    //  获取系统
    async getSysAppSystemList(data = {}) {
      const res = await sysAppSystemList({ ...data })
      const systemList = res.data.list
      // console.log('系统列表', systemList)
      const list = systemList || []
      this.sysList = list.map(item => {
        return {
          value: item.appSysId,
          label: item.appSysName
        }
      })
      this.$set(this.searchData._appSystemIds, 'dataSource', this.sysList)
      // this.$set(this.popOptions.content[0], 'dataSource', list)
      const tempData = this.sysList.find(item => item.value * 1 === this.systemId * 1)
      this.systemName = tempData && tempData.label
    },
    // 获取系统菜单列表
    async getSysPermitList(data = {}) {
      const res = await sysPermitList({ ...data })
      const systemList = res.data.list
      // console.log('系统列表', systemList)
      const list = systemList && systemList.length && systemList[0].child || []
      this.$set(this.searchData._permitIds, 'options', list)
    },
    // 删除角色
    async deleteRole(id) {
      const res = await roleDelete({ roleId: id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('DEL', '/userCenter/sysRole/delete'), { roleId: id }, JSON.stringify({ beforeText: `在'用户中心-角色管理'删除一条记录`, beforeCode: { roleId: id }}))
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRoleList()
    },
    // 查看用户(左边数据)
    async viewUser(data = {}) {
      const res = await userList({ ...data, requireOrgFlag: 1 })
      console.log('查看用户', res)
      const userLists = res.data.list || []
      // const userArray = userLists.filter(item => {
      //   item.isLeaf = true
      //   return item.realName !== null && item.realName !== ''
      // })
      this.$set(this.viewPopOptions.formDatas, 'role', userLists)
      this.userList = userLists.length !== 0 ? userLists.map(item => item.userId) : []
      // console.log('userArray', userArray)
      // this.$set(this.viewPopOptions.content[0].treeOptions, 'data', userArray.length !== 0 ? [{ userId: 1, realName: '全部', children: userArray }] : [])
      // this.$set(this.viewPopOptions.content[0].tableOptions, 'dataSource', userArray)
      // console.log('children', this.viewPopOptions.content[0].treeOptions.data[0].children)
    },
    // 部门一行显示 没有部门
    sortDepartment(data) {
      if (data.orgs && data.orgs.length !== 0) {
        return `（ ${data.orgs && data.orgs.map(item => item.name).join(' / ')} ）`
      } else {
        return ''
      }
    },
    // 树形重新渲染带部门
    renderContent(h, { node, data, store }) {
      // console.log('node', node, data, store)
      if (data.realName === '全部') {
        return <span>{node.label}</span>
      } else {
        return (
          <span class='custom-tree-node'>
            <div>{node.label }</div>
            <div class='spot color' title={this.sortDepartment(data)}>{this.sortDepartment(data)}</div>
          </span>
        )
      }
    },

    // 根据角色id查看用户(查看用户右边回显的数据)
    async getUserList(id) {
      const res = await roleUserList({ roleId: id })
      this.rowSetMessages = res.data
      const role = res.data.userIds
      this.userList = role
      // this.userList = role.length !== 0 ? role.map(item => item.userId) : []
      console.log('回显用户', res, role)
      this.$set(this.viewPopOptions.formDatas, 'role', role)
      // console.log('role', this.viewPopOptions.formDatas)
    },
    checkedTagsRenderContent(item) {
      console.log('item', item)
      if (item.isEnabled === 1) {
        return `<div class="custom-tree-node"><span class="spot" title="${this.sortDepartment(item)}">${item.realName} ${this.sortDepartment(item)}<span></div>`
      } else if (item.isEnabled === 0) {
        return `<div class="custom-tree-node"><span style="color: #FE4949">！</span><span class="spot" title="${this.sortDepartment(item)}">${item.realName} ${this.sortDepartment(item)}<span></div>`
      }
    },
    // 设置用户
    async saveUser(data = {}) {
      const res = await roleUserModify(data)
      if (res.code !== 200) {
        return false
      }
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'roleId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('SET', '/userCenter/sysRole/user/modify'), data, JSON.stringify({ beforeText: `在'用户中心-角色管理'做了设置操作`, afterCode }))
      // this.viewPopDialogHandle()
      this.$set(this.viewPopOptions, 'visible', false)
      this.$message.success('保存成功')
      this.getRoleList()
    },
    // 获取公司类型
    async getCompanyType() {
      const res = await companyAccountTypesList()
      // console.log('公司类型', res)
      const dataList = res.data.list.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
      this.$set(this.EPRContent[this.content.length], 'dataSource', dataList)
    },
    // 获取公司列表
    async getCompanyList() {
      const res = await companyAccountsList()
      // console.log('公司列表', res)
      const dataList = res.data.list || []
      this.$set(this.EPRContent[this.content.length + 1].treeOptions.data[0], 'children', dataList)
    },
    // 搜索表单所属系统select框禁用状态
    isDisabled() {
      if (this.systemId) {
        return true
      } else {
        if (this.type === 'edit') {
          return true
        } else {
          return false
        }
      }
    },
    // 获取角色详情
    async getRoleInfo(data = {}) {
      const res = await roleInfo(data)
      // console.log(res)
      if (res.code !== 200) {
        return false
      }
      const dataList = res.data || {}
      this.rowInfoMessages = dataList
      const companyTypes = dataList.companyTypes ? dataList.companyTypes.split(',').map(item => item * 1) : null
      const companyId = dataList.companyId === null ? [] : [dataList.companyId * 1]
      this.setFormDatas({ ...res.data, companyTypes, companyId })
    },
    // 获取用户分页列表
    async getUserPage(data = {}) {
      // const res = await userPageList({ ...this.searchFormDatas, ...data, requireOrgFlag: 1, requireDataGroupFlag: 1 })
      const res = await userPageList({ ...data, requireOrgFlag: 1, requireDataGroupFlag: 1, realName: this.userValue })
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
      // this.userPagination = {
      //   ...this.userPagination,
      //   dataTotal: res.data ? res.data.total : 0,
      //   ...data,
      //   currentPage: res.data.pageNum,
      //   pageSize: res.data.pageSize
      // }
    },
    // 一个简单的防抖函数
    debounce(fn, time = 300) {
      return function(args) {
        const that = this
        clearTimeout(fn.tid)
        fn.tid = setTimeout(() => {
          fn.call(that, args)
        }, time)
      }
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

<style lang="scss" scoped>
/deep/.el-cascader.el-cascader--small {
  width: 100%;
}
.app-main {
  .role {
    padding: 20px;
    // padding-bottom: 0;
    height: 100%;

   .systemName {
    font-size: 16px;
    color: #0094ff;
    margin-bottom: 1px;
    .system-text{
      font-size: 16px;
      color: #474747;
    }
  }

    .el-row {
      width: 100%;
    }

    .line {
      width: 100%;
      height: 1px;
      background-color: #ccc;
    }
  }
}
.system-button{
  display: flex;
  align-items: center;
  padding-bottom: 15px;
}
</style>
<style lang="scss">
.role {
  .userPop {
    .el-dialog__body {
      // padding:10px 20px!important;
    }
  }
  .custom-tree-node {
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
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
  .popOptionsClass {
    .el-textarea__inner{
      resize: none;
    }
  }
}
</style>
