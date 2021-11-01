<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  仓库资料页面
 -->
<template>
  <div class="store-data">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 页签和按钮部分 -->
    <div class="store-button">
      <el-button
        v-permission="['wms:warehouse:add']"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="addList"
      >新增仓库</el-button>
    </div>

    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :table-scrollx="true"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { storePage, storeAdd, storeDetail, storeUpdate, storeDelete, supplierWarehouse, supplierName } from './api/index.js'
// import { filterOptions } from '@/views/wms/basis-data/area-data/api/common.js'
import { dataComparision } from '@/views/basic-data/common/index'
import { fetchLog } from '@/views/wms/public/fetchLog'
export default {
  name: 'StoreData',
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机号验证正则
    // const phoneReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // 英文验证
    // const enReg = this.$getRules({ type: 'en', trigger: ['blur'] })
    // 只能输入大小写字母
    const enTrim = (data) => {
      data = data.replace(/[^a-zA-Z]/g, '')
      return data
    }

    // 只能输入数字--手机号
    // const phoneData = (rule, value, callback) => {
    //   if (value.length !== 11) {
    //     callback(new Error('请输入正确的11位手机号码'))
    //   } else {
    //     callback()
    //   }
    // }
    const ruleTrim = (data) => {
      data = data.replace(/[^0-9]/g, '')
      data = data.toUpperCase()
      data = data.replace('_', '')
      return data
    }
    // 服务商的联动
    const changeSupplier = (value, form, formDatas, setFormDatas) => {
      setFormDatas({ supplier: null })
      this.setFormDatas({ name: '' })
      this.supplierNameList(value.value)
    }

    const changeName = (value, form, formDatas, setFormDatas) => {
      // setFormDatas({ type: null })
      // 找出对应的value值和label值
      console.log('服务商名称', value)
      // const test = this.supplierNameData.find(val => val.value === value)
      // 把供应商的名字给输入框
      this.setFormDatas({ name: value.label })
    }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'name',
        itemType: 'input',
        label: '仓库名称',
        clearable: true
      },
      // {
      //   prop: 'enable',
      //   itemType: 'select',
      //   label: '状态:',
      //   dataSource: [
      //     {
      //       label: '全部',
      //       value: ''
      //     },
      //     {
      //       label: '启用',
      //       value: '1'
      //     },
      //     {
      //       label: '禁用',
      //       value: '0'
      //     }
      //   ]
      // },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.getRulePage(params)
          this.searchFormDatas = params
        },
        resetHandle: (params) => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'name',
        label: '仓库名称',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'code',
        label: '仓库代码',
        minWidth: '110'
      },
      {
        prop: 'address',
        label: '仓库地址',
        minWidth: '110',
        showOverflowTooltip: true
      },
      {
        prop: 'warnSum',
        label: '库存预警值(件)',
        minWidth: '110'
      },
      {
        prop: 'chargeUserName',
        label: '仓库负责人',
        minWidth: '110'
      },
      {
        prop: 'chargeUserPhone',
        label: '联系电话',
        minWidth: '110'
      }
      // {
      //   prop: 'enable',
      //   label: '状态',
      //   minWidth: '80',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return scope.row[scope.column.property] === 1 ? '启用' : scope.row[scope.column.property] === 0 ? '禁用' : ''
      //   }
      // }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'type',
        itemType: 'select',
        label: '仓库类型',
        valueType: 'object',
        valueKey: 'value',
        change: changeSupplier,
        clearable: true,
        dataSource: [],
        rules: [commonBlurReg]
      },
      {
        prop: 'supplier',
        itemType: 'select',
        label: '供应商名称',
        filterable: true,
        valueType: 'object',
        valueKey: 'value',
        clearable: true,
        dataSource: [],
        change: changeName,
        rules: [commonBlurReg]
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '仓库名称',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg]
      },
      {
        prop: 'code',
        itemType: 'input',
        label: '仓库代码',
        trim: enTrim,
        clearable: true,
        maxlength: 30,
        rules: [commonBlurReg]
      },
      {
        itemType: 'select',
        prop: 'warehousePop',
        label: '仓库属性',
        clearable: true,
        rules: [commonBlurReg],
        dataSource: [
          {
            label: '成品仓',
            value: 1
          },
          {
            label: '虚拟仓',
            value: 2
          }
        ]
      },
      {
        itemType: 'input',
        prop: 'address',
        label: '仓库地址',
        clearable: true,
        maxlength: 50,
        rules: [commonBlurReg]
      },
      {
        itemType: 'input',
        prop: 'chargeUserName',
        label: '仓库负责人',
        clearable: true,
        maxlength: 10,
        rules: [commonBlurReg, { trigger: ['blur'] }]
      },
      {
        itemType: 'input',
        prop: 'chargeUserPhone',
        label: '联系电话',
        trim: ruleTrim,
        clearable: true,
        maxlength: 12,
        rules: [commonBlurReg, { message: '请输入手机号码', trigger: ['change'] }]
      },
      {
        itemType: 'input',
        prop: 'warnSum',
        label: '库存预警值',
        clearable: true,
        trim: ruleTrim,
        maxlength: 10,
        placeholder: '件/卷',
        rules: [commonBlurReg]
      }
      // {
      //   prop: 'enable',
      //   itemType: 'radio-group',
      //   type: 'radio',
      //   label: '状态',
      //   rules: [commonBlurReg],
      //   dataSource: [
      //     {
      //       label: '启用',
      //       value: 1
      //     },
      //     {
      //       label: '禁用',
      //       value: 0
      //     }
      //   ]
      // }
    ]
    const copyContent = [
      ...commonContent
    ]
    let popOperatesDataSource = [
      // {
      //   label: '禁用',
      //   // permitTag: ['basic:countries:update'],
      //   isShow: (scope) => {
      //     return scope.row.enable === 1
      //   },
      //   handle: scope => {
      //     console.log('打印启用', scope.row.id, scope.row.enable)
      //     this.$confirm('确认要禁用该条数据吗？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning',
      //     }).then(() => {
      //       const obj = {
      //         id: scope.row.id,
      //         enable: 0
      //       }
      //       this.changeEnable(obj)
      //     }).catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '已取消'
      //       })
      //     })
      //   }
      // },
      // {
      //   label: '启用',
      //   // permitTag: ['basic:countries:update'],
      //   isShow: (scope) => {
      //     return scope.row.enable === 0
      //   },
      //   handle: scope => {
      //     this.$confirm('确认要启用该条数据吗？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning',
      //     }).then(() => {
      //       const obj = {
      //         id: scope.row.id,
      //         enable: 1
      //       }
      //       this.changeEnable(obj)
      //     }).catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '已取消'
      //       })
      //     })
      //   }
      // },
      {
        label: '编辑',
        permitTag: ['wms:warehouse:modify'],
        isShow: true,
        handle: scope => {
          this.types = '' + scope.row.type
          this.suppliers = '' + scope.row.suppliers
          this.type = 'edit'
          this.PopDialogHandle('编辑仓库')
          if (this.type === 'edit') {
            this.$set(this.copyContent[0], 'disabled', true)
            this.$set(this.copyContent[1], 'disabled', true)
            this.$set(this.copyContent[2], 'disabled', true)
            this.$set(this.copyContent[3], 'disabled', true)
          } else {
            this.$set(this.copyContent[0], 'disabled', false)
            this.$set(this.copyContent[1], 'disabled', false)
            this.$set(this.copyContent[2], 'disabled', false)
            this.$set(this.copyContent[3], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', copyContent)
          this.editList({ id: scope.row.id }, scope.row.index)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['wms:warehouse:delete'],
        isShow: true,
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
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.pagination.pageSize = val
        this.pagination.currentPage = 1
        this.pagination.pageNum = 1
        this.getRulePage({ pageNum: this.pagination.pageNum, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增仓库',
      okText: '保存',
      ok: params => {
        this.addOrEdit(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: copyContent
    }
    return {
      types: '', // 弹框中的仓库类型
      supplier: '',
      formOtions: {
        // layout: true,
        size: 'small',
        inline: true
      },
      formDatas: {
        // enable: ''
      },
      searchData,
      columns,
      copyContent,
      dataSource: [],
      supplierNameData: [],
      supplierData: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add',
      visible: false,
      rowInfoMessages: {}, // 日志先后拿到的信息
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getRulePage()
    this.supplierOption()
    // this.supplierNameList()
  },
  mounted() {},
  methods: {
    addList() {
      this.type = 'add'
      this.PopDialogHandle('新增仓库')
      this.setFormDatas({ enable: 1 })
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.copyContent[0], 'disabled', false)
      this.$set(this.copyContent[1], 'disabled', false)
      this.$set(this.copyContent[2], 'disabled', false)
      this.$set(this.copyContent[3], 'disabled', false)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await storeAdd(data)
      if (res.code !== 200) {
        return false
      }
      // this.$store.dispatch('app/printingLog' /wms/warehouse/add
      this.fetchLog(this.getLogMessages('INSERT', '/wms/warehouse/add'), data, JSON.stringify({ beforeText: `在'仓储管理-基础数据-仓库资料,新增一条记录`, beforeCode: data }))
      this.$set(this.popOptions, 'visible', false)
      this.getRulePage()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增或修改弹出框点击确认按钮的接口事件
    addOrEdit(params) {
      // 走新增接口
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = ['type', 'supplier', 'name', 'code', 'warehousePop', 'address', 'chargeUserName', 'chargeUserPhone', 'warnSum', 'enable']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addData(obj)
      } else if (this.type === 'edit') { // 走编辑接口
        const obj = {}
        const pamraskey = ['id', 'type', 'supplier', 'name', 'code', 'warehousePop', 'address', 'chargeUserName', 'chargeUserPhone', 'warnSum', 'enable']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // 服务供应商（已启用的）
    async supplierOption(data = {}) {
      const res = await supplierWarehouse({ supplierCategory: 1, status: 1 })
      if (res.code !== 200) {
        return false
      }
      // this.supplierData = filterOptions(this.types, res.data.list, this.type)
      this.supplierData = (res.data.list || []).map(item => {
        return { value: item.id, label: item.typeName }
      })
      this.$set(this.copyContent[0], 'dataSource', this.supplierData)
    },
    // 服务商联动
    async supplierNameList(data) {
      const res = await supplierName({ supplierCategory: 1, supplierType: data })
      if (res.code !== 200) {
        return false
      }
      // this.supplierNameData = filterOptions(this.supplier, res.data.list, this.type)
      console.log('供应商返回名称', res)
      this.supplierNameData = (res.data || []).map(item => {
        return { value: item.id, label: item.supplierName }
      })
      this.$set(this.copyContent[1], 'dataSource', this.supplierNameData)
    },
    // 列表查询
    async getRulePage(data = {}) {
      const res = await storePage({ ...this.searchFormDatas, ...data })
      this.dataSource =
        (res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
            return item
          })) ||
        []
      this.total = res.data.total || {}
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },
    // 点击编辑获取详情
    async editList(data = {}, code) {
      const res = await storeDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      const editData = res.data || {}
      editData.type = {
        label: editData.type.label,
        value: parseInt(editData.type.value)
      }
      // 重新获取供应商名称
      this.supplierNameList(editData.type.value)
      editData.supplier = {
        label: editData.supplier.label,
        value: parseInt(editData.supplier.value)
      }
      console.log('打印editData', editData)
      this.rowInfoMessages = { ...editData }
      this.oldForm = { ...editData, index: code }
      this.$set(this.popOptions, 'formDatas', editData)
      console.log('编辑详情', this.popOptions.formDatas)
      // this.setFormDatas({ ...editData, index: code })
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      console.log('daying', params)
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 弹框取消数据比较回调
    CompaCallback(hadInput) {
      if (hadInput) {
        this.$confirm('您已经输入内容，确认退出吗？', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(_ => {
            this.$set(this.popOptions, 'visible', false)
          })
          .catch(_ => {
            this.$set(this.popOptions, 'visible', true)
          })
      } else {
        this.$set(this.popOptions, 'visible', false)
      }
    },
    // 更新
    async addUpdate(data = {}) {
      const res = await storeUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      // 日志--修改
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'id')
      this.fetchLog(this.getLogMessages('UPDATE', '/wms/warehouse/modify'), data, JSON.stringify({ beforeText: `在'仓储管理-基础数据-仓库资料,修改一条记录`, ...{ beforeCode, afterCode }}))
      this.$set(this.popOptions, 'visible', false)
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 删除
    async deleteData(id) {
      const res = await storeDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      // 日志--删除
      this.fetchLog(this.getLogMessages('DEL', '/wms/warehouse/delete'), id, JSON.stringify({ beforeText: `在'仓储管理-基础数据-仓库资料, 删除一条记录`, beforeCode: { id: id }}))
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    }
    // 页面启用禁用
    // async changeEnable(data) {
    //   const res = await storeEnabled(data)
    //   if (res.code === 200) {
    //     this.$message({
    //       message: res.message ? '更新状态成功' : res.message,
    //       type: 'success'
    //     })
    //   } else {
    //     this.$message({
    //       message: res.message ? '更新状态失败' : res.message,
    //       type: 'error'
    //     })
    //   }
    //   this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    // }
  }
}
</script>

<style lang='scss' scoped>
.store-data {
  padding: 20px;
  padding-bottom: 0px;
}

.store-button {
  margin-bottom: 15px;
}
/deep/ .el-tabs__header {
  margin: 0;
  .el-tabs__item {
    font-weight: 400;
  }
}
/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
  background-color: #d0d6da;
}
</style>
<style lang="scss">
.store-data {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important
  }
}
</style>
