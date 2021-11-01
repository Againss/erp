<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  库位资料页面
 -->
<template>
  <div class="location-data">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 页签和按钮部分 -->
    <div class="location-button">
      <el-button
        v-permission="['wms:warehouseLocation:add']"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="addList"
      >新增库位</el-button>
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
      <cs-custom-pop class="locationPop" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { locationPage, locationAdd, locationDelete, locationWarehouse, locationArea, locationShelf, locationEnabled } from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import { fetchLog } from '@/views/wms/public/fetchLog'
export default {
  name: 'LocationData',
  components: {},
  mixins: [fetchLog],
  data() {
    // 下拉变换时，仓库产生；联动效果
    const changeSelect = (value, form, formDatas, setFormDatas) => {
      setFormDatas({ areaCode: null })
      this.areaOption(value)
    }
    // 下拉变化时，提供仓库，区号，产生联动效果
    const changeArea = (value, form, formDatas, setFormDatas) => {
      setFormDatas({ shelfCode: null })
      this.shelfOption(value)
    }
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 只能输入数字
    const ruleTrim = (data) => {
      data = data.replace(/[^0-9]/g, '')
      data = data.toUpperCase()
      data = data.replace('_', '')
      return data
    }
    // 长限制
    const lengthReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,18})|(0{1}))(\.\d{1,10})?$/, message: '请输入数字', trigger: ['blur'] })
    // 宽限制
    const wideReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,18})|(0{1}))(\.\d{1,10})?$/, message: '请输入数字', trigger: ['blur'] })
    // 高限制
    const highReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,18})|(0{1}))(\.\d{1,10})?$/, message: '请输入数字', trigger: ['blur'] })
    // 弹框中基本信息和附加信息的公共样式
    const locationstyle = {
      'font-size': '14px',
      'color': '#333',
      'background-color': '#eee',
      'padding': '10px',
      'border-radius': '2px',
      'margin-bottom': '15px'
    }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'warehouseName',
        itemType: 'input',
        label: '仓库名称',
        clearable: true
      },
      {
        prop: 'areaCode',
        itemType: 'input',
        label: '区号',
        clearable: true
      },
      {
        prop: 'enable',
        itemType: 'select',
        label: '状态',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
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
        align: 'left',
        minWidth: '50'
      },
      {
        prop: 'warehouseName',
        label: '仓库名称',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'path',
        label: '库位编号',
        minWidth: '150'
      },
      {
        prop: 'locationCode',
        label: '货位号',
        minWidth: '100'
      },
      {
        prop: 'areaCode',
        label: '区号',
        minWidth: '100'
      },
      {
        prop: 'shelfCode',
        label: '货架号',
        minWidth: '100'
      },
      {
        prop: 'goodsLimit',
        label: '货位限制',
        minWidth: '130'
      },
      {
        prop: 'enable',
        label: '状态',
        minWidth: '100',
        formater: scope => {
          return scope.row[scope.column.property] === 1
            ? '<span>启用</span>'
            : '<span>禁用</span>'
        }
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '150',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.createdTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      }
    ]
    // 新增弹窗中的字段
    const firstContent = [
      {
        itemType: 'view',
        text: '基本信息',
        style: locationstyle
      },
      {
        prop: 'warehouseCode',
        itemType: 'select',
        label: '仓库',
        dataSource: [],
        visibleChange: (value) => {
          if (value) {
            this.warehouseOption()
          }
        },
        change: changeSelect,
        rules: [commonBlurReg]
      },
      {
        prop: 'areaCode',
        itemType: 'select',
        label: '区号',
        dataSource: [],
        change: changeArea,
        rules: [commonBlurReg]
      },
      {
        prop: 'shelfCode',
        itemType: 'select',
        label: '货架号',
        dataSource: [],
        rules: [commonBlurReg]
      },
      {
        prop: 'enable',
        itemType: 'select',
        label: '状态',
        dataSource: [
          {
            label: '启用',
            value: '1'
          },
          {
            label: '禁用',
            value: '0'
          }
        ],
        rules: [commonBlurReg]
      },
      {
        itemType: 'input',
        prop: 'locationCode',
        label: '货位号',
        clearable: true,
        trim: ruleTrim,
        maxlength: 10,
        rules: [commonBlurReg]
      }
    ]
    const secondContent = [
      {
        itemType: 'view',
        text: '附加信息',
        style: locationstyle
      },
      {
        itemType: 'input',
        prop: 'length',
        label: '长(M)',
        clearable: true,
        maxlength: 10,
        rules: [commonBlurReg, lengthReg]
      },
      {
        itemType: 'input',
        prop: 'wide',
        label: '宽(M)',
        clearable: true,
        maxlength: 10,
        rules: [commonBlurReg, wideReg]
      },
      {
        itemType: 'input',
        prop: 'high',
        label: '高(M)',
        clearable: true,
        maxlength: 10,
        rules: [commonBlurReg, highReg]
      },
      {
        itemType: 'input',
        prop: 'amountLimit',
        label: '限制数量',
        clearable: true,
        maxlength: 10,
        rules: [commonBlurReg, { message: '长度在 10 个字符以内', trigger: ['blur'] }]
      },
      {
        itemType: 'input',
        prop: 'weightLimit',
        label: '限制重量(KG)',
        maxlength: 10,
        clearable: true
      },
      {
        itemType: 'input',
        prop: 'goodsLimit',
        label: '限制品种',
        maxlength: 10,
        clearable: true
      }
    ]
    const copyContent = [
      ...firstContent, ...secondContent
    ]
    let popOperatesDataSource = [
      {
        label: '禁用',
        permitTag: ['wms:warehouseLocation:status:modify'],
        isShow: (scope) => {
          return scope.row.enable === 1
        },
        handle: scope => {
          this.$confirm('确认要禁用该条数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const obj = {
              id: scope.row.id,
              enable: 0
            }
            this.changeEnable(obj)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      },
      {
        label: '启用',
        permitTag: ['wms:warehouseLocation:status:modify'],
        isShow: (scope) => {
          return scope.row.enable === 0
        },
        handle: scope => {
          this.$confirm('确认要启用该条数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const obj = {
              id: scope.row.id,
              enable: 1
            }
            this.changeEnable(obj)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['wms:warehouseLocation:delete'],
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
      },
      {
        label: '详情',
        permitTag: ['wms:warehouseLocation:info'],
        isShow: true,
        handle: scope => {
          this.$router.push(
            `/wms/basis-data/location-data/components/details/${scope.row.id}`
          )
        }
      }]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getRulePage({ pageNum: this.pagination.pageNum, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      itemStyle: { 'width': '40%' },
      visible: false,
      title: '新增货位',
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
      formOtions: {
        // layout: true,
        size: 'small',
        inline: true
      },
      formDatas: {
        enable: ''
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
      warehouseData: [],
      warehouseSelect: '',
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getRulePage()
  },
  mounted() {},
  methods: {
    // 新增弹框页面
    addList() {
      // 去新增
      this.type = 'add'
      this.PopDialogHandle('新增货位')
      this.$set(this.popOptions, 'content', this.copyContent)
      this.resetData()
      this.$set(this.popOptions, 'formDatas', {})
      this.warehouseOption()
    },
    // 重置新增数据
    resetData() {
      this.warehouseData = []
      this.$set(this.copyContent[2], 'dataSource', [])
      this.$set(this.copyContent[3], 'dataSource', [])
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await locationAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('INSERT', '/wms/warehouseLocation/add'), data, JSON.stringify({ beforeText: `在'仓储管理-基础数据-库位资料,新增一条记录`, beforeCode: data }))
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
        this.warehouseData.forEach((item, index) => {
          if (item.value === params.warehouseCode) {
            params.warehouseName = item.label
          }
        })
        const obj = {}
        const pamraskey = ['warehouseCode', 'warehouseName', 'areaCode', 'enable', 'shelfCode', 'locationCode', 'length', 'wide', 'high', 'amountLimit', 'weightLimit', 'goodsLimit']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addData(obj)
      }
    },
    // 列表查询
    async getRulePage(data = {}) {
      const res = await locationPage({ ...this.searchFormDatas, ...data })
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
    // 点击编辑时处理数据
    setFormDatas(params) {
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
    // 删除
    async deleteData(id) {
      const res = await locationDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      // 日志--删除
      this.fetchLog(this.getLogMessages('DEL', '/wms/warehouseLocation/delete'), id, JSON.stringify({ beforeText: `在'仓储管理-基础数据-库位资料', 删除一条记录`, beforeCode: { id: id }}))
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 仓库下拉数据
    async warehouseOption(data = {}) {
      const res = await locationWarehouse({ enable: 1 })
      if (res.code !== 200) {
        return false
      }
      this.warehouseData = (res.data.list || []).map(item => {
        return { value: item.code, label: item.name }
      })
      this.$set(this.copyContent[1], 'dataSource', this.warehouseData)
    },
    // 区号下拉数据
    async areaOption(data) {
      this.warehouseSelect = data
      const res = await locationArea({ enable: 1, warehouseCode: data })
      if (res.code !== 200) {
        return false
      }
      const areaData = (res.data.list || []).map(item => {
        return { value: item.areaCode, label: item.areaCode }
      })
      this.$set(this.copyContent[2], 'dataSource', areaData)
    },
    // 货架号下拉数据
    async shelfOption(data) {
      console.log('this.areaSelect', this.warehouseSelect)
      const res = await locationShelf({ enable: 1, warehouseCode: this.warehouseSelect, areaCode: data })
      if (res.code !== 200) {
        return false
      }
      const shelfData = (res.data.list || []).map(item => {
        return { value: item.shelfCode, label: item.shelfCode }
      })
      this.$set(this.copyContent[3], 'dataSource', shelfData)
    },
    // 页面启用禁用
    async changeEnable(data) {
      console.log('启用', data)
      const res = await locationEnabled(data)
      if (res.code === 200) {
        this.$message({
          message: res.message ? '更新状态成功' : res.message,
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message ? '更新状态失败' : res.message,
          type: 'error'
        })
      }
      // ${JSON.stringify({ 'id': id })}
      this.fetchLog(this.getLogMessages('UPDATE', '/wms/warehouseLocation/status/modify'), { id: data.id }, JSON.stringify({ beforeText: `在'仓储管理-基础数据-库位资料', ${data.enable ? '启用' : '禁用'}一条记录`, beforeCode: { status: data.enable === 1 ? '禁用' : '启用', id: data.id }, afterCode: { status: data.enable === 1 ? '启用' : '禁用', id: data.id }}))
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    }
  }
}
</script>

<style lang='scss' scoped>
.location-data {
  padding: 20px;
  padding-bottom: 0px;
}
.location-button {
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
.location-data {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important
  }
  .locationPop{
    .el-dialog{
      width: 1200px !important;
    }
    .el-dialog__body{
      padding: 20px !important;
    }
  }
}
</style>
