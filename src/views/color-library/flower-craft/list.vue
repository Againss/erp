
<!--
 * @Date: 2020-11-03 14:50:48
 * @Author: Againss
 * @LastEditTime: 2021-06-22 16:26:28
 * @LastEditors: zhengjin
 * @Descripttion: 花号工艺
-->
<template>
  <div class="color-list">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <div class="color-tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item,index) in tabs"
          :key="Math.random(index)"
          :label="item.label+'('+item.number+')'"
          :name="item.name"
        />

        <!-- <el-tab-pane :label="`全部(${totalNum['1'] || 0})`" name="0" />
        <el-tab-pane :label="`待提交(${totalNum['2'] || 0})`" name="1" />
        <el-tab-pane :label="`待审核(${totalNum['3'] || 0})`" name="2" />
        <el-tab-pane :label="`已完成(${totalNum['4'] || 0})`" name="3" /> -->
      </el-tabs>
    </div>

    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        ref="singleTable"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :data-total="dataSource.length"
        :operates="popOperates"
        tooltip-effect="dark"
        table-scrollx
      />
    </div>
  </div>
</template>

<script>
import { pageList } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import colorItem from './components/color'
import { change } from './api'
import configData from '@/views/product-center/configDock/index.js'
import store from '@/store'
export default {
  mixins: [logMethods],
  data() {
    // el-tabs信息
    const tabs = [
      {
        label: '全部',
        name: '0',
        number: 0
      },
      {
        label: '待提交',
        name: '1',
        number: 0
      },
      {
        label: '待审核',
        name: '2',
        number: 0
      },
      {
        label: '已完成',
        name: '3',
        number: 0
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '50',
        fixed: true
      },
      {
        prop: 'flowerCode',
        label: '智布花号',
        width: '180',
        showOverflowTooltip: true,
        fixed: true,
        handle: (scope) => {
          this.$router.push(
            `/color-library/flower-craft/flower-code/${scope.row.id}/show`
          )
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'printingSoCode',
        label: 'SO单号',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'printingColorName',
        label: '印花颜色名',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'printingTech',
        label: '印花工艺',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricCategory',
        label: '布类',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricIngredient',
        label: '布成份',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'printingFactory',
        label: '印花厂',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'printingTopping',
        label: '印花套色',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'printingPattern',
        label: '印花图案',
        minWidth: '80',
        components: {
          colorItem
        }
      },
      {
        prop: 'orderDate',
        label: '下单日期',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'deliveryDate',
        label: '交期',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'updator',
        label: '操作人',
        showOverflowTooltip: true,
        minWidth: '200',
        formater: (scope) => {
          return (
            (scope.row.updator &&
              `${scope.row.updator.name}/${scope.row.updator.realName}`)
          )
        }
      },
      {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '140',
        formater: (scope) => {
          return scope.row.updatedTime && this.$filters.parseTime(
            scope.row.updatedTime,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      }
    ]
    const searchData = [
      {
        prop: 'printingSoCode',
        itemType: 'input',
        label: 'SO单号:',
        placeholder: '请输入SO单号'
      },
      {
        prop: 'flowerCode',
        itemType: 'input',
        label: '智布花号:',
        placeholder: '请输入智布花号'
      },
      {
        prop: 'printingColorName',
        itemType: 'input',
        label: '印花颜色名:',
        placeholder: '请输入印花颜色名'
      },
      {
        prop: 'printingFactory',
        itemType: 'input',
        label: '印花厂:',
        placeholder: '请输入印花厂'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getList(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    let dataList = [
      {
        label: '编辑',
        permitTag: ['color:Api:FlowerManage:FlowerTechnology:update'],
        isShow: (scope) => {
          return (
            scope.row.status === 1 || scope.row.status === 0 || scope.row.status === 4
          )
        },
        handle: (params) => {
          // 待对色编辑进入色号新增
          this.$router.push(
            `/color-library/flower-craft/flower-code/${params.row.id}/edit`
          )
        }
      },
      // {
      //   label: '驳回',
      //   permitTag: ['color:Api:FlowerManage:FlowerTechnology:disapprove'],
      //   isShow: (scope) => {
      //     return (
      //       scope.row.status === 2
      //     )
      //   },
      //   handle: (params) => {
      //     this.$router.push(
      //       `/color-library/flower-craft/flower-code/${params.row.id}/show`
      //     )
      //     // this.$confirm(' 你确认要驳回该数据吗？', '提示', {
      //     //   confirmButtonText: '确定',
      //     //   cancelButtonText: '取消',
      //     //   type: 'warning'
      //     // }).then(async() => {
      //     //   const res = await reject({ id: params.row.id })
      //     //   if (res.code !== 200) {
      //     //     return
      //     //   }
      //     //   this.comMethod('reject', '驳回', params)
      //     //   this.getList()
      //     // })
      //   }
      // },
      {
        label: '审核',
        permitTag: ['color:Api:FlowerManage:FlowerTechnology:approve'],
        isShow: (scope) => {
          return scope.row.status === 2
        },
        handle: (params) => {
          this.$router.push(
            `/color-library/flower-craft/flower-code/${params.row.id}/show`
          )
          // this.$confirm(' 你确认要审核该数据吗？', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(async() => {
          //   const res = await review({ id: params.row.id })
          //   if (res.code !== 200) {
          //     return
          //   }
          //   this.comMethod('review', '审核', params)
          //   this.getList()
          // })
        }
      },
      {
        label: '变更',
        permitTag: ['color:Api:FlowerManage:FlowerTechnology:change'],
        isShow: (scope) => {
          return scope.row.status === 3
        },
        handle: (params) => {
          this.$confirm(' 你确认要变更该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await change({ id: params.row.id })
            if (res.code !== 200) {
              return
            }
            this.comMethod('change', '变更', params)
            this.$router.push(
              `/color-library/flower-craft/flower-code/${params.row.id}/edit`
            )
            // this.getList()
          })
        }
      }
    ]
    dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '200',
      fixed: 'right',
      dataSource: dataList
    }
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: (val) => {
        console.log(val)
        // 切换页数
        this.getList({
          pageSize: this.pagination.pageSize || 20,
          page: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.getList({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    return {
      tabs,
      popOperates,
      pagination,
      dataSource: [],
      activeName: '1',
      columns,
      formOtions: {
        inline: true,
        size: 'small',
        layout: true
      },
      totalNum: {},
      searchData
    }
  },
  created() {
    this.getList()
    this.getPermission()
    if (this.activeName - 0 === 1) {
      this.columns.push({
        prop: 'status',
        label: '状态',
        minWidth: '100',
        formater: (scope) => {
          return this.getStatus(scope.row)
        }
      })
    }
  },
  methods: {
    // 新增
    addHandler() {
      this.$router.push('/color-library/flower-management/flower-code/create')
    },
    // 权限
    getPermission() {
      const permits = store.getters && store.getters.permits
      const hasPermission = permits.some((role) => {
        return role === 'color:Api:FlowerManage:FlowerTechnology:show'
      })
      if (!hasPermission) {
        this.columns[1].handle = null
        this.columns[1].style = null
      }
    },
    comMethod(type, des, params) {
      this.fetchLog(
        this.getLogMessages(
          'UPDATE',
          `${configData.colorRequestPrefix}/api/flower/flowerManage/${type}`,
          'color'
        ),
        { code: params.row.code },
        JSON.stringify({
          beforeText: `在'色号花号库-花号工艺'${des}一条记录`,
          beforeCode: { code: params.row.flowerCode || '' }
        })
      )
    },
    // 获取列表
    async getList(data = {}) {
      const obj = { status: this.activeName - 0 }
      // if (this.activeName === '5') {
      //   obj = { enabled: 'N' }
      // } else {
      //   obj = { status: this.activeName - 0 }
      // }
      const res = await pageList({
        ...this.searchFormDatas,
        ...obj,
        ...data
      })
      this.dataSource = (res.data.list && res.data.list.map((item, index) => {
        item.index = (res.data.page - 1) * res.data.pageSize + index + 1
        return item
      })) || []
      this.$nextTick(() => {
        const arr = this.tabs
        for (let i = 0; i < arr.length; i++) {
          arr[i]['number'] = res.data.totalNum[i + 1] || 0
        }
      })
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.page,
        pageSize: res.data.pageSize
      }
    },
    handleClick() {
      if (this.activeName - 0 === 0 || this.activeName - 0 === 1) {
        if (this.columns[this.columns.length - 1].label !== '状态') {
          this.columns.push({
            prop: 'status',
            label: '状态',
            minWidth: '100',
            formater: (scope) => {
              // return scope.row.statusValue
              return this.getStatus(scope.row)
            }
          })
        }
      } else {
        if (this.columns[this.columns.length - 1].label === '状态') {
          this.columns.pop()
        }
      }
      this.getList()
    },
    getStatus(data) {
      let str = ''
      switch (data.status) {
        case 0:
          str = ''
          break
        case 1:
          str = '<span style="color:#FF9B02">草稿</span>'
          break
        case 2:
          str = '<span style="color:#FF9B02">待审核</span>'
          break
        case 3:
          str = '<span style="color:#FF9B02">已审核</span>'
          break
        case 4:
          str = '<span style="color:#00BCC5">已驳回</span>'
          break
        default:
          str = ''
          break
      }
      return str
    }
  }
}
</script>

<style lang="scss" scoped>
.color-list {
  padding: 20px;
}
.color-tabs {
  position: relative;
  background: #fff;
  margin-bottom: 1px;
  /deep/.el-tabs__nav .el-tabs__item {
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
  }
}
.color-button {
  position: absolute;
  right: 20px;
  z-index: 99;
  top: 15px;
}
/deep/ .el-tabs__header {
  margin: 0;
  .el-tabs__item {
    font-weight: 400;
  }
}
/deep/ .el-tabs__nav-wrap::after {
  height: 0;
  background-color: #d0d6da;
}
</style>
