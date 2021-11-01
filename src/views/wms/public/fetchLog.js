export const fetchLog = fetchLog || {
  methods: {
    // 操作日志
    // 传日志信息到卡夫卡
    fetchLog(messages, data, description) {
      this.$store.dispatch('app/fetchLog', { ...messages, params: JSON.stringify(data), description })
    },
    // 日志描述新老数据比对
    compareData(oldData, newData, id) {
      const comparedKeys = Object.keys(newData).filter(item => {
        if (Array.isArray(newData[item])) {
          return JSON.stringify(oldData[item] || []) !== JSON.stringify(newData[item])
        } else {
          return oldData[item] !== newData[item]
        }
      })
      const oldObj = {}
      const newObj = {}
      comparedKeys.forEach(item => {
        oldObj[item] = oldData[item]
        newObj[item] = newData[item]
      })
      return {
        beforeCode: { ...oldObj, [id]: newData[id] },
        afterCode: { ...newObj, [id]: newData[id] }
      }
    },
    // 获取需要传过去的日志信息
    getLogMessages(opratorType, api) {
      const { userInfo, topic } = this.$store.state.user
      const baseURL = this.$store.state.app.baseURL
      const logcommonMessages = {
        type: 'OP',
        appId: 'wms',
        handleResult: 'SUCCESS',
        userId: userInfo.userId,
        realName: userInfo.realName,
        userName: userInfo.name,
        topic: topic,
        description: '',
        createTime: new Date().getTime()
      }
      return {
        ...logcommonMessages,
        opratorType: opratorType,
        api: baseURL + api
      }
    },
    outFun(params) {
      //老数据、新数据、属性、操作类型、url 、beforeText、afterText、remark
      const { oldData, newData, pro, type, url, beforeText, afterText, remark } = params
      if (type === 'DEL' || type === 'INSERT' || type === 'IMPORT') {
        this.fetchLog(
          this.getLogMessages(
            type,
            url,
            pro
          ),
          remark,
          JSON.stringify({
            beforeText: beforeText,
            beforeCode: remark
          })
        )
      } else {
        const { beforeCode, afterCode } = this.compareData(oldData, newData, pro)
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(
          this.getLogMessages(type, url),
          remark,
          JSON.stringify({
            beforeText: beforeText,
            afterText: afterText,
            ...{ beforeCode, afterCode }
          })
        )
      }
    }

  }
}