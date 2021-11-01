import * as api from '../api/index'
export const clothInspectionDetail = {
  methods: {
    // 获取详情info
    async qaGreySwatchesTaskInfo(data = {}) {
      const res = await api.qaGreyFabricTaskInfo({ id: this.determinateBoardid, ...data })
      const dataInfo = res.data || {}

      // 赋值基础数据
      this.baseFormDatas = { ...this.baseFormDatas, ...dataInfo }
      const { qaGreigeFabricMaterialInformationList, qaGreigeFabricTestInformationList, swatchesUserId, swatchesUserName, swatchesStatus, swatchesComments, status, taskNo, attachmentList } = dataInfo
      // 赋值任务编码
      this.taskNumber = taskNo
      // 赋值状态
      this.status = status
      // 赋值原料信息
      this.rawMaterialFormDatas = { rawMaterialTable: qaGreigeFabricMaterialInformationList || [] }
      // 赋值确板信息
      this.confirmationFormDatas = { swatchesUserId, swatchesUserName, swatchesStatus, swatchesComments };
      // 赋值验布信息
      (qaGreigeFabricTestInformationList && qaGreigeFabricTestInformationList.length) && qaGreigeFabricTestInformationList.forEach(item => {
        item.edit = true
        item.remarkEdit = this.isEdit && +status === 2
      })
      this.clothInspectionFormDatas = { clothInspectionTable: qaGreigeFabricTestInformationList || [] }

      // 赋值图片信息
      this.srcList = attachmentList ? attachmentList.map((item, index) => item.viewUrl) : []
    },
    // 获取所有数据并处理完传给后台
    async handleDataToBackstage(data = {}) {
      console.log(this.$refs)
      // 获取基础数据
      const baseData = this.$refs.baseSearchForm.dynamicValidateFormRuleForm
      // 获取原料信息
      const qaGreigeFabricMaterialInformationList = this.$refs.rawMaterialSearchForm.dynamicValidateFormRuleForm.rawMaterialTable
      // 获取确板信息
      const { swatchesUserId, swatchesUserName, swatchesStatus, swatchesComments } = this.$refs.confirmationSearchForm.dynamicValidateFormRuleForm
      // 获取验布信息
      const qaGreigeFabricTestInformationList = this.$refs.clothInspectionSearchForm.dynamicValidateFormRuleForm.clothInspectionTable
      // const { handler: processUserName, reviewResult, reviewComments } = taskDynamicsData[0]

      const res = await api.qaGreigeFabricTaskModify({ ...baseData, qaGreigeFabricMaterialInformationList, qaGreigeFabricTestInformationList, swatchesUserId, swatchesUserName, swatchesStatus, swatchesComments, ...data })
      if (res.data) {
        this.$message.success('保存成功')
        // this.$router.replace({ query: { id: this.determinateBoardid, type: 'detail' }})

        const { beforeCode, afterCode } = this.$utils.compareData(this.baseFormDatas, { ...baseData, qaGreigeFabricMaterialInformationList, qaGreigeFabricTestInformationList, swatchesUserId, swatchesUserName, swatchesStatus, swatchesComments, ...data }, 'id')
        const api = `/qa/qaGreigeFabricTask/modify`
        const opratorType = `UPDATE`
        const description = { beforeText: `在'质量管理-坯布检测-坯布验布详情'`, afterText: `${data.saveOrSubmit === 1 ? '审核' : '保存'}`, beforeCode, afterCode }
        const appId = 'qa'
        this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api, description, appId })

        if (data.saveOrSubmit === 1) this.$router.push({ name: 'grey-fabric-cloth-inspection-page', query: { status: this.status }})
        else {
          this.$router.replace({ query: { id: this.determinateBoardid, type: 'detail' }})
          this.qaGreySwatchesTaskInfo()
        }
        // data.saveOrSubmit === 1 ? this.$router.push({ name: 'grey-fabric-cloth-inspection-page', query: { status }}) : this.$router.replace({ query: { id: this.determinateBoardid, type: 'detail' }})
      }
    },
    // 数据校验必填
    dataVerification() {
      // 获取验布信息
      const qaGreigeFabricTestInformationList = this.$refs.clothInspectionSearchForm.dynamicValidateFormRuleForm.clothInspectionTable
      let text = ''
      qaGreigeFabricTestInformationList.some(item => {
        if (item.isQualified === '0' && !item.remark) {
          text += '验布信息-审核意见未填写.'
          return true
        }
      })
      if (text !== '') {
        this.$refs.clothInspectionSearchForm.form.validate()
      }
      return text
    },
    // 详情保存按钮
    save() {
      const errorMessage = this.dataVerification()
      if (errorMessage === '') {
        this.handleDataToBackstage({ saveOrSubmit: 0 })
      } else {
        this.$message.error(errorMessage)
      }
    },
    // 详情保存并提交按钮
    // saveAndSubmit() {
    //   console.log('保存并提交')
    //   if (this.dataVerification() === '') {
    //     this.handleDataToBackstage()
    //   } else {
    //     this.$message.error(this.dataVerification())
    //   }
    // },
    // 保存并审核
    saveAndExamine() {
      const errorMessage = this.dataVerification()
      if (errorMessage === '') {
        this.handleDataToBackstage({ saveOrSubmit: 1 })
      } else {
        this.$message.error(errorMessage)
      }
    },
    // 详情取消按钮
    cancel() {
      this.$router.back()
    },
    // 详情编辑
    edit() {
      console.log(this.$router)
      this.$router.replace({ query: { id: this.determinateBoardid, type: 'edit' }})
    },
    // 详情提交
    // submit() {},
    // 详情审核
    examine() {
      const errorMessage = this.dataVerification()
      if (errorMessage === '') {
        this.handleDataToBackstage({ saveOrSubmit: 1 })
      } else {
        this.$message.error(errorMessage)
      }
    },
    // 详情取消任务按钮
    cancelTask() {
      this.cancelTaskpopOptions.visible = true
    },

    // 取消任务ok事件
    async cancelOk(data = {}) {
      const res = await api.qaGreyFabricTaskCancel(data)
      if (res.data) {
        this.$message.success('取消任务成功')

        const api = `/qa/qaGreigeFabricTask/cancel`
        const opratorType = `UPDATE`
        const description = { beforeText: `在'质量管理-坯布检测-坯布验布详情'取消一条任务`, beforeCode: data }
        const appId = 'qa'
        this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api, description, appId })

        this.$router.back()
      }
    },

    // 版本v change事件
    editionChange(val) {
      this.qaGreySwatchesTaskInfo({ vsersion: val })
    }
  }
}
