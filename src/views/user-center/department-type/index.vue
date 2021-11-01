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
        v-permission="['userCenter:sysOrgType:add']"
        type="primary"
        size="small"
        @click="addList"
      >新增类型</el-button>
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
import { sysOrgTypeList, sysOrgTypeAdd, sysOrgTypeDelete } from './api/index.js'
import { _debounce } from '@/utils'

export default {
  name: 'DepartmentType',
  components: {},
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 部门中文验证正则
    const checkValZn = this.$getRules({ type: 'zh', trigger: ['blur'] })
    // 部门英文验证正则
    const checkValEn = (rule, value, callback) => {
      const reg = /^([A-Za-z]+\s?)*[A-Za-z]$/
      if (value && !reg.test(value)) {
        return callback(new Error('只能输入英文'))
      } else if (!value) {
        return callback(new Error('必填项不能为空'))
      } else {
        callback()
      }
    }
    // 部门英文简称验证正则
    const checkValEnSimple = {
      pattern: /^[A-Z]{2,3}$/,
      message: '只能输入2-3位大写英文',
      trigger: 'blur'
    }
    // 查询/重置表单配置信息
    const searchData = {
      _typeName: {
        prop: 'typeName',
        itemType: 'input',
        label: '类型名称',
        placeholder: '中文名/英文名',
        clearable: true
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.formDatas = { ...params }
          this.getPageList({ ...params })
        },
        restHandle: params => {
          this.formDatas = {}
        }
      }
    }
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '编号',
        width: '100'
      },
      {
        prop: 'typeName',
        label: '类型名称(中)',
        showOverflowTooltip: true
      },
      {
        prop: 'typeNameEn',
        label: '类型名称(英)',
        showOverflowTooltip: true
      },
      {
        prop: 'abbr',
        label: '英文简称',
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
        prop: 'typeName',
        label: '类型名称(中)',
        maxlength: 5,
        clearable: true,
        rules: [commonBlurReg, checkValZn],
        placeholder: '请输入(最多5个字符)'
      },
      {
        itemType: 'input',
        prop: 'typeNameEn',
        label: '类型名称(英)',
        maxlength: 20,
        clearable: true,
        rules: [commonBlurReg, { validator: checkValEn, trigger: 'blur' }],
        placeholder: '请输入(最多20个字符)'
      },
      {
        itemType: 'input',
        prop: 'abbr',
        label: '英文简称',
        maxlength: 3,
        clearable: true,
        rules: [commonBlurReg, checkValEnSimple],
        placeholder: '请输入(最少2个,最多3个大写英文字符)'
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
      //   permitTag: ['price:sysOrgType:modify'],
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
        permitTag: ['userCenter:sysOrgType:delete'],
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
      }
    ]
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
        this.getPageList({ page: 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增部门类型',
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
        typeName: ''
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
      this.PopDialogHandle('新增部门类型')
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
            await sysOrgTypeAdd(params)
            this.fetchLog(this.getLogMessages('INSERT', '/userCenter/sysOrgType/add'), params, JSON.stringify({ beforeText: `在'用户中心-部门类型'新增一条记录`, beforeCode: params }))
          }
          // else if (this.type === 'edit') {
          //   // 修改
          //   const obj = {}
          //   const pamraskey = ['id', 'mailBoxSuffix', 'remark']
          //   pamraskey.forEach(v => {
          //     obj[v] = params[v]
          //   })
          //   await eailModify(obj)
          //   const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, obj, 'id')
          //   const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
          //   flag && this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/mailBoxManager/modify'), obj, JSON.stringify({ beforeText: `在'用户中心-可用邮箱'将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          // }
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
      const res = await sysOrgTypeList({ ...this.formDatas, ...data })
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
    // async editList(data = {}, code) {
    //   const res = await eailDetail(data)
    //   if (!res || res.code !== 200) {
    //     return false
    //   }
    //   const editData = res.data || {}
    //   this.rowInfoMessages = editData
    //   this.$set(this.popOptions, 'formDatas', editData)
    // },
    // 删除
    async deleteData(id) {
      const res = await sysOrgTypeDelete({ id })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功!')
      this.getPageList({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/userCenter/sysOrgType/delete'), { id }, JSON.stringify({ beforeText: `在'用户中心-部门类型'删除一条记录`, beforeCode: { id }}))
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
