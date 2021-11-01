<template>
  <div class="drawnwork-index">
    <!-- 抽纱列表搜索 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <!-- tab栏 -->
    <div class="tab-group">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="statusClick">
        <el-tab-pane
          v-for="(item, i) in statusArr"
          :key="i"
          :name="item.value"
        >
          <span slot="label" :tabIndex="item.value">{{ `${item.label}(${item.count || '0'})` }}</span>
        </el-tab-pane>
        <!-- <el-tab-pane label="已处理" name="1" /> -->
      </el-tabs>
      <div class="right-button">
        <el-button v-if="$permission(['aps-center:grayYarn:info'])" class="process-button" size="small" type="primary" @click="drawnworkClick">抽纱</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div class="pop-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :header-cell-style="headerCellStyle"
        :table-scrollx="true"
        :operates="operates"
        :data-source="dataSource"
        :pagination="pagination"
      />
    </div>
  </div>
</template>

<script>
import { drawnworkList } from './components/index.js'
export default {
  mixins: [drawnworkList],
  data() {
    // 搜索时间配置
    const pickerOptions = {
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }
      ]
      // disabledDate(time) {
      //   return time.getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59).getTime() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 91
      // }
    }
    // 搜索配置信息
    const searchData = {
      '_orderNo': {
        prop: 'orderNo',
        itemType: 'input',
        label: '订单号',
        itemStyle: { width: '25%' },
        placeholder: '请输入订单号'
      },
      '_customerName': {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        itemStyle: { width: '25%' },
        placeholder: '请输入客户名称'
      },
      '_salesTeam': {
        prop: 'salesTeam',
        itemType: 'input',
        label: '销售团队',
        itemStyle: { width: '25%' },
        placeholder: '请输入销售团队'
      },
      '_deliveryDate': {
        itemType: 'date',
        type: 'daterange',
        prop: 'deliveryDate',
        label: '订单交期',
        // style: { width: '300px' },
        itemStyle: { width: '25%' },
        pickerOptions: pickerOptions,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
        // change: timeChange
      },
      '_yarnCode': {
        prop: 'yarnCode',
        itemType: 'input',
        label: '纱线编码',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱线编码'
      },
      '_yarnName': {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱名',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱名'
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '纱属性',
        placeholder: '请输入纱属性'
      },
      '_operate': {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          let startTime = ''
          let endTime = ''
          if (params.deliveryDate && params.deliveryDate.length === 2) {
            startTime = params.deliveryDate[0]
            endTime = params.deliveryDate[1]
          }

          this.searchFormDatas = { ...params, startTime, endTime }
          this.grayYarnPage()
          this.grayYarnPageCount()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    // 表格表头配置
    const columns = {
      '_id': {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: (scope) => {
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        }
      },
      '_orderNo': {
        prop: 'orderNo',
        label: '订单号',
        width: '156',
        showOverflowTooltip: true
        // handle: scope => {
        //   console.log('scope', scope)
        //   this.$router.push({ name: 'drawnwork-detail' })
        // },
        // style: {
        //   color: '#1890ff',
        //   cursor: 'pointer'
        // }
      },
      '_clothType': {
        prop: 'clothType',
        label: '布类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_yarnCode': {
        prop: 'yarnCode',
        label: '纱线编码',
        minWidth: '140',
        className: 'cellBorderBottom',
        showOverflowTooltip: true,
        formater: scope => {
          const yarnCodeArr = scope.row.yarnCode ? scope.row.yarnCode.split(',') : []
          let str = '<span>'
          yarnCodeArr.forEach((item, index) => {
            if (index !== yarnCodeArr.length - 1) {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>`
            } else {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>` + '</span>'
            }
          })
          return str
        }
      },
      '_yarnName': {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '120',
        className: 'cellBorderBottom',
        showOverflowTooltip: true,
        formater: scope => {
          const yarnNameArr = scope.row.yarnName ? scope.row.yarnName.split(',') : []
          let str = '<div>'
          yarnNameArr.forEach((item, index) => {
            if (index !== yarnNameArr.length - 1) {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>`
            } else {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>` + '</div>'
            }
          })
          return str
        }
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '140',
        className: 'cellBorderBottom',
        showOverflowTooltip: true,
        formater: scope => {
          const yarnAttrArr = scope.row.yarnAttr ? scope.row.yarnAttr.split(',') : []
          let str = '<div>'
          yarnAttrArr.forEach((item, index) => {
            if (index !== yarnAttrArr.length - 1) {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>`
            } else {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>` + '</div>'
            }
          })
          return str
        }
      },
      '_whetherDyed': {
        prop: 'whetherDyed',
        label: '是否染色',
        minWidth: '80',
        className: 'cellBorderBottom',
        // isShow: scope => {
        //   return this.activeName === '0'
        // },
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            1: '是',
            0: '否'
          }
          const whetherDyedArr = scope.row.whetherDyed ? scope.row.whetherDyed.split(',') : []
          let str = '<div>'
          whetherDyedArr.forEach((item, index) => {
            if (index !== whetherDyedArr.length - 1) {
              str += `<div title="${obj[item] || '-'}" class="cell-item-style">${obj[item] || '-'}</div>`
            } else {
              str += `<div title="${obj[item] || '-'}" class="cell-item-style">${obj[item] || '-'}</div>` + '</div>'
            }
          })
          return str
        }
      },
      '_yarnColor': {
        prop: 'yarnColor',
        label: '染纱颜色',
        minWidth: '80',
        className: 'cellBorderBottom',
        // isShow: scope => {
        //   return this.activeName === '0'
        // },
        showOverflowTooltip: true,
        formater: scope => {
          const yarnColorArr = scope.row.yarnColor ? scope.row.yarnColor.split(',') : []
          let str = '<div>'
          yarnColorArr.forEach((item, index) => {
            if (index !== yarnColorArr.length - 1) {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>`
            } else {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>` + '</div>'
            }
          })
          return str
        }
      },
      '_yarnNum': {
        prop: 'yarnNum',
        label: '坯纱数量(KG)',
        minWidth: '110',
        align: 'right',
        className: 'cellBorderBottom',
        // isShow: scope => {
        //   return this.activeName === '1'
        // },
        showOverflowTooltip: true,
        formater: scope => {
          const yarnNumArr = scope.row.yarnNum ? scope.row.yarnNum.split(',') : []
          let str = '<div>'
          yarnNumArr.forEach((item, index) => {
            const itemValue = !isNaN(item) ? (+item).toFixed(2) : '-'
            if (index !== yarnNumArr.length - 1) {
              str += `<div title="${itemValue}" class="cell-item-style">${itemValue}</div>`
            } else {
              str += `<div title="${itemValue}" class="cell-item-style">${itemValue}</div>` + '</div>'
            }
          })
          return str
        }
      },
      '_lockNum': {
        prop: 'lockNum',
        label: '抽纱数量(KG)',
        align: 'right',
        className: 'cellBorderBottom',
        isShow: scope => {
          return this.activeName === '1'
        },
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          const lockNumArr = scope.row.lockNum ? scope.row.lockNum.split(',') : []
          let str = '<span>'
          lockNumArr.forEach((item, index) => {
            const itemValue = !isNaN(item) ? (+item).toFixed(2) : '-'
            if (index !== lockNumArr.length - 1) {
              str += `<div title="${itemValue}" class="cell-item-style">${itemValue}</div>`
            } else {
              str += `<div title="${itemValue}" class="cell-item-style">${itemValue}</div>` + '</div>'
            }
          })
          return str
        }
      },
      '_needClothNum': {
        prop: 'needClothNum',
        label: '需织坯量(KG)',
        minWidth: '110',
        align: 'right',
        isShow: scope => {
          return this.activeName === '1'
        },
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.needClothNum) ? (+scope.row.needClothNum).toFixed(2) : '-'
        }
      },
      '_customerName': {
        prop: 'customerName',
        label: '客户',
        minWidth: '60',
        isShow: scope => {
          // return this.activeName === '1'
          return true
        },
        showOverflowTooltip: true
      },
      '_delivery': {
        prop: 'delivery',
        label: '订单交期',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.delivery ? this.$filters.parseTime(scope.row.delivery, '{y}-{m}-{d}') : '-'
        }
      },
      // '_customerColor': {
      //   prop: 'customerColor',
      //   label: '客户颜色',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // },
      '_salesTeamName': {
        prop: 'salesTeamName',
        label: '销售团队',
        minWidth: '100',
        showOverflowTooltip: true
      },
      '_updatedBy': {
        prop: 'updatedBy',
        label: '处理人',
        minWidth: '90',
        isShow: scope => {
          return this.activeName === '1'
        },
        showOverflowTooltip: true
      },
      '_updateTime': {
        prop: 'updateTime',
        label: '处理时间',
        minWidth: '140',
        isShow: scope => {
          return this.activeName === '1'
        },
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.delivery ? this.$filters.parseTime(scope.row.delivery, '{y}-{m}-{d} {h}:{i}') : '-'
        }
      }
    }
    let operatesList = [
      {
        label: '重新抽纱',
        isShow: () => {
          return this.activeName === '1'
        },
        permitTag: ['aps-center:grayYarn:redo'],
        handle: scope => {
          // this.$router.push({ name: 'drawnwork-detail' })
          this.whetherReDraw({ reduceId: scope.row.id })
        }
      },
      {
        label: '查看',
        isShow: () => {
          return this.activeName === '0'
        },
        permitTag: ['aps-center:grayYarn:info'],
        handle: scope => {
          this.$router.push({ name: 'drawnwork-detail', query: { id: scope.row.id }})
        }
      }
    ]
    operatesList = this.$filterPermission(operatesList)
    const operates = {
      label: '操作',
      width: '110',
      fixed: 'right',
      dataSource: operatesList
    }
    const pagination = {
      currentChange: val => {
        console.log('current', val)
        this.grayYarnPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.grayYarnPage({ pageNum: 1, pageSize: val })
      }
    }
    return {
      searchData,
      formOtions: { inline: true, size: 'small', layout: true },
      searchFormDatas: {},

      activeName: '0',
      statusArr: [
        { value: '0', label: '待抽纱', count: 0 },
        { value: '1', label: '已抽纱', count: 0 }
      ],

      columns,
      pagination,
      dataSource: [],
      // handledOperates,
      operates,

      headerCellStyle: { 'background-color': '#F5F7FA', 'height': '44px' }
    }
  },
  created() {
    this.grayYarnPage()
    this.grayYarnPageCount()
  },
  methods: {
    // 状态tab切换事件
    statusClick() {
      // console.log(this.activeName)
      // const flag = this.activeName === '0'
      // this.operates = flag ? null : this.handledOperates
      this.grayYarnPage()
      this.grayYarnPageCount()
    },
    // 抽纱按钮
    drawnworkClick() {
      this.$router.push({ name: 'drawnwork-detail' })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawnwork-index {
  padding: 20px;

  // .commonTabs {
  //   background-color: #fff;
  //   padding: 5px 0 0;
  //   .el-tabs__nav-scroll {
  //     padding: 0 20px;
  //   }
  //   .el-tabs__item {
  //     line-height: 36px;
  //     font-size: 14px;
  //   }
  //   .el-tabs__nav-wrap::after {
  //     height: 1px;
  //   }
  //   .el-tabs__header {
  //     margin-bottom: 0;
  //   }
  // }
}
</style>
<style lang="scss">
  .drawnwork-index {
    .commonTabs {
      background-color: #fff;
      padding: 20px 0 0;
      .el-tabs__nav-scroll {
        padding: 0 20px;
      }
      .el-tabs__item {
        line-height: 20px;
        font-size: 14px;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__header {
        margin-bottom: 0;
      }
    }

    .tab-group {
      position: relative;
      padding-bottom: 1px;
      .right-button {
        position: absolute;
        right: 20px;
        top: 14px;
      }
    }

    // tbody .el-table__row td {
    //   border-bottom-width: 1px;
    // }

    .cell-item-style {
      // height: 49px;
      padding: 13px 10px;
      &:not(:last-child) {
        border-bottom: 1px solid #dfe6ec;
      }

      // line-height: 49px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    td.cellBorderBottom {
      .cell {
        width: 100%!important;
        padding: 0;
      }
    }

    .el-table__row td {
      padding: 0;
    }

    .pop-table {
      background-color: #fff;
      padding: 0 10px 10px;
    }
  }
</style>
