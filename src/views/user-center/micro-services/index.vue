<template>
  <div class="microServices">
    <!-- 新增微服务/系统按钮 -->
    <!-- <div class="button">
      <el-button v-permission="['userCenter:sysAppSystem:add']" size="small" type="primary" @click="addMicroServices">新增业务系统</el-button>
    </div> -->
    <!-- table表格 -->
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
    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popOptions" :options="popOptions" />
    </div>
  </div>
</template>

<script>

import handle from '@/components/handleGroup/handle.vue'
import { sysAppSystem, addSysAppSystem, modifySysAppSystem, deleteSysAppSystem, sysAppSystemInfo } from './api/index'
export default {
  name: 'MicroServices',
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = [
      {
        prop: 'appSysId',
        label: '系统ID',
        width: '70'
      },
      {
        prop: 'appSysName',
        label: '业务系统名称',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'enName',
        label: '英文名称',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'description',
        label: '描述',
        minWidth: '150',
        showOverflowTooltip: true

      },
      {
        prop: 'serverSelectionList',
        label: '服务端',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const tempObj = {
            PC: 'PC端',
            MINI: '移动端'
          }
          return scope.row[scope.column.property] ? scope.row[scope.column.property].map(item => tempObj[item]).join(' / ') : ''
        }
      },
      // {
      //   prop: 'uri',
      //   label: '系统路径',
      //   minWidth: '200',
      //   showOverflowTooltip: true
      // },
      {
        prop: 'type',
        label: '系统类型',
        width: '80',
        formater: scope => {
          return scope.row[scope.column.property] === 1 ? '内部系统' : scope.row[scope.column.property] === 2 ? '外部系统' : ''
        }
      }
    ]
    // 表格操作栏更多悬停上的配置信息
    let moreHandle = [
      {
        moreHandleTag: '菜单管理',
        permitTag: ['userCenter:sysAppSystem:permitManage'],
        method: scope => {
          this.$router.push({ path: '/user-center/menu-management', query: { id: scope.row.appSysId }})
        }
      },
      {
        moreHandleTag: '角色管理',
        permitTag: ['userCenter:sysAppSystem:roleManage'],
        method: scope => {
          this.$router.push({ path: '/user-center/role-management', query: { id: scope.row.appSysId }})
        }
      }
    ]
    // 权限控制
    moreHandle = this.$filterPermission(moreHandle)
    // 表格操作栏的配置信息
    let handleConf = [
      {
        handleTag: '修改',
        permitTag: ['userCenter:sysAppSystem:modify'],
        method: scope => {
          this.PopDialogHandle('修改微服务/系统')
          this.type = 'edit'
          this.$set(this.popOptions, 'okHidden', false)
          this.$set(this.popOptions, 'cancelText', '取消')
          this.getSysAppSystemInfo({ appSysId: scope.row.appSysId }, false)
        }
      },
      {
        handleTag: '查看',
        permitTag: ['userCenter:sysAppSystem:modify'],
        method: scope => {
          this.PopDialogHandle('查看微服务/系统')
          // this.type = 'edit'
          this.$set(this.popOptions, 'okHidden', true)
          this.$set(this.popOptions, 'cancelText', '关闭')
          this.getSysAppSystemInfo({ appSysId: scope.row.appSysId }, true)
        }
      }
    ]
    handleConf = this.$filterPermission(handleConf)
    // 表格操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '210',
      components: {
        handle
      },
      componentsOptions: {
        handle: handleConf,
        moreHandle,
        noJump: true
      }
    }
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('current', val)
        this.getMicroServices({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.getMicroServices({ pageNum: 1, pageSize: val })
      }
    }
    // 基础弹出框内容
    const baseContent = [
      {
        prop: 'appSysName',
        itemType: 'input',
        label: '名称:',
        rules: [commonBlurReg, { max: 20, message: '长度在 20 个字符以内', trigger: ['blur'] }],
        placeholder: '请输入名称'
      },
      {
        itemType: 'input',
        prop: 'enName',
        label: '英文名称:',
        rules: [commonBlurReg, { max: 20, message: '长度在 20 个字符以内', trigger: ['blur'] }],
        placeholder: '请输入英文名称'
      },
      {
        itemType: 'input',
        type: 'textarea',
        // autosize: { minRows: 2, maxRows: 2 },
        prop: 'description',
        label: '描述:',
        maxlength: 30,
        placeholder: '请输入描述内容'
      },
      {
        prop: 'type',
        itemType: 'select',
        label: '系统类型:',
        placeholder: '请选择系统类型',
        dataSource: [
          {
            label: '内部系统',
            value: 1
          },
          {
            label: '外部系统',
            value: 2
          }
        ]
      },
      {
        prop: 'serverSelectionList',
        itemType: 'select',
        label: '服务端选择:',
        multiple: true,
        placeholder: '请选择系统类型',
        rules: [commonChangeReg],
        dataSource: [
          {
            label: 'PC端',
            value: 'PC'
          },
          {
            label: '移动端',
            value: 'MINI'
          }
        ],
        change: value => {
          console.log(value)
          this.changeServePopContent(value, false)
        }
      }
    ]
    // 基础弹出框PC内容
    const basePCContent = [
      {
        prop: 'uri',
        itemType: 'input',
        label: '系统路径(PC):',
        placeholder: '系统路径(PC)由系统设置',
        disabled: true
      }
    ]
    // 基础弹出框weChat内容
    const baseWeChatContent = [
      {
        prop: 'weChatUri',
        itemType: 'input',
        label: '系统路径(微信):',
        placeholder: '系统路径(微信)由系统设置',
        disabled: true
      },
      {
        prop: 'isBindWeChat',
        itemType: 'select',
        label: '是否绑定微信:',
        // placeholder: '请选择系统类型',
        dataSource: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]
      }
    ]
    // PC弹出框内容
    const PCContent = [
      ...baseContent,
      ...basePCContent
    ]
    // weChat弹出框内容
    const weChatContent = [
      ...baseContent,
      ...baseWeChatContent
    ]
    // PC和weChat多选弹出框内容
    const PCAndWechatContent = [
      ...baseContent,
      ...basePCContent,
      ...baseWeChatContent
    ]
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      customClass: 'popOptionsClass',
      ok: params => {
        // console.log(params)
        this.appSystem(params)
      },
      okText: '保存',
      cancel: params => {
        this.PopDialogHandle()
        // console.log(params)
      },
      formDatas: {},
      formOptions: {
        // labelWidth: 'auto'
      },
      content: baseContent
    }
    return {
      columns,
      // dataSource: [],
      popOperates,
      pagination,
      popOptions,
      baseContent,
      PCContent,
      weChatContent,
      PCAndWechatContent,
      type: 'add',
      rowInfoMessages: {}
    }
  },
  computed: {
    baseUrl() {
      // console.log(this.$store.state.user.userInfo)
      return this.$store.state.app.baseUrl
    },
    dataSource: {
      get() {
        return this.$store.state.user.microData
      },
      set(data) {
        this.$store.commit('user/SET_MICROData', data)
      }
    }
  },
  created() {
    this.$permission(['userCenter:sysAppSystem:list']) ? this.getMicroServices() : this.$router.replace('/403')
    // console.log(this.$store.state.user.userInfo)
  },
  methods: {
    // 新增微服务/系统点击事件
    addMicroServices() {
      this.PopDialogHandle('新增微服务/系统')
      this.setFormDatas({})
      // console.log('111', this.popOptions.formDatas)
      this.type = 'add'
    },
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
    // 获取微服务列表
    async getMicroServices(data = {}) {
      // console.log('data', data)
      // const appSystemIds = this.$store.state.user.userInfo.appSystemIds.length !== 0 ? this.$store.state.user.userInfo.appSystemIds : null
      const res = await sysAppSystem(data)
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
    // 新增和修改按钮功能
    appSystem(params) {
      if (this.type === 'add') {
        this.addAppSystem(params)
      } else {
        this.modifyAppSystem(params)
      }
    },
    // 新增微服务功能
    async addAppSystem(params) {
      const res = await addSysAppSystem(params)
      // console.log(params)
      // console.log('新增微服务', res)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('INSERT', '/userCenter/sysAppSystem/add'), params, JSON.stringify({ beforeText: `在'用户中心-业务管理系统中'新增一条记录`, beforeCode: params }))
      // this.PopDialogHandle()
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('添加成功')
      this.getMicroServices()
    },
    // 修改微服务功能
    async modifyAppSystem(params) {
      const res = await modifySysAppSystem(params)
      // console.log('修改微服务', res)
      if (res.code !== 200) {
        return false
      }
      // this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysAppSystem/modify'), params, JSON.stringify({ beforeText: `在'用户中心-业务管理系统中'将${JSON.stringify({ 'appSysId': params.appSysId })}`, afterText: '修改为', beforeCode: this.rowInfoMessages, afterCode: params }))
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, params, 'appSysId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysAppSystem/modify'), params, JSON.stringify({ beforeText: `在'用户中心-业务管理系统中'将${JSON.stringify({ 'appSysId': params.appSysId })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('修改成功')
      this.getMicroServices()
    },
    // 删除微服务/系统
    async deleteAppSystem(id) {
      const res = await deleteSysAppSystem({ appSysId: id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('DEL', '/userCenter/sysAppSystem/delete'), { appSysId: id }, JSON.stringify({ beforeText: `在'用户中心-业务管理系统中'删除一条记录`, beforeCode: { appSysId: id }}))
      this.$message.success('删除成功')
      this.getMicroServices()
    },
    // 根据id查询name
    getPermit(data, list, arr = []) {
      data.forEach(item => {
        if (list.includes(item.permitId)) {
          arr.push(
            {
              permitId: item.permitId,
              name: item.name
            }
          )
        }
        if (item.child && item.child.length) {
          this.getPermit(item.child, list, arr)
        }
      })
      return arr
    },
    // 获取微服务详情
    async getSysAppSystemInfo(data = {}, flag) {
      const res = await sysAppSystemInfo(data)
      // console.log(res)
      if (res.code !== 200) {
        return false
      }
      this.changeServePopContent(res.data.serverSelectionList, flag)
      this.rowInfoMessages = res.data
      this.setFormDatas({ ...res.data })
      setTimeout(() => {
        this.$refs.popOptions.$children[0].form.clearValidate('serverSelectionList')
      }, 0)
      // console.log(this.$refs.popOptions.$children[0].form)
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
    },

    // 根据服务端选择长度切换弹出框内容
    changeServePopContent(value, flag) {
      const length = value ? value.length : 0
      let content = []
      switch (length) {
        case 0:
          content = this.baseContent
          break
        case 1:
          if (value[0] === 'PC') {
            content = this.PCContent
          } else {
            content = this.weChatContent
          }
          break
        case 2:
          content = this.PCAndWechatContent
          break

        default:
          break
      }
      this.popContentReadonly(content, flag)
      this.$set(this.popOptions, 'content', content)
    },

    // 给弹出框所有的内容添加readonly: true
    popContentReadonly(content, flag) {
      // content.filter(item => item.itemType === 'select').forEach(item => { item.disabled = flag })
      content.forEach((item, index) => {
        item.readonly = flag
        if (item.itemType === 'select') {
          this.$set(content[index], 'disabled', flag)
          // item.disabled = flag
        }
      })
      // debugger
    }
  }
}
</script>

<style lang="scss" scoped>
.microServices {
  padding: 20px;
  // padding-bottom: 0;

}
</style>
<style lang="scss">
.popOptionsClass {
  .el-textarea__inner{ //el_input中的隐藏属性
resize: none;  //主要是这个样式
  }
}
</style>
