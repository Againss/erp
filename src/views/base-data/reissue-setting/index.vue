<!--
 * @Author: pmr
 * @Description: 基础数据》复期设置
 * @Date: 2021-04-19
 * @LastEditors: pmr
 * @LastEditTime: 2021-04-19
-->
<template>
  <div class="countryArea">
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table :columns="columns" :data-source="dataSource" :operates="popOperates" lazy table-scrollx :pagination="pagination" edit-type="pop" />
    </div>
    <!-- 导入pop弹出层 -->
    <details-pop ref="detailsPop" @modify="modifyCallback" />
  </div>
</template>
<script>
import { list } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import detailsPop from './details-pop'
import label from './label'

export default {
  name: 'ReissueSetting',
  components: { detailsPop },
  mixins: [logMethods],
  data() {
    // 操作栏 和权限配置
    let popOperatesDataSource = [
      { label: '编辑', permitTag: ['baseData:baseDeliverySet:modify'], isShow: true, handle: scope => this.$nextTick(() => this.$refs['detailsPop'].init(scope.row)) }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    return {
      // 表格表头的配置信息
      columns: [
        { prop: 'planDelivery', label: label.planDelivery, minWidth: '50', showOverflowTooltip: true },
        { prop: 'daysSet', label: label.daysSet, minWidth: '80', showOverflowTooltip: true }
      ],
      // 分页配置信息
      pagination: {
        currentChange: val => this.load({ pageSize: this.pagination.pageSize || 20, pageNum: val }),
        sizeChange: val => this.load({ pageNum: this.pagination.page || 1, pageSize: val })
      },
      popOperates: { label: '操作', width: '160', fixed: 'right', dataSource: popOperatesDataSource },
      dataSource: [] // 表格数据源
    }
  },
  created() {
    this.load()
  },
  methods: {
    // 修改后的回调函数
    modifyCallback(data = {}) {
      if (data.code === 200) {
        this.$message({ message: '修改成功', type: 'success' })
        this.load({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      }
    },
    // 获取列表数据
    async load(params = {}) {
      const { data = [], code = 0 } = await list(params)
      if (code === 200) {
        data.map((item, index) => { item.code = data.total - ((data.pageNum - 1) * data.pageSize + index) })
        const listData = data
        this.dataSource = listData
        this.pagination = { ...this.pagination, dataTotal: data.total || 0, ...params, currentPage: data.pageNum, pageSize: params.pageSize, page: data.pageNum }
      }
    }
  }
}
</script>

<style lang="scss">
.countryArea {
  padding: 20px;
  padding-bottom: 0px;
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>
