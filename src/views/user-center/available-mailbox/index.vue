<template>
  <div class="paymentPage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button
        v-permission="['userCenter:mailBoxManager:add']"
        type="primary"
        size="small"
        @click="addList"
      >新增</el-button>
    </div>
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
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { _debounce } from '@/utils/index.js'
import { rolePageList, mailDelete, eailDetail, eailAdd, eailModify } from './api/index.js'

export default {
  name: 'AvailableMailbox',
  components: {},
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 邮箱后缀验证正则
    const checkValNum = (rule, value, callback) => {
      const reg = /^@+[a-zA-Z0-9-_]+\.[a-zA-Z]{2,4}$/
      if (value && !reg.test(value)) {
        return callback(new Error('必须以@开头，仅支持英文、数字、_ 、@、- ,如：@xxx.com'))
      } else if (!value) {
        return callback(new Error('必填项不能为空'))
      } else {
        callback()
      }
    }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'mailBoxSuffix',
        itemType: 'input',
        label: '邮箱后缀:',
        placeholder: '输入邮箱后缀',
        clearable: true
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.formDatas = { ...params }
          this.getPageList({ ...params })
        },
        resetHandle: (params) => {
          this.formDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '编号',
        width: '100'
      },
      {
        prop: 'mailBoxSuffix',
        label: '邮箱后缀',
        width: '280',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      },
      {
        prop: 'createdBy',
        label: '创建人',
        showOverflowTooltip: true
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        itemType: 'input',
        prop: 'id',
        label: '编号:',
        disabled: true,
        placeholder: '系统生成'
      },
      {
        itemType: 'input',
        prop: 'mailBoxSuffix',
        label: '邮箱后缀:',
        maxlength: 20,
        clearable: true,
        rules: [commonBlurReg, { validator: checkValNum, trigger: 'blur' }],
        placeholder: '请输入(最多20个字符)'
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'remark',
        label: '备注:',
        maxlength: 100,
        placeholder: '请输入备注（最多100个字符）'
      }

    ]
    const copyContent = [
      ...commonContent
    ]
    let popOperatesDataSource = [
      // {
      //   label: '编辑',
      //   permitTag: ['price:testStandard:modify'],
      //   isShow: true,
      //   handle: scope => {
      //     this.type = 'edit'
      //     this.editList({ id: scope.row.id })
      //     this.PopDialogHandle('编辑按钮类型')
      //   }
      // },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        permitTag: ['userCenter:mailBoxManager:delete'],
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.deleteData(scope.row.id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getPageList({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.getPageList({ page: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增按钮类型',
      okText: '保存',
      ok: params => {
        this.addOrEdit(params)
      },
      cancel: (params) => {
        this.$set(this.popOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {},
      content: copyContent
    }
    return {
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        mailBoxSuffix: ''
      },
      searchData,
      columns,
      copyContent,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add',
      visible: false,
      rowInfoMessages: {}
    }
  },
  created() {
    this.getPageList()
  },
  activated() {
    this.getPageList()
  },
  mounted() { },
  methods: {
    addList() {
      this.type = 'add'
      this.PopDialogHandle('新增按钮类型')
      this.$set(this.popOptions, 'formDatas', {})
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增或修改弹出框点击确认按钮的接口事件
    addOrEdit(params = {}) {
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            // 新增
            await eailAdd(params)
            this.fetchLog(this.getLogMessages('INSERT', '/userCenter/mailBoxManager/add'), params, JSON.stringify({ beforeText: `在'用户中心-可用邮箱'新增一条记录`, beforeCode: params }))
          } else if (this.type === 'edit') {
            // 修改
            const obj = {}
            const pamraskey = ['id', 'mailBoxSuffix', 'remark']
            pamraskey.forEach(v => {
              obj[v] = params[v]
            })
            await eailModify(obj)
            const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, obj, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/mailBoxManager/modify'), obj, JSON.stringify({ beforeText: `在'用户中心-可用邮箱'将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          }
          this.$set(this.popOptions, 'formDatas', {})
          this.$set(this.popOptions, 'visible', false)
          this.$message.success('保存成功')
          this.getPageList({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
        }
      })
    },
    // 列表查询
    @_debounce(50)
    async getPageList(data = {}) {
      const res = await rolePageList({ ...this.formDatas, ...data })
      res.data.list && res.data.list.map((item, index) => { item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        page: res.data.pageNum
      }
    },

    // 点击编辑获取详情
    async editList(data = {}, code) {
      const res = await eailDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      const editData = res.data || {}
      this.rowInfoMessages = editData
      this.$set(this.popOptions, 'formDatas', editData)
    },
    // 删除
    async deleteData(id) {
      const res = await mailDelete({ id })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功!')
      this.getPageList({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/userCenter/mailBoxManager/delete'), { id }, JSON.stringify({ beforeText: `在'用户中心-可用邮箱'删除一条记录`, beforeCode: { id }}))
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
<style lang='scss' scoped>
.paymentPage {
  padding: 20px;
  padding-bottom: 0px;
}
</style>
<style lang="scss">
.paymentPage {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>
