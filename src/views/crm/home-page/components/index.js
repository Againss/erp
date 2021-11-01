import * as api from '../api/index'
import { dashboardInfo } from '../../system-settings/instrument-cluster-settings/api/index'

export const HomePage = {
  methods: {
    // 查询今日新增数据
    async getQueryStatictisDataT(data = {}) {
      const res = await api.queryStatictisData({ ...this.formDatas, ...data })
      console.log('昨日今日', res)
      this.statisticsListT = res.data || {}
    },
    // 查询昨天新增数据
    async getQueryStatictisDataY(data = {}) {
      const res = await api.queryStatictisData({ ...this.formDatas, ...data })
      console.log('昨日今日', res)
      this.statisticsListY = res.data || {}
    },

    // 查询销售目标完成情况
    async getQuerySalesTargetHistogram(data = {}) {
      if (data.userIdsOrOrgIds.length !== 0) {
        const res = await api.querySalesTargetHistogram(data)
        console.log('销售目标', res)
        this.$set(this.statisticsOption.series[0], 'data', res.data ? res.data.salesTargetAmounts.map(item => item !== 0 ? item / 10000 : 0) : [])
        this.$set(this.statisticsOption.series[1], 'data', res.data ? res.data.winSalesAmounts.map(item => item !== 0 ? item / 10000 : 0) : [])
      }
    },

    // 查询 漏斗
    async getQueryBusinessStageBucket(data = {}) {
      if (data.userIdsOrOrgIds.length !== 0) {
        const res = await api.queryBusinessStageBucket(data)
        console.log('商机阶段', res)
        const dataList = res.data || []
        const newArray = dataList.map(item => {
          return {
            name: item.name,
            value: item.total
          }
        })
        this.$set(this.stageOption.series[0], 'data', newArray)
        this.$set(this.stageOption.series[1], 'data', newArray)
      }
    },

    // 查询商机销售金额 排行榜
    async getQueryBusinessStageHistogram(data = {}) {
      if (data.orgIds.length !== 0) {
        const res = await api.queryBusinessStageHistogram(data)
        console.log('排行榜', res)
        const dataList = res.data || []
        let newArray = []
        if (dataList.length > 5) {
          newArray = dataList.slice(0, 5)
        } else {
          newArray = dataList
        }
        const names = newArray.map(item => item.name)
        const dataArray = newArray.map(item => {
          return item.total !== 0 ? (item.total / 10000) : 0
        })
        this.$set(this.moneyOption.series[0], 'data', dataArray)
        this.$set(this.moneyOption.yAxis, 'data', names)
      }
    },

    // 查询商机销售金额 趋势
    async getQuerySalesAmountsLine(data = {}) {
      if (data.userIdsOrOrgIds.length !== 0) {
        const res = await api.querySalesAmountsLine(data)
        console.log('趋势', res)
        const dataList = res.data || []
        this.$set(this.trendOption.series[0], 'data', dataList.map(item => {
          return item !== 0 ? item / 10000 : 0
        }))
      }
    },

    // 查询组织机构
    async getSysOrgList(data = {}, flag) {
      const res = await api.sysOrgList(data)
      console.log('组织机构', res)
      // if (res.data === null) {
      //   this.$message.info('无组织机构')
      //   return false
      // }
      const dataList = res.data || []
      this.sysOrgList = dataList.map(item => item.orgId)
      const dataArray = dataList.map(item => {
        return {
          label: item.name,
          value: item.orgId
        }
      });
      (flag === 'all' || flag === 'statistics') && this.$set(this.statisticsSearchData[1], 'dataSource', [{ label: '全部部门', value: null }, ...dataArray]);
      (flag === 'all' || flag === 'salesTarget') && this.$set(this.salesTargetSearchData[2], 'dataSource', [{ label: '全部部门', value: null }, ...dataArray]);
      (flag === 'all' || flag === 'stage') && this.$set(this.stageSearchData[2], 'dataSource', [{ label: '全部部门', value: null }, ...dataArray]);
      (flag === 'all' || flag === 'money') && this.$set(this.moneySearchData[1], 'dataSource', [{ label: '全部部门', value: null }, ...dataArray]);
      (flag === 'all' || flag === 'trend') && this.$set(this.trendSearchData[2], 'dataSource', [{ label: '全部部门', value: null }, ...dataArray])
    },

    // 查询人员
    async getSysUserList(data = {}, searchData, num) {
      const res = await api.sysUserList(data)
      console.log('人员', res)
      const dataList = res.data ? res.data.list : []
      this.userList = dataList.map(item => item.userId)
      const dataArray = dataList.map(item => {
        return {
          label: item.realName,
          value: item.userId
        }
      })
      //   console.log(dataArray, searchData)
      this.$set(searchData[num], 'dataSource', dataArray)
    //   this.$set(searchData[2], 'dataSource', dataArray)
    },

    // 获取仪表盘类型
    async getDashboardType(data = {}) {
      const res = await dashboardInfo(data)
      console.log('仪表盘类型', res)
      if (res.data) {
        this.dashboardtype = res.data.type
        if (res.data.type === 2) {
          await this.getSysOrgList({ functionTag: 'SAL' }, 'all')
          if (this.sysOrgList.length !== 0) {
            this.getQueryStatictisDataY({ ids: this.sysOrgList, tag: 'Y' })
            this.getQueryStatictisDataT({ ids: this.sysOrgList, tag: 'T' })
            this.getQuerySalesTargetHistogram({ type: 2, year: 2020, userIdsOrOrgIds: this.sysOrgList })
            this.getQueryBusinessStageBucket({ type: 2, year: 2020, userIdsOrOrgIds: this.sysOrgList })
            this.getQueryBusinessStageHistogram({ type: 1, orgIds: this.sysOrgList })
            this.getQuerySalesAmountsLine({ type: 2, year: 2020, userIdsOrOrgIds: this.sysOrgList })
          }
        } else {
          this.getQueryStatictisDataY({ ids: [this.userId], type: 'EME', tag: 'Y' })
          this.getQueryStatictisDataT({ ids: [this.userId], type: 'EME', tag: 'T' })
          this.getQuerySalesTargetHistogram({ type: 1, year: 2020, userIdsOrOrgIds: [this.userId] })
          this.getQueryBusinessStageBucket({ type: 1, year: 2020, userIdsOrOrgIds: [this.userId] })
          //   this.getQueryBusinessStageHistogram({ type: 1, orgIds: this.sysOrgList })
          this.getQuerySalesAmountsLine({ type: 1, year: 2020, userIdsOrOrgIds: [this.userId] })
        }
      } else {
        this.dashboardtype = 3
      }
    },

    // 业务统计部门/人员select框change事件
    async statisticsChange(value, form, formDatas, setFormDatas) {
      if (value === 'DEP') {
        await this.getSysOrgList({ functionTag: 'SAL' }, 'statistics')
        this.getQueryStatictisDataY({ type: value, ids: this.sysOrgList, tag: 'Y' })
        this.getQueryStatictisDataT({ type: value, ids: this.sysOrgList, tag: 'T' })
        setFormDatas({ ids: null })
      } else {
        await this.getSysUserList({ orgIds: this.sysOrgList }, this.statisticsSearchData, 1)
        this.getQueryStatictisDataY({ type: value, ids: [this.userList[0]], tag: 'Y' })
        this.getQueryStatictisDataT({ type: value, ids: [this.userList[0]], tag: 'T' })
        setFormDatas({ ids: this.userList[0] })
      }
    },
    // 业务统计部门/人员列表select框change事件
    async statisticsListChange(value, form, formDatas, setFormDatas) {
      console.log(formDatas)
      if (value === null) {
        this.getQueryStatictisDataY({ type: 'DEP', ids: this.sysOrgList, tag: 'Y' })
        this.getQueryStatictisDataT({ type: 'DEP', ids: this.sysOrgList, tag: 'T' })
      } else {
        this.getQueryStatictisDataY({ type: formDatas.type, ids: [value], tag: 'Y' })
        this.getQueryStatictisDataT({ type: formDatas.type, ids: [value], tag: 'T' })
      }
    },

    // 销售目标部门/人员select框change事件
    async departmentChange(value, form, formDatas, setFormDatas) {
      console.log(formDatas)
      if (value === 2) {
        switch (formDatas.target) {
          case 'salesTarget':
            await this.getSysOrgList({ functionTag: 'SAL' }, 'salesTarget')
            this.getQuerySalesTargetHistogram({ type: 2, year: 2020, userIdsOrOrgIds: this.sysOrgList })
            break
          case 'stage':
            await this.getSysOrgList({ functionTag: 'SAL' }, 'stage')
            this.getQueryBusinessStageBucket({ type: 2, year: 2020, userIdsOrOrgIds: this.sysOrgList })
            break
            //   case 'money':
            //     await this.getSysOrgList({ functionTag: 'SAL' }, 'money')
            //     this.getQueryBusinessStageHistogram({ type: 2, year: 2020, orgIds: this.sysOrgList })
            //     break
          case 'trend':
            await this.getSysOrgList({ functionTag: 'SAL' }, 'trend')
            this.getQuerySalesAmountsLine({ type: 2, year: 2020, userIdsOrOrgIds: this.sysOrgList })
            break

          default:
            break
        }
        setFormDatas({ userIdsOrOrgIds: null })
      } else {
        switch (formDatas.target) {
          case 'salesTarget':
            await this.getSysUserList({ orgIds: this.sysOrgList }, this.salesTargetSearchData, 2)
            this.getQuerySalesTargetHistogram({ type: value, year: 2020, userIdsOrOrgIds: [this.userList[0]] })
            break
          case 'stage':
            await this.getSysUserList({ orgIds: this.sysOrgList }, this.stageSearchData, 2)
            this.getQueryBusinessStageBucket({ type: value, year: 2020, userIdsOrOrgIds: [this.userList[0]] })
            break
            //   case 'money':
            //     await this.getSysUserList({ orgIds: this.sysOrgList }, this.moneySearchData, 2)
            //     this.getQueryBusinessStageHistogram({ type: value, year: 2020, orgIds: this.sysOrgList })
            //     break
          case 'trend':
            await this.getSysUserList({ orgIds: this.sysOrgList }, this.trendSearchData, 2)
            this.getQuerySalesAmountsLine({ type: value, year: 2020, userIdsOrOrgIds: [this.userList[0]] })
            break

          default:
            break
        }
        setFormDatas({ userIdsOrOrgIds: this.userList[0] })
      }
    },
    // 销售目标部门/人员列表select框change事件
    async listChange(value, form, formDatas, setFormDatas) {
      console.log(formDatas)
      let type, userIdsOrOrgIds
      if (value === null) {
        type = 2
        userIdsOrOrgIds = this.sysOrgList
        // this.getQuerySalesTargetHistogram({ type: 2, year: 2020, userIdsOrOrgIds: this.sysOrgList })
      } else {
        type = formDatas.type
        userIdsOrOrgIds = [value]
        // this.getQuerySalesTargetHistogram({ type: formDatas.type, year: 2020, userIdsOrOrgIds: [value] })
      }
      switch (formDatas.target) {
        case 'salesTarget':
        //   await this.getSysOrgList({ functionTag: 'SAL' }, 'salesTarget')
          this.getQuerySalesTargetHistogram({ type: type, year: 2020, userIdsOrOrgIds: userIdsOrOrgIds })
          break
        case 'stage':
        //   await this.getSysOrgList({ functionTag: 'SAL' }, 'stage')
          this.getQueryBusinessStageBucket({ type: type, year: 2020, userIdsOrOrgIds: userIdsOrOrgIds })
          break
          //   case 'money':
          //     await this.getSysOrgList({ functionTag: 'SAL' }, 'money')
          //     this.getQueryBusinessStageHistogram({ type: 2, year: 2020, orgIds: this.sysOrgList })
          //     break
        case 'trend':
        //   await this.getSysOrgList({ functionTag: 'SAL' }, 'trend')
          this.getQuerySalesAmountsLine({ type: type, year: 2020, userIdsOrOrgIds: userIdsOrOrgIds })
          break

        default:
          break
      }
    },

    // 商机销售金额部门/人员select框change事件
    async moneyChange(value, form, formDatas, setFormDatas) {
      //   console.log(value)
    //   await this.getSysOrgList({ functionTag: 'SAL' }, 'money')
      this.getQueryBusinessStageHistogram({ type: value, orgIds: this.sysOrgList })
      setFormDatas({ orgIds: null })
    },
    // 商机销售金额部门/人员列表select框change事件
    async moneyListChange(value, form, formDatas, setFormDatas) {
      console.log(formDatas)
      if (value === null) {
        this.getQueryBusinessStageHistogram({ type: formDatas.type, year: 2020, orgIds: this.sysOrgList })
      } else {
        this.getQueryBusinessStageHistogram({ type: formDatas.type, year: 2020, orgIds: [value] })
      }
    }

  }
}
