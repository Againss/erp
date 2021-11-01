<template>
  <div class="menu">
    <!-- 新增菜单按钮 -->
    <div v-if="systemId" class="button">
      <!-- <inputVagueSearch /> -->
      <!-- <el-button v-permission="['userCenter:sysPermit:add']" type="primary" @click="addMenu">新增菜单</el-button> -->
      <span class="systemName"><span class="system-text">当前微服务/系统：</span> {{ systemName }}</span>
    </div>
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>

    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :tree-props="{children: 'child'}"
        row-key="permitId"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        lazy
        :pagination="pagination"
        edit-type="pop"
        :table-scrollx="true"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
// import splitInformation from '@/components/formSplitRow/splitInformation.vue'
import config from './config/buttonType.js'
import { sysPermitPage, sysPermitList, sysPermitAdd, sysPermitModify, sysPermitDelete, sysPermitInfo } from './api/index.js'
import { sysAppSystemList } from '../micro-services/api/index.js'
import { _debounce } from '@/utils/index.js'
export default {
  name: 'MenuManagement',
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
    // 单选框点击页面格式修改
    const radioChange = (value, form) => {
      // console.log(value)
      form.clearValidate()
      // console.log('form', form)
      if (value === 'N') {
        this.$set(this.popOptions, 'content', navContent)
      } else if (value === 'M') {
        this.$set(this.popOptions, 'content', menuContent)
      } else if (value === 'B') {
        // console.log('111', this.popOptions.formDatas.controlStatus)
        this.setFormDatas({ controlStatus: this.popOptions.formDatas.controlStatus })
        if (this.popOptions.formDatas.controlStatus === 1) {
          this.$set(this.popOptions, 'content', btnSelectContent)
        } else {
          this.$set(this.popOptions, 'content', btnContent)
        }
      }
    }
    // switch框change事件
    const switchChange = value => {
      // console.log('switch', value)
      if (value === 1) {
        this.$set(this.popOptions, 'content', btnSelectContent)
      } else {
        this.$set(this.popOptions, 'content', btnContent)
      }
    }
    // 所属系统select change事件
    const systemChange = value => {
      // console.log('systemChange', value)
      this.allPermissionList({ appSystemId: value })
    }

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
    // 授权标识内容
    const permitTagContent = {
      prop: 'permitTag',
      itemType: 'input',
      label: '授权标识:',
      placeholder: '请输入授权标志',
      disabled: true,
      rules: [commonBlurReg]
    }
    // pop弹出框公用内容
    const content = [
      {
        itemType: 'view',
        text: '基本信息',
        style
      },
      {
        prop: 'appSystemId',
        itemType: 'select',
        label: '所属系统:',
        change: systemChange,
        filterable: true,
        rules: [commonChangeReg],
        dataSource: []
      },
      {
        itemType: 'radio-group',
        prop: 'type',
        label: '类型:',
        change: radioChange,
        rules: [commonChangeReg],
        dataSource: [
          {
            value: 'N',
            label: '导航'
          },
          {
            value: 'M',
            label: '菜单'
          },
          {
            value: 'B',
            label: '按钮'
          }
        ]
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '中文名称:',
        rules: [commonBlurReg],
        placeholder: '请输入中文名称'
      },
      {
        prop: 'enName',
        itemType: 'input',
        label: '英文名称:',
        rules: [commonBlurReg],
        placeholder: '请输入英文名称'
      }
    ]
    // pop导航内容
    const navContent = [
      ...content,
      {
        prop: 'icon',
        itemType: 'icon',
        label: '图标名称:',
        placeholder: '请选择图标名称'
      },
      {
        prop: 'parentId',
        itemType: 'tree',
        label: '上级菜单:',
        width: '560px',
        popoverOptions: {
          width: '560',
          trigger: 'click',
          title: '选择菜单'
        },
        treeOptions: {
          nodeKey: 'permitId',
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
        placeholder: '请选择上级菜单'
      },
      {
        prop: 'sort',
        itemType: 'input',
        label: '序号:',
        placeholder: '请输入序号'
      },
      permitTagContent
    ]
    // pop菜单内容
    const menuContent = [
      ...navContent,
      {
        prop: 'uri',
        itemType: 'input',
        label: '链接地址:',
        placeholder: '请输入链接地址',
        rules: [commonBlurReg],
        disabled: true
      }
      // {
      //   prop: 'permitTag',
      //   itemType: 'input',
      //   label: '授权标识:',
      //   placeholder: '请输入授权标志',
      //   rules: [commonBlurReg]
      // }
    ]
    // pop按钮内容
    const btnContent = [
      ...content,
      {
        prop: 'parentId',
        itemType: 'tree',
        label: '上级菜单:',
        popoverOptions: {
          width: '560',
          trigger: 'click',
          title: '选择菜单'
        },
        treeOptions: {
          nodeKey: 'permitId',
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
        placeholder: '请选择上级菜单'
      },
      {
        prop: 'uri',
        itemType: 'input',
        label: '链接地址:',
        placeholder: '请输入链接地址',
        rules: [commonBlurReg]
      },
      // {
      //   prop: 'permitTag',
      //   itemType: 'input',
      //   label: '授权标识:',
      //   placeholder: '请输入授权标志',
      //   rules: [commonBlurReg]
      // },
      permitTagContent,
      {
        itemType: 'view',
        text: '(设置Php微服务的控制器和方法)',
        style: {
          'margin-left': '12px',
          'font-size': '14px',
          'color': '#aaa'
        }
      },
      {
        itemType: 'switch',
        prop: 'controlStatus',
        change: switchChange,
        label: '控制器配置:',
        activeValue: 1,
        inactiveValue: 2
      }
    ]
    // pop按钮打开配置器内容
    const btnSelectContent = [
      ...btnContent,
      {
        prop: 'controller',
        itemType: 'input',
        label: '控制器:',
        placeholder: '请输入控制器名称',
        rules: [commonBlurReg]
      },
      {
        prop: 'method',
        itemType: 'input',
        label: '方法名:',
        rules: [commonBlurReg],
        placeholder: '请输入方法名称'
      },
      {
        prop: 'buttonType',
        itemType: 'select',
        label: '类型:',
        rules: [commonChangeReg],
        dataSource: []
      }
    ]
    // 表格表头的配置信息/以下五个都是table的配置信息
    const columns = [
      {
        prop: 'name',
        label: '名称',
        minWidth: '200px',
        align: 'left',
        showOverflowTooltip: true
      },
      {
        prop: 'enName',
        label: '英文名',
        minWidth: '120px',
        showOverflowTooltip: true
      },
      {
        prop: 'icon',
        label: '图标',
        minWidth: '60',
        showOverflowTooltip: true
      },
      {
        prop: 'type',
        label: '类型',
        minWidth: '70',
        formater: scope => {
          if (scope.row[scope.column.property] === 'N') {
            return '<span class="bnt-menu-type" style="color: #E6A23D;background: #FDF6ED;border: 1px solid #FFE7C5;">导航</span>'
          } else if (scope.row[scope.column.property] === 'M') {
            return '<span class="bnt-menu-type" style="color: #00BCC5;background: #EBF7F8;border: 1px solid #88E0E5;">菜单</span>'
          } else if (scope.row[scope.column.property] === 'B') {
            return '<span class="bnt-menu-type" style="color: #368FFF;background: #E3EFFF;border: 1px solid rgba(99,166,251,0.5);">按钮</span>'
          }
        }
      },
      // {
      //   prop: 'controller',
      //   label: '控制器',
      //   minWidth: '70',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'method',
      //   label: '方法名',
      //   minWidth: '70',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'buttonType',
      //   label: '按钮类型',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // },
      {
        prop: 'sort',
        label: '序号',
        minWidth: '60'
      },
      {
        prop: 'appSystemName',
        label: '所属系统',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'uri',
        label: '链接地址',
        minWidth: '200px',
        showOverflowTooltip: true
      },
      {
        prop: 'permitTag',
        label: '授权标识',
        minWidth: '200px',
        showOverflowTooltip: true
        // width: '200'
      }
    ]
    // 当从微服务系统管理点击过来表格内容会换 这是复制的一个版本 用来返回数据的
    const cpColumns = [
      ...columns
    ]
    // 表头操作栏里dataSource的配置信息
    let dataList = [
      {
        label: '修改',
        permitTag: ['userCenter:sysPermit:modify'],
        isShow: modifyIsShow,
        handle: async params => {
          // console.log('修改', params)
          this.type = 'edit'
          this.$set(this.content[2], 'disabled', true)
          this.$set(this.content[1], 'disabled', this.isDisabled())
          // console.log('树形结构', this.btnContent[5].treeOptions.data)
          const parentId = []
          parentId[0] = params.row.parentId
          // console.log('parentId', parentId)
          let content = ''
          if (params.row.type === 'N') {
            content = navContent
          } else if (params.row.type === 'M') {
            content = menuContent
          } else if (params.row.type === 'B') {
            if (params.row.controlStatus === 1) {
              content = btnSelectContent
            } else {
              content = btnContent
            }
          }
          this.PopDialogHandle('修改导航菜单')
          this.$set(this.popOptions, 'content', content)
          await this.getSysPermitInfo({ permitId: params.row.permitId })
          this.allPermissionList({ appSystemId: params.row.appSystemId })
        }
      }
    ]
    dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '60',
      dataSource: dataList
    }
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 15,
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.permissionList({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.permissionList({ pageNum: 1, pageSize: val })
      }
    }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'appSystemIds',
        itemType: 'select',
        itemStyle: { width: '300px' },
        label: '所属系统:',
        multiple: true,
        collapseTags: true,
        filterable: true,
        dataSource: []
      },
      {
        itemType: 'operate',
        submitHandle: params => {
          console.log('查询', params)
          const appSystemIds = params.appSystemIds && params.appSystemIds.length === 0 ? null : params.appSystemIds
          this.searchFormDatas = { ...params, appSystemIds }
          this.permissionList({ ...params, appSystemIds })
        },
        submitText: '查询',
        resetHidden: false,
        resetHandle: () => {
          this.systemId || this.$set(this.formDatas, 'appSystemIds', [])
          this.searchFormDatas = {}
        }
      }
    ]
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改导航菜单',
      okText: '保存',
      ok: params => {
        // console.log('弹出框', params)
        const parentId = params.parentId[0]
        // console.log('zzz', this.getParentType(this.parentLists, parentId), this.parentLists, parentId)
        const itemObject = this.$utils.getArrayFromKey(this.parentLists, params.parentId, { key: 'permitId', children: 'child' })
        // console.log('parentType', itemObject)
        const parentType = itemObject[0].type ? itemObject[0].type : -1
        const pamrasObj = {
          N: ['permitId', 'type', 'appSystemId', 'name', 'enName', 'icon', 'parentId', 'sort'],
          M: ['permitId', 'type', 'appSystemId', 'name', 'enName', 'icon', 'parentId', 'sort', 'uri', 'permitTag'],
          B: ['permitId', 'type', 'appSystemId', 'name', 'enName', 'parentId', 'uri', 'permitTag', 'controller', 'controlStatus', 'method', 'buttonType']
        }
        const data = {}
        pamrasObj[params.type].forEach(v => {
          data[v] = params[v]
        })
        // console.log(data)
        this.newOrEditMenu({ ...data, parentId, parentType })
      },
      cancel: params => {
        this.PopDialogHandle()
        // console.log(params)
      },
      formDatas: {
        parentId: [-1]
        // type: 'N'
      },
      formOptions: {
        // labelWidth: '100px'
      }
    }
    return {
      formOtions: {
        size: 'small',
        // layout: true,
        inline: true
      },
      searchData,
      columns,
      cpColumns,
      popOperates,
      pagination,
      popOptions,
      content,
      navContent,
      menuContent,
      btnContent,
      btnSelectContent,
      formDatas: {
        appSystemIds: []
      },
      type: 'add',
      systemId: null,
      systemName: null,
      parentLists: [],
      searchFormDatas: {},
      orginDatas: [],
      menuParentId: [],
      appSystemIds: this.$store.state.user.userInfo.appSystemIds.length !== 0 ? this.$store.state.user.userInfo.appSystemIds : null,
      // switch: false
      rowInfoMessages: {}
    }
  },
  computed: {
    dataSource: {
      get() {
        return this.$store.state.user.menuData
      },
      set(data) {
        this.$store.commit('user/SET_MENUData', data)
      }
    }
  },
  watch: {
    // 监听路由变化
    $route: {
      handler(v) {
        if (v.name !== this.$options.name) return
        if (v.query.id) {
          this.$set(this.formDatas, 'appSystemIds', [v.query.id * 1])
          this.columns = this.cpColumns.filter(item => item.prop !== 'appSystemName')
          this.$set(this.searchData[0], 'disabled', true)
          this.systemId = v.query.id
        } else {
          // this.$set(this.formDatas, 'appSystemIds', [])
          console.log(this.formDatas)
          this.$nextTick(() => {
            this.formDatas = { appSystemIds: [] }
          })
          this.columns = this.cpColumns
          this.$set(this.searchData[0], 'disabled', false)
          this.systemId = null
        }
        this.$set(this.content[1], 'disabled', this.isDisabled())
        this.permissionList()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getButtonType()
    this.getSystemList()
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
    // 新增菜单按钮
    addMenu() {
      this.type = 'add'
      this.$set(this.popOptions, 'content', this.navContent)
      this.PopDialogHandle('添加导航菜单')
      this.$set(this.navContent[2], 'disabled', false)
      this.$set(this.btnContent[2], 'disabled', false)
      // console.log(this.isDisabled())
      this.$set(this.content[1], 'disabled', this.isDisabled())
      if (this.systemId) {
        this.allPermissionList({ appSystemId: this.systemId })
      } else {
        this.$set(this.navContent[6].treeOptions, 'data', [])
        this.$set(this.btnContent[5].treeOptions, 'data', [])
      }
      this.$set(this.popOptions, 'formDatas', {
        type: 'N',
        controlStatus: 2,
        appSystemId: this.systemId ? this.systemId * 1 : undefined,
        uri: null,
        permitTag: null,
        controller: null,
        method: null,
        buttonType: null,
        parentId: []
      })
      // console.log('132', this.popOptions.formDatas)
    },
    // 按钮控制器下面类型select
    getButtonType() {
      this.$set(this.btnSelectContent[this.btnContent.length + 2], 'dataSource', config)
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
      this.$set(this.searchData[0], 'dataSource', list)
      this.$set(this.btnContent[1], 'dataSource', list)
      this.$set(this.navContent[1], 'dataSource', list)
      const tempData = this.searchData[0].dataSource.find(item => item.value * 1 === this.systemId * 1)
      this.systemName = tempData && tempData.label
    },
    // 分页查询权限列表
    @_debounce(50)
    async permissionList(data = {}) {
      // const appSystemIds = this.systemId ? [this.systemId] : this.searchFormDatas.appSystemIds
      // let appSystemIds = null
      if (this.systemId && this.appSystemIds && !this.appSystemIds.includes(this.systemId)) {
        this.$message.error('您无权限查看此系统下的菜单')
        this.$router.push('/user-center/menu-management')
      }
      const appSystemIds = this.systemId ? [this.systemId] : this.searchFormDatas.appSystemIds || this.appSystemIds
      console.log('appSystemIds', appSystemIds)
      this.$store.commit('user/SET_MUNUPARAMSAPPSYSTEMIDS', appSystemIds || [])
      console.log(appSystemIds, this.searchFormDatas.appSystemIds)
      // const permitAppSystemIds = this.appSystemIds
      const res = await sysPermitPage({ ...this.searchFormDatas, ...data, appSystemIds })
      // console.log('权限列表', res)
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
    // 查询权限列表
    async allPermissionList(data = {}) {
      const res = await sysPermitList(data)
      // console.log('全部权限列表', res)
      const dataList = res.data.list || []
      const newDataList = [{ permitId: -1, name: '一级导航' }, ...dataList]
      this.parentLists = newDataList
      if (/⼤布⾏/.test(dataList[0].appSystemName)) {
        this.$set(this.btnContent[5].treeOptions, 'defaultExpandedKeys', [dataList[0].permitId])
        this.$set(this.btnContent[5].treeOptions, 'defaultExpandAll', false)
        this.$set(this.navContent[6].treeOptions, 'defaultExpandedKeys', [dataList[0].permitId])
        this.$set(this.navContent[6].treeOptions, 'defaultExpandAll', false)
      } else {
        this.$set(this.btnContent[5].treeOptions, 'defaultExpandAll', true)
        this.$set(this.navContent[6].treeOptions, 'defaultExpandAll', true)
      }
      this.$set(this.navContent[6].treeOptions, 'data', newDataList)
      this.$set(this.btnContent[5].treeOptions, 'data', newDataList)
      console.log(this.menuParentId)
      this.setFormDatas({ parentId: this.menuParentId })
    },
    // 弹出框确认按钮功能
    newOrEditMenu(data) {
      if (this.type === 'add') {
        this.newMenu(data)
      } else if (this.type === 'edit') {
        this.editMenu(data)
      }
    },
    // 新增菜单
    async newMenu(data = {}) {
      const res = await sysPermitAdd(data)
      if (res.code !== 200) {
        return false
      }
      // this.PopDialogHandle()
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('添加成功')
      this.getSystemList()
      this.permissionList()
    },
    // 编辑菜单
    async editMenu(data = {}) {
      const res = await sysPermitModify(data)
      if (res.code !== 200) {
        return false
      }
      delete data.parentType
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'permitId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysPermit/modify'), data, JSON.stringify({ beforeText: `在'用户中心-菜单管理'将${JSON.stringify({ 'permitId': data.permitId })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('修改成功,左侧导航请刷新页面后生效')
      this.getSystemList()
      this.permissionList()
    },
    // 删除菜单
    async deleteMenu(id) {
      const res = await sysPermitDelete({ permitId: id })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getSystemList()
      this.permissionList()
    },
    // 搜索表单select框禁用
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
    // 获取权限(菜单)详情
    async getSysPermitInfo(data = {}) {
      const res = await sysPermitInfo(data)
      // console.log(res)
      if (res.code !== 200) {
        return false
      }
      this.rowInfoMessages = res.data
      const parentId = []
      parentId[0] = res.data.parentId
      this.menuParentId[0] = res.data.parentId
      this.setFormDatas({ ...res.data, parentId })
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
      // console.log(oldObj, newObj)
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
.menu {
  padding: 20px;
  // padding-bottom: 0;
  // padding-top: 0;
  .systemName {
    font-size: 16px;
    color: #0094ff;
    margin-bottom: 1px;
    .system-text{
      font-size: 16px;
      color: #474747;
    }
  }

  .line {
    width: 100%;
    height: 1px;
    background-color: #ccc;
  }

  .button {
    display: flex;
    align-items: center;
    padding-bottom: 15px;
    margin: 0;
  }

  .noData {
    padding-top: 120px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    color: #ccc;
  }

}

</style>
<style lang="scss">
  .bnt-menu-type{
    display: inline-block;
    width: 46px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 5px;
    font-size: 12px;
  }
  .menu {
    .page-table {
      tr:nth-child(even) {
        background-color: #fff;
      }
      tbody .el-table__row td {
        border-bottom: 1px solid #EEEFF0;
      }

      thead {
        .is-right {
          padding-right: 10px;
        }
      }
    }
  }
</style>
