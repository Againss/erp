import * as api from '../api/index'
import { cluesFromList } from '../../system-settings/clue-source-options/api/index'
export const ClueRelevant = {
  methods: {
    // 获取线索分页列表
    async getCluePage(data = {}) {
      const res = await api.cluesPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('线索', res)
      const userList = res.data.list || []
      //   this.dataSource = userList
      this.clueDataSource = userList
      this.clueTotal = res.data.total
      this.relevantClueOptions && this.$set(this.relevantClueOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑线索
    addOrEditClue(data) {
      if (this.type === 'add') {
        this.addClue(data)
      } else if (this.type === 'edit') {
        this.editClue(data)
      }
    },

    // 添加线索
    async addClue(data = {}) {
      const res = await api.cluesAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.cluePopOptions, 'visible', false)
      this.closePopDialogHandle(this.cluePopOptions)
      this.$message.success('添加成功')
      this.getCluePage()
    },

    // 编辑线索
    async editClue(data = {}, flag) {
      const res = await api.cluesModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.cluePopOptions, 'visible', false)
      this.closePopDialogHandle(this.cluePopOptions)
      this.$message.success('编辑成功')
      if (flag) {
        this.getClueInfoDisplay({ id: this.routeId })
      } else {
        this.getCluePage()
      }
    },

    // 删除线索
    async deleteClue(data = {}, flag) {
      const res = await api.cluesDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      if (flag) {
        this.$router.back()
      } else {
        this.getCluePage()
      }
    },

    // 获取线索详情
    async getClueInfo(data = {}) {
      const res = await api.cluesInfo(data)
      console.log('详情', res)
      const clueDate = this.$filters.parseTime(res.data.clueDate + '', '{y}-{m}-{d} {h}:{i}:{s}')
      const startTime = this.$filters.parseTime(res.data.startTime + '', '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = this.$filters.parseTime(res.data.endTime + '', '{y}-{m}-{d} {h}:{i}:{s}')
      this.setFormDatas(this.cluePopOptions, { ...res.data, clueDate, startTime, endTime })
    },

    // 获取线索来源选项列表
    async getClueSourceOptions(data = {}) {
      const res = await cluesFromList(data)
      console.log('线索来源选项', res)
      const dataList = res.data || []
      const options = dataList.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
      this.$set(this.cluePopOptions.content[5], 'dataSource', options)
    }

  }
}
