<template>
  <div v-if="dashboardtype" class="homePage crm-background-color">
    <div v-if="dashboardtype === 3" class="no-permission">
      <i class="el-icon-sugar" style="font-size: 40px;margin-bottom: 15px;" />
      <div>请联系管理员开通仪表盘</div>
    </div>
    <div v-else class="homePageContent">
      <div class="item">
        <div class="item-title line">
          <span class="small-title">{{ dashboardtype === 2 ? '' : '我的' }}业务统计</span>
          <!-- 搜索表单 -->
          <div>
            <cs-custom-form v-if="dashboardtype === 2" ref="searchForm" :data-source="statisticsSearchData" :options="formOtions" :form-datas="formDatas" />
          </div>
        </div>
        <div class="item-content">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content content-padding">
                <span>昨日新增线索总数</span>
                <p class="green">{{ statisticsListY.cluesIncrNum || 0 }}</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content content-padding">
                <span>昨日新增商机总数</span>
                <p class="orange">{{ statisticsListY.businessOpportunityIncrNum || 0 }}</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content content-padding">
                <span>昨日新增客户总数</span>
                <p class="blue">{{ statisticsListY.customerIncrNum || 0 }}</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content content-padding">
                <span>昨日新增联系人总数</span>
                <p class="lightBlue">{{ statisticsListY.contactPersonIncrNum || 0 }}</p>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content content-padding">
                <span>今日新增线索总数</span>
                <p class="green">{{ statisticsListT.cluesIncrNum || 0 }}</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content content-padding">
                <span>今日新增商机总数</span>
                <p class="orange">{{ statisticsListT.businessOpportunityIncrNum || 0 }}</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content content-padding">
                <span>今日新增客户总数</span>
                <p class="blue">{{ statisticsListT.customerIncrNum || 0 }}</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content content-padding">
                <span>今日新增联系人总数</span>
                <p class="lightBlue">{{ statisticsListT.contactPersonIncrNum || 0 }}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="item">
        <div style="margin-bottom: -5px;" class="item-title small-title">{{ dashboardtype === 2 ? '' : '我的' }}仪表盘</div>
        <div class="item-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="grid-content">
                <div class="item-chart">
                  <div class="chart-title">
                    <div class="left">{{ dashboardtype === 2 ? '' : '本年 ' }}销售目标</div>
                    <div class="right">完成情况</div>
                  </div>
                  <div class="chart-select">
                    <!-- 搜索表单 -->
                    <div>
                      <cs-custom-form v-if="dashboardtype === 2" ref="searchForm" :data-source="salesTargetSearchData" :options="formOtions" :form-datas="salesTargetFormDatas" />
                    </div>
                  </div>
                  <div class="chart-item">
                    <bar-chart :charts-option="statisticsOption" />
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <div class="item-chart">
                  <div class="chart-title">
                    <div class="left">{{ dashboardtype === 2 ? '' : '本年 ' }}商机阶段</div>
                    <div class="right">漏斗</div>
                  </div>
                  <div class="chart-select">
                    <div>
                      <cs-custom-form v-if="dashboardtype === 2" ref="searchForm" :data-source="stageSearchData" :options="formOtions" :form-datas="stageFormDatas" />
                    </div>
                  </div>
                  <div class="chart-item">
                    <bar-chart :charts-option="stageOption" />
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="item-content">
          <el-row :gutter="20">
            <el-col v-if="dashboardtype === 2" :span="12">
              <div class="grid-content">
                <div class="item-chart">
                  <div class="chart-title">
                    <div class="left">商机销售金额</div>
                    <div class="right">排行傍</div>
                  </div>
                  <div class="chart-select">
                    <div class="left">
                      <cs-custom-form ref="searchForm" :data-source="moneySearchData" :options="formOtions" :form-datas="moneyFormDatas" />
                    </div>
                  </div>
                  <div class="chart-item">
                    <bar-chart :charts-option="moneyOption" />
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <div class="item-chart">
                  <div class="chart-title">
                    <div class="left">{{ dashboardtype === 2 ? '' : '本年 ' }}商机销售金额</div>
                    <div class="right">趋势</div>
                  </div>
                  <div class="chart-select">
                    <div>
                      <cs-custom-form v-if="dashboardtype === 2" ref="searchForm" :data-source="trendSearchData" :options="formOtions" :form-datas="trendFormDatas" />
                    </div>
                  </div>
                  <div class="chart-item">
                    <bar-chart :charts-option="trendOption" />
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import lineChart from './components/line-chart'
// import funnelChart from './components/funnel-chart'
// import categoryChart from './components/category-chart'
import echarts from 'echarts'
import barChart from './components/bar-chart'
import { PublicCrm } from '@/views/crm/public/index'
import { HomePage } from './components/index.js'
export default {
  components: { barChart },
  mixins: [HomePage, PublicCrm],
  data() {
    // const oldsysOrgList = [...this.oldsysOrgList]
    // 业务统计
    const statisticsSearchData = [
      {
        prop: 'type',
        itemType: 'select',
        change: this.statisticsChange,
        // label: '范围:',
        dataSource: [
          {
            value: 'DEP',
            label: '部门'
          },
          {
            value: 'EME',
            label: '人员'
          }
        ]
      },
      {
        prop: 'ids',
        itemType: 'select',
        change: this.statisticsListChange,
        // label: '范围:',
        dataSource: []
      }
    ]
    // 销售目标
    const salesTargetSearchData = [
      {
        prop: 'year',
        itemType: 'select',
        itemStyle: { width: '30%' },
        // change: this.salesTargetChange,
        // itemStyle: { 'width': '31%' },
        // label: '范围:',
        dataSource: [
          {
            value: '2020',
            label: '本年'
          }
        ]
      },
      {
        prop: 'type',
        itemType: 'select',
        itemStyle: { width: '30%' },
        change: this.departmentChange,
        // itemStyle: { 'width': '31%' },
        // label: '范围:',
        dataSource: [
          {
            value: 2,
            label: '部门'
          },
          {
            value: 1,
            label: '人员'
          }
        ]
      },
      {
        prop: 'userIdsOrOrgIds',
        itemType: 'select',
        itemStyle: { width: '30%' },
        change: this.listChange,
        // itemStyle: { 'width': '31%' },
        // label: '范围:',
        dataSource: []
      }
    ]
    // 商机阶段
    const stageSearchData = [
      {
        prop: 'year',
        itemType: 'select',
        // label: '范围:',
        itemStyle: { width: '30%' },
        dataSource: [
          {
            value: '2020',
            label: '本年'
          }
        ]
      },
      {
        prop: 'type',
        itemType: 'select',
        change: this.departmentChange,
        itemStyle: { width: '30%' },
        // label: '范围:',
        dataSource: [
          {
            value: 2,
            label: '部门'
          },
          {
            value: 1,
            label: '人员'
          }
        ]
      },
      {
        prop: 'userIdsOrOrgIds',
        itemType: 'select',
        itemStyle: { width: '30%' },
        change: this.listChange,
        // label: '范围:',
        dataSource: []
      }
    ]
    // 销售金额
    const moneySearchData = [
      {
        prop: 'type',
        itemType: 'select',
        itemStyle: { width: '30%' },
        change: this.moneyChange,
        // label: '范围:',
        dataSource: [
          {
            value: 1,
            label: '本月'
          },
          {
            value: 2,
            label: '本季'
          },
          {
            value: 3,
            label: '本年'
          }
        ]
      },
      {
        prop: 'orgIds',
        itemType: 'select',
        itemStyle: { width: '30%' },
        change: this.moneyListChange,
        // label: '范围:',
        dataSource: []
      }
      // {
      //   prop: 'ids',
      //   itemType: 'select',
      //   // label: '范围:',
      //   dataSource: []
      // }
    ]
    // 销售趋势
    const trendSearchData = [
      {
        prop: 'year',
        itemType: 'select',
        itemStyle: { width: '30%' },
        // label: '范围:',
        dataSource: [
          {
            value: '2020',
            label: '本年'
          }
        ]
      },
      {
        prop: 'type',
        itemType: 'select',
        itemStyle: { width: '30%' },
        change: this.departmentChange,
        // label: '范围:',
        dataSource: [
          {
            value: 2,
            label: '部门'
          },
          {
            value: 1,
            label: '人员'
          }
        ]
      },
      {
        prop: 'userIdsOrOrgIds',
        change: this.listChange,
        itemType: 'select',
        itemStyle: { width: '30%' },
        // label: '范围:',
        dataSource: []
      }
    ]

    // 销售目标图表信息
    const statisticsOption = {
      series: [
        {
          name: '销售目标金额',
          type: 'bar',
          stack: '金额',
          data: []
        },
        {
          name: '商机赢单金额',
          type: 'bar',
          stack: '金额',
          data: []
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        textStyle: {
          align: 'left'
        }
        // trigger: 'item',
        // formatter: data => {
        //   // console.log(data)
        //   const ins = data.name + '<br/>' + data.seriesName + '  ' + data.data
        //   return ins
        // }
      },
      grid: {
        bottom: 40
      },
      legend: {
        x: 'center',
        y: 'bottom',
        // bottom: '0',
        // padding: [0, 0, -5, 0],
        data: ['销售目标金额', '商机赢单金额']
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        splitLine: {
          show: false
        }
      },
      yAxis: {
        axisLine: {
          show: true
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted',
            color: '#ececec'
          }
        }
      }
    }

    // 商机阶段图表信息
    const stageOption = {
      series: [
        {
          type: 'funnel',
          left: '20%',
          width: '60%',
          colors: ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#9692ff'],
          data: [],
          label: {
            show: true,
            color: '#8C8C8C',
            position: 'right',
            formatter: ('{b} {c}')
          }
        },
        {
          type: 'funnel',
          left: '20%',
          width: '60%',
          z: 2,
          colors: ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#9692ff'],
          data: [],
          label: {
            show: true,
            position: 'inside',
            formatter: ('{d}%')
          }
        }
      ],
      title: {
        // show: true,
        // text: '132'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} \t {c} , {d}%'
      },
      grid: {
        bottom: 40
        // right: 200
      },
      legend: {
        x: 'center',
        y: 'bottom',
        // bottom: '0',
        // padding: [0, 0, -5, 0],
        data: ['初步接洽', '需求确定', '方案/报价', '商务谈判', '贏单', '输单']
      },
      xAxis: {
        // {
        //   type: 'category',
        //   data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        // }
        axisLine: {
          show: true
        }
      },
      yAxis: {
        axisLine: {
          show: true
        }
      }
    }

    // 商机销售金额图表信息
    const moneyOption = {
      series: [
        {
          name: '商机销售金额',
          type: 'bar',
          // colors: ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#9692ff'],
          data: []
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        textStyle: {
          align: 'left'
        }
      },
      grid: {
        bottom: 40
      },
      legend: {
        x: 'center',
        y: 'bottom',
        // bottom: '0',
        // padding: [0, 0, -5, 0],
        data: ['商机销售金额']
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted',
            color: '#ececec'
          }
        }
        // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: [],
        splitLine: {
          show: false
        }
        // axisLine: {
        //   show: true
        // }
      }
    }

    // 商机销售趋势图表信息
    const trendOption = {
      series: [
        {
          name: '销售目标金额',
          type: 'line',
          stack: '金额',
          data: [],
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0,179,244,0.3)'
              },
              {
                offset: 1,
                color: 'rgba(0,179,244,0)'
              }
              ], false),
              shadowColor: 'rgba(0,179,244, 0.9)',
              shadowBlur: 20
            }
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        textStyle: {
          align: 'left'
        }
      },
      grid: {
        bottom: 40
      },
      xAxis: {
        type: 'category',
        splitLine: {
          show: false
        },
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        axisLine: {
          show: true
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted',
            color: '#ececec'
          }
        }
      }
    }
    return {
      statisticsSearchData,
      salesTargetSearchData,
      stageSearchData,
      moneySearchData,
      trendSearchData,
      // business: {
      //   department: ''
      // },
      formOtions: {
        inline: true
      },
      formDatas: {
        type: 'DEP',
        ids: null
      },
      moneyFormDatas: {
        target: 'money',
        type: 1,
        orgIds: null
      },
      salesTargetFormDatas: {
        target: 'salesTarget',
        type: 2,
        year: '2020',
        userIdsOrOrgIds: null
      },
      stageFormDatas: {
        target: 'stage',
        type: 2,
        year: '2020',
        userIdsOrOrgIds: null
      },
      trendFormDatas: {
        target: 'trend',
        type: 2,
        year: '2020',
        userIdsOrOrgIds: null
      },
      dashboard: {},
      sysOrgList: [],
      // oldsysOrgList,
      userList: [],
      statisticsListY: {},
      statisticsListT: {},
      statisticsOption,
      stageOption,
      moneyOption,
      trendOption,
      dashboardtype: null
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.userId
    }
  },
  async created() {
    this.getDashboardType({ userId: this.userId })
    // await this.getSysOrgList({ functionTag: 'SAL' }, 'all')
    // this.getQueryStatictisDataY({ ids: this.sysOrgList, tag: 'Y' })
    // this.getQueryStatictisDataT({ ids: this.sysOrgList, tag: 'T' })
    // this.getQuerySalesTargetHistogram({ type: 2, year: 2020, userIdsOrOrgIds: this.sysOrgList })
    // this.getQueryBusinessStageBucket({ type: 2, year: 2020, userIdsOrOrgIds: this.sysOrgList })
    // this.getQueryBusinessStageHistogram({ type: 1, orgIds: this.sysOrgList })
    // this.getQuerySalesAmountsLine({ type: 2, year: 2020, userIdsOrOrgIds: this.sysOrgList })
    // this.getSysUserList({ orgIds: this.sysOrgList })
  }
}
</script>

<style lang="scss">
// html,body,.app-main,.main-container {
//   height: 100%;
// }
.homePage {
  // height: 100%;
  // background: #F1F7FB;
  .item {
    margin-bottom: 10px;
    .item-title {
      padding-bottom: 30px;
      padding-left: 9px;
      // padding: 16px 0;
      span {
        // margin-right: 10px;
      }
      .el-select {
        width: 120px;
        margin-right: 0px;
      }
    }
    .item-content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      // padding: 20px 0 0 0;
      .el-row {
        width: 100%;
        margin: 0 0 20px 0!important;
        .el-col {
          text-align: center;
          .grid-content {
            background: #fff;
            span {
              display: block;
              font-size: 16px;
              color: #888E9E ;
            }
            p {
              font-size: 40px;
              font-weight: 400;
              margin-bottom: 0;
              margin-top: 15px;
            }
            .green{
              color: #18C66F;
            }
            .orange{
              color: #FF8F06;
            }
            .blue{
              color: #24ACFF;
            }
            .lightBlue{
              color: #07B9D9;
            }
            .item-chart {
              .chart-title {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #EEEFF0;
                padding: 16px 0;
                .left {
                  font-size: 16px;
                  margin-left: 16px;
                }
                .right {
                  font-size: 14px;
                  color: #717171;
                  margin-right: 16px;
                }
              }
            }
            .chart-select {
              padding-top: 16px;
              .el-select {
                width: 26%;
                margin: 0 10px;
              }
            }
            .chart-item {
              padding: 20px;
            }
          }
          .content-padding {
            padding: 22px 0;
          }
        }
      }
    }
  }
  .homePageContent {
    padding: 20px;
  }

  .line {
    display: flex;
    align-items: center;
    .el-form--inline {
      align-items: center;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .el-form--inline {
    justify-content: center;
  }
  .left .el-form--inline {
    justify-content: left;
    margin-left: 20px;
  }
  .no-permission {
    width: 100%;
    position: absolute;
    margin-top: 300px;
    // display: flex;
    // padding-top: 24%;
    // padding-bottom: 24%;
    text-align: center;
    // height: 100%;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .small-title {
    font-size: 18px;
    margin-right: 10px;
  }
  .el-form--inline .el-form-item {
    margin-right: 15px;
  }
}
</style>
