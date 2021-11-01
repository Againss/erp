<template>
  <div class="employee">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增员工按钮 -->
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="addEmployee">新增员工</el-button>
      <el-button v-permission="['userCenter:sysUser:batch:add']" size="small" @click="bulkImport">批量导入</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
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
    <!-- 导入pop弹出层(查看角色) -->
    <div class="userPop">
      <cs-custom-pop :options="viewPopOptions" />
    </div>
    <!-- 导入pop弹出层(批量导入) -->
    <div class="userPop">
      <cs-custom-pop :options="importPopOptions" />
    </div>
  </div>
</template>

<script>
// 导入基本信息标识组件
// 导入表格操作栏带有更多显示功能的组件
import handle from '@/components/handleGroup/handle.vue'
import department from './components/department'
import { userPageList, userDelete, userAdd, userModify, userDisable, userPasswordReset, userEnable, userRoleList, userInfo, sysUserweChatRelease, sysDataMaskingRuleList, unBoundWeCom } from './api/index.js'
import { sysOrgList } from '../department-management/api/index.js'
import { roleList } from '../role-management/api/index.js'
import { mailBoxManagerList } from '../available-mailbox/api/index.js'
import areaTel from './components/areaTel.vue'
import downloadTemplate from './components/download-template.vue'
// import uploadFile from './components/upload-file.vue'
import uploadSlotTrigger from './components/upload-slot-trigger.vue'
// import { getToken } from '@/utils/auth'
import { sysDataGroupList } from '../data-setting-range/api/index.js'
import { _debounce } from '@/utils'
export default {
  name: 'EmployeeManagement',
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 公用组件样式
    const style = {
      'font-size': '14px',
      'color': '#333',
      'background-color': '#eee',
      'padding': '10px',
      'border-radius': '2px',
      'margin-bottom': '15px'
    }
    // 手机号验证正则
    // const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 邮箱验证正则
    const emailReg = this.$getRules({ type: 'email', trigger: ['blur'] })
    // const emailReg2 = this.$getRules({ type: 'email2', trigger: ['blur'] })
    const emailNumReg = this.$getRules({ type: 'department', trigger: ['blur'] })
    // 用户名长度验证正则
    const usernameReg = this.$getRules({ type: 'username', message: '只支持英文字符、数字、"_"', trigger: ['blur'] })
    const usernameLengthReg = this.$getRules({ type: 'role', trigger: ['blur'] })
    // 用户名格式验证正则
    const roleReg = this.$getRules({ pattern: /^(?=.*[A-Za-z])[A-Za-z\d_]+$/, type: 'role', message: '必须包含英文字符', trigger: ['blur'] })
    // 员工姓名正则
    const nameReg = this.$getRules({ type: 'department', message: '最大长度为50', trigger: ['blur'] })
    // 登录密码验证正则
    // const passwordReg = this.$getRules({ type: 'password', message: '请输入6~20位字母、数字', trigger: ['blur'] })
    // 公共pop内容
    const commonContent = [
      {
        itemType: 'view',
        text: '基本信息',
        style
      },
      {
        prop: 'jobNum',
        itemType: 'input',
        label: '工号:',
        placeholder: '请输入工号'
      },
      {
        prop: 'realName',
        itemType: 'input',
        label: '姓名:',
        rules: [commonBlurReg, nameReg],
        placeholder: '请输入名称'
      },
      {
        components: {
          areaTel
        }
      },
      {
        prop: 'email',
        itemType: 'input',
        label: '邮箱:',
        rules: [emailReg, commonBlurReg, emailNumReg],
        placeholder: '请输入邮箱'
      },
      {
        prop: 'orgs',
        itemType: 'tree',
        type: 'textarea',
        autosize: { minRows: 1, maxRows: 10 },
        label: '部门:',
        popoverOptions: {
          trigger: 'click',
          width: '560',
          title: '选择部门'
        },
        treeOptions: {
          depend: false,
          // checkStrictly: false,
          bindParentTags: true,
          defaultExpandAll: false,
          nodeKey: 'orgId',
          props: {
            label: 'name',
            children: 'child'
          },
          // checkedTagsRenderContent: (item) => { return this.checkedTagsRenderContent(item) },
          isPopTree: true,
          treeSelectTitle: '请选择',
          span: [12, 12],
          treeSelectedTitle: '已选择',
          data: [],
          showCheckbox: true,
          expandOnClickNode: true
        },
        rules: [commonChangeReg],
        placeholder: '请选择部门'
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '用户名:',
        isShow: false,
        disabled: true,
        // rules: [usernameLengthReg, usernameReg, roleReg, commonBlurReg],
        placeholder: '请输入用户名'
      },

      {
        itemType: 'view',
        text: '权限信息',
        style
      },
      {
        prop: 'roles',
        itemType: 'tree',
        type: 'textarea',
        autosize: { minRows: 1, maxRows: 10 },
        label: '角色:',
        popoverOptions: {
          trigger: 'click',
          width: '560',
          title: '选择角色'
        },
        treeOptions: {
          checkStrictly: false,
          bindParentTags: true,
          defaultExpandAll: false,
          nodeKey: 'roleId',
          props: {
            parentId: 'appSystemId',
            label: 'name'
            // children: 'child'
          },
          showCheckbox: true,
          isPopTree: true,
          treeSelectTitle: '请选择',
          span: [12, 12],
          treeSelectedTitle: '已选择',
          data: []
        },
        rules: [commonChangeReg],
        placeholder: '请选择角色'
      },
      {
        prop: 'dataGroups',
        itemType: 'tree',
        label: '数据范围:',
        type: 'textarea',
        autosize: { minRows: 1, maxRows: 10 },
        popoverOptions: {
          trigger: 'click',
          width: '560',
          title: '选择数据范围'
        },
        treeOptions: {
          checkStrictly: false,
          bindParentTags: true,
          defaultExpandAll: false,
          nodeKey: 'dataGourpId',
          props: {
            parentId: 'appSystemId',
            label: 'name'
          },
          isPopTree: true,
          treeSelectTitle: '请选择',
          span: [12, 12],
          treeSelectedTitle: '已选择',
          data: [],
          showCheckbox: true
        },
        placeholder: '请选择数据范围'
      },
      {
        prop: 'maskRuleList',
        itemType: 'tree',
        type: 'textarea',
        autosize: { minRows: 1, maxRows: 10 },
        label: '加密字段:',
        popoverOptions: {
          trigger: 'click',
          width: '560',
          title: '全部字段加密'
        },
        treeOptions: {
          depend: false,
          // checkStrictly: false,
          bindParentTags: true,
          defaultExpandAll: false,
          nodeKey: 'ruleId',
          props: {
            parentId: 'appSystemId',
            label: 'name'
            // children: 'child'
          },
          // checkedTagsRenderContent: (item) => { return this.checkedTagsRenderContent(item) },
          isPopTree: true,
          treeSelectTitle: '请选择',
          span: [12, 12],
          treeSelectedTitle: '已选择',
          data: [],
          showCheckbox: true
        },
        // rules: [commonChangeReg],
        placeholder: '全部字段加密'
      }
    ]
    // 修改员工pop内容
    const reviseEmployeeContent = [
      ...commonContent,
      {
        prop: 'name',
        itemType: 'input',
        label: '用户名:',
        rules: [usernameLengthReg, usernameReg, roleReg, commonBlurReg],
        placeholder: '请输入用户名'
      }

    ]
    // 添加员工pop内容
    const addEmployeeContent = [
      ...commonContent,
      {
        prop: 'name',
        itemType: 'input',
        label: '用户名:',
        rules: [usernameLengthReg, usernameReg, roleReg, commonBlurReg],
        placeholder: '请输入用户名'
      }
    ]
    // 查询/重置 form表单配置信息
    const searchData = [
      {
        prop: 'realNameOrJobNum',
        itemType: 'input',
        label: '员工:',
        clearable: true,
        // itemStyle: { width: '25%' },
        placeholder: '请输入员工姓名或者工号'
      },
      {
        prop: 'mobile',
        itemType: 'input',
        label: '手机号:',
        clearable: true,
        // itemStyle: { width: '25%' },
        placeholder: '请输入手机号'
      },
      {
        prop: 'email',
        itemType: 'input',
        label: '邮箱:',
        clearable: true,
        // itemStyle: { width: '25%' },
        placeholder: '请输入邮箱'
      },
      {
        prop: 'orgIds',
        itemType: 'tree',
        // type: 'input',
        // itemStyle: { width: '25%' },
        rows: '1',
        clearable: true,
        label: '所在部门:',
        popoverOptions: {
          placement: 'bottom',
          trigger: 'click',
          width: '320',
          title: '选择部门'
        },
        treeOptions: {
          depend: false,
          selectedHidden: true,
          searchNeedChild: false,
          isPopTree: true,
          defaultExpandAll: false,
          nodeKey: 'orgId',
          props: {
            label: 'name',
            children: 'child'
          },
          treeSelectTitle: '请选择',
          span: [24, 0],
          // treeSelectedTitle: '已选择',
          data: [],
          showCheckbox: true,
          expandOnClickNode: true
        },
        placeholder: '请选择部门'
      },
      {
        prop: 'isEnabled',
        label: '状态:',
        placeholder: '请选择状态',
        itemType: 'select',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '正常',
            value: '1'
          },
          {
            label: '禁用',
            value: '0'
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          // const orgIds = params.orgIds ? params.orgIds[0] ? params.orgIds : [] : []
          // this.getUserList({ ...params, orgIds })
          // this.searchFormDatas = { ...params, orgIds }
          this.getUserList(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = { isEnabled: '1' }
          // console.log('重置', this.pagination)
          // this.getUserList({ pageNum: 1, pageSize: 20 })
        }
      }
    ]
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = [
      {
        prop: 'realName',
        label: '姓名',
        minWidth: '110',
        showOverflowTooltip: true
      },
      {
        prop: 'jobNum',
        label: '工号',
        showOverflowTooltip: true,
        width: '100'
      },
      {
        prop: 'mobile',
        label: '手机号',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => {
          // console.log('scope', scope)
          return scope.row[scope.column.property] ? scope.row.areaCode ? `+${scope.row.areaCode}-${scope.row[scope.column.property]}` : scope.row[scope.column.property] : ''
        }
      },
      {
        prop: 'email',
        label: '邮箱',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'orgs',
        label: '所在部门',
        minWidth: '140',
        // showOverflowTooltip: true,
        components: {
          department
        },
        componentsOptions: {
          key: 'orgs',
          name: 'name'
        }
      },
      {
        prop: 'name',
        label: '登录名',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'dataGroups',
        label: '数据范围规则',
        minWidth: '140',
        // showOverflowTooltip: true,
        components: {
          department
        },
        componentsOptions: {
          key: 'dataGroups',
          name: 'name'
        }
        // formater: scope => {
        //   return scope.row[scope.column.property] ? scope.row[scope.column.property].map(item => item.name).join(' , ') : '-'
        // }
      },
      {
        prop: 'isEnabled',
        label: '状态',
        minWidth: '60',
        formater: scope => {
          return scope.row[scope.column.property] === 1
            ? '<span style="color: #2ac06d;">启用</span>'
            : '<span style="color: #ff0000;">禁用</span>'
        }
        // components: {
        //   stateColumn
        // }
      },
      {
        prop: 'userLoginInfo',
        label: '最后登录',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.userLoginInfo && scope.row.userLoginInfo.lastLoginTime ? this.$filters.parseTime(
            scope.row.userLoginInfo.lastLoginTime,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
      }
    ]
    // 表格操作栏里面更多的配置信息
    let moreHandle = [
      {
        moreHandleTag: '启用',
        permitTag: ['userCenter:sysUser:enable'],
        method: scope => {
          const isEnabled = scope.row.isEnabled === 0 ? '启用' : '禁用'
          this.$confirm(
            `确定要${isEnabled}该员工吗？${isEnabled}后，该员工${
              isEnabled === '启用' ? '可以正常' : '无法'
            }登录系统...`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              if (isEnabled === '禁用') {
                this.disableUser(scope, isEnabled)
              } else if (isEnabled === '启用') {
                this.enableUsers(scope, isEnabled)
              }
              // scope.row.isEnabled = isEnabled === '启用' ? 1 : 0
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: `已取消${isEnabled}`
              })
            })
        }
      },
      {
        moreHandleTag: '禁用',
        permitTag: ['userCenter:sysUser:disable'],
        method: scope => {
          const isEnabled = scope.row.isEnabled === 0 ? '启用' : '禁用'
          this.$confirm(
            `确定要${isEnabled}该员工吗？${isEnabled}后，该员工${
              isEnabled === '启用' ? '可以正常' : '无法'
            }登录系统...`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              if (isEnabled === '禁用') {
                this.disableUser(scope, isEnabled)
              } else if (isEnabled === '启用') {
                this.enableUsers(scope, isEnabled)
              }
              // scope.row.isEnabled = isEnabled === '启用' ? 1 : 0
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: `已取消${isEnabled}`
              })
            })
        }
      },
      {
        moreHandleTag: '重置密码',
        permitTag: ['userCenter:sysUser:password:reset'],
        method: scope => {
          this.$confirm('确定要重置该员工的登录密码吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.resetPassword(scope.row.userId)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消重置'
              })
            })
        }
      },
      {
        moreHandleTag: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['userCenter:sysUser:delete'],
        method: scope => {
          this.$confirm(' 你确认要删除该员工数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              // console.log(scope)
              this.deleteUser(scope.row.userId)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      },
      {
        moreHandleTag: '微信解绑',
        permitTag: ['userCenter:sysUser:weChatRelease'],
        method: scope => {
          this.$confirm(' 你确认要微信解绑吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              // console.log(scope)
              this.chatRelease(scope.row.userId)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消微信解绑'
              })
            })
        }
      },
      {
        moreHandleTag: '企业微信解绑',
        permitTag: ['userCenter:user:wecom:unBound'],
        method: async(scope) => {
          const res = await this.$uiUtils.confirmMsg({ message: '是否解绑企业微信', cancelMessage: '已取消操作' })
          if (res) {
            this.comWechatRelease(scope.row.userId)
          } else {
            console.log('取消解绑')
          }
        }
      }

    ]
    moreHandle = this.$filterPermission(moreHandle)
    // 表格操作栏里面的配置信息
    let handleConf = [
      {
        handleTag: '查看角色',
        permitTag: ['userCenter:sysUser:role:list'],
        method: scope => {
          // console.log('角色', scope)
          this.viewRoles(scope.row.userId)
          scope.row.roles && scope.row.roles.forEach((item) => { item.disabled = true })
          // this.viewSetFormDatas({ ...scope.row })
          this.viewPopDialogHandle('查看角色')
        }
      },
      {
        handleTag: '修改',
        permitTag: ['userCenter:sysUser:modify'],
        method: scope => {
          console.log('修改', scope)
          this.type = 'edit'
          this.$set(this.reviseEmployeeContent[11], 'disabled', true)
          this.$set(this.popOptions, 'content', this.reviseEmployeeContent)
          this.PopDialogHandle('编辑员工')
          // this.setFormDatas({ ...scope.row })
          this.getUserInfo({ userId: scope.row.userId })
          this.jobNumIsDisabled(scope.row.jobNum)
          this.$set(this.popOptions, 'saveAndadd', null)
        }
      }
    ]
    handleConf = this.$filterPermission(handleConf)
    // 表格操作栏里面的配置信息
    const popOperates = {
      label: '操作',
      width: '200',
      fixed: 'right',
      components: {
        handle
      },
      componentsOptions: {
        handle: handleConf,
        moreHandle,
        isFilter: (scope, array) => {
          // console.log(scope, array)
          return array.filter(item => {
            if (scope.row.isEnabled === 0) {
              return item.moreHandleTag !== '禁用'
            } else if (scope.row.isEnabled === 1) {
              return item.moreHandleTag !== '启用'
            }
          }).filter(item => {
            if (!scope.row.wecomUserId) {
              return item.moreHandleTag !== '企业微信解绑'
            }
            return true
          })
        }
      }
    }
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getUserList({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('sizeChange', this.pagination)
        this.$set(this.pagination, 'currentPage', 1)
        this.getUserList({ pageNum: 1, pageSize: val })
      }
    }
    // 点击新增时下方保存并提交按钮事件
    const saveAndadd = (params, form) => {
      form.validate((valid) => {
        if (valid) {
          this.saveAndaddFlag = false
          const orgIds = params.orgs.map(item => typeof item === 'object' ? item.orgId : item)
          const roleIds = params.roles.map(item => typeof item === 'object' ? item.roleId : item)
          this.addOrEditUser({ ...params, roleIds, orgIds }, form)
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('zzz', params)
        this.saveAndaddFlag = true
        const orgIds = params.orgs.map(item => typeof item === 'object' ? item.orgId : item)

        const roleIds = params.roles.map(item => typeof item === 'object' ? item.roleId : item)
        const maskRuleList = params.maskRuleList[0] ? params.maskRuleList.map(item => typeof item === 'object' ? item.ruleId : item) : []

        const userDataIds = params.dataGroups[0] ? params.dataGroups.map(item => typeof item === 'object' ? item.dataGourpId : item) : []
        const addRoleIds = roleIds.filter(item => !this.roleList.includes(item))
        const deleteRoleIds = this.roleList.filter(item => !roleIds.includes(item))
        this.addOrEditUser({ ...params, orgIds, roleIds, userDataIds, addRoleIds, deleteRoleIds, maskRuleList })
        // console.log(this.addOrEditUser({ ...params, orgIds, roleIds }))
      },
      saveAndaddText: '保存并继续',
      saveAndadd,
      cancel: params => {
        this.PopDialogHandle()
        // console.log(params)
      },
      formDatas: {
        dataGroups: [],
        maskRuleList: []
        // areaNum: 86
      },
      formOptions: {
        // labelWidth: '111px'
      },
      content: addEmployeeContent
    }
    // 查看角色pop弹出框的配置信息
    const viewPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      // label: '100',
      cancelHidden: true,
      okText: '关闭',
      width: '560px',
      ok: params => {
        // console.log(params)
        this.$set(this.viewPopOptions, 'visible', false)
      },
      cancel: params => {
        this.$set(this.viewPopOptions, 'visible', false)
        // console.log(params)
      },
      formDatas: {},
      formOptions: {
        labelWidth: '0px'
      },
      content: [
        {
          prop: 'role',
          itemType: 'tree',
          label: '',
          popoverOptions: {
            trigger: 'click',
            title: '选择角色'
          },
          treeOptions: {
            // checkStrictly: false,
            bindParentTags: true,
            defaultExpandAll: false,
            nodeKey: 'roleId',
            props: {
              parentId: 'appSystemId',
              label: 'name',
              children: 'children'
            },
            showCheckbox: true,
            isPopTree: false,
            treeSelectTitle: '请选择',
            span: [12, 12],
            treeSelectedTitle: '已选择',
            data: [],
            expandOnClickNode: true
          },
          placeholder: '请选择部门'
        }
      ]
    }
    // 批量导入pop弹出框的配置信息
    const importPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '导入员工',
      // label: '100',
      showFooter: false,
      cancelHidden: true,
      okHidden: true,
      // okText: '关闭',
      width: '560px',
      ok: params => {
      },
      cancel: params => {
        // this.importPopDialogHandle()
      },
      close: () => {
        this.$set(this.importPopOptions.formDatas, 'upload', [])
      },
      formDatas: {},
      formOptions: {
        // labelWidth: '0px'
      },
      content: [
        {
          itemType: 'view',
          text: '第一步：下载员工模板，填写信息',
          style: 'color: #888E9E;font-size: 16px;'
        },
        {
          components: {
            downloadTemplate
          }
        },
        {
          itemType: 'view',
          text: '第二步：上传填写好的文件，并导入',
          style: 'color: #888E9E;font-size: 16px;'
        },
        // {
        //   itemType: 'view',
        //   components: {
        //     uploadFile
        //   }
        // },
        {
          prop: 'upload',
          itemType: 'upload',
          label: '',
          className: 'upload-demo',
          // showFileList: false,
          onSuccess: (res, file) => {
            // console.log(res, file)
            this.$message.success('导入成功')
            this.fetchLog(this.getLogMessages('IMPORT', '/userCenter/sysUser/batch/add'), file, JSON.stringify({ beforeText: `在'用户中心-员工管理'批量导入成功` }))
            console.log(this.importPopOptions)
            this.importPopDialogHandle()
            this.getUserList()
          },
          onError: (res, file) => {
            // console.log(res, file)
          },
          beforeUpload: (file) => {
            // console.log(file.type.split('/')[1])
            const fileName = file.name.split('.')
            const fileType = fileName[fileName.length - 1]
            const regexp = new RegExp(fileType)
            const isXls = regexp.test(this.accept)
            console.log(file, fileType, regexp, isXls)
            // const isLt1M = file.size / 1024 / 1024 < 1
            if (!isXls) {
              this.$message.error('上传文件只能是 .xlsx,.xls,XLSX,.XLS 格式!')
            }
            // else if (!isLt1M) {
            //   this.$message.error('上传头像图片大小不能超过 1MB!')
            // }
            return isXls
          },
          action: `/userCenter/sysUser/batch/add`,
          accept: '.xlsx,.xls,XLSX,.XLS',
          showFileList: true,
          timeout: 30000,
          limit: 1,
          content: [
            {
              slot: 'trigger',
              component: uploadSlotTrigger
            }
          ]
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
      // dataSource: [],
      popOperates,
      pagination,
      popOptions,
      commonContent,
      viewPopOptions,
      importPopOptions,
      addEmployeeContent,
      reviseEmployeeContent,
      saveAndadd,
      saveAndaddFlag: false,
      accept: '.xlsx,.xls,XLSX,.XLS',
      type: 'add',
      searchFormDatas: {
        realNameOrJobNum: '',
        isEnabled: '1',
        mobile: '',
        email: ''
      },
      dataFormList: [],
      formDatas: {
        realNameOrJobNum: '',
        isEnabled: '1',
        mobile: '',
        email: '',
        orgIds: []
      },
      roleList: [],
      rowInfoMessages: {},
      appSystemIds: this.$store.state.user.userInfo.appSystemIds.length !== 0 ? this.$store.state.user.userInfo.appSystemIds : null,
      mailboxList: null
    }
  },
  computed: {
    dataSource: {
      get() {
        return this.$store.state.user.employeeData
      },
      set(data) {
        this.$store.commit('user/SET_EMPLOYEEData', data)
      }
    }
  },
  created() {
    this.getOrgList()
    this.getUserList()
    this.$permission(['userCenter:sysUser:modify', 'userCenter:sysUser:add']) && this.getRoleList()
    this.$permission(['userCenter:sysUser:modify', 'userCenter:sysUser:add']) && this.getDataGroupList()
    this.getAvailableMailboxList()
    this.getDataRuleList()
  },
  activated() {
    this.getUserList()
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
      // console.log(params)
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 修改弹出层的判断
    viewPopDialogHandle(val) {
      this.$set(this.viewPopOptions, 'visible', !this.viewPopOptions.visible)
      if (val) {
        this.$set(this.viewPopOptions, 'title', val)
      }
    },
    // 查看角色修改按钮
    viewSetFormDatas(params) {
      // console.log(params)
      setTimeout(() => {
        this.$set(this.viewPopOptions, 'formDatas', params)
      }, 0)
    },
    // 修改弹出层的判断
    importPopDialogHandle(val) {
      this.$set(this.importPopOptions, 'visible', !this.importPopOptions.visible)
      if (val) {
        this.$set(this.importPopOptions, 'title', val)
      }
    },
    // 查看角色修改按钮
    importSetFormDatas(params) {
      // console.log(params)
      setTimeout(() => {
        this.$set(this.importPopOptions, 'formDatas', params)
      }, 0)
    },
    // 新增员工按钮
    addEmployee() {
      this.type = 'add'
      this.$set(this.addEmployeeContent[11], 'disabled', false)
      this.$set(this.popOptions, 'content', this.addEmployeeContent)
      this.PopDialogHandle('添加员工')
      this.setFormDatas({ areaCode: '86', orgs: [], roles: [] })
      this.$set(this.commonContent[1], 'disabled', false)
      this.$set(this.popOptions, 'saveAndadd', this.saveAndadd)
    },
    bulkImport() {
      // console.log(this)
      // this.$set(this.importPopOptions.content[3], 'fileList', [])
      // this.$set(this.importPopOptions.formDatas, 'upload', [])
      this.importPopDialogHandle()
    },
    // 添加或者编辑员工
    addOrEditUser(data, form) {
      if (this.type === 'add') {
        this.addUser(data, form)
      } else if (this.type === 'edit') {
        this.editUser(data, form)
      }
    },
    // 新增员工确认点击事件
    async addUser(data, form) {
      const res = await userAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('INSERT', '/userCenter/sysUser/add'), data, JSON.stringify({ beforeText: `在'用户中心-员工管理'新增一条记录`, beforeCode: data }))
      form && form.resetFields()
      this.setFormDatas({ areaCode: '86', orgs: [], roles: [] })
      if (this.saveAndaddFlag === true) {
        // this.PopDialogHandle()
        this.$set(this.popOptions, 'visible', false)
      }
      this.$message.success('添加成功')
      // console.log('新增用户', res)
      this.getUserList()
    },
    // 编辑员工确认点击事件
    async editUser(data, form) {
      console.log('data', data)
      // maskRuleList
      // debugger
      const res = await userModify(data)
      if (res.code !== 200) {
        return false
      }
      const rowInfoMessages = this.rowInfoMessages
      rowInfoMessages.roleIds = rowInfoMessages.roles = rowInfoMessages.roles ? rowInfoMessages.roles.map(item => typeof item === 'object' ? item.roleId : item) : []
      rowInfoMessages.orgIds = rowInfoMessages.orgs = rowInfoMessages.orgs ? rowInfoMessages.orgs.map(item => typeof item === 'object' ? item.orgId : item) : []
      rowInfoMessages.userDataIds = rowInfoMessages.dataGroups ? rowInfoMessages.dataGroups.map(item => typeof item === 'object' ? item.dataGourpId : item) : []
      rowInfoMessages.maskRuleList = rowInfoMessages.maskRuleList ? rowInfoMessages.maskRuleList.map(item => typeof item === 'object' ? item.ruleId : item) : []
      delete data.roles
      delete data.roleIds
      delete data.orgs
      delete data.dataGroups
      delete data.maskRuleList
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'userId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysUser/modify'), data, JSON.stringify({ beforeText: `在'用户中心-员工管理'将${JSON.stringify({ 'userId': data.userId })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      form && form.resetFields()
      this.setFormDatas({ areaCode: '86', orgs: [], roles: [] })
      if (this.saveAndaddFlag === true) {
        // this.PopDialogHandle()
        this.$set(this.popOptions, 'visible', false)
      }
      this.$message.success('修改成功')
      // console.log('修改用户', res)
      this.getUserList()
    },
    // 获取用户分页列表
    @_debounce(50)
    async getUserList(data = {}) {
      const res = await userPageList({ ...this.searchFormDatas, ...data, requireOrgFlag: 1, requireDataGroupFlag: 1 })
      // console.log('用户列表', res)
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
      console.log('zxc', data, this.pagination)
      // debugger
      // this.$set(this.pagination, 'dataTotal', res.data.total || this.pagination.dataTotal)
      // console.log('pagination', this.pagination)
    },
    // 获取所有组织机构(部门)
    async getOrgList(data = {}) {
      const res = await sysOrgList(data)
      // console.log('部门列表', res)
      const listData = res.data.list || []
      this.dataFormList = listData
      const orgIdList = listData.map(item => item.orgId)
      this.$set(this.searchData[3].treeOptions, 'defaultExpandedKeys', orgIdList)
      this.$set(this.commonContent[5].treeOptions, 'defaultExpandedKeys', orgIdList)
      this.$set(this.searchData[3].treeOptions, 'data', listData)
      this.$set(this.commonContent[5].treeOptions, 'data', listData)
    },
    // 删除员工
    async deleteUser(id) {
      const res = await userDelete({ userId: id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('DEL', '/userCenter/sysUser/delete'), { userId: id }, JSON.stringify({ beforeText: `在'用户中心-员工管理'删除一条记录`, beforeCode: { userId: id }}))
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getUserList()
    },
    // 微信解绑
    async chatRelease(id) {
      const res = await sysUserweChatRelease({ userId: id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('DEL', '/userCenter/sysUser/weChatRelease'), { userId: id }, JSON.stringify({ beforeText: `在'用户中心-员工管理'微信解绑一条记录`, beforeCode: { userId: id }}))
      this.$message({
        type: 'success',
        message: '解绑成功!'
      })
      this.getUserList()
    },
    // 企业微信解绑
    async  comWechatRelease(id) {
      const res = await unBoundWeCom({ userId: id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('DEL', '/userCenter/sysUser/unBoundWeCom'), { userId: id }, JSON.stringify({ beforeText: `在'用户中心-员工管理'企业微信解绑一条记录`, beforeCode: { userId: id }}))
      this.$message({
        type: 'success',
        message: '解绑成功!'
      })
      this.getUserList()
    },
    // 获取角色列表
    async getRoleList(data = {}) {
      const res = await roleList(data)
      // console.log('角色列表', res)
      const listData = res.data.list || []
      // const OptionalData = JSON.parse(JSON.stringify(listData))
      const optionalData = this.$utils.deepClone(listData)
      const newArray = this.translateArray(optionalData, false, { key: 'roleId' })
      newArray.forEach(item => { item.hiddenCheckBox = true })
      // const noChoice = JSON.parse(JSON.stringify(listData))
      const noChoice = this.$utils.deepClone(listData)
      this.$set(this.commonContent[8].treeOptions, 'data', newArray)
      this.$set(this.viewPopOptions.content[0].treeOptions, 'data', this.translateArray(noChoice, true, { key: 'roleId' }))
      // console.log('111', this.translateArray(listData))
    },
    // 禁用员工
    async disableUser(scope, isEnabled) {
      const res = await userDisable({ userId: scope.row.userId })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysUser/disable'), { userId: scope.row.userId }, JSON.stringify({ beforeText: `在'用户中心-员工管理'禁用一条记录`, beforeCode: { status: '启用', userId: scope.row.userId }, afterCode: { status: '禁用', userId: scope.row.userId }}))
      scope.row.isEnabled = isEnabled === '启用' ? 1 : 0
      this.$message.success('禁用成功')
    },
    // 启用员工
    async enableUsers(scope, isEnabled) {
      const res = await userEnable({ userId: scope.row.userId })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysUser/enable'), { userId: scope.row.userId }, JSON.stringify({ beforeText: `在'用户中心-员工管理'启用一条记录`, beforeCode: { status: '禁用', userId: scope.row.userId }, afterCode: { status: '启用', userId: scope.row.userId }}))
      scope.row.isEnabled = isEnabled === '启用' ? 1 : 0
      this.$message.success('启用成功')
    },
    // 重置密码
    async resetPassword(id) {
      const res = await userPasswordReset({ userId: id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysUser/password/reset'), { userId: id }, JSON.stringify({ beforeText: `在'用户中心-员工管理'重置一条记录`, beforeCode: { userId: id }}))
      this.$message.success('重置成功,新密码已经通过邮箱发送给用户')
    },
    // 角色信息/一维数组转二维数组
    translateArray(array, flag, prop = {}) {
      const key = prop.key || 'key'
      const name = prop.name || 'name'
      console.log('this.appSystemIds', this.appSystemIds)
      const newArray = {}
      if (flag) {
        while (array.length) {
          const current = array.pop() // 会影响原数组
          current.disabled = flag
          current.appSystemId = current.appSystemId + ''
          newArray[current.appSystemId] = newArray[current.appSystemId] || []
          newArray[current.appSystemId].push(current)
        }
      } else {
        while (array.length) {
          const current = array.pop() // 会影响原数组
          if (this.appSystemIds && this.appSystemIds.length !== 0) {
            current.disabled = !this.appSystemIds.includes(current.appSystemId * 1)
          } else {
            current.disabled = flag
          }
          // let appSystemId=current.appSystemId
          current.appSystemId = current.appSystemId + ''
          newArray[current.appSystemId] = newArray[current.appSystemId] || []
          newArray[current.appSystemId].push(current)
        }
      }
      console.log('newArray', newArray)
      return Object.values(newArray).map(item => {
        return {
          [key]: item[0].appSystemId + '',
          appSystemId: '-1',
          [name]: item[0].appSystemName || ' ',
          disabled: flag,
          children: item
        }
      })
    },
    // 查看用户拥有角色(查看角色按钮)
    async viewRoles(id) {
      const res = await userRoleList({ userId: id })
      // console.log('查看拥有角色', res)
      const role = res.data.roleIds
      this.$set(this.viewPopOptions.formDatas, 'role', role)
    },
    // 判断工号是否存在
    jobNumIsDisabled(jobNum) {
      if (jobNum) {
        this.$set(this.commonContent[1], 'disabled', true)
      } else {
        this.$set(this.commonContent[1], 'disabled', false)
      }
    },
    // 查询数据加密
    async getDataRuleList(data = {}) {
      const res = await sysDataMaskingRuleList(data)
      console.log('查询数据加密', res)
      const listData = res.data.list || []
      // debugger
      const newList = listData.map(v => {
        return {
          ...v,
          name: v.ruleName
        }
      })
      const optionalData = this.$utils.deepClone(newList)
      // const newArray = this.translateArray(optionalData, false, { key: 'ruleId', name: 'ruleName' })
      const newArray = this.translateArray(optionalData, false, { key: 'ruleId' })
      // debugger
      console.log(newArray)
      newArray.forEach(item => { item.hiddenCheckBox = true })
      this.$set(this.commonContent[10].treeOptions, 'data', newArray)
      // this.$set(this.viewPopOptions.content[0].treeOptions, 'data', this.translateArray(noChoice, true, { key: 'roleId' }))
    },

    // 查询数据范围
    async getDataGroupList(data = {}) {
      const res = await sysDataGroupList(data)
      console.log('数据范围', res)
      const dataList = res.data.list || []
      const optionalData = this.$utils.deepClone(dataList)
      const newArray = this.translateArray(optionalData, false, { key: 'dataGourpId' })
      // console.log('数据范围', newArray)
      newArray.forEach(item => { item.hiddenCheckBox = true })
      this.$set(this.commonContent[9].treeOptions, 'data', newArray)
    },
    // 对业务数据树右边的数据进行处理
    checkedTagsRenderContent(item) {
      // console.log('树右边', item)
      // const newArray = []
      // newArray[0] = item.name
      const newList = this.recursionFatherOrSon(this.dataFormList, item.orgId)
      // console.log('newList', newList)
      return `<span>${newList.join(' - ')}<span>`
    },
    // 递归查找数据
    recursionFatherOrSon(array, id) {
      const newArray = []
      // console.log('array', array, id)
      function recursion(array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].orgId === id) {
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
    // 获取员工详情
    async getUserInfo(data = {}) {
      const res = await userInfo(data)
      console.log(res)
      if (res.code !== 200) {
        return false
      }
      // debugger
      this.rowInfoMessages = res.data
      res.data.roles && (this.roleList = res.data.roles.map(item => item.roleId))
      const dataGroups = res.data.dataGroups ? res.data.dataGroups.map(item => { return item.dataGourpId }) : []
      const orgs = res.data.orgs ? res.data.orgs : []
      const roles = res.data.roles ? this.roleList : []
      const maskRuleData = res.data.maskRuleList ? res.data.maskRuleList : []
      const maskRuleList = maskRuleData.map(v => {
        return {
          ruleId: v.ruleId,
          name: v.ruleName
        }
      })

      !res.data.areaCode && delete res.data.areaCode
      console.log({ ...res.data, dataGroups, orgs, roles, maskRuleList })
      this.setFormDatas({ ...res.data, dataGroups, orgs, roles, maskRuleList })
    },

    // 获取可用邮箱的列表
    async getAvailableMailboxList(data = {}) {
      const res = await mailBoxManagerList(data)
      if (res.code !== 200) {
        return false
      }
      console.log(res)
      const dataList = res.data || []
      // const dataList = ['@sfabric.com', '@qq.com']
      const emailName = dataList.map(item => item.mailBoxSuffix).join('|')
      // const emailName = dataList.join('|')
      const pattern = new RegExp('(' + emailName + ')$')
      console.log('pattern', pattern)
      const mailboxListReg = this.$getRules({ type: 'email2', pattern, message: '请输入正确的公司可用email', trigger: ['blur'] })
      this.$set(this.commonContent[4], 'rules', [...this.commonContent[4].rules, mailboxListReg])
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
.employee {
  padding: 20px 20px 21px;
  // padding-bottom: 0;

  .line {
    margin-top: 20px;
    margin-bottom: 15px;
    width: 100%;
    height: 1px;
    background-color: #ccc;
  }
}
</style>
<style lang="scss">
  .userPop {
    .el-dialog__body {
      // padding: 30px!important;
    }
  }
  .employee {
    .el-form.el-form--inline .el-form-item__label-wrap {
      margin-left: 0px !important;
    }
  }
  .popOptionsClass {
    .el-textarea__inner{
      resize: none;
    }
  }
</style>
