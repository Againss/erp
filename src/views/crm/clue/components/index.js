import * as api from '../api/index'
import { customerLevelList } from '../../system-settings/customer-level-options/api/index.js'
import { customerTypeList } from '../../system-settings/customer-type-options/api/index.js'
import { winRateList } from '../../system-settings/winning-rate-of-business/api/index'
import { customerList } from '../../customer/api/index.js'
export const Clue = {
  methods: {
    // 获取线索详情并显示
    async getClueInfoDisplay(data = {}) {
      const res = await api.cluesInfo(data)
      console.log('详情', res)
      const gender = res.data.gender && res.data.gender === 'M' ? '男' : '女'
      const status = {
        'U': '未跟进',
        'F': '跟进中',
        'C': '关闭',
        'T': '已转化'
      }
      switch (res.data.clueStaus) {
        case 'U':
          this.closedState = -1
          this.onGoingStatus = 0
          break
        case 'F':
          this.closedState = -1
          this.onGoingStatus = 1
          break
        case 'T':
          this.closedState = -1
          this.onGoingStatus = 2
          break
        case 'C':
          this.closedState = 0
          this.onGoingStatus = -1
          break

        default:
          break
      }
      this.clueStaus = res.data.clueStaus
      const clueStaus = res.data.clueStaus && status[res.data.clueStaus]
      const createdTime = res.data.createdTime && this.$filters.parseTime(res.data.createdTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const updatedTime = res.data.updatedTime && this.$filters.parseTime(res.data.updatedTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      // this.follower = res.data.follower
      this.clueFormDatas = { ...res.data, createdTime, updatedTime, gender, clueStaus }
      //   this.setFormDatas(this.cluePopOptions, res.data)
    },

    // 获取线索详情
    async getTransformClueInfo(data = {}) {
      const res = await api.cluesInfo(data)
      console.log('详情', res)
      this.setFormDatas(this.transformPopOptions, res.data)
      // this.clueName = res.data.clueName
    },

    // 点击更改所有人
    async okClick(params) {
      // console.log(params)
      const res = await api.cluesModifyFollower({ ...params, id: this.routeId })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('更改所有人成功')
      // this.$emit('visibleClick', false)
      this.$set(this.OwnerPopOptions, 'visible', false)
      // console.log(this.visible)
      this.getClueInfoDisplay({ id: this.routeId })
    },

    // 获取全部客户级别
    async getCustomerLeveList(data = {}) {
      const res = await customerLevelList(data)
      console.log('级别', res)
      this.customerleveList = res.data
      const leve = res.data ? res.data.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      }) : []
      // this.searchData && this.$set(this.searchData[2], 'dataSource', [{ value: null, label: '全部商机阶段' }, ...leve])
      this.$set(this.transformPopOptions.content[3], 'dataSource', leve)
    },

    // 获取全部客户类型
    async getCustomerTypeList(data = {}) {
      const res = await customerTypeList(data)
      console.log('类型', res)
      this.customerTypeList = res.data
      const type = res.data.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
      // this.searchData && this.$set(this.searchData[2], 'dataSource', [{ value: null, label: '全部商机阶段' }, ...type])
      this.$set(this.transformPopOptions.content[4], 'dataSource', type)
    },

    // 获取商机阶段
    async getBusinessOpportunityStage(data = {}) {
      const res = await winRateList(data)
      console.log('商机阶段', res)
      this.businessOpportunityStage = res.data
      const stage = res.data.map(item => {
        return {
          value: item.id,
          label: item.businessStage
        }
      })
      // this.searchData && this.$set(this.searchData[2], 'dataSource', [{ value: null, label: '全部商机阶段' }, ...stage])
      this.$set(this.transformPopOptions.content[11], 'dataSource', stage)
    },
    // 商机阶段切换事件
    stageChange(value) {
      console.log(value)
      this.$set(this.transformPopOptions.formDatas, 'probability', this.businessOpportunityStage.filter(item => item.id === value)[0].rate + '%')
    },

    // 查询是否有重复客户名称
    async customerRepeat(data = {}) {
      const res = await customerList(data)
      console.log('是否重复', res)
      const unrepeatStyle = {
        'width': '100%',
        'font-size': '12px',
        'background-color': '#eee',
        'textAlign': 'center',
        'padding': '5px',
        'margin-bottom': '15px'
      }
      if (res.data) {
        this.$set(this.transformPopOptions.content[0], 'text', '查询到重复客户名称，转化后将在已有客户下新建联系人、商机')
        this.$set(this.transformPopOptions.content[0], 'style', { ...unrepeatStyle, 'color': '#FF0000' })
      } else {
        this.$set(this.transformPopOptions.content[0], 'text', '未查询到重复客户名称，转化后将新建客户及关联的联系人和商机')
        this.$set(this.transformPopOptions.content[0], 'style', { ...unrepeatStyle, 'color': '#009900' })
      }
    },

    // 转化线索
    async transformationClue(data = {}) {
      const res = await api.cluesTransform(data)
      console.log('转化', res)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('线索转化成功')
      this.closePopDialogHandle(this.transformPopOptions)
      this.getClueInfoDisplay({ id: this.routeId })
    },

    // 线索状态修改
    async clueStausModify(data = {}) {
      const res = await api.cluesModifyClueStaus({ id: this.routeId, ...data })
      console.log('线索状态修改', res)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('线索状态修改成功')
      this.getClueInfoDisplay({ id: this.routeId })
    }

  }
}
