import * as api from '../api/index'
export const determinateBoardDetail = {
  methods: {
    // 获取详情info
    async qaGreySwatchesTaskInfo(data = {}) {
      const res = await api.qaGreySwatchesTaskInfo({ id: this.determinateBoardid, ...data })
      const dataInfo = res.data || {}

      // 需要数据解构
      const { taskNo, qaGreigeSwatchesMaterialInformationList, qaGreigeSwatchesBarInformationList, swatchesUserId, swatchesUserName, swatchesResult, swatchesUserComments, swatchesUserHandledTime, processUserId, processUserName, processUserHandledTime, processUserAuditResult, processUserComments, status, versionInfo, attachmentList, showVersion } = dataInfo

      // 赋值任务编码
      this.taskNumber = taskNo

      // 赋值基础数据
      const attachment = attachmentList ? attachmentList.map((item, index) => {
        return {
          url: item.viewUrl,
          name: item.originalName
        }
      }) : []
      this.baseFormDatas = { ...this.baseFormDatas, ...dataInfo, attachmentPath: attachment }
      // 赋值状态
      this.status = status
      // 赋值原料信息
      qaGreigeSwatchesMaterialInformationList && qaGreigeSwatchesMaterialInformationList.forEach(item => {
        item.edit = this.isEdit
        item.yarnLengthReal = item.yarnLengthRealJson ? JSON.parse(item.yarnLengthRealJson).map(item => item.describe + ':' + item.yarnLoomLength + 'cm').join('|') : ''
        item.yarnLengthRealEdit = this.isEdit
      })
      this.rawMaterialFormDatas = { rawMaterialTable: qaGreigeSwatchesMaterialInformationList || [] }
      // 赋值间条信息
      qaGreigeSwatchesBarInformationList && qaGreigeSwatchesBarInformationList.forEach(item => {
        item.edit = this.isEdit
        item.beforeWashLengthEdit = this.isEdit
        item.afterWashLengthEdit = this.isEdit
      })
      this.intervalFormDatas = { intervalTable: qaGreigeSwatchesBarInformationList || [] }
      // 处理数据 赋值任务动态
      let swatchesResultArr = []
      if (+status === 1) {
        swatchesResultArr = [
          { label: '通过', value: 1 },
          { label: '不通过', value: 2 },
          { label: '递交工艺员', value: 3 }
        ]
      } else if (+status === 2) {
        swatchesResultArr = [
          { label: '通过', value: 1 },
          { label: '不通过', value: 2 }
        ]
      }
      const commonObj = { role: '确板员', handler: swatchesUserName, processTime: swatchesUserHandledTime, swatchesUserName, swatchesUserId, swatchesResult: [1, 2, 3].includes(swatchesResult) ? swatchesResult : '', swatchesUserComments, edit: this.isEdit && +status === 1, swatchesResultEdit: this.isEdit, swatchesUserCommentsEdit: this.isEdit }
      let taskDynamicsArray = [commonObj]
      if (swatchesResult === 3) {
        const tempObj = { role: '工艺员', handler: processUserName, processUserId, processUserName, processTime: processUserHandledTime, swatchesResult: processUserAuditResult || '', swatchesUserComments: processUserComments, edit: this.isEdit && +status === 2, swatchesResultEdit: this.isEdit, swatchesUserCommentsEdit: this.isEdit }
        taskDynamicsArray = [{ ...commonObj, edit: false }, tempObj]
      }
      this.$set(this.taskDynamicsColumnsInfos._swatchesResult.editOptions, 'dataSource', swatchesResultArr)
      // this.taskDynamicsColumnsInfos._swatchesResult.dataSource = swatchesResultArr
      this.taskDynamicsFormDatas = { taskDynamicsTable: taskDynamicsArray }

      // 版本号写入页面
      this.editionValue = 'v' + showVersion
      this.editionArrayData = versionInfo.map(item => {
        return {
          id: item.id,
          label: 'v' + item.showVersion,
          value: 'v' + item.showVersion
        }
      })
    },
    // 获取所有数据并处理完传给后台
    async handleDataToBackstage(data = {}) {
      console.log(this.$refs)
      // 获取基础数据
      const baseData = this.$refs.baseSearchForm.dynamicValidateFormRuleForm
      // const { attachmentPath } = baseData
      // const attachmentName = attachmentPath ? attachmentPath.map(item => item.name).join(',') : ''
      // const attachmentList = attachmentPath ? attachmentPath.map(item => item.url || item.response.data.viewUrl).join(',') : ''
      // 获取原料信息
      const qaGreigeSwatchesMaterialInformationList = this.$refs.rawMaterialSearchForm.dynamicValidateFormRuleForm.rawMaterialTable
      // 获取间条信息
      const qaGreigeSwatchesBarInformationList = this.$refs.intervalSearchForm.dynamicValidateFormRuleForm.intervalTable
      // 获取任务动态信息
      const taskDynamicsData = this.$refs.taskDynamicsSearchForm.dynamicValidateFormRuleForm.taskDynamicsTable
      let swatchesResult = ''
      let swatchesUserComments = ''
      let processUserAuditResult = ''
      let processUserComments = ''
      if (taskDynamicsData.length >= 1) {
        swatchesResult = taskDynamicsData[0].swatchesResult
        swatchesUserComments = taskDynamicsData[0].swatchesUserComments
      }
      if (taskDynamicsData.length === 2) {
        processUserAuditResult = taskDynamicsData[1].swatchesResult
        processUserComments = taskDynamicsData[1].swatchesUserComments
      }
      // const { handler: processUserName, swatchesResult, swatchesUserComments } = taskDynamicsData[0]

      const res = await api.qaGreySwatchesTaskModify({ ...baseData, qaGreigeSwatchesMaterialInformationList, qaGreigeSwatchesBarInformationList, swatchesResult, swatchesUserComments, attachmentPath: '', processUserAuditResult, processUserComments, ...data })
      if (res.data) {
        this.$message.success('保存成功')

        const { beforeCode, afterCode } = this.$utils.compareData(this.baseFormDatas, { ...baseData, qaGreigeSwatchesMaterialInformationList, qaGreigeSwatchesBarInformationList, swatchesResult, swatchesUserComments, processUserAuditResult, processUserComments, ...data }, 'id')
        const api = `/qa/qaGreigeSwatchesTask/modify`
        const opratorType = `UPDATE`
        const description = { beforeText: `在'质量管理-坯布检测-坯布确版详情'`, afterText: `${data.saveOrSubmit === 1 ? this.status + '' === '1' ? '提交' : '审核' : '保存'}`, beforeCode, afterCode }
        const appId = 'qa'
        this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api, description, appId })

        if (data.saveOrSubmit === 1) this.$router.push({ name: 'grey-fabric-determinate-board-page', query: { status: this.status }})
        else {
          this.$router.replace({ query: { id: this.determinateBoardid, type: 'detail' }})
          this.qaGreySwatchesTaskInfo()
        }
        // data.saveOrSubmit === 1 ? this.$router.push({ name: 'grey-fabric-determinate-board-page', query: { status }}) : this.$router.replace({ query: { id: this.determinateBoardid, type: 'detail' }})
      }
    },
    // 数据校验必填
    dataVerification() {
      // 获取基础数据
      const baseData = this.$refs.baseSearchForm.dynamicValidateFormRuleForm
      // 获取原料信息
      const qaGreigeSwatchesMaterialInformationList = this.$refs.rawMaterialSearchForm.dynamicValidateFormRuleForm.rawMaterialTable
      // 获取任务动态信息
      const taskDynamicsData = this.$refs.taskDynamicsSearchForm.dynamicValidateFormRuleForm.taskDynamicsTable
      let text = ''
      if (baseData.width && baseData.widthUnit && baseData.weight) {
        // console.log(111)
      } else {
        text += '坯布规格未填写.'
      }
      qaGreigeSwatchesMaterialInformationList.some(item => {
        if (!item.yarnLengthReal) {
          text += '实测纱长未填写.'
        }
      })
      const { swatchesResult, swatchesUserComments } = taskDynamicsData[0]
      if (!swatchesResult || !swatchesUserComments) {
        text += '确板结果或意见不能为空.'
      }
      if (text !== '') {
        this.$refs.rawMaterialSearchForm.form.validate()
        this.$refs.taskDynamicsSearchForm.form.validate()
      }
      this.$refs.baseSearchForm.form.validate((valid) => {
        if (!valid) {
          text += '基本信息校验输入信息失败.'
        }
      })
      console.log(text)
      return text
    },
    // 详情保存按钮
    save() {
      // this.handleDataToBackstage()
      if (this.dataVerification() === '') {
        this.handleDataToBackstage({ saveOrSubmit: 0 })
      } else {
        this.$message.error(this.dataVerification())
      }
    },
    // 详情保存并提交按钮
    saveAndSubmit() {
      console.log('保存并提交')
      if (this.dataVerification() === '') {
        this.handleDataToBackstage({ saveOrSubmit: 1 })
      } else {
        this.$message.error(this.dataVerification())
      }
    },
    // 保存并审核
    saveAndExamine() {
      // console.log(this.dataVerification)
      if (this.dataVerification() === '') {
        this.handleDataToBackstage({ saveOrSubmit: 1 })
      } else {
        this.$message.error(this.dataVerification)
      }
    },
    // 详情取消按钮
    cancel() {
      this.$router.back()
    },
    // 详情编辑
    edit() {
      this.$router.replace({ query: { id: this.determinateBoardid, type: 'edit' }})
    },
    // 详情提交
    submit() {
      if (this.dataVerification() === '') {
        this.handleDataToBackstage({ saveOrSubmit: 1 })
      } else {
        this.$message.error(this.dataVerification())
      }
    },
    // 详情审核
    examine() {
      if (this.dataVerification() === '') {
        this.handleDataToBackstage({ saveOrSubmit: 1 })
      } else {
        this.$message.error(this.dataVerification())
      }
    },
    // 详情取消任务按钮
    cancelTask() {
      this.cancelTaskpopOptions.visible = true
    },

    async cancelOk(data = {}) {
      const res = await api.greigeSwatchesTaskCancel(data)
      if (res.data) {
        this.$message.success('取消任务成功')
        this.$router.back()
      }
    },

    // 版本v change事件
    editionChange(val) {
      const id = this.editionArrayData.filter(item => item.value === val)[0].id
      this.qaGreySwatchesTaskInfo({ id })
    }

  }
}
