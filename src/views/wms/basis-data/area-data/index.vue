<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  库区资料页面
 -->
<template>
  <div class="area-data">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 页签和按钮部分 -->
    <div class="area-button">
      <el-button
        v-permission="['wms:warehouseArea:add']"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="addList"
      >新增库区</el-button>
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
import { areaPage, areaAdd, areaDetail, areaUpdate, areaDelete, locationWarehouse } from './api/index.js'
import { filterOptions } from './api/common.js'
import { dataComparision } from '@/views/basic-data/common/index'
import { fetchLog } from '@/views/wms/public/fetchLog'
export default {
  name: 'AreaData',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 只能输入数字
    const ruleTrim = (data) => {
      data = data.replace(/[^0-9]/g, '')
      data = data.toUpperCase()
      data = data.replace('_', '')
      return data
    }
    // 区域面积限制
    const areaReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,18})|(0{1}))(\.\d{1,10})?$/, message: '请输入数字', trigger: ['blur'] })
    // const itemStyle = { width: '33%' }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'warehouseName',
        itemType: 'input',
        label: '仓库名称',
        clearable: true
        // itemStyle
      },
      {
        prop: 'areaCode',
        itemType: 'input',
        label: '区号',
        clearable: true
        // itemStyle
      },
      {
        prop: 'type',
        itemType: 'select',
        label: '存放方式',
        clearable: true,
        // itemStyle,
        dataSource: [
          {
            label: '货架',
            value: '1'
          },
          {
            label: '地面堆垛',
            value: '2'
          },
          {
            label: '货架+地面堆垛',
            value: '3'
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
        minWidth: '50'
      },
      {
        prop: 'warehouseName',
        label: '仓库名称',
        minWidth: '110',
        showOverflowTooltip: true
      },
      {
        prop: 'areaCode',
        label: '区号',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'type',
        label: '存放方式',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === '1' ? '货架' : scope.row[scope.column.property] === '2' ? '地面堆垛' : '货架+地面堆垛'
        }
      },
      {
        prop: 'acreage',
        label: '预估区域面积(M³)',
        minWidth: '130',
        showOverflowTooltip: true
      },
      {
        prop: 'stockSum',
        label: '库存预警值(件)',
        minWidth: '130',
        showOverflowTooltip: true
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '120',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.createdTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'warehouseCode',
        itemType: 'select',
        label: '仓库',
        dataSource: [],
        clearable: true,
        visibleChange: (value) => {
          if (value) {
            this.warehouseOption()
          }
        },
        rules: [commonBlurReg]
      },
      {
        itemType: 'select',
        prop: 'type',
        label: '存货方式',
        clearable: true,
        rules: [commonBlurReg],
        dataSource: [
          {
            label: '货架',
            value: '1'
          },
          {
            label: '地面堆垛',
            value: '2'
          },
          {
            label: '货架+地面堆垛',
            value: '3'
          }
        ]
      },
      {
        itemType: 'input',
        prop: 'areaCode',
        label: '区号',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { trigger: ['blur'] }]
      },
      {
        itemType: 'input',
        prop: 'acreage',
        label: '区域面积(M³)',
        maxlength: 10,
        rules: areaReg,
        clearable: true
      },
      {
        itemType: 'input',
        prop: 'stockSum',
        label: '存储货物值',
        trim: ruleTrim,
        maxlength: 10,
        clearable: true
      }
    ]
    const copyContent = [
      ...commonContent
    ]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['wms:warehouseArea:modify'],
        isShow: true,
        handle: scope => {
          this.warehouseCode = '' + scope.row.warehouseCode
          this.type = 'edit'
          this.PopDialogHandle('编辑库区')
          if (this.type === 'edit') {
            this.$set(this.copyContent[0], 'disabled', true)
            this.$set(this.copyContent[2], 'disabled', true)
          } else {
            this.$set(this.copyContent[0], 'disabled', false)
            this.$set(this.copyContent[2], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', copyContent)
          this.warehouseOption()
          this.editList({ id: scope.row.id }, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['wms:warehouseArea:delete'],
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
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getRulePage({ pageNum: this.pagination.pageNum, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增库区',
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
      warehouseCode: '',
      formOtions: {
        // layout: true,
        size: 'small',
        inline: true
      },
      formDatas: {},
      searchData,
      columns,
      copyContent,
      dataSource: [],
      warehouseData: [],
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
    this.warehouseOption()
  },
  mounted() {},
  methods: {
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新增库区')
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.copyContent[0], 'disabled', false)
      this.$set(this.copyContent[2], 'disabled', false)
      this.$set(this.popOptions, 'formDatas', {})
    },
    handleClick() {},
    // 新增的确定事件
    async addData(data = {}) {
      const res = await areaAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('INSERT', '/wms/warehouseArea/add'), data, JSON.stringify({ beforeText: `在'仓储管理-基础数据-库区资料,新增一条记录`, beforeCode: data }))
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
        const pamraskey = ['warehouseName', 'warehouseCode', 'type', 'areaCode', 'acreage', 'stockSum']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addData(obj)
      } else if (this.type === 'edit') { // 走编辑接口
        const obj = {}
        const pamraskey = ['id', 'warehouseName', 'warehouseCode', 'areaCode', 'type', 'acreage', 'stockSum']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // 列表查询
    async getRulePage(data = {}) {
      const res = await areaPage({ ...this.searchFormDatas, ...data })
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
      const res = await areaDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      const editData = res.data || {}
      this.rowInfoMessages = { ...editData }
      this.oldForm = { ...editData, code: code }
      this.setFormDatas({ ...editData, code: code })
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
    // 更新
    async addUpdate(data = {}) {
      const res = await areaUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      // 日志--修改
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'id')
      this.fetchLog(this.getLogMessages('UPDATE', '/wms/warehouseArea/modify'), data, JSON.stringify({ beforeText: `在'仓储管理-基础数据-库区资料,修改一条记录`, ...{ beforeCode, afterCode }}))
      this.$set(this.popOptions, 'visible', false)
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 删除
    async deleteData(id) {
      const res = await areaDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      // 日志--删除
      this.fetchLog(this.getLogMessages('DEL', '/wms/warehouseArea/delete'), id, JSON.stringify({ beforeText: `在'仓储管理-基础数据-库区资料', 删除一条记录`, beforeCode: { id: id }}))
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 仓库下拉数据
    async warehouseOption(data = {}) {
      const res = await locationWarehouse({ enable: this.type === 'add' ? 1 : '' })
      if (res.code !== 200) {
        return false
      }
      this.warehouseData = filterOptions(this.warehouseCode, res.data.list, this.type)
      this.warehouseData = res.data.list.map(item => {
        return { label: item.name, value: item.code }
      })
      this.$set(this.copyContent[0], 'dataSource', this.warehouseData)
    }
  }
}
</script>

<style lang='scss' scoped>
.area-data {
  padding: 20px;
  padding-bottom: 0px;
}
.area-button {
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
.area-data {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important
  }
}
</style>
