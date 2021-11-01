<!--
* @Author: Againss
 * @Date: 2020-11-03 14:50:48
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-06-22 14:32:46
 * @Descripttion: 色号管理列表
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
        <!-- <el-tab-pane :label="`全部(${totalNum['0'] || 0})`" name="0" />
        <el-tab-pane :label="`待提交(${totalNum['5'] || 0})`" name="5" />
        <el-tab-pane :label="`待对色(${totalNum['1'] || 0})`" name="1" />
        <el-tab-pane :label="`待录入配方(${totalNum['2'] || 0})`" name="2" />
        <el-tab-pane :label="`待审核(${totalNum['3'] || 0})`" name="3" />
        <el-tab-pane :label="`已审核(${totalNum['4'] || 0})`" name="4" />
        <el-tab-pane :label="`已禁用(${totalNum['n'] || 0})`" name="n" /> -->
      </el-tabs>
      <div class="color-button">
        <el-button
          v-permission="['color:Api:ColorManage:ColorManage:store']"
          size="small"
          type="primary"
          @click="addHandler"
        >新增</el-button>
      </div>
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
import { pageList, enabled } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import colorItem from './components/color'
import codeShow from './components/codeShow'
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
        name: '5',
        number: 0
      },
      {
        label: '待对色',
        name: '1',
        number: 0
      },
      {
        label: '待录入配方',
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
      },
      {
        label: '已禁用',
        name: 'n',
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
        prop: 'code',
        label: '智布色号',
        width: '180',
        showOverflowTooltip: true,
        handle: (scope) => {
          this.$router.push(
            `/color-library/color-management/color-code/${scope.row.id}/show`
          )
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'cloth',
        label: '布类',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.cloth && scope.row.cloth.name) || ''
        }
      },
      {
        prop: 'colorPlateOrderCode',
        label: '色板单号',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'colorManageYarn',
        label: '纱信息',
        minWidth: '200',
        components: {
          codeShow
        },
        componentsOptions: {
          type: 'colorManageYarn'
        }
      },
      {
        prop: 'colorManageDye',
        label: '色系',
        minWidth: '80',
        components: {
          codeShow
        },
        componentsOptions: {
          type: 'colorManageDye'
        }
      },
      {
        prop: 'status',
        label: '操作人',
        showOverflowTooltip: true,
        minWidth: '100',
        formater: (scope) => {
          return (
            (scope.row.updator &&
              `${scope.row.updator.name}/${scope.row.updator.realName}`) ||
            (scope.row.creator &&
              `${scope.row.creator.name}/${scope.row.creator.realName}`)
          )
        }
      },
      {
        prop: 'operatedTime',
        label: '操作时间',
        minWidth: '140',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.operatedTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      }
    ]
    const searchData = [
      {
        prop: 'colorPlateOrderCode',
        itemType: 'input',
        label: '色板单号:',
        placeholder: '请输入色板单号'
      },
      {
        prop: 'code',
        itemType: 'input',
        label: '智布色号:',
        placeholder: '请输入智布色号'
      },
      {
        prop: 'customerColor',
        itemType: 'input',
        label: '客户颜色:',
        placeholder: '请输入客户颜色'
      },
      {
        prop: 'cloth',
        itemType: 'input',
        label: '布类:',
        placeholder: '请输入布类'
      },
      {
        prop: 'yarn',
        itemType: 'input',
        label: '纱支:',
        placeholder: '请输入纱支'
      },
      {
        prop: 'ingredient',
        itemType: 'input',
        label: '成份:',
        placeholder: '请输入成份'
      },
      {
        prop: 'colorSystem',
        itemType: 'input',
        label: '色系:',
        placeholder: '请输入色系'
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
      // {
      //   label: '查看',
      //   permitTag: ['userCenter:sysDataMaskingRule:modify'],
      //   isShow: true,
      //   handle: (params) => {
      //     this.$router.push({
      //       name: 'colorManagementColorCode',
      //       params: { id: params.row.id, edit: 'show' }
      //     })
      //   }
      // },
      {
        label: '编辑',
        permitTag: ['color:Api:ColorManage:ColorManage:update'],
        isShow: (scope) => {
          return (
            scope.row.enabled === 'Y' &&
            (scope.row.status === 1 || scope.row.status === 5 ||
              (scope.row.status === 3 &&
                scope.row.colorPlateType &&
                scope.row.colorPlateType.name === '花灰纱') ||
                (scope.row.status === 2 &&
                scope.row.isComputerColorMatch === 0))
          )
        },
        handle: (params) => {
          if (!params.row.canEdit) {
            this.$message({
              type: 'warning',
              message: '对应色板申请单已完结或对应色板生产进度已产生客批结果，不能编辑！'
            })
            return
          }
          // 待对色编辑进入色号新增
          this.$router.push(
            `/color-library/color-management/color-code/${params.row.id}/edit`
          )
        }
      },
      {
        label: '编辑',
        permitTag: ['color:Api:ColorManage:Datacolor:update'],
        isShow: (scope) => {
          return scope.row.enabled === 'Y' && scope.row.status === 2 && scope.row.isComputerColorMatch !== 0
        },
        handle: (params) => {
          this.$router.push(
            `/color-library/color-management/computer-color/${params.row.id}/edit?status=${params.row.status}`
          )
        }
      },
      {
        label: '编辑',
        permitTag: ['color:Api:ColorManage:Formula:update'],
        isShow: (scope) => {
          return (
            scope.row.enabled === 'Y' &&
            scope.row.status === 3 &&
            scope.row.colorPlateType &&
            scope.row.colorPlateType.name !== '花灰纱'
          )
        },
        handle: (params) => {
          this.$router.push(
            `/color-library/color-management/recipe-entry/${params.row.id}/edit`
          )
        }
      },
      {
        label: '电脑对色',
        permitTag: ['color:Api:ColorManage:Datacolor:store'],
        isShow: (scope) => {
          return scope.row.status === 1 && scope.row.enabled === 'Y'
        },
        handle: (params) => {
          this.$router.push(
            `/color-library/color-management/computer-color/${params.row.id}/add`
          )
        }
      },
      // isFormula true 走update编辑  false 走 store 新增
      {
        label: '录入配方',
        permitTag: ['color:Api:ColorManage:Formula:store'],
        isShow: (scope) => {
          return (
            scope.row.status === 2 &&
            scope.row.enabled === 'Y' &&
            !scope.row.isFormula
          )
        },
        handle: (params) => {
          this.$router.push(
            `/color-library/color-management/recipe-entry/${params.row.id}/add`
          )
        }
      },
      {
        label: '录入配方',
        permitTag: ['color:Api:ColorManage:Formula:store'],
        // permitTag: ['color:Api:ColorManage:Formula:update'],
        isShow: (scope) => {
          return (
            scope.row.status === 2 &&
            scope.row.enabled === 'Y' &&
            scope.row.isFormula
          )
        },
        handle: (params) => {
          this.$router.push(
            `/color-library/color-management/recipe-entry/${params.row.id}/edit`
          )
        }
      },
      {
        label: '审核',
        permitTag: ['color:Api:ColorManage:ColorManage:approve'],
        isShow: (scope) => {
          return scope.row.status === 3 && scope.row.enabled === 'Y'
        },
        handle: (params) => {
          if (
            params.row.colorPlateType &&
            params.row.colorPlateType.name === '花灰纱'
          ) {
            this.$router.push(
              `/color-library/color-management/color-code/${params.row.id}/show`
            )
            return
          }
          this.$router.push(
            `/color-library/color-management/recipe-entry/${params.row.id}/show`
          )
        }
      },
      {
        label: '对色结果',
        permitTag: ['color:Api:ColorManage:Datacolor:show'],
        isShow: (scope) => {
          let flag = false
          if (
            scope.row.colorPlateType &&
            scope.row.colorPlateType.name === '花灰纱'
          ) {
            flag = true
          }
          return (
            (scope.row.status === 3 || scope.row.status === 4) &&
            scope.row.enabled === 'Y' &&
            !flag && scope.row.isComputerColorMatch !== 0
          )
        },
        handle: (params) => {
          this.$router.push(
            `/color-library/color-management/computer-color/${params.row.id}/show?status=${params.row.status}`
          )
        }
      },
      {
        label: '配方内容',
        permitTag: ['color:Api:ColorManage:Formula:show'],
        isShow: (scope) => {
          let flag = false
          if (
            scope.row.colorPlateType &&
            scope.row.colorPlateType.name === '花灰纱'
          ) {
            flag = true
          }
          return scope.row.status === 4 && scope.row.enabled === 'Y' && !flag
        },
        handle: (params) => {
          this.$router.push(
            `/color-library/color-management/recipe-entry/${params.row.id}/show`
          )
        }
      },
      {
        label: '禁用',
        permitTag: ['color:Api:ColorManage:ColorManage:enabled'],
        isShow: (scope) => {
          return scope.row.status !== 1 && scope.row.status !== 5 && scope.row.enabled === 'Y'
        },
        handle: (params) => {
          this.$confirm(' 你确认要禁用该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await enabled({ id: params.row.id, type: 'N' })
            if (res.code !== 200) {
              return
            }
            this.fetchLog(
              this.getLogMessages(
                'UPDATE',
                '/color/api/color/colorManage/enabled',
                'color'
              ),
              { code: params.row.code },
              JSON.stringify({
                beforeText: `在'色号花号库-色号管理'禁用一条记录`,
                beforeCode: { code: params.row.code || '' }
              })
            )
            this.getList()
          })
        }
      },
      {
        label: '启用',
        permitTag: ['color:Api:ColorManage:ColorManage:enabled'],
        isShow: (scope) => {
          return scope.row.enabled === 'N'
        },
        handle: (params) => {
          this.$confirm(' 你确认要启用该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await enabled({ id: params.row.id, type: 'Y' })
            if (res.code !== 200) {
              return
            }
            this.fetchLog(
              this.getLogMessages(
                'UPDATE',
                '/color/api/color/colorManage/enabled',
                'color'
              ),
              { code: params.row.code },
              JSON.stringify({
                beforeText: `在'色号花号库-色号管理'启用一条记录`,
                beforeCode: { code: params.row.code || '' }
              })
            )
            this.getList()
          })
        }
      }
    ]
    dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '300',
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
      activeName: '5',
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
    // 新增
    addHandler() {
      this.$router.push('/color-library/color-management/color-code/create')
    },
    // 权限
    getPermission() {
      const permits = store.getters && store.getters.permits
      const hasPermission = permits.some((role) => {
        return role === 'color:Api:ColorManage:ColorManage:show'
      })
      if (!hasPermission) {
        this.columns[1].handle = null
        this.columns[1].style = null
      }
    },
    // 获取列表
    async getList(data = {}) {
      let obj
      if (this.activeName === 'n') {
        obj = { enabled: 'N' }
      } else {
        obj = { status: this.activeName - 0 }
      }
      const res = await pageList({
        ...this.searchFormDatas,
        ...obj,
        ...data
      })

      this.dataSource =
        (res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.page - 1) * res.data.pageSize + index + 1
            return item
          })) ||
        []
      this.$nextTick(() => {
        // 深拷贝
        // const arr = this.tabs.map(o => ({ ...o }))
        const arr = this.tabs
        for (let i = 0; i < arr.length; i++) {
          if (res.data.totalNum[arr[i].name]) {
            arr[i]['number'] = res.data.totalNum[arr[i].name] || 0
          }
        }
        // this.tabs = arr
      })
      // this.totalNum = res.data.totalNum || {}
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.page,
        pageSize: res.data.pageSize
      }
    },
    handleClick() {
      if (this.activeName - 0 === 0) {
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
      if (this.activeName - 0 !== 1 && this.activeName - 0 !== 5) {
        if (this.columns[5].label !== 'RGB颜色') {
          this.columns.splice(5, 0, {
            prop: 'color',
            label: 'RGB颜色',
            minWidth: '80',
            components: {
              colorItem
            }
          })
        }
      } else {
        if (this.columns[5].label === 'RGB颜色') {
          this.columns.splice(5, 1)
        }
      }
      this.getList()
    },
    getStatus(data) {
      if (data.enabled === 'N') {
        return '<span style="color:#BBC2D0">已禁用</span>'
      }
      let str = ''
      switch (data.status) {
        case 1:
          str = '<span style="color:#FF9B02">待对色</span>'
          break
        case 2:
          str = '<span style="color:#FF9B02">待录入配方</span>'
          break
        case 3:
          str = '<span style="color:#FF9B02">待审核</span>'
          break
        case 4:
          str = '<span style="color:#00BCC5">已审核</span>'
          break
        case 5:
          str = '<span style="color:#FF9B02">待提交</span>'
          break
        default:
          break
      }
      return str
    }
    // 用纱信息
    // getColorManageYarn(colorManageYarn) {
    //   return colorManageYarn.reduce((str, cru) => {
    //     const ingredientVal = cru.yarnElement && cru.yarnElement.reduce((s, c) => {
    //       const sv = ((c.ingredient && c.ingredient.name) || '') +
    //         c.ingredientRatio +
    //         '%'
    //       if (s) {
    //         s += '/' + sv
    //       } else {
    //         s = sv
    //       }
    //       return s
    //     }, '')
    //     const strv = ((cru.yarnType && cru.yarnType.name) || '') +
    //       ' ' +
    //       (cru.element && cru.element.name || '') +
    //       (cru.ingredientType === 1 ? ingredientVal : '100%')
    //     if (str) {
    //       str += '<br>' + strv
    //     } else {
    //       str = strv
    //     }
    //     return str
    //   }, '')
    // },
    // colorManageDye(colorManageDye) {
    //   return Array.from(
    //     new Set(
    //       (colorManageDye &&
    //         colorManageDye.map((cru) => {
    //           return (cru.colorSystem && cru.colorSystem.name) || ''
    //         })) ||
    //       []
    //     )
    //   ).join('<br>')
    // }
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
