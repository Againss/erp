<template>
  <div class="dataSettingRange">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增角色按钮 -->
    <div class="button">
      <el-button v-permission="['userCenter:sysDataGroup:add']" size="small" type="primary" @click="addRange">新增范围</el-button>
    </div>
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="dataSource.length"
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
import { sysDataGroupPage, sysDataGroupAdd, sysDataGroupModify, sysDataGroupDelete, bussinessBillList, sysDataGroupInfo, sysDataGroupUserModify } from './api/index.js'
import { sysOrgList } from '../department-management/api/index.js'
import { userList, userPageList } from '../employee-management/api/index.js'
import { sysAppSystemList } from '../micro-services/api/index.js'
import { _debounce } from '@/utils/index.js'
// import { sysPermitInfo } from '../menu-management/api/index.js'
export default {
  name: 'DataSettingRange',
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 数据组名称验证规则
    const nameReg = this.$getRules({ pattern: /^[a-zA-Z_\u4e00-\u9fa5]{1,20}$/, type: 'username', trigger: ['blur'], message: '只允许输入中文、英文和下划线"_", 最大长度20' })
    // 公用组件样式
    const style = {
      'font-size': '14px',
      'color': '#333',
      'background-color': '#eee',
      'padding': '10px',
      'border-radius': '2px',
      'margin-bottom': '15px'
    }
    // 所属系统change事件
    const appSystemChange = value => {
      console.log('value', value)
      this.getBussinessBillList({ appSystemIds: [value] })
    }
    // 弹出框单选change事件
    const radioChange = value => {
      console.log('value', value)
      if (value === 1) {
        this.$set(this.popOptions, 'content', ownDepartment)
      } else if (value === 2) {
        this.$set(this.popOptions, 'content', otherDepartment)
      }
    }
    const permitListTree = {
      prop: 'permitList',
      itemType: 'tree',
      type: 'textarea',
      autosize: { minRows: 1, maxRows: 10 },
      label: '业务数据:',
      popoverOptions: {
        trigger: 'click',
        width: '560',
        title: '选择业务单据'
      },
      treeOptions: {
        checkStrictly: false,
        bindParentTags: true,
        nodeKey: 'permitId',
        props: {
          label: 'name',
          children: 'child'
        },
        // checkedTagsRenderContent: (item) => { return this.checkedTagsRenderContent(item) },
        showCheckbox: true,
        isPopTree: true,
        treeSelectTitle: '系统业务数据',
        span: [12, 12],
        treeSelectedTitle: '已选择',
        data: []
      },
      rules: [commonChangeReg],
      placeholder: '请选择业务单据'
    }
    // 公共弹出框内容
    const commonContent = [
      {
        itemType: 'view',
        style,
        text: '基本信息'
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '规则名称:',
        rules: [commonBlurReg, nameReg],
        placeholder: '请输入规则名称'
      },
      {
        prop: 'appSystemId',
        itemType: 'select',
        label: '所属系统:',
        filterable: true,
        change: appSystemChange,
        rules: [commonChangeReg],
        dataSource: []
      },
      {
        prop: 'dataType',
        itemType: 'radio-group',
        label: '可查看部门:',
        placeholder: '系统生成',
        change: radioChange,
        rules: [commonChangeReg],
        dataSource: [
          {
            label: '只允许查看自己及自己所有下级部门用户的业务数据',
            value: 1
          },
          {
            label: '指定部门用户的业务数据',
            value: 2
          }
        ]
      }
    ]
    // 单选查看自己的本部门弹出框内容
    const ownDepartment = [
      ...commonContent,
      permitListTree
      // {
      //   prop: 'permitList',
      //   itemType: 'tree',
      //   label: '可查看的业务数据:',
      //   popoverOptions: {
      //     trigger: 'click',
      //     width: '560',
      //     title: '选择业务单据'
      //   },
      //   treeOptions: {
      //     checkStrictly: false,
      //     nodeKey: 'permitId',
      //     props: {
      //       label: 'name',
      //       children: 'child'
      //     },
      //     showCheckbox: true,
      //     isPopTree: true,
      //     treeSelectTitle: '系统业务数据',
      //     span: [12, 12],
      //     treeSelectedTitle: '已选择',
      //     data: []
      //   },
      //   rules: [commonChangeReg],
      //   placeholder: '请选择业务单据'
      // }
    ]
    // 单选查看指定部门弹出框内容
    const otherDepartment = [
      ...commonContent,
      {
        prop: 'orgList',
        itemType: 'tree',
        label: '选择部门:',
        popoverOptions: {
          trigger: 'click',
          width: '560',
          title: '选择部门'
        },
        treeOptions: {
          depend: false,
          // checkStrictly: true,
          defaultExpandAll: false,
          nodeKey: 'orgId',
          props: {
            label: 'name',
            children: 'child'
          },
          showCheckbox: true,
          isPopTree: true,
          treeSelectTitle: '部门',
          span: [12, 12],
          treeSelectedTitle: '已选择',
          data: []
        },
        rules: [commonChangeReg],
        placeholder: '请选择部门'
      },
      permitListTree
      // {
      //   prop: 'permitList',
      //   itemType: 'tree',
      //   label: '可查看的业务数据:',
      //   popoverOptions: {
      //     trigger: 'click',
      //     width: '560',
      //     title: '选择业务单据'
      //   },
      //   treeOptions: {
      //     checkStrictly: false,
      //     nodeKey: 'permitId',
      //     props: {
      //       label: 'name',
      //       children: 'child'
      //     },
      //     showCheckbox: true,
      //     isPopTree: true,
      //     treeSelectTitle: '系统业务数据',
      //     span: [12, 12],
      //     treeSelectedTitle: '已选择',
      //     data: []
      //   },
      //   rules: [commonChangeReg],
      //   placeholder: '请选择业务单据'
      // }
    ]
    // 查询表单配置信息
    const searchData = [
      {
        prop: 'dataGroupName',
        itemType: 'input',
        label: '规则名称:',
        // itemStyle: { width: '25%' },
        placeholder: '请输入数据组名称'
      },
      {
        prop: 'permitName',
        itemType: 'input',
        label: '业务单据名称:',
        // itemStyle: { width: '25%' },
        // labelWidth: '115px',
        placeholder: '请输入业务单据关键字'
      },
      {
        prop: 'appSystemIds',
        itemType: 'select',
        label: '所属系统:',
        itemStyle: { 'width': '300px' },
        multiple: true,
        collapseTags: true,
        filterable: true,
        dataSource: []
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          // let appSystemIds = params.appSystemIds && params.appSystemIds.length === 0 ? null : params.appSystemIds
          // appSystemIds = appSystemIds && appSystemIds[0] ? appSystemIds : null
          // this.searchFormDatas = { ...params, appSystemIds }
          // this.getGroupPage({ ...params, appSystemIds })
          const appSystemIds = params.appSystemIds && params.appSystemIds.length === 0 ? null : params.appSystemIds
          this.searchFormDatas = { ...params, appSystemIds }
          this.getGroupPage({ ...params, appSystemIds })
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头配置信息
    const columns = [
      {
        prop: 'id',
        label: '序号',
        width: '60'
        // formater: scope => {
        // console.log('scope', scope, this.pagination)
        // return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        // return scope.$index + 1
        // }
      },
      {
        prop: 'name',
        label: '规则名称',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'orgNames',
        label: '可查看部门',
        minWidth: '120',
        formater: scope => {
          return scope.row.dataType === 2 ? `指定部门：${scope.row[scope.column.property] || '<span style="color:red;">当前指定部门为空<span>'}` : '自己及下级部门'
        },
        showOverflowTooltip: true
      },
      {
        prop: 'appSystemName',
        label: '所属系统',
        minWidth: '120'
      },
      {
        prop: 'permitLeveName',
        label: '可查看单据',
        minWidth: '240',
        showOverflowTooltip: true
        // formater: scope => {
        //   return scope.row[scope.column.property] ? `${scope.row[scope.column.property].map(item => item.leveName).join(', ')}` : '无'
        // }
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        width: '150',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      }
    ]
    // 表格操作栏配置信息
    let popOperatesDataSource = [
      // {
      //   label: '设置用户',
      //   isShow: true,
      //   permitTag: ['userCenter:sysRole:user:modify'],
      //   handle: params => {
      //     console.log('查看用户', params)
      //     this.viewPopDialogHandle('查看用户')
      //     this.getUserPage()
      //     this.viewUser({ dataGroupId: [params.row.sysCompanyId] })
      //     // this.roleId = params.row.roleId
      //   }
      // },
      {
        label: '设置用户',
        isShow: true,
        permitTag: ['userCenter:sysDataGroup:user:modify'],
        handle: params => {
          console.log('设置用户', params)
          this.viewPopDialogHandle('设置用户')
          this.getUserPage()
          this.viewUser({ dataGroupIds: [params.row.dataGourpId] })
          this.groupId = params.row.dataGourpId
        }
      },
      {
        label: '修改',
        isShow: true,
        permitTag: ['userCenter:sysDataGroup:modify'],
        handle: async params => {
          console.log('修改', params)
          this.$set(this.popOptions.content[2], 'disabled', true)
          this.$set(this.popOptions.content[2], 'dataSource', this.sysList)
          if (params.row.dataType === 2) {
            this.$set(this.popOptions, 'content', otherDepartment)
          } else if (params.row.dataType === 1) {
            this.$set(this.popOptions, 'content', ownDepartment)
          }
          this.PopDialogHandle('修改数据范围')
          this.getGroupInfo({ dataGourpId: params.row.dataGourpId })
          this.type = 'edit'
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        isShow: true,
        permitTag: ['userCenter:sysDataGroup:delete'],
        handle: params => {
          // console.log(params)
          this.$confirm('确认要删除选择的数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
            // cancelButtonClass: 'width135',
            // confirmButtonClass: 'width135'
          })
            .then(() => {
              this.deleteGroup({ dataGourpId: params.row.dataGourpId })
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
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '200',
      fixed: 'right',
      dataSource: popOperatesDataSource
      // components: { operatesColumn }
    }
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length
      currentChange: val => {
        // console.log('current', val)
        this.getGroupPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.getGroupPage({ pageNum: 1, pageSize: val })
      }
    }
    // 弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      size: '540px',
      okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        // console.log('params', params)
        this.addOrModifyGroup(params)
      },
      cancel: params => {
        this.PopDialogHandle()
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        // labelWidth: '140px'
      },
      content: ownDepartment
      // component: PopDialog
    }
    // 设置用户弹出框配置信息
    const viewPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      okText: '保存',
      ok: params => {
        console.log('111', params)
        const ids = params.role && params.role.length !== 0 ? params.role.map(item => item.userId) : []
        const addUserIds = ids.filter(item => !this.userList.includes(item))
        const deleteUserIds = this.userList.filter(item => !ids.includes(item))
        this.saveUser({ dataGroupId: this.groupId, addUserIds, deleteUserIds })
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
            headerCellStyle: { 'background-color': '#F5F7FA' },
            span: [14, 10],
            operates: {
              label: '选择'
            },
            selectedType: 'object',
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
        // layout: true,
        inline: true
      },
      searchData,
      columns,
      numId: 1,
      // dataSource: [],
      pagination,
      popOperates,
      popOptions,
      viewPopOptions,
      ownDepartment,
      otherDepartment,
      formDatas: {
        dataGroupName: '',
        permitName: '',
        appSystemIds: []
      },
      searchFormDatas: {
        dataGroupName: '',
        permitName: ''
      },
      userList: [],
      type: 'add',
      sysList: [],
      permitListTree,
      dataFormList: [],
      rowInfoMessages: {},
      groupId: '',
      appSystemIds: this.$store.state.user.userInfo.appSystemIds.length !== 0 ? this.$store.state.user.userInfo.appSystemIds : null,
      userValue: ''
    }
  },
  computed: {
    dataSource: {
      get() {
        return this.$store.state.user.rangeData
      },
      set(data) {
        this.$store.commit('user/SET_RANGEData', data)
      }
    }
  },
  created() {
    this.$permission(['userCenter:sysDataGroup:modify', 'userCenter:sysDataGroup:add']) && this.getSysOrgList()
    // this.$permission(['userCenter:sysDataGroup:modify', 'userCenter:sysDataGroup:add']) && this.getBussinessBillList()
    this.getGroupPage()
    this.getSystemList()
    // console.log('appSystemIds', this.appSystemIds)
  },
  activated() {
    this.getGroupPage()
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
    async setFormDatas(params) {
      await this.getBussinessBillList({ appSystemIds: [params.appSystemId] })
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
    // 新增角色
    addRange() {
      this.type = 'add'
      this.PopDialogHandle('新增数据范围')
      console.log('新增')
      this.setFormDatas({ dataType: 1 })
      this.$set(this.popOptions, 'content', this.ownDepartment)
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions.formDatas, 'orgList', [])
      this.$set(this.popOptions.formDatas, 'permitList', [])
      this.$set(this.permitListTree.treeOptions, 'data', [])
      this.$set(this.popOptions.content[2], 'disabled', false)
      this.$set(this.popOptions.content[2], 'dataSource', this.sysList.filter(item => ![2, 5, 6].includes(item.value)))
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
    // 获取所有组织机构列表
    async getSysOrgList(data = {}) {
      const res = await sysOrgList(data)
      // console.log('部门列表', res)
      const dataList = res.data.list || []
      const orgIdList = dataList.map(item => item.orgId)
      this.$set(this.otherDepartment[4].treeOptions, 'defaultExpandedKeys', orgIdList)
      this.$set(this.otherDepartment[4].treeOptions, 'data', dataList)
    },
    // 获取数据表单列表
    async getBussinessBillList(data = {}) {
      const res = await bussinessBillList(data)
      // const res = await bussinessBillList({...data,this.appSystemIds})
      // console.log('数据表单列表', res)
      const dataList = res.data || []
      this.dataFormList = dataList
      const newData = this.recursionPermissions(dataList)
      // this.$set(this.otherDepartment[4].treeOptions, 'data', newData)
      // this.$set(this.ownDepartment[3].treeOptions, 'data', newData)
      this.$set(this.permitListTree.treeOptions, 'data', newData)
    },
    // 获取数据范围
    @_debounce(50)
    async getGroupPage(data = {}) {
      const appSystemIds = this.searchFormDatas.appSystemIds || this.appSystemIds
      // const appSystemIds = data.appSystemIds && data.appSystemIds.length > 0 ? data.appSystemIds : this.appSystemIds
      const res = await sysDataGroupPage({ ...this.searchFormDatas, ...data, appSystemIds })
      // console.log('用户列表', res)
      res.data.list && res.data.list.map((item, index) => { item.id = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      const dataList = res.data.list || []
      this.dataSource = dataList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },
    // 获取系统列表
    async getSystemList(data = {}) {
      const appSystemIds = this.appSystemIds
      const res = await sysAppSystemList({ appSystemIds, ...data })
      const systemList = res.data.list.map(item => {
        return { value: item.appSysId, label: item.appSysName }
      })
      // console.log('系统列表', systemList)
      const list = systemList || []
      this.sysList = list
      this.$set(this.searchData[2], 'dataSource', list)
    },
    // 新增或者修改数据范围
    addOrModifyGroup(data) {
      if (this.type === 'add') {
        this.addGroup(data)
      } else if (this.type === 'edit') {
        this.modifyGroup(data)
      }
    },
    // 新增数据范围
    async addGroup(data = {}) {
      const res = await sysDataGroupAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('INSERT', '/userCenter/sysDataGroup/add'), data, JSON.stringify({ beforeText: `在'用户中心-数据范围'新增一条记录`, beforeCode: data }))
      // this.PopDialogHandle()
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('添加成功')
      this.getGroupPage()
    },
    // 修改数据范围
    async modifyGroup(data = {}) {
      const res = await sysDataGroupModify(data)
      if (res.code !== 200) {
        return false
      }
      const rowInfoMessages = this.rowInfoMessages
      rowInfoMessages.permitList = rowInfoMessages.permitList ? rowInfoMessages.permitList.map(item => item.permitId) : []
      rowInfoMessages.orgList = rowInfoMessages.orgList ? rowInfoMessages.orgList.map(item => item.orgId) : []
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'dataGourpId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysDataGroup/modify'), data, JSON.stringify({ beforeText: `在'用户中心-数据范围'将${JSON.stringify({ 'dataGourpId': data.dataGourpId })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      // this.PopDialogHandle()
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('修改成功')
      this.getGroupPage()
    },
    // 删除数据范围
    async deleteGroup(data = {}) {
      const res = await sysDataGroupDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('DEL', '/userCenter/sysDataGroup/delete'), data, JSON.stringify({ beforeText: `在'用户中心-数据范围'删除一条记录`, beforeCode: data }))
      // this.PopDialogHandle()
      this.$message.success('删除成功')
      this.getGroupPage()
    },
    // 查看用户(左边数据)
    async viewUser(data = {}) {
      const res = await userList({ ...data, requireOrgFlag: 1 })
      console.log('查看用户', res)
      const userLists = res.data.list || []
      this.$set(this.viewPopOptions.formDatas, 'role', userLists)
      this.userList = userLists.length !== 0 ? userLists.map(item => item.userId) : []
    },
    // 获取用户分页列表
    async getUserPage(data = {}) {
      // const res = await userPageList({ ...this.searchFormDatas, ...data, requireOrgFlag: 1, requireDataGroupFlag: 1 })
      const res = await userPageList({ ...data, requireOrgFlag: 1, requireDataGroupFlag: 1, realName: this.userValue })
      console.log('用户列表', res)
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
    // 设置用户
    async saveUser(data = {}) {
      const res = await sysDataGroupUserModify(data)
      if (res.code !== 200) {
        return false
      }
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'roleId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('SET', '/userCenter/sysDataGroup/user/modify'), data, JSON.stringify({ beforeText: `在'用户中心-数据范围'做了设置操作`, afterCode }))
      // this.viewPopDialogHandle()
      this.$set(this.viewPopOptions, 'visible', false)
      this.$message.success('保存成功')
    },
    // 给child不为null的添加 hiddenCheckBox: true
    recursionPermissions(array) {
      function recursion(array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].child && array[i].child.length !== 0) {
            array[i].hiddenCheckBox = true
            recursion(array[i].child)
          }
        }
        return array
      }
      return recursion(array)
    },
    // 根据id获取详情
    async getGroupInfo(data = {}) {
      const res = await sysDataGroupInfo(data)
      // console.log('详情', res)
      if (res.code !== 200) {
        return false
      }
      const dataList = res.data || {}
      this.rowInfoMessages = dataList
      const orgList = dataList.orgList ? dataList.orgList.map(item => item.orgId) : []
      const permitList = dataList.permitList ? dataList.permitList.map(item => item.permitId) : []
      this.setFormDatas({ ...dataList, orgList, permitList })

      // return { orgList, permitList }
    },
    // 对业务数据树右边的数据进行处理
    checkedTagsRenderContent(item) {
      console.log('item', item)
      if (item.isEnabled === 1) {
        return `<div class="custom-tree-node"><span class="spot" title="${this.sortDepartment(item)}">${item.realName} ${this.sortDepartment(item)}<span></div>`
      } else if (item.isEnabled === 0) {
        return `<div class="custom-tree-node"><span style="color: #FE4949">！</span><span class="spot" title="${this.sortDepartment(item)}">${item.realName} ${this.sortDepartment(item)}<span></div>`
      }
    },
    // 部门一行显示 没有部门
    sortDepartment(data) {
      if (data.orgs && data.orgs.length !== 0) {
        return `（ ${data.orgs && data.orgs.map(item => item.name).join(' / ')} ）`
      } else {
        return ''
      }
    },
    // 递归查找数据
    recursionFatherOrSon(array, id) {
      const newArray = []
      // console.log('array', array, id)
      function recursion(array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].permitId === id) {
            newArray.push(array[i].name)
            return newArray
          }
          if (array[i].child && array[i].child.length) {
            newArray.push(array[i].name)
            const res = recursion(array[i].child)
            if (res) {
              return res
            } else {
              newArray.splice(newArray.indexOf(array[i].name), 1)
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
.dataSettingRange {
  padding: 20px;
  // padding-bottom: 0;
  // .el-form-item__label-wrap {
  //   margin-left: 0!important;
  // }
  // .table {
  //   tbody {
  //     tr {
  //       :nth-child(3),
  //       :nth-child(4) {
  //         .cell {
  //           span {
  //             display: block;
  //             overflow: hidden;
  //             text-overflow: ellipsis;
  //             -ms-text-overflow: ellipsis;
  //             white-space: nowrap;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  .el-radio {
      margin-top: 10px;
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
// .customClass {
//   button {
//     width: 135px;
//   }
// }
// .el-message-box__btns {
//   button {
//     width: 135px;
//   }
// }
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
  // .userPop{
  //   .customDialogclass{
  //     width: 830px !important;
  //     .el-dialog__body{
  //       padding: 0;
  //       .el-col-14{
  //         padding: 20px;
  //         padding-top: 0;
  //         border-right: 1px solid #e9eff2;
  //       }
  //       .selectTitle,.selectedTitle{
  //         line-height: 16px;
  //         margin: 20px 0;
  //         font-size: 16px;
  //         color: #3C4043;
  //       }
  //     }
  //     .el-form-item{
  //       margin-bottom: 0;
  //     }
  //     .selected{
  //       padding-right: 20px;
  //     }
  //   }
  // }
</style>
