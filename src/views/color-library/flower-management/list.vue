
<!--
 * @Date: 2020-11-03 14:50:48
 * @Author: Againss
 * @LastEditTime: 2021-06-22 14:44:58
 * @LastEditors: zhengjin
 * @Descripttion: 花号管理
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

        <!-- <el-tab-pane :label="`全部(${totalNum[1] || 0})`" name="1" />
        <el-tab-pane :label="`待提交(${totalNum[2] || 0})`" name="2" />
        <el-tab-pane :label="`待审核(${totalNum[3] || 0})`" name="3" />
        <el-tab-pane :label="`已审核(${totalNum[4] || 0})`" name="4" />
        <el-tab-pane :label="`已禁用(${totalNum[5] || 0})`" name="5" /> -->
      </el-tabs>
      <!-- <div class="color-button">
        <el-button
          v-permission="['color:Api:ColorManage:ColorManage:store']"
          size="small"
          type="primary"
          @click="addHandler"
          >新增</el-button
        >
      </div> -->
    </div>

    <!-- 新增规则按钮 -->

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
import { pageList, change } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import colorItem from './components/color'
import configData from '@/views/product-center/configDock/index.js'
import store from '@/store'

export default {
  mixins: [logMethods],
  data() {
    // el-tabs信息
    const tabs = [
      {
        label: '全部',
        name: '1',
        number: 0
      },
      {
        label: '待提交',
        name: '2',
        number: 0
      },
      {
        label: '待审核',
        name: '3',
        number: 0
      },
      {
        label: '已审核',
        name: '4',
        number: 0
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
        prop: 'flowerCode',
        label: '智布花号',
        width: '180',
        showOverflowTooltip: true,
        handle: (scope) => {
          this.$router.push(
            `/color-library/flower-management/flower-code/${scope.row.id}/show`
          )
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'soOrderCode',
        label: 'SO单号',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.soOrderCode || ''
        }
      },
      {
        prop: 'flowerColor',
        label: '花色',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.flowerColor || ''
        }
      },
      {
        prop: 'ingredient',
        label: '成份',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.ingredient || ''
        }
      },
      {
        prop: 'actualTechnologyNames',
        label: '印花工艺',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'printPic',
        label: '印花图案',
        minWidth: '80',
        components: {
          colorItem
        }
      },
      {
        prop: 'status',
        label: '操作人',
        showOverflowTooltip: true,
        minWidth: '200',
        formater: (scope) => {
          return (
            (scope.row.updator && `${scope.row.updator.name}/${scope.row.updator.realName}`)
          )
        }
      },
      {
        prop: 'operationTime',
        label: '操作时间',
        minWidth: '140',
        formater: (scope) => {
          return scope.row.operationTime && this.$filters.parseTime(
            scope.row.operationTime,
            '{y}-{m}-{d} {h}:{i}'
          ) || ''
        }
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '100',
        formater: (scope) => {
          return this.getStatus(scope.row)
        }
      }
    ]
    const searchData = [
      {
        prop: 'flowerCode',
        itemType: 'input',
        label: '智布花号:',
        placeholder: '请输入智布花号'
      },
      {
        prop: 'soOrderCode',
        itemType: 'input',
        label: 'SO单号:',
        placeholder: '请输入SO单号'
      },
      {
        prop: 'flowerColor',
        itemType: 'input',
        label: '花色:',
        placeholder: '请输入花色'
      },
      {
        prop: 'actualTech',
        itemType: 'input',
        label: '印花工艺:',
        placeholder: '请输入印花工艺'
      },
      {
        prop: 'ingredient',
        itemType: 'input',
        label: '成份:',
        placeholder: '请输入成份'
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
        permitTag: ['color:Api:FlowerManage:FlowerMain:update'],
        isShow: (scope) => {
          return (

            (scope.row.status === 1 ||
              (scope.row.status === 4) || scope.row.status === 0)
          )
        },
        handle: (params) => {
          // 待对色编辑进入色号新增
          this.$router.push(
            `/color-library/flower-management/flower-code/${params.row.id}/edit`
          )
        }
      },
      {
        label: '审核',
        permitTag: ['color:Api:FlowerManage:FlowerMain:approve'],
        isShow: (scope) => {
          return scope.row.status === 2
        },
        handle: (params) => {
          this.$router.push(
            `/color-library/flower-management/flower-code/${params.row.id}/show`
          )
        }
      },
      {
        label: '变更',
        permitTag: ['color:Api:FlowerManage:FlowerMain:change'],
        isShow: (scope) => {
          return scope.row.status === 3
        },
        handle: (params) => {
          this.$confirm(' 你确认要变更该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await change({
              id: params.row.id, actualTechnologyIds: params.row.actualTechnologyIds && params.row.actualTechnologyIds.split(',') || [],
              actualPrintMode: params.row.actualPrintMode || 0
            })
            if (res.code !== 200) {
              return
            }
            this.comMethod('change', '变更', params)
            setTimeout(() => {
              this.$router.push(
                `/color-library/flower-management/flower-code/${params.row.id}/edit`
              )
            })
          })
        }
      }
      // {
      //   label: '禁用',
      //   permitTag: ['color:Api:FlowerManage:FlowerMain:enable'],
      //   isShow: (scope) => {
      //     return scope.row.status === 3 && scope.row.enabled !== 'N'
      //   },
      //   handle: (params) => {
      //     this.$confirm(' 你确认要禁用该数据吗？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(async() => {
      //       const res = await enabled({ id: params.row.id, enabled: 'N' })
      //       if (res.code !== 200) {
      //         return
      //       }
      //       this.comMethod('enabled', '禁用', params)

      //       this.getList()
      //     })
      //   }
      // },
      // {
      //   label: '启用',
      //   permitTag: ['color:Api:FlowerManage:FlowerMain:enable'],
      //   isShow: (scope) => {
      //     return scope.row.enabled === 'N'
      //   },
      //   handle: (params) => {
      //     this.$confirm(' 你确认要启用该数据吗？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(async() => {
      //       const res = await enabled({ id: params.row.id, enabled: 'Y' })
      //       if (res.code !== 200) {
      //         return
      //       }
      //       this.comMethod('enabled', '启用', params)
      //       this.getList()
      //     })
      //   }
      // }
    ]
    dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '200',
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
      activeName: '2',
      columns,
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      totalNum: {},
      searchData
    }
  },
  created() {
    this.getList()
    this.getPermission()
  },
  methods: {
    // 权限
    getPermission() {
      const permits = store.getters && store.getters.permits
      const hasPermission = permits.some((role) => {
        return role === 'color:Api:FlowerManage:FlowerMain:show'
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
          `${configData.colorRequestPrefix}/api/color/colorManage/${type}`,
          'color'
        ),
        { code: params.row.code },
        JSON.stringify({
          beforeText: `在'色号花号库-花号管理'${des}一条记录 编码:${params.row.flowerCode}`
        })
      )
    },
    // 获取列表
    async getList(data = {}) {
      const obj = { status: this.activeName - 0 }
      const res = await pageList({
        ...this.searchFormDatas,
        ...obj,
        ...data
      })

      this.dataSource =
        (res.data.data && res.data.data.map((item, index) => {
          item.index = (res.data.page - 1) * res.data.pageSize + index + 1
          return item
        })) || []
      this.$nextTick(() => {
        const arr = this.tabs
        for (let i = 0; i < arr.length; i++) {
          if (res.data.totalNumber[arr[i].name]) {
            arr[i]['number'] = res.data.totalNumber[arr[i].name] || 0
          }
        }
      })
      // this.totalNum = res.data.totalNumber || {}
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.page,
        pageSize: res.data.pageSize
      }
    },
    handleClick() {
      if (this.activeName - 0 === 1 || this.activeName - 0 === 2) {
        if (this.columns[this.columns.length - 1].label !== '状态') {
          this.columns.push({
            prop: 'status',
            label: '状态',
            minWidth: '100',
            formater: (scope) => {
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
      // if (data.enabled === 'N') {
      //   return '<span style="color:#BBC2D0">已禁用</span>'
      // }
      let str = ''
      switch (data.status) {
        case 1:
          str = '<span style="color:#FF9B02">草稿</span>'
          break
        case 4:
          str = '<span style="color:#FF4444;">已驳回</span>'
          break
        case 2:
          str = '<span style="color:#FF9B02">待审核</span>'
          break
        case 3:
          str = '<span style="color:#00BCC5">已审核</span>'
          break
        default:
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
  height: 1px;
  background-color: #d0d6da;
}
</style>
