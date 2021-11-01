<template>
  <div class="demoDiv">
    <!-- 新增按钮 -->
    <div class="button">
      <el-button v-permission="['userCenter:sysAppSystem:add']" size="small" type="primary" @click="addHandle">新增操作</el-button>
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { list, add, edit, del, detail } from './api/index'
export default {
  props: {},
  data() {
    // {forEachColumns columns} back
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = [
      {
        prop: 'appSysId',
        label: '系统ID'
      },
      {
        prop: 'appSysName',
        label: '业务系统名称'
      },
      {
        prop: 'enName',
        label: '英文名称'
      },
      {
        prop: 'description',
        label: '描述'
      },
      {
        prop: 'serverSelectionList',
        label: '服务端'
      },
      {
        prop: 'type',
        label: '系统类型'
      }
    ]
    // 正则验证
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })

    // 列表操作栏按钮
    const popOperates = {
      label: '操作',
      width: '200',
      moreOptions: {
        maxLength: 2// 最大超过多少个显示more功能，默认为2
      },
      dataSource: [
        {
          label: '修改',
          isShow: (params) => {
            return true
          },
          handle: params => {
            this.editHandle(params)
          }
        },
        {
          label: '删除',
          isShow: true,
          handle: params => {
            this.delHandle(params)
          }
        },
        {
          label: '其他操作',
          isShow: false,
          handle: params => {
            console.log(params)
          }
        }
      ]
    }

    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      customClass: 'popOptionsClass',
      ok: params => {
        // console.log(params)
        this.edit(params)
      },
      okText: '保存',
      cancel: params => {
        this.PopDialogHandle()
        // console.log(params)
      },
      formDatas: {},
      formOptions: {
      },
      content: {
        '_appSysName': {
          prop: 'appSysName',
          itemType: 'input',
          label: '名称:',
          rules: [commonBlurReg, { max: 20, message: '长度在 20 个字符以内', trigger: ['blur'] }],
          placeholder: '请输入名称'
        },
        '_enName': {
          prop: 'enName',
          itemType: 'input',
          label: '英文名称:',
          rules: [commonBlurReg, { max: 20, message: '长度在 20 个字符以内', trigger: ['blur'] }],
          placeholder: '请输入英文名称'
        },
        '_description': {
          prop: 'description',
          itemType: 'input',
          label: '描述:',
          rules: [commonBlurReg, { max: 20, message: '长度在 20 个字符以内', trigger: ['blur'] }],
          placeholder: '请输入描述'
        },
        '_serverSelectionList': {
          prop: 'serverSelectionList',
          itemType: 'select',
          label: '服务端选择:',
          placeholder: '请输入服务端选择'
        },
        '_type': {
          prop: 'type',
          itemType: 'select',
          label: '系统类型:',
          placeholder: '请输入系统类型'
        }
      }
    }

    const pagination = {
      currentChange: val => {
        console.log('current', val)
        this.list({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.list({ pageNum: 1, pageSize: val })
      }
    }
    return {
      dataSource: [],
      columns,
      row: {},
      popOptions,
      popOperates,
      pagination,
      type: 'add'
    }
  },
  created() {
    this.list()
  },
  mounted() {},
  methods: {
    // 获取弹窗详情数据操作
    async detail(data = {}) {
      const res = await detail(data)
      // console.log(res)
      if (res.code !== 200) {
        return false
      }
      this.row = res.data
      this.setFormDatas({ ...res.data })
    },
    // 获取列表操作
    async list(data = {}) {
      const res = await list(data)
      const listData = res.data.list || []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },
    // 删除提交操作
    async del(id) {
      const res = await del({ 'appSysId': id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLog('DEL', '/userCenter/sysAppSystem/delete'), { 'appSysId': id }, JSON.stringify({ beforeText: `在'某系統-某頁面'删除一条记录`, beforeCode: { 'appSysId': id }}))
      this.$message.success('删除成功')
      this.list()
    },
    // 新增提交操作
    async add(params) {
      console.log(params)
      const res = await add(params)
      console.log('新增微服务', res)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLog('INSERT', '/userCenter/sysAppSystem/add'), params, JSON.stringify({ beforeText: `在'某系統-某頁面'新增一条记录`, beforeCode: params }))
      // this.PopDialogHandle()
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('添加成功')
      this.list()
    },
    // 修改提交操作
    async edit(params) {
      console.log(params)
      const res = await edit(params)
      console.log(res)
      if (res.code !== 200) {
        return false
      }
      const { beforeCode, afterCode } = this.compareData(this.row, params, 'appSysId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysAppSystem/modify'), params, JSON.stringify({ beforeText: `在'某系統-某頁面'將${JSON.stringify({ 'appSysId': params['appSysId'] })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('修改成功')
      this.list()
    },
    // 删除按钮事件
    delHandle(params) {
      console.log(params)
      this.$confirm(' 确认删除当前数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.del(params.row['appSysId'])
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑按钮事件
    editHandle(params) {
      console.log(params)
      this.PopDialogHandle('修改操作')
      this.type = 'edit'
      this.detail({ 'appSysId': params.row['appSysId'] })
    },
    // 新增按钮事件
    addHandle() {
      this.PopDialogHandle('新增操作')
      this.setFormDatas({})
      this.type = 'add'
    },
    // 设置表单数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 设置弹窗标题及显示隐藏
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 发送日志信息
    fetchLog(messages, data, description) {
      this.$store.dispatch('app/fetchLog', { ...messages, params: JSON.stringify(data), description })
    },
    // 获取日志信息
    getLog(opratorType, api) {
      const { userInfo, topic } = this.$store.state.user
      const baseURL = this.$store.state.app.baseURL
      const logcommonMessages = {
        type: 'OP', // 日誌類型
        appId: 'userCenter', // 系統id
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
    }
  }
}
</script>

<style lang="scss" scoped>
.demoDiv {
    padding: 20px;
}
.popOptionsClass {
    .el-textarea__inner{
        resize: none;
    }
}
</style>
