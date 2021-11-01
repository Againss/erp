<!--
  @Description 坯布成本-织工
-->
<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOptions" :form-datas="searchFormDatas" />
    </div>
    <!-- 新增按钮 -->
    <div class="button">
      <el-button
        v-permission="['price:wovenTechInfo:add']"
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="addFn"
      >新增</el-button>
    </div>
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        table-scrollx
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import {
  getSearchSelect,
  getCertificatePage,
  deleteCertificate,
  editCertificate,
  enabledCertificate,
  addCertificate,
  getCertificateDetail
} from './api/index.js'
import enableSwitch from '@/views/price-center/components/enableSwitch'
import * as selectData from '@/views/price-center/common/basisApi'
import yarnsFineness from './components/yarns-fineness.vue'
import department from './components/department'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'CertificateFiber',
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({
      type: 'number',
      pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/,
      message: '输入3位整数或保留1到2位小数',
      trigger: ['blur']
    })
    // const maxNumberReg = this.$getRules({
    //   type: 'number',
    //   pattern: /^[1-9]\d*$/,
    //   message: '请输入最多三位正整数',
    //   trigger: ['blur']
    // })
    // 公共弹出框内容
    const commonContent = [
      // {
      //   prop: 'dyeMethod',
      //   itemType: 'select',
      //   label: '染方式:',
      //   valueType: 'object',
      //   placeholder: '请选择染方式',
      //   rules: [commonBlurReg],
      //   filterable: true,
      //   dataSource: []
      // },
      // {
      //   prop: 'damaskModelling',
      //   itemType: 'select',
      //   label: '织花造型:',
      //   valueType: 'object',
      //   placeholder: '请选择织花造型',
      //   filterable: true,
      //   dataSource: []
      // },
      // {
      //   prop: 'stretchType',
      //   itemType: 'select',
      //   label: '弹力:',
      //   clearable: true,
      //   placeholder: '请选择弹力',
      //   dataSource: [
      //     {
      //       value: 1,
      //       label: '弹力'
      //     },
      //     {
      //       value: 0,
      //       label: '非弹力'
      //     }
      //   ]
      // },
      {
        prop: 'fabricName',
        itemType: 'select',
        label: '布类:',
        valueType: 'object',
        placeholder: '请选择布类',
        filterable: true,
        rules: [commonChangeReg],
        dataSource: []
      },
      {
        components: {
          yarnsFineness
        },
        componentsOptions: {
          setDatas: val => {
            this.$set(this.popOptions, 'formDatas', val)
          }
        }

      },
      // {
      //   prop: 'pinNumber',
      //   itemType: 'input',
      //   label: '针数:',
      //   maxlength: 3,
      //   placeholder: '请输入最多3位正整数',
      //   rules: [commonBlurReg, maxNumberReg]
      // },
      {
        prop: 'wovenTechPrice',
        itemType: 'input',
        label: '织工价格:',
        placeholder: '请输入织工价格',
        rules: [commonBlurReg, max999Reg]
      }
    ]
    // 查询表单配置信息
    const searchData = [
      // {
      //   prop: 'dyeMethod',
      //   itemType: 'select',
      //   label: '染方式:',
      //   placeholder: '请选择染方式',
      //   valueType: 'object',
      //   filterable: true,
      //   dataSource: []
      // },
      // {
      //   prop: 'damaskModelling',
      //   itemType: 'select',
      //   label: '织花造型:',
      //   valueType: 'object',
      //   placeholder: '请选择织花造型',
      //   filterable: true,
      //   dataSource: []
      // },
      // {
      //   prop: 'stretchType',
      //   itemType: 'select',
      //   label: '弹力:',
      //   clearable: true,
      //   placeholder: '请选择弹力',
      //   dataSource: [
      //     {
      //       value: '',
      //       label: '全部'
      //     },
      //     {
      //       value: 0,
      //       label: '非弹力'
      //     },
      //     {
      //       value: 1,
      //       label: '弹力'
      //     }
      //   ]
      // },
      {
        prop: 'fabricName',
        itemType: 'select',
        label: '布类:',
        valueType: 'object',
        placeholder: '请选择布类',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '启用/禁用:',
        clearable: true,
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
            value: 1
          },
          {
            label: '禁用',
            value: 0
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = params
          this.getCertificatePageFn(params, true)
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: scope => (this.pagination.currentPage - 1) * this.pagination.pageSize + scope.$index + 1
      },
      // {
      //   prop: 'dyeMethodName',
      //   label: '染方式',
      //   minWidth: '120',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'damaskModellingName',
      //   label: '织花造型',
      //   minWidth: '120',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'stretchType',
      //   label: '弹力',
      //   minWidth: '120',
      //   showOverflowTooltip: true,
      //   formater: scope => scope.row[scope.column.property] === 0 ? '非弹力' : scope.row[scope.column.property] === 1 ? '弹力' : ''
      // },
      {
        prop: 'fabricName',
        label: '布类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'wovenMiddleInfo',
        label: '纱支/细度',
        minWidth: '150',
        // showOverflowTooltip: true,
        // formater: scope => {
        //   const str = (scope.row[scope.column.property] || []).reduce((a, n) => {
        //     a += n.dyedYarnName ? '<span>' + n.dyedYarnName + '</span><br>' : ''
        //     return a
        //   }, '')
        //   return str.slice(0, -4)
        // },
        components: {
          department
        },
        componentsOptions: {
          key: 'wovenMiddleInfo',
          name: 'name'
        }
      },
      // {
      //   prop: 'pinNumber',
      //   label: '针数',
      //   minWidth: '120',
      //   showOverflowTooltip: true
      // },
      {
        prop: 'wovenTechPrice',
        label: '织工价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => '¥' + scope.row[scope.column.property]
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'createdBy',
        label: '创建人',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '禁用/启用',
        minWidth: '120',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'price:wovenTechInfo:status',
          changeStatus: scope => {
            this.enableStatus({ id: scope.row.id, status: scope.row.status * 1 }, scope)
          }
        }
      }
    ]

    let popOperatesList = [
      {
        label: '编辑',
        isShow: true,
        permitTag: ['price:wovenTechInfo:modify'],
        handle: scope => {
          this.type = 'edit'
          this.editFn(scope.row.id)
        }
      },
      {
        label: '删除',
        isShow: scope => scope.row.status !== 1,
        style: { 'color': '#FE4949' },
        permitTag: ['price:wovenTechInfo:delete'],
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => this.deleteFn({ id: scope.row.id }))
        }
      }
    ]
    popOperatesList = this.$filterPermission(popOperatesList)
    const popOperates = {
      label: '操作',
      width: '110',
      fixed: 'right',
      dataSource: popOperatesList
    }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getCertificatePageFn({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getCertificatePageFn({
          pageNum: this.pagination.pageNum || 1,
          pageSize: val
        })
      }
    }
    // 弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      okText: '保存',
      saveAndaddText: '保存并继续',
      ok: params => {
        this.addOrEdit(params, true)
      },
      cancel: params => {
        this.PopDialogHandle()
      },
      formDatas: {},
      formOptions: {},
      content: commonContent
    }
    return {
      formOptions: {
        size: 'small',
        inline: true
      },
      searchFormDatas: {
        status: '',
        stretch: ''
      },
      searchData,
      columns,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add',
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getCertificatePageFn()
  },
  methods: {
    async editFn(id) {
      const data = (await getCertificateDetail({ id })).data || {}
      // console.log(data)
      this.oldForm = data
      this.popOptions.formDatas.type = ''
      data.updatedBy ? delete data.updatedBy : ''
      data.updatedTime ? delete data.updatedTime : ''
      const obj = this.setYarnsFn(data.wovenMiddleInfoInfoResp)
      this.$set(this.popOptions, 'formDatas', { ...data, ...obj, type: 'edit' })
      this.$set(this.popOptions, 'saveAndadd', undefined)
      this.PopDialogHandle('编辑织工')
    },
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.popOptions.visible) {
        this.setSelectData()
      }
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增
    addFn() {
      this.type = 'add'
      if (JSON.stringify(this.popOptions.formDatas) !== '{}') {
        this.$set(this.$refs.popForm.$refs.popComponents.$refs.customform, 'dynamicValidateFormRuleForm', this.setYarnsFn(''))
      }
      this.$set(this.popOptions, 'formDatas', this.setYarnsFn(''))
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
      this.PopDialogHandle('新增织工')
    },
    // 获取数据
    async getCertificatePageFn(data = {}, isSearch) {
      const res = await getCertificatePage({ ...this.searchFormDatas, ...data })
      this.dataSource = res.data && res.data.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data && res.data.total || 0,
        ...data,
        currentPage: res.data && res.data.pageNum || 1,
        pageSize: res.data && res.data.pageSize || 20
      }
      if (!isSearch) {
        this.setSearchSelect()
      }
    },
    // 获取搜索栏下拉数据
    async setSearchSelect() {
      const res = (await getSearchSelect()).data || {}
      this.searchData.forEach((ele, i) => {
        if (ele.prop && ele.valueType === 'object') {
          this.$set(this.searchData[i], 'dataSource', res[ele.prop] && res[ele.prop].filter(e => JSON.stringify(e) !== JSON.stringify({})) || [])
        }
      })
    },
    // 启用/禁用
    async enableStatus(data, scope) {
      await enabledCertificate(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/wovenTechInfo/status'), data, JSON.stringify({ beforeText: `在'价格中心-坯布成本-织工'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
    },
    // 新增或者修改印花
    addOrEdit(params, go) {
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          // debugger
          const arr = this.setYarnsFn(params, 1)
          const data = { ...params, wovenMiddleInfoAddReq: arr }
          if (this.type === 'add') {
            await addCertificate(data)
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/wovenTechInfo/add'), data, JSON.stringify({ beforeText: `在'价格中心-坯布成本-织工,新增一条记录`, beforeCode: data }))
          } else if (this.type === 'edit') {
            await editCertificate(data)
            const { beforeCode, afterCode } = this.compareData(this.oldForm, data, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/wovenTechInfo/modify'), data, JSON.stringify({ beforeText: `在'价格中心-坯布成本-织工,将${JSON.stringify({ 'id': data.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          }
          this.$message.success('保存成功')
          this.$set(this.$refs.popForm.$refs.popComponents.$refs.customform, 'dynamicValidateFormRuleForm', this.setYarnsFn(''))
          this.$set(this.popOptions, 'formDatas', this.setYarnsFn(''))
          this.getCertificatePageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
          if (go) {
            this.PopDialogHandle()
          }
        }
      })
    },
    // 删除
    async deleteFn(data = {}) {
      await deleteCertificate(data)
      this.$message.success('删除成功')
      this.getCertificatePageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/wovenTechInfo/delete'), data, JSON.stringify({ beforeText: `在'价格中心-坯布成本-织工'删除一条记录`, beforeCode: data }))
    },
    // 设置弹框下拉数据
    setSelectData() {
      // arr [ [0]接口获取选项的fn, [1]弹框配置的第几项, [2]接口需要的参数 ]
      const arr = [
        // [selectData.getZhiRan, '0', { mode: 'D' }],
        // [selectData.getZhiRan, 1, { mode: 'K' }],
        [selectData.getBuLei, 0, { enabled: 'Y' }]
      ]
      arr.forEach(async e => {
        const row = this.popOptions.formDatas
        const select = this.popOptions.content[e[1]].dataSource
        const id = row && row[this.popOptions.content[e[1]].prop] && row[this.popOptions.content[e[1]].prop].value || ''
        const bool = id && !select.find(item => item.value === id)
        // 当下拉选为空 或 编辑时当前值不在下拉列表中
        if (!select.length || bool) {
          const data = await e[0](e[2] || {}, { id, data: [], type: this.type })
          this.$set(this.popOptions.content[e[1]], 'dataSource', data)
        }
      })
    },
    // 处理弹框纱支细度 fun
    setYarnsFn(val, type) {
      // type = 1 提交时的数据处理
      if (!type) {
        if (!val || JSON.stringify(val) === '[]') {
          return {
            yarnsBranch: [{ dyedYarn: '' }],
            fineness: [{ dyedYarn: '' }]
          }
        }
        const obj = val.reduce((a, n) => {
          const name = n.dyedYarnCategory === 'S' ? 'yarnsBranch' : 'fineness'
          const item = {
            value: n.dyedYarn.value,
            label: n.dyedYarn.label
          }
          if (a[name]) {
            a[name].push({ dyedYarn: item })
          } else {
            a[name] = [{ dyedYarn: item }]
          }
          return a
        }, {})
        return obj
      }
      const arr1 = val.yarnsBranch ? val.yarnsBranch.filter(e => e.dyedYarn).map(e => ({
        dyedYarn: {
          label: e.dyedYarn.label,
          value: e.dyedYarn.value
        },
        dyedYarnCategory: 'S'
      })) : []
      const arr2 = val.fineness ? val.fineness.filter(e => e.dyedYarn).map(e => ({
        dyedYarn: {
          label: e.dyedYarn.label,
          value: e.dyedYarn.value
        },
        dyedYarnCategory: 'F'
      })) : []
      return [...arr1, ...arr2]
    }
  }
}
</script>

<style lang='scss' scopd>

</style>
