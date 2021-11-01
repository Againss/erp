<template>
  <div class="yarn-testing-yarn">
    <!-- 搜索页面 -->
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        lazy
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
        @sort-change="changeSort"
      />
    </div>
  </div>
</template>

<script>
import { yarnTestPage } from './api/index.js'
export default {
  data() {
    const searchData = [
      {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱线名称:',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱名',
        clearable: true
      },
      {
        prop: 'supplierName',
        itemType: 'input',
        label: '供应商:',
        placeholder: '请输入供应商',
        itemStyle: { width: '25%' },
        clearable: true
      },
      {
        prop: 'yarnBatch',
        itemType: 'input',
        label: '纱牌/纱批:',
        placeholder: '请输入纱牌/纱批',
        itemStyle: { width: '25%' },
        clearable: true
      },
      {
        prop: 'yarnNo',
        itemType: 'input',
        label: '批次号:',
        itemStyle: { width: '25%' },
        placeholder: '请输入纺纱方法',
        clearable: true
      },
      {
        prop: 'yarnUuid',
        itemType: 'input',
        label: '纱线编号:',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱线编号',
        clearable: true
      },
      {
        prop: 'physicalyarnUuid',
        itemType: 'input',
        label: '物测编号:',
        placeholder: '请输入物测编号',
        itemStyle: { width: '25%' },
        clearable: true
      },

      {
        prop: 'testingyarnUuid',
        itemType: 'input',
        label: '试纱编号:',
        placeholder: '请输入试纱编号',
        itemStyle: { width: '25%' },
        clearable: true
      },

      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = params
          this.formDatas = params
          this.initData()
        },
        resetHandle: () => {
          // console.log('重置')
          this.formDatas = {}
          this.formDatas.sorts = [] // 自定义表格内排序
          this.$refs.tableList.$refs.table.clearSort()
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'yarnUuid',
        label: '纱线编号',
        minWidth: '130',
        showOverflowTooltip: true,
        formater: scope => scope.row.inspection.skuId,
        // handle: scope => {
        //   this.$router.push(
        //     `./detail?id=${scope.row.inspection.skuId}&show=detail`
        //   )

        //   // localStorage.setItem('orderInfo', JSON.stringify(scope.row))
        // },
        handle: scope => {
          this.$router.push({
            path: '/quality-manage/quality-assurance/yarn-testing-yarn/detail',
            query: { id: scope.row.id }
          })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'yarnName',
        label: '纱线名称',
        minWidth: '300',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.inspection
            ? scope.row.inspection.yarnCountName +
                ' ' +
                scope.row.inspection.ingredientsName +
                scope.row.inspection.proportion +
                ' ' +
                scope.row.inspection.yarnTypeName +
                ' ' +
                scope.row.inspection.cardingMethodName +
                ' ' +
                scope.row.inspection.spinningMethodName
            : ''
        }
      },
      {
        prop: 'spinningMethodName',
        label: '纺纱方法',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row.inspection.spinningMethodName
      },
      {
        prop: 'cardingMethodName',
        label: '梳棉方法',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: scope => scope.row.inspection.cardingMethodName
      },
      {
        prop: 'supplierName',
        label: '供应商',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row.inspection.supplierName
      },
      {
        prop: 'yarnBatch',
        label: '纱牌/纱批',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.inspection.yarnBatch
      },
      {
        prop: 'batchNo',
        label: '批次号',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row.inspection.batchNo
      },
      {
        prop: 'physicalyarnUuid',
        label: '物测编号',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row.physicalInspection.yarnUuid
      },
      {
        prop: 'physicalApplyTime',
        label: '申请时间',
        sortable: 'custom',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.physicalInspection.applyTime
            ? this.$filters.parseTime(
              scope.row.physicalInspection.applyTime,
              '{y}-{m}-{d} {h}:{i}'
            )
            : ''
        }
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: scope => {
          return this.getStatus(scope.row.physicalInspection.status)
        }
      },
      {
        prop: 'yarnTestCode',
        label: '试纱编号',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row.testingInspection.yarnUuid
      },

      {
        prop: 'testingApplyTime',
        label: '申请时间',
        sortable: 'custom',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.testingInspection.applyTime
            ? this.$filters.parseTime(
              scope.row.testingInspection.applyTime,
              '{y}-{m}-{d} {h}:{i}'
            )
            : ''
        }
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: scope => {
          return this.getStatus(scope.row.testingInspection.status)
        }
      }
    ]
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.initData({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: val => {
        this.initData({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    let popOperatesDataSource = [
      {
        label: '详情',
        // permitTag: ['basic:countries:update'],
        isShow: true,
        handle: scope => {
          this.$router.push({
            path: '/quality-manage/quality-assurance/yarn-testing-yarn/detail',
            query: { id: scope.row.id }
          })
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '200',
      dataSource: popOperatesDataSource
    }
    return {
      searchData,
      formOtions: {
        inline: true,
        size: 'small',
        layout: true
      },
      formDatas: {
        status: ''
      },
      dataSource: [],
      columns,
      pagination,
      popOperates
    }
  },

  created() {
    this.initData()
  },
  mounted() {},
  methods: {
    // 列表查询
    async initData(data = {}) {
      data.pageNum = data.pageNum || 1
      const res = await yarnTestPage({
        ...this.formDatas,
        ...this.searchFormDatas,
        ...data
      })
      res.data.list &&
        res.data.list.map((item, index) => {
          item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1
        })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageNum: res.data.pageNum
      }
    },
    // 处理状态数据
    getStatus(data) {
      let status = ''

      switch (data) {
        case 0:
          status = `<span style="color:#FF9B02">待提交</span>`
          break
        case 1:
          status = `<span style="color:#FF9B02">进行中</span>`
          break
        case 2:
          status = `<span style="color:#00BCC5">待审核</span>`
          break
        case 3:
          status = `<span style="color:#FF9B02">已处理</span>`
          break
        default:
          status = ''
          break
      }
      return status
    },
    /**
     * 排序点击事件
     */
    changeSort(e) {
      delete this.formDatas.physicalApplyTime
      delete this.formDatas.testingApplyTime
      // 申请时间
      if (e.prop === 'physicalApplyTime') {
        // 处理时间
        if (e.order === 'ascending') {
          this.formDatas.physicalTimeOrder = '0'
        } else {
          this.formDatas.physicalTimeOrder = '1'
        }
      } else if (e.prop === 'testingApplyTime') {
        if (e.order === 'ascending') {
          this.formDatas.testingTimeOrder = '0'
        } else {
          this.formDatas.testingTimeOrder = '1'
        }
      }
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.yarn-testing-yarn {
  position: relative;
  padding: 20px;
  padding-bottom: 0px;
}
</style>
