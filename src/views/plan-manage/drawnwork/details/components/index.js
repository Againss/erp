import * as api from '../api/index'
export const DrawnworkDetails = {
  methods: {
    // 获取试纱详情
    async getGrayYarnInfo(data = {}) {
      const res = await api.grayYarnInfo({ ...this.searchFormDatas, reduceId: this.reduceId, ...data })
      const dataInfo = res.data || {}
      console.log(dataInfo)
      const dataList = dataInfo.list || [] // 拿到抽纱列表
      const recordList = dataInfo.recordList || [] // 拿到已抽纱列表
      this.dataSource = dataList
      this.drawnworkDataSourceCopy = recordList.length ? recordList.map(item => {
        return {
          ...item,
          lastLockNum: item.lockNum
        }
      }) : []

      const checkedList = dataList.filter(item => +item.status !== 0)
      // 划扣的选中进来就选中状态
      console.log(this.$refs.yarnTable.$children[0].$children[0])
      const tableRef = this.$refs.yarnTable.$children[0].$children[0]
      // this.$nextTick(() => {
      //   tableRef.toggleRowSelection(checkedList, true)
      // })
      // setTimeout(() => {
      //   tableRef.toggleRowSelection(checkedList, true)
      // }, 0)
      checkedList.forEach(item => {
        setTimeout(() => {
          tableRef.toggleRowSelection(item, true)
        }, 0)
      })
    },

    // 点击抽纱按钮弹出框
    drawnworkClick() {
      if (this.checkedYarnList.length) {
        this.popOptions.visible = true
        // 获取
        const checkedDataSource = this.checkedYarnList.map(item => {
          return {
            ...item,
            apsGrayyarnReduceId: item.apsGrayyarnReduceId,
            apsLossDetailYarnId: item.apsLossDetailYarnId,
            orderNo: item.orderNo,
            yarnCode: item.yarnCode,
            yarnNum: item.yarnNum,
            lastTotalLockNum: item.lockNum,
            lockNum: '',
            edit: true,
            lockNumEdit: true
          }
        })
        const yarnCodeGroup = this.checkedYarnList.map(item => item.yarnCode).join('、')
        // 不加nextTick第一次打开不更新, 第二次打开更新第一次的
        this.$nextTick(() => {
          this.popOptions.popFormOptions.formDatas = { yarnCode: yarnCodeGroup }
          this.$set(this.popOptions.footerComponentOption, 'dataSource', checkedDataSource)
        })
        this.getGrayYarnStockList({ yarnCode: yarnCodeGroup })
      } else {
        this.$message.warning('请先选择抽纱列表')
      }
    },

    // 编辑事件
    drawnworkEdit() {
      const drawnworkList = this.drawnworkFormDatas.tableForm
      if (drawnworkList && drawnworkList.length) {
        const flag = drawnworkList.some(item => +item.status !== 1)
        if (flag) {
          this.isDetail = false
        } else {
          this.$message.warning('已抽纱列表都已完成, 不可以编辑')
        }
      } else {
        this.$message.warning('已抽纱列表不存在, 不可以编辑')
      }
    },

    // 取消事件
    drawnworkCancel() {
      this.isDetail = true
    },

    // 保存事件
    drawnworkSave() {
      console.log(this.newDrawnworkFormDatas)
      // if (this.newDrawnworkFormDatas.some(item => !item.lockNum)) {
      //   this.$message.warning('')
      // }
      // const that = this
      this.$refs.drawnworkSearchForm.$children[0].validate((valid) => {
        if (valid) {
          let lessThanFlag = true
          this.newDrawnworkFormDatas.tableForm.forEach(item => {
            item.type = '0'
            if (+item.lockNum > +item.lastLockNum) {
              lessThanFlag = false
            }
          })
          if (lessThanFlag) {
            console.log('保存成功')
            this.grayYarnAddRecord({ addRecordList: this.newDrawnworkFormDatas.tableForm })
          } else {
            this.$message.error('输入数值不得大于之前数值')
          }
        } else {
          // this.$message.error('请输入正确的数值')
          return false
        }
      })
    },

    // 获取抽纱试纱列表
    async getGrayYarnStockList(data = {}) {
      const orderNos = this.checkedYarnList.map(item => item.orderNo)
      const res = await api.grayYarnStockList({ ...this.popsearchFormDatas, orderNos, ...data })
      const dataList = res.data || []
      console.log(dataList)
      dataList.forEach((item, index) => {
        item.sortIndex = index
      })
      this.$set(this.popOptions.popTableOptions, 'dataSource', dataList)
    },

    // 弹出框确认划扣
    async grayYarnAddRecord(data = {}) {
      const res = await api.grayYarnAddRecord(data)
      if (res.data) {
        this.$message.success('划扣成功')

        const api = `/aps/grayYarn/addRecord`
        const opratorType = `SET`
        const description = { beforeText: `在'计划管理-抽纱-抽纱详情'划扣多条记录`, beforeCode: data }
        const appId = 'aps'
        this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api, description, appId })

        this.popOptions.visible = false
        // this.getGrayYarnStockList()
        await this.getGrayYarnInfo()
        this.isDetail = true
      } else {
        this.$message.error(res.message)
      }
    },

    // 完成抽纱
    finishDrawnwork() {
      if (this.checkedYarnList.length) {
        // console.log('调用抽纱接口')
        // const checkedYarnList = this.drawnworkDataSourceCopy.filter(item => ids.includes(+item.apsGrayyarnReduceId))
        const ids = this.checkedYarnList.map(item => item.id)
        this.grayYarnConfirmDone({ grayYarnIds: ids })
      } else this.$message.warning('请选择抽纱')
    },

    // 抽纱详情完成抽纱
    async grayYarnConfirmDone(data = {}) {
      const res = await api.grayYarnConfirmDone(data)
      if (res.data) {
        this.$message.success('完成抽纱成功')

        const api = `/aps/grayYarn/confirmDone`
        const opratorType = `SET`
        const description = { beforeText: `在'计划管理-抽纱-抽纱详情'完成多条抽纱`, beforeCode: data }
        const appId = 'aps'
        this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api, description, appId })

        // this.getGrayYarnInfo()
        this.$router.back()
      } else {
        this.$message.error(res.message)
      }
    },

    // 重新抽纱
    againDrawnwork() {
      this.whetherReDraw()
    },

    // 重新抽纱校验
    async whetherReDraw(data = {}) {
      const res = await api.grayYarnRedo({ reduceId: this.reduceId, ...data })
      if (res.data) {
        // 可以重新抽纱, 跳转到详情页
        // this.$router.push({ name: 'drawnwork-detail', query: { id: data.reduceId }})
        this.getGrayYarnInfo()
      } else {
        this.$message.warning('该条信息不能重新抽纱')
      }
    }
  }
}
