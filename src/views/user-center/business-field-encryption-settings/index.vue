<template>
  <div class="encryptionSettings">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增规则按钮 -->
    <div class="button">
      <el-button v-permission="['userCenter:sysDataMaskingRule:add']" size="small" type="primary" @click="addRuleBtn">新增规则</el-button>
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
    <!-- 设置加密pop弹框 -->
    <!-- <setEncryptedField :pop-flag.sync="popFlag" /> -->
    <div class="pop">
      <cs-custom-pop :options="encryptionPopOptions" />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
    <!-- 导入pop弹出层(查看用户) -->
    <!-- <div class="userPop">
      <cs-custom-pop :options="viewPopOptions" />
    </div> -->
    <!-- 选择员工 -->
    <div class="userPop">
      <cs-custom-pop :options="viewPopOptions2" />
    </div>
  </div>
</template>

<script>
import { sysDataMaskingRulePage, sysDataMaskingRuleAdd, sysDataMaskingRuleModify, sysDataMaskingRuleDelete, formList, sysDataMaskingRuleInfo, /* getRelateRoleList, relateRoleModify,*/ relateUserModify, getRelateUserList } from './api/index.js'
import { ruleFormModify, ruleFormReset } from './api/index.js'
import { sysAppSystemList } from '../micro-services/api/index.js'
import { userPageList } from '../employee-management/api/index.js'
// import { roleList } from '../role-management/api/index.js'
// import setEncryptedField from './components/setEncryptedField'
// import elCheckbox from './components/elCheckbox.vue'
import elRadiobox from './components/elRadiobox.vue'
import currentSystem from './components/currentSystem.vue'
import department from '../employee-management/components/department.vue'
import { _debounce } from '@/utils/index.js'
export default {
  name: 'BusinessFieldEncryptionSettings',
  components: {
    // setEncryptedField
  },
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
    // 所属系统change事件
    const appSystemIdChange = (value, form, formDatas, setFormDatas) => {
      // console.log(value)
      this.getFormList({ appSystemId: value })
      setFormDatas({ forms: [] })
    }
    // tab栏切换change事件
    const tabChange = value => {
      // console.log(value)
      // console.log(this.listGroup)
      const listDatas = this.listGroup.filter(item => {
        if (item.formId === value) {
          return item.fields
        }
      })
      // console.log(listDatas[0].fields)
      // this.$set(this.csCustomPopConfig)
      // this.csCustomPopConfig = listDatas[0].fields
      this.$set(this.encryptionPopOptions.content[3], 'dataSource', listDatas[0].fields)
    }
    // 设置里面选择单据change事件
    const billChange = value => {
      // console.log(value)
      const tabDatas = this.childFormList.filter(item => item.parentId === value).map(item => {
        return {
          label: '单据-' + item.formName,
          value: item.formId
        }
      })
      this.$set(this.encryptionPopOptions.content[2], 'dataSource', tabDatas)
      tabChange(tabDatas[0].value)
      this.encryptionSetFormDatas({ tabs: tabDatas[0].value })
      // this.$set(this.encryptionPopOptions.content[3], 'dataSource', [])
      // console.log('tabDatas', tabDatas)
    }
    // 当前系统的样式
    // const style2 = {
    //   'margin-bottom': '22px'
    // }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'ruleName',
        itemType: 'input',
        label: '规则名称:',
        // itemStyle: { width: '25%' },
        // labelWidth: '108px',
        placeholder: '请输入规则名称'
      },
      {
        prop: 'appSystemIds',
        itemType: 'select',
        label: '所属系统:',
        itemStyle: { width: '300px' },
        filterable: true,
        multiple: true,
        collapseTags: true,
        dataSource: []
      },
      {
        prop: 'formName',
        itemType: 'input',
        // itemStyle: { width: '25%' },
        label: '业务单据名称:',
        // labelWidth: '108px',
        placeholder: '请输入业务单据关键字'
      },
      {
        prop: 'status',
        itemType: 'select',
        // itemStyle: { width: '25%' },
        label: '设置状态:',
        dataSource: [
          {
            label: '全部',
            value: 2
          },
          {
            label: '已设置',
            value: 1
          },
          {
            label: '未设置',
            value: 0
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          // console.log('查询', params)
          const status = params.status && params.status === 2 ? null : params.status
          const appSystemIds = params.appSystemIds && params.appSystemIds.length === 0 ? null : params.appSystemIds
          this.searchFormDatas = { ...params, status, appSystemIds }
          this.getRulePage({ ...params, status, appSystemIds })
        },
        resetHandle: (params) => {
          // console.log('重置', this.pagination)
          // this.getRoleList({ pageNum: 1, pageSize: 20 })
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
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
        prop: 'ruleName',
        label: '规则名称',
        minWidth: '120'
      },
      {
        prop: 'appSystemName',
        label: '所属系统',
        minWidth: '100'
      },
      {
        prop: 'forms',
        label: '业务单据',
        minWidth: '180',
        components: {
          department
        },
        componentsOptions: {
          key: 'forms',
          name: 'formName'
        }
        // formater: scope => {
        //   return scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0 ? scope.row[scope.column.property].map(item => item.formName).join(' , ') : '无'
        // }
      },
      {
        prop: 'status',
        label: '设置状态',
        width: '100',
        formater: scope => {
        //   return scope.row[scope.column.property] !== null && scope.row[scope.column.property] === 1
        //     ? `<span style="color: #2ac06d;">已授权</span>`
        //     : `<span style="color: #ff0000;">未授权</span>`
          return scope.row[scope.column.property] === 1 ? `<span style="color: #00BCC5;">已设置</span>` : `<span style="color: #FF9214;">未设置</span>`
        }
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        width: '140',
        formater: scope => {
          return this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}')
        }
      }
    ]
    // dialog弹出框表格表头的配置信息
    const columnsInfos = [
      {
        prop: 'id',
        label: '序号',
        width: '90',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          return scope.$index + 1
        }
      },
      {
        prop: 'desc',
        label: '字段名称'
        // handle: scope => {
        //   console.log('加密', scope)
        // }
      },
      {
        prop: 'status',
        label: '不加密',
        width: '120',
        components: {
          elRadiobox
        },
        componentsOptions: {
          value: 'N',
          changeMethods: (scope) => {
            scope.row.type = 'N'
          }
        }
      },
      {
        prop: 'status',
        label: '不可编辑',
        width: '130',
        components: {
          elRadiobox
        },
        componentsOptions: {
          value: 'D',
          changeMethods: (scope) => {
            scope.row.type = 'D'
          }
        }
      },
      {
        prop: 'status',
        label: '加密且不可编辑',
        width: '160',
        components: {
          elRadiobox
        },
        componentsOptions: {
          value: 'B',
          changeMethods: (scope) => {
            scope.row.type = 'B'
          }
        }
      }
    ]
    // 规则状态为未设置时，不显示设置角色按钮
    // const modifyIsShow = scope => {
    //   if (scope.row.status === 0) {
    //     return false
    //   } else {
    //     return true
    //   }
    // }
    let popOperatesDataSource = [
      {
        label: '设置',
        isShow: true,
        permitTag: ['userCenter:sysDataMaskingRule:rule:form:modify'],
        handle: async params => {
          this.type = 'set'
          console.log(params)
          this.encryptionPopDialogHandle('设置业务单据的加密显示字段')
          await this.getFormInfo({ ruleId: params.row.ruleId })
          const businessDocumentList = this.parentFormList.length !== 0 ? this.parentFormList.map(item => {
            return {
              label: item.formName,
              value: item.formId
            }
          }) : []
          this.$set(this.encryptionPopOptions.content[1], 'dataSource', businessDocumentList)
          billChange(businessDocumentList[0].value)
          this.$set(this.encryptionPopOptions.content[0].componentsOptions, 'systemName', params.row.appSystemName)
        }
      },
      {
        label: '关联员工',
        isShow: true,
        permitTag: ['userCenter:sysDataMaskingRule:rule:form:modify'],
        handle: params => {
          // console.log('查看用户', params)
          this.viewPopDialogHandle2('选择员工')
          // this.getUserList(params.row.roleId)
          this.getUserPage()
          this.viewUser({ ruleId: params.row.ruleId })
          this.ruleId = params.row.ruleId
        }
      },
      {
        label: '修改',
        permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: (scope) => {
          return true
        },
        handle: params => {
          console.log(params)
          this.type = 'edit'
          this.$set(this.popOptions.content[2], 'disabled', true)
          console.log(this.searchData[1])
          console.log('修改', params)
          this.PopDialogHandle('修改字段加密规则')
          this.getFormList({ appSystemId: params.row.appSystemId })
          this.getFormInfo({ ruleId: params.row.ruleId })
        }
      },
      // {
      //   label: '关联角色',
      //   permitTag: ['userCenter:sysDataMaskingRule:relate:role:modify'],
      //   isShow: true, // modifyIsShow,
      //   handle: async params => {
      //     console.log('关联角色', params)
      //     await this.getRoleList({ appSystemIds: [params.row.appSystemId] })
      //     this.viewRoles(params.row.ruleId)
      //     params.row.roles && params.row.roles.forEach((item) => { item.disabled = true })
      //     this.viewPopDialogHandle('关联角色')
      //     this.ruleId = params.row.ruleId
      //   }
      // },
      {
        label: '重置',
        permitTag: ['userCenter:sysDataMaskingRule:rule:form:reset'],
        isShow: (scope) => {
          return true
        },
        handle: params => {
          this.$confirm(' 你确认要重置加密字段吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.resetRule(params)
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
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['userCenter:sysDataMaskingRule:delete'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该规则吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteRule({ ruleId: params.row.ruleId })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }
      // {
      //   label: '角色',
      //   permitTag: ['userCenter:sysRole:user:modify'],
      //   isShow: modifyIsShow,
      //   handle: params => {
      //     console.log('查看用户', params)
      //     this.viewPopDialogHandle('查看用户')
      //     this.getUserPage()
      //     // this.viewUser({ roleIds: [params.row.roleId] })
      //     // this.roleId = params.row.roleId
      //   }
      // }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '210',
      fixed: 'right',
      moreOptions: {
        maxLength: 2, // 最大超过多少个显示more功能，默认为2
        placement: 'bottom'
      },
      dataSource: popOperatesDataSource
      // components: { operatesColumn }
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.getRulePage({ pageNum: 1, pageSize: val })
      }
    }
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      okText: '保存',
      ok: params => {
        // console.log('zzz', params)
        const formIds = params.forms ? params.forms.map(item => typeof item === 'object' ? item.formId : item) : []
        this.addOrModifyRule({ ...params, formIds })
      },
      cancel: params => {
        this.PopDialogHandle()
      },
      formDatas: {
        // areaNum: 86
      },
      formOptions: {
        // labelWidth: '90px'
      },
      content: [
        {
          itemType: 'view',
          text: '基本信息',
          style
        },
        {
          prop: 'ruleName',
          itemType: 'input',
          label: '规则名称:',
          rules: [commonBlurReg],
          placeholder: '请输入规则名称'
        },
        {
          prop: 'appSystemId',
          itemType: 'select',
          label: '所属系统:',
          filterable: true,
          change: appSystemIdChange,
          rules: [commonChangeReg],
          dataSource: []
          // placeholder: '请输入工号'
        },
        {
          prop: 'forms',
          itemType: 'tree',
          label: '选择单据:',
          popoverOptions: {
            trigger: 'click',
            width: '560',
            title: '选择单据'
          },
          treeOptions: {
            depend: false,
            // checkStrictly: false,
            nodeKey: 'formId',
            props: {
              label: 'formName',
              children: 'child'
            },
            // checkedTagsRenderContent: (item) => { return this.checkedTagsRenderContent(item) },
            isPopTree: true,
            treeSelectTitle: '请选择',
            span: [12, 12],
            treeSelectedTitle: '已选择',
            data: [],
            showCheckbox: true
          },
          rules: [commonChangeReg],
          placeholder: '请选择单据'
        }
      ]
    }
    // 设置加密规则pop弹出框配置信息
    const encryptionPopOptions = {
      itemType: 'dialog',
      width: '694px',
      visible: false,
      title: '修改',
      okText: '保存',
      ok: params => {
        // console.log('zzz', params)
        // console.log(this.listGroup)
        let num = 0
        this.listGroup.forEach(item => {
          if (item.fields.every(item => item.status === '0')) {
            num++
          }
        })
        // const JSONDatas = this.listGroup.map(item => {
        //   return {
        //     formId: item.formId,
        //     fields: JSON.stringify(item.fields)
        //   }
        // })
        const objDatas = {
          ruleId: params.ruleId,
          forms: this.listGroup.map(item => {
            return {
              formId: item.formId,
              fields: JSON.stringify(item.fields)
            }
          })
        }
        if (num !== 0) {
          this.$confirm(`该规则已经选择了${this.listGroup.length}个业务表单，加密字段设置只设置了${this.listGroup.length - num}个表单，是否确认保存退出？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // console.log('objDatas', objDatas)
            this.setRules(objDatas)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            })
          })
        } else {
          // console.log('objDatas', objDatas)
          this.setRules(objDatas)
        }
      },
      cancel: params => {
        // this.encryptionPopDialogHandle()
        this.$set(this.encryptionPopOptions, 'visible', false)
      },
      formDatas: {
        // areaNum: 86
      },
      formOptions: {
        className: 'pop-table'
        // labelWidth: '74px'
      },
      content: [
        {
          // itemType: 'view',
          // text: `当前系统: `,
          // style: style2
          components: {
            currentSystem
          },
          componentsOptions: {
            systemName: ''
            // systemName: this.systemName
          }
        },
        {
          prop: 'businessDocumentList',
          itemType: 'select',
          label: '选择单据:',
          labelWidth: '346px',
          change: billChange,
          dataSource: []
          // placeholder: '请输入工号'
        },
        {
          prop: 'tabs',
          itemType: 'tabs',
          label: '',
          type: 'card',
          labelWidth: '0',
          placeholder: '请输入姓名',
          itemStyle: { 'margin-bottom': '0px' },
          change: tabChange,
          dataSource: [
            // {
            //   label: '标签一',
            //   value: '1'
            // }, {
            //   label: '标签二',
            //   value: '2'
            // }
          ]
        },
        {
          prop: 'table',
          itemType: 'table',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          label: '',
          labelWidth: '0',
          dataSource: this.csCustomPopConfig,
          columns: columnsInfos
        }
      ]
    }
    // 关联角色pop弹出框的配置信息
    // const viewPopOptions = {
    //   itemType: 'dialog',
    //   visible: false,
    //   title: '修改',
    //   // label: '100',
    //   okText: '保存',
    //   width: '560px',
    //   ok: params => {
    //     console.log('111', params)
    //     const ids = params.role && params.role.length !== 0 ? params.role.map(item => item) : []
    //     const addRoleIds = ids.filter(item => !this.roleList.includes(item))
    //     const deleteRoleIds = this.roleList.filter(item => !ids.includes(item))
    //     this.saveRole({ ruleId: this.ruleId, addRoleIds, deleteRoleIds })
    //   },
    //   cancel: params => {
    //     this.$set(this.viewPopOptions, 'visible', false)
    //     // console.log(params)
    //   },
    //   formDatas: {},
    //   formOptions: {
    //     labelWidth: '0px'
    //   },
    //   content: [
    //     {
    //       prop: 'role',
    //       itemType: 'tree',
    //       label: '',
    //       popoverOptions: {
    //         trigger: 'click',
    //         title: '选择角色'
    //       },
    //       treeOptions: {
    //         checkStrictly: false,
    //         bindParentTags: true,
    //         defaultExpandAll: false,
    //         nodeKey: 'roleId',
    //         props: {
    //           parentId: 'appSystemId',
    //           label: 'name',
    //           children: 'children'
    //         },
    //         showCheckbox: true,
    //         isPopTree: false,
    //         treeSelectTitle: '请选择',
    //         span: [12, 12],
    //         treeSelectedTitle: '已选择',
    //         data: []
    //       },
    //       placeholder: '请选择角色'
    //     }
    //   ]
    // }
    // 设置用户弹出框配置信息
    const viewPopOptions2 = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      okText: '保存',
      ok: params => {
        for (let i = 0; i < params.user.length; i++) {
          if (!params.user[i] || !params.user[i].userId) params.user.splice(i--, 1)
        }
        const ids = params.user && params.user.length !== 0 ? params.user.map(item => item.userId) : []
        const addUsers = ids.filter(item => !this.userList.includes(item))
        const deleteUsers = this.userList.filter(item => !ids.includes(item))
        this.saveUser({ ruleId: this.ruleId, addUsers, deleteUsers })
      },
      cancel: params => {
        this.$set(this.viewPopOptions2, 'visible', false)
        // this.userValue = ''
      },
      formDatas: {},
      formOptions: {
        className: 'pop-table'
        // labelWidth: '0px'
      },
      content: [
        {
          prop: 'user',
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
            selectTitle: '全部员工',
            needSearch: true,
            tooltipEffect: 'dark',
            props: { label: 'info' },
            dataSource: [],
            checkedTagsRenderContent: (item) => { return this.checkedTagsRenderContent2(item) },
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
      formDatas: {
        ruleName: '',
        formName: '',
        appSystemIds: []
      },
      columns,
      columnsInfos,
      popOperates,
      pagination,
      // dataSource: [],
      csCustomPopConfig: [],
      popOptions,
      // viewPopOptions,
      encryptionPopOptions,
      popFlag: false,
      searchFormDatas: {
        ruleName: '',
        formName: ''
      },
      type: 'add',
      childFormList: [],
      parentFormList: [],
      listGroup: [],
      appSystemIds: this.$store.state.user.userInfo.appSystemIds.length !== 0 ? this.$store.state.user.userInfo.appSystemIds : null,
      // systemName: ''
      rowInfoMessages: {},
      rowInfoRuleMessages: {},
      userValue: '',
      roleList: [],
      ruleId: '',
      viewPopOptions2,
      userList: []
    }
  },
  computed: {
    dataSource: {
      get() {
        return this.$store.state.user.encryptionData
      },
      set(data) {
        this.$store.commit('user/SET_ENCRYPTIONData', data)
      }
    }
  },
  created() {
    this.getSystemList()
    this.getRulePage()
    // this.getRoleList()
  },
  activated() {
    this.getRulePage()
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
    // 修改弹出层的判断
    encryptionPopDialogHandle(val) {
      this.$set(this.encryptionPopOptions, 'visible', !this.encryptionPopOptions.visible)
      if (val) {
        this.$set(this.encryptionPopOptions, 'title', val)
      }
    },
    // 修改按钮
    encryptionSetFormDatas(params) {
      // setTimeout(() => {
      this.$set(this.encryptionPopOptions, 'formDatas', params)
      // }, 0)
    },
    // 添加规则按钮
    addRuleBtn() {
      this.type = 'add'
      this.$set(this.popOptions.content[2], 'disabled', false)
      this.$set(this.popOptions.content[3].treeOptions, 'data', [])
      this.PopDialogHandle('新增字段加密规则')
    },
    // 修改查看用户弹出层的判断
    // viewPopDialogHandle(val) {
    //   this.$set(this.viewPopOptions, 'visible', !this.viewPopOptions.visible)
    //   if (val) {
    //     this.$set(this.viewPopOptions, 'title', val)
    //   }
    // },
    // 修改选择员工弹出层的判断
    viewPopDialogHandle2(val) {
      this.userValue = ''
      this.$set(this.viewPopOptions2, 'visible', !this.viewPopOptions2.visible)
      if (val) {
        this.$set(this.viewPopOptions2, 'title', val)
      }
    },
    // 查看用户拥有角色(右边选择的)
    // async viewRoles(id) {
    //   const res = await getRelateRoleList({ ruleId: id })
    //   // console.log('查看拥有角色', res)
    //   const role = res.data && res.data.roleIds ? res.data.roleIds : []
    //   this.$set(this.viewPopOptions.formDatas, 'role', role)

    //   this.roleList = role.length !== 0 ? role.map(item => item) : []
    // },
    // 设置角色
    // async saveRole(data = {}) {
    //   const res = await relateRoleModify(data)
    //   if (res.code !== 200) {
    //     return false
    //   }
    //   const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'roleId')
    //   const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
    //   flag && this.fetchLog(this.getLogMessages('SET', '/userCenter/sysDataMaskingRule/relate/role/modify'), data, JSON.stringify({ beforeText: `在'用户中心-字段加密'做了设置操作`, afterCode }))
    //   // this.viewPopDialogHandle()
    //   this.$set(this.viewPopOptions, 'visible', false)
    //   this.$message.success('保存成功')
    // },
    // 获取角色列表
    // async getRoleList(data = {}) {
    //   const res = await roleList(data)
    //   // console.log('角色列表', res)
    //   const listData = res.data.list || []
    //   const listRes = listData.filter(v => v.type !== '1')
    //   const optionalData = this.$utils.deepClone(listRes)
    //   const newArray = this.translateArray(optionalData, false, { key: 'roleId' })
    //   newArray.forEach(item => { item.hiddenCheckBox = true })
    //   this.$set(this.viewPopOptions.content[0].treeOptions, 'data', newArray)
    // },
    // 角色信息/一维数组转二维数组
    translateArray(array, flag, prop = {}) {
      const key = prop.key || 'key'
      // const name = prop.name || 'name'
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
          // roleId: item[0].appSystemId,
          appSystemId: '-1',
          name: item[0].appSystemName,
          disabled: flag,
          children: item
        }
      })
    },
    // ejectPop() {
    //   this.popFlag = true
    // }
    // 获取系统列表
    async getSystemList(data = {}) {
      const appSystemIds = this.appSystemIds
      const res = await sysAppSystemList({ ...data, appSystemIds })
      const systemList = res.data.list.map(item => {
        return { value: item.appSysId, label: item.appSysName }
      })
      // console.log('系统列表', systemList)
      const list = systemList || []
      // this.sysList = list
      this.$set(this.searchData[1], 'dataSource', list)
      this.$set(this.popOptions.content[2], 'dataSource', list.filter(item => ![2, 5, 6].includes(item.value)))
      // this.$set(this.popOptions.content[2], 'dataSource', list)
      // const tempData = this.searchData[2].dataSource.find(item => item.value * 1 === this.systemId * 1)
      // this.systemName = tempData && tempData.label
    },
    // 获取用户分页列表
    @_debounce(50)
    async getRulePage(data = {}) {
      const appSystemIds = this.searchFormDatas.appSystemIds || this.appSystemIds
      const res = await sysDataMaskingRulePage({ ...this.searchFormDatas, ...data, appSystemIds })
      // console.log('用户列表', res)
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
    },
    // 获取用户分页列表
    async getUserPage(data = {}) {
      const res = await userPageList({ ...data, requireOrgFlag: 1, requireDataGroupFlag: 1, realName: this.userValue || '' })
      // console.log('用户列表', res)
      const userList = res.data.list || []
      // this.dataSource = userList
      this.$set(this.viewPopOptions2.content[0].tableOptions, 'dataSource', userList)
      this.$set(this.viewPopOptions2.content[0], 'pagination', {
        ...this.viewPopOptions2.content[0].pagination,
        dataTotal: res.data.total || 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      })
    },
    // 查看用户(右边已选择数据)
    async viewUser(data = {}) {
      const res = await getRelateUserList({ ...data })
      const userLists = res.data || []
      this.$set(this.viewPopOptions2.formDatas, 'user', userLists)
      this.userList = userLists.length !== 0 ? userLists.map(item => item.userId) : []
      console.log('已选择用户', this.userList)
    },
    checkedTagsRenderContent2(item) {
      return `<div class="custom-tree-node"><span class="spot" title="${this.sortDepartment(item)}">${item.realName || item.name} ${this.sortDepartment(item)}<span></div>`
    },
    // 设置用户
    async saveUser(data = {}) {
      const res = await relateUserModify(data)
      if (res.code !== 200) {
        return false
      }
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'roleId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('SET', '/userCenter/sysDataMaskingRule/relate/user/modify'), data, JSON.stringify({ beforeText: `在'用户中心-字段加密'做了设置操作`, afterCode }))
      // this.viewPopDialogHandle()
      this.$set(this.viewPopOptions2, 'visible', false)
      this.$message.success('保存成功')
    },
    // 部门一行显示 没有部门
    sortDepartment(data) {
      if (data.orgs && data.orgs.length !== 0) {
        return `（ ${data.orgs && data.orgs.map(item => item.name).join(' / ')} ）`
      } else if (data.orgList && data.orgList.length !== 0) {
        return `（ ${data.orgList && data.orgList.map(item => item.name).join(' / ')} ）`
      } else {
        return ''
      }
    },
    checkedTagsRenderContent(item) {
      console.log('item', item)
      if (item.isEnabled === 1) {
        return `<div class="custom-tree-node"><span class="spot" title="${this.sortDepartment(item)}">${item.realName} ${this.sortDepartment(item)}<span></div>`
      } else if (item.isEnabled === 0) {
        return `<div class="custom-tree-node"><span style="color: #FE4949">！</span><span class="spot" title="${this.sortDepartment(item)}">${item.realName} ${this.sortDepartment(item)}<span></div>`
      }
    },
    // 新增或者修改规则
    addOrModifyRule(data) {
      if (this.type === 'add') {
        this.addRule(data)
      } else if (this.type === 'edit') {
        this.modifyRule(data)
      }
    },
    // 新增规则
    async addRule(data = {}) {
      const res = await sysDataMaskingRuleAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('INSERT', '/userCenter/sysDataMaskingRule/add'), data, JSON.stringify({ beforeText: `在'用户中心-字段加密'新增一条记录`, beforeCode: data }))
      this.getRulePage()
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('添加成功')
    },
    // 修改规则
    async modifyRule(data = {}) {
      const res = await sysDataMaskingRuleModify(data)
      if (res.code !== 200) {
        return false
      }
      this.rowInfoMessages.formIds = this.parentFormList.map(item => item.formId)
      delete data.forms
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'ruleId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      // console.log(this.rowInfoMessages)
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysDataMaskingRule/modify'), data, JSON.stringify({ beforeText: `在'用户中心-字段加密'将${JSON.stringify({ 'ruleId': data.ruleId })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      this.getRulePage()
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('修改成功')
    },
    // 删除规则
    async deleteRule(data = {}) {
      const res = await sysDataMaskingRuleDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('DEL', '/userCenter/sysDataMaskingRule/delete'), data, JSON.stringify({ beforeText: `在'用户中心-字段加密'删除一条记录`, beforeCode: data }))
      this.$message.success('删除成功')
      this.getRulePage()
    },
    // 业务单据列表查询
    async getFormList(data = {}) {
      const res = await formList(data)
      // console.log('业务列表', res)
      const dataList = res.data.list || []
      this.$set(this.popOptions.content[3].treeOptions, 'data', dataList)
    },
    // 业务单据详情查询
    async getFormInfo(data = {}) {
      const res = await sysDataMaskingRuleInfo(data)
      this.rowInfoMessages = res.data
      this.rowInfoRuleMessages = { ruleId: res.data.ruleId, forms: res.data.forms }
      console.log('详情', res)
      const parentDataList = res.data.forms ? res.data.forms.filter(item => item.parentId === '-1') : []
      this.parentFormList = parentDataList
      const childDataList = res.data.forms ? res.data.forms.filter(item => item.parentId !== '-1') : []
      this.childFormList = childDataList
      this.listGroup = childDataList.map(item => {
        return {
          formId: item.formId,
          fields: item.fields ? JSON.parse(item.fields) : []
        }
      })
      if (this.type === 'edit') {
        this.setFormDatas({ ...res.data, forms: parentDataList.map(item => item.formId) })
      } else if (this.type === 'set') {
        for (let i = 0; i < this.listGroup.length; i++) {
          for (let j = 0; j < this.listGroup[i].fields.length; j++) {
            if (!this.listGroup[i].fields[j].type) this.listGroup[i].fields[j].type = 'N'
          }
        }
        this.encryptionSetFormDatas({ ...res.data, businessDocumentList: parentDataList[0].formId })
      }
    },
    // 设置规则确认按钮
    async setRules(data = {}) {
      console.log('data', data)
      const res = await ruleFormModify(data)
      if (res.code !== 200) {
        return false
      }
      const { beforeCode, afterCode } = this.compareData({ ...this.statusChecked(this.childFormList), ruleId: data.ruleId }, { ...this.statusChecked(data.forms), ruleId: data.ruleId }, 'ruleId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      // console.log(JSON.stringify(this.childFormList.map(item => { return { formId: item.formId, fields: JSON.parse(item.fields).filter(item => item.status === '1') } })), this.statusChecked(this.childFormList))
      flag && this.fetchLog(this.getLogMessages('SET', '/userCenter/sysDataMaskingRule/rule/form/modify'), data, JSON.stringify({ beforeText: `在'用户中心-字段加密'将${JSON.stringify({ 'ruleId': data.ruleId })}的加密字段`, afterText: '设置为', ...{ beforeCode, afterCode }}))
      this.$set(this.encryptionPopOptions, 'visible', false)
      this.$message.success('保存成功')
      this.getRulePage()
    },
    // 重置规则
    async resetRule(params = {}) {
      const res = await ruleFormReset({ ruleId: params.row.ruleId })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysDataMaskingRule/rule/form/reset'), { ruleId: params.row.ruleId }, JSON.stringify({ beforeText: `在'用户中心-字段加密'清除了一条记录的所有规则`, beforeCode: { ruleId: params.row.ruleId }}))
      this.$message.success('重置成功')
      params.row.status = 0
    },
    // 传日志信息到卡夫卡
    fetchLog(messages, data, description) {
      this.$store.dispatch('app/fetchLog', { ...messages, params: JSON.stringify(data), description })
    },
    // 选出状态status为1 也就是选中的出来
    statusChecked(data) {
      // console.log(data)
      return data.map(item => {
        return {
          formId: item.formId,
          fields: JSON.parse(item.fields).filter(item => item.status === '1')
        }
      })
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
      const userInfo = this.$store.state.user.userInfo
      const baseURL = this.$store.state.app.baseURL
      const topic = this.$store.state.user.topic
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

<style lang='scss' scoped>
    .encryptionSettings {
        padding: 20px;
        // padding-bottom: 0;
    }
</style>
<style lang="scss">
  .encryptionSettings {
    .custom-form {
      .el-form {
        // position: relative;
      }
    }
    .el-form.el-form--inline .el-form-item__label-wrap {
      margin-left: 0px !important;
    }
    .el-dialog__body {
      padding-top: 15px;
      .el-tabs__nav {
        height: 34px;
      }
      .el-tabs__item {
        height: 30px;
        line-height: 30px;
      }
    }
    .custom-tree-node {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding-right: 10px;
    }
  }
</style>
