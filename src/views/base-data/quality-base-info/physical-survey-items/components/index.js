import * as api from '../api/index'
import * as basicApi from '../api/basicIndex'
// import dynamicHeader from './dynamic-header.vue'
export const PhysicalSurveyItems = {
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(popOptions, val) {
      this.$set(popOptions, 'visible', !popOptions.visible)
      if (val) {
        this.$set(popOptions, 'title', val)
      }
    },
    // 关闭弹出框
    closePopDialogHandle(popOptions) {
      this.$set(popOptions, 'visible', false)
    },
    // 修改按钮动态重置
    setFormDatas(popOptions, params) {
      // console.log(params)
      setTimeout(() => {
        this.$set(popOptions, 'formDatas', params)
      }, 0)
    },

    // 新增按钮点击事件
    addHandle() {
      this.type = 'add'
      const titleObj = {
        1: '新增纱线等级',
        2: '新增物测项目',
        3: '新增执行标准'
      }
      this.PopDialogHandle(this.popOptions, titleObj[this.activeName])
      if (this.activeName === '1') {
        this.YarnGradeAddinfo({})
        const array = ['ingredients', 'proportion', 'yarnCount', 'cardingMethod', 'spinningMethod']
        array.forEach(item => {
          this.$set(this.yarnGradeContent['_' + item], 'disabled', false)
        })
        this.popOptions.formDatas = { proportion: '' }
        // this.$set(this.popOptions.formDatas, 'proportion', '')
      } else if (this.activeName === '2') {
        const array = ['name', 'isRelationYarnGrade']
        array.forEach(item => {
          this.$set(this.physicalSurveyItemsContent['_' + item], 'disabled', false)
        })
        this.$set(this.physicalSurveyItemsContent['_' + 'gradeRule'], 'disabled', true)
        this.$set(this.physicalSurveyItemsContent['_' + 'gradeRule'], 'rules', [])
      } else {
        this.$set(this.executiveStandardContent._name, 'disabled', false)
      }
    },
    // 编辑按钮点击事件
    editHandle() {
      if (this.fiveUuid) {
        this.type = 'edit'
        this.PopDialogHandle(this.popOptions, '编辑纱线等级')
        const array = ['ingredients', 'proportion', 'yarnCount', 'cardingMethod', 'spinningMethod']
        array.forEach(item => {
          this.$set(this.yarnGradeContent['_' + item], 'disabled', true)
        })
        this.getYarnGradeInfo({ uuid: this.fiveUuid })
      } else {
        this.$message.warning('请先选择一条数据')
      }
    },
    // 复制按钮点击事件
    copyHandle() {
      if (this.fiveUuid) {
        this.type = 'add'
        this.PopDialogHandle(this.popOptions, '新增纱线等级')
        const array = ['ingredients', 'proportion', 'yarnCount', 'cardingMethod', 'spinningMethod']
        array.forEach(item => {
          this.$set(this.yarnGradeContent['_' + item], 'disabled', false)
        })
        this.getYarnGradeInfo({ uuid: this.fiveUuid })
      } else {
        this.$message.warning('请先选择一条数据')
      }
    },

    // 单元格合并
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.activeName === '1') {
        // const dataList = this.dyeingSliverPopOptions.content._rawMaterialTable.dataSource

        // console.log(this.dataPretreatment(dataList))
        const mergingRows = this.dataPretreatment(this.dataSource)
        if (columnIndex > 0 && columnIndex <= 5) {
          const _row = mergingRows[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
    },
    // 处理表格的合并的数据，找到要合并的数组
    dataPretreatment(data) {
      // 注意因为需要多次处理后台数据合并 所以合并前初始化这两个
      const mergingRows = []
      let mergingPos = 0
      for (let i = 0; i < data.length; i++) {
        // data传入的表格数据源
        if (i === 0) {
          mergingRows.push(1)
          mergingPos = 0
        } else {
          if (data[i].attrMd5 === data[i - 1].attrMd5) {
            mergingRows[mergingPos] += 1
            mergingRows.push(0)
          } else {
            mergingRows.push(1)
            mergingPos = i
          }
        }
      }
      return mergingRows
    },

    // 纱线等级表格列表
    async yarnGradePage(data = {}) {
      const res = await api.yarnGradeConfigPage({ ...this.searchFormDatas, ...data })
      const userList = res.data.list || []
      console.log('userList', userList)
      this.dataSource = userList
      this.yarnGradePagination = {
        ...this.yarnGradePagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.pagination = this.yarnGradePagination
    },
    // 添加或者编辑纱线等级
    addOrEditYarnGrade(data) {
      if (this.type === 'add') {
        this.addYarnGrade(data)
      } else if (this.type === 'edit') {
        this.editYarnGrade(data)
      }
    },
    // 添加纱线等级
    async addYarnGrade(data = {}) {
      const res = await api.yarnGradeConfigAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('添加成功')
      this.fetchLog(
        this.getLogMessages('INSERT', '/baseData/qa/yarnGradeConfig/add', 'baseData'),
        data,
        JSON.stringify({ beforeText: `在'基础数据-质量基础数据-物测项目-纱线等级'新增一条记录`, beforeCode: data })
      )
      this.yarnGradePage()
      this.physicalSurveyItemsList({})
    },
    // 编辑纱线等级
    async editYarnGrade(data = {}) {
      const res = await api.yarnGradeConfigModify({ ...data, uuid: this.fiveUuid })
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('编辑成功')
      const { beforeCode, afterCode } = this.compareData(this.yarnGradeInfo, data, 'id')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(
        this.getLogMessages('UPDATE', '/baseData/qa/yarnGradeConfig/modify', 'baseData'),
        data,
        JSON.stringify({
          beforeText: `在'基础数据-质量基础数据-物测项目-纱线等级'将${JSON.stringify({ 'uuid': this.fiveUuid })}`,
          afterText: '修改为',
          ...{ beforeCode, afterCode }
        })
      )
      this.yarnGradePage()
      this.physicalSurveyItemsList({})
    },
    // 获取纱线详情
    async getYarnGradeInfo(data = {}) {
      const res = await api.yarnGradeConfigInfo(data)
      if (res.code !== 200) {
        return false
      }
      const dataInfo = res.data || {}
      this.yarnGradeInfo = dataInfo
      // 取值
      const { cardingMethod, conversionFactorName, ingredients, proportion, spinningMethod, yarnCount } = dataInfo
      // 下拉框放值
      this.$set(this.yarnGradeContent._ingredients, 'dataSource', [ingredients])
      this.$set(this.yarnGradeContent._yarnCount, 'dataSource', [yarnCount])
      this.$set(this.yarnGradeContent._cardingMethod, 'dataSource', [cardingMethod])
      this.$set(this.yarnGradeContent._spinningMethod, 'dataSource', [spinningMethod])
      // 表单放值
      this.setFormDatas(this.popOptions, { cardingMethod, conversionFactorName, ingredients, proportion, spinningMethod, yarnCount })
      // debugger
      // table-form放值
      const yarnGradeAttrConfigList = res.data.yarnGradeAttrConfig || []
      this.dynamicRulebyData(yarnGradeAttrConfigList)
      yarnGradeAttrConfigList.forEach(item => {
        item.edit = true
      })
      this.$set(this.yarnGradeContent._tableForm, 'dataSource', yarnGradeAttrConfigList)
    },
    // 点击新增的结构体
    async YarnGradeAddinfo(data = {}) {
      const res = await api.yarnGradeConfigAddinfo(data = {})
      const dataList = res.data.yarnGradeAttrConfig || []
      this.dynamicRulebyData(dataList)
      dataList.forEach(item => {
        item.edit = true
      })
      // const sortData = dataList.sort((a, b) => b.orders - a.orders > 0)
      // console.log(sortData)
      this.$set(this.yarnGradeContent._tableForm, 'dataSource', dataList)
      // console.log(this.$refs.popOptions.$children[0].$children[0].$children[0].dynamicValidateFormRuleForm.yarnGradeAttrConfig)
      // this.dynamicRulebyData(this.$refs.popOptions.$children[0].$children[0].$children[0].dynamicValidateFormRuleForm.yarnGradeAttrConfig)
    },

    // 物测项目表格分页列表
    async physicalSurveyItemsPage(data = {}) {
      const res = await api.pysicalSurveyConfigPage({ ...this.searchFormDatas, ...data })
      const userList = res.data.list || []
      this.dataSource = userList
      this.physicalSurveyItemsPagination = {
        ...this.physicalSurveyItemsPagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.pagination = this.physicalSurveyItemsPagination
    },
    // 物测项目表格列表
    async physicalSurveyItemsList(data = {}) {
      const res = await api.pysicalSurveyConfigList({ ...data, isEnabled: 1 })
      const dataList = res.data || []
      const eddColumns = {
        '_numberRange': {
          prop: 'numberRange',
          label: '支数范围%',
          minWidth: '90',
          align: 'right',
          formater: (scope) => {
            return scope.row.numberRange ? '±' + scope.row.numberRange : ''
          }
        },
        '_contentRange': {
          prop: 'contentRange',
          label: '含量比范围%',
          minWidth: '110',
          align: 'right',
          formater: (scope) => {
            return scope.row.contentRange ? '±' + scope.row.contentRange : ''
          }
        },
        '_updatedBy': {
          prop: 'updatedBy',
          label: '操作人',
          minWidth: '70',
          showOverflowTooltip: true
        },
        '_updatedTime': {
          prop: 'updatedTime',
          label: '操作时间',
          minWidth: '135',
          formater: (scope) => {
            return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
          }
        }
      }
      const dynamicColumns = {}
      const sortData = dataList.sort((a, b) => a.orders - b.orders)
      console.log('sortData', sortData)
      sortData.forEach(item => {
        // item.edit = true
        // item.pysical = item.name
        item.isRelationYarnGrade ? dynamicColumns['_' + item.uuid] = {
          prop: item.uuid,
          label: item.name,
          // headerComponent: dynamicHeader,
          renderHeader: (h, { column, $index }) => {
            console.log(h, { column, $index })
            return h('div', {
              attrs: {
                class: 'dynamic-header',
                title: column.label
              }
            }, column.label)
          },
          minWidth: '80',
          formater: (scope) => {
            // console.log(scope)
            // debugger
            let value = '';
            (scope.row.pysicalChildren && scope.row.pysicalChildren.length) && scope.row.pysicalChildren.forEach(scopeRowItem => {
              if (scopeRowItem.pysical.value === scope.column.property) {
                value = scopeRowItem.pysical.type
              }
            })
            return value
          }
        } : ''
      })
      //   this.$set(this.yarnGradeContent._tableForm, 'dataSource', dataList)
      //   this.gradeGroup = dataList
      this.columns = { ...this.yarnGradeColumns, ...dynamicColumns, ...eddColumns }
    },
    // 添加或者编辑物测项目
    addOrEditPhysicalSurveyItems(data) {
      if (this.type === 'add') {
        this.addPhysicalSurveyItems(data)
      } else if (this.type === 'edit') {
        this.editPhysicalSurveyItems(data)
      }
    },
    // 添加物测项目
    async addPhysicalSurveyItems(data = {}) {
      const res = await api.pysicalSurveyConfigAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('添加成功')
      this.fetchLog(
        this.getLogMessages('INSERT', '/baseData/qa/pysicalSurveyConfig/add', 'baseData'),
        data,
        JSON.stringify({ beforeText: `在'基础数据-质量基础数据-物测项目-物测项目'新增一条记录`, beforeCode: data })
      )
      this.physicalSurveyItemsPage({})
    },
    // 编辑物测项目
    async editPhysicalSurveyItems(data = {}) {
      const res = await api.pysicalSurveyConfigModify(data)
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('编辑成功')
      const { beforeCode, afterCode } = this.compareData(this.physicalSurveyItemsInfo, data, 'id')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(
        this.getLogMessages('UPDATE', '/baseData/qa/pysicalSurveyConfig/modify', 'baseData'),
        data,
        JSON.stringify({
          beforeText: `在'基础数据-质量基础数据-物测项目-物测项目'将${JSON.stringify({ 'uuid': this.fiveUuid })}`,
          afterText: '修改为',
          ...{ beforeCode, afterCode }
        })
      )
      this.physicalSurveyItemsPage({})
    },
    // 获取物测项目详情
    async getPhysicalSurveyItemsInfo(data = {}) {
      const res = await api.pysicalSurveyConfigInfo(data)
      if (res.code !== 200) {
        return false
      }
      const dataInfo = res.data || {}
      this.physicalSurveyItemsInfo = dataInfo
      dataInfo.isRelationYarnGrade ? 1 : 0
      dataInfo.status === 'N' && this.$set(this.physicalSurveyItemsContent._gradeRule, 'disabled', !dataInfo.isRelationYarnGrade)
      dataInfo.isRelationYarnGrade = dataInfo.isRelationYarnGrade ? 1 : 0
      this.setFormDatas(this.popOptions, dataInfo)
    },
    // 删除物测项目
    async deletePhysicalSurveyItems(data = {}) {
      await api.pysicalSurveyConfigDelete(data)
      this.$message.success('删除成功')
      this.fetchLog(
        this.getLogMessages('DEL', '/baseData/qa/pysicalSurveyConfig/delete', 'baseData'),
        data,
        JSON.stringify({ beforeText: `在'基础数据-质量基础数据-物测项目-物测项目'删除一条记录`, beforeCode: data })
      )
      this.physicalSurveyItemsPage({})
    },
    // 审核物测项目
    async auditedPhysicalSurveyItems(data = {}) {
      await api.pysicalSurveyConfigAudited(data)
      this.$message.success('审核成功')
      this.fetchLog(
        this.getLogMessages('EXAMINE', '/baseData/qa/pysicalSurveyConfig/audited', 'baseData'),
        data,
        JSON.stringify({ beforeText: `在'基础数据-质量基础数据-物测项目-物测项目'审核一条记录`, beforeCode: data })
      )
      this.physicalSurveyItemsPage({})
    },
    // 启用/禁用物测项目
    async enabledPhysicalSurveyItems(data = {}, isEnabled) {
      await api.pysicalSurveyConfigEnabled(data)
      this.$message.success(`${isEnabled ? '启用' : '禁用'}成功`)
      this.fetchLog(
        this.getLogMessages('UPDATE', '/baseData/qa/pysicalSurveyConfig/enabled', 'baseData'),
        data,
        JSON.stringify({ beforeText: `在'基础数据-质量基础数据-物测项目-物测项目'${isEnabled ? '启用' : '禁用'}一条记录`, beforeCode: data })
      )
    },

    // 执行标准表格列表
    async executiveStandardPage(data = {}) {
      const res = await api.executivsStandardConfigPage({ ...this.searchFormDatas, ...data })
      const userList = res.data.list || []
      this.dataSource = userList
      this.executiveStandardPagination = {
        ...this.executiveStandardPagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.pagination = this.executiveStandardPagination
    },
    // 添加或者编辑执行标准
    addOrEditExecutiveStandard(data) {
      if (this.type === 'add') {
        this.addExecutiveStandard(data)
      } else if (this.type === 'edit') {
        this.editExecutiveStandard(data)
      }
    },
    // 添加执行标准
    async addExecutiveStandard(data = {}) {
      const res = await api.executivsStandardConfigAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('添加成功')
      this.fetchLog(
        this.getLogMessages('INSERT', '/baseData/qa/executivsStandardConfig/add', 'baseData'),
        data,
        JSON.stringify({ beforeText: `在'基础数据-质量基础数据-物测项目-执行标准'新增一条记录`, beforeCode: data })
      )
      this.executiveStandardPage({})
    },
    // 编辑执行标准
    async editExecutiveStandard(data = {}) {
      const res = await api.executivsStandardConfigModify(data)
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('编辑成功')
      const { beforeCode, afterCode } = this.compareData(this.executiveStandardInfo, data, 'id')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(
        this.getLogMessages('UPDATE', '/baseData/qa/executivsStandardConfig/modify', 'baseData'),
        data,
        JSON.stringify({
          beforeText: `在'基础数据-质量基础数据-物测项目-执行标准'将${JSON.stringify({ 'uuid': this.fiveUuid })}`,
          afterText: '修改为',
          ...{ beforeCode, afterCode }
        })
      )
      this.executiveStandardPage({})
    },
    // 获取执行标准详情
    async getExecutiveStandardInfo(data = {}) {
      const res = await api.executivsStandardConfigInfo(data)
      if (res.code !== 200) {
        return false
      }
      const dataInfo = res.data || {}
      this.executiveStandardInfo = dataInfo
      this.$set(this.executiveStandardContent._name, 'disabled', dataInfo.status === 'Y')
      // this.$set(this.executiveStandardContent._nameEn, 'disabled', dataInfo.status === 'Y')
      this.setFormDatas(this.popOptions, dataInfo)
    },
    // 删除执行标准
    async deleteExecutiveStandard(data = {}) {
      await api.executivsStandardConfigDelete(data)
      this.$message.success('删除成功')
      this.fetchLog(
        this.getLogMessages('DEL', '/baseData/qa/executivsStandardConfig/delete', 'baseData'),
        data,
        JSON.stringify({ beforeText: `在'基础数据-质量基础数据-物测项目-执行标准'删除一条记录`, beforeCode: data })
      )
      this.executiveStandardPage({})
    },
    // 审核执行标准
    async auditedExecutiveStandard(data = {}) {
      await api.executivsStandardConfigAudited(data)
      this.$message.success('审核成功')
      this.fetchLog(
        this.getLogMessages('EXAMINE', '/baseData/qa/executivsStandardConfig/audited', 'baseData'),
        data,
        JSON.stringify({ beforeText: `在'基础数据-质量基础数据-物测项目-执行标准'审核一条记录`, beforeCode: data })
      )
      this.executiveStandardPage({})
    },
    // 启用/禁用执行标准
    async enabledExecutiveStandard(data = {}, isEnabled) {
      await api.executivsStandardConfigEnabled(data)
      this.$message.success(`${isEnabled ? '启用' : '禁用'}成功`)
      this.fetchLog(
        this.getLogMessages('UPDATE', '/baseData/qa/executivsStandardConfig/enabled', 'baseData'),
        data,
        JSON.stringify({ beforeText: `在'基础数据-质量基础数据-物测项目-执行标准'${isEnabled ? '启用' : '禁用'}一条记录`, beforeCode: data })
      )
    },

    // 纱线等级搜索栏下拉框数据
    async getYarnTypeSearch(data = {}, content, name, remoteObject) {
      const res = await basicApi.yarnTypeSearch({ enabled: 'Y', ...data })
      const dataList = res.data || []
      const selectData = dataList.map(e => {
        return {
          label: e.name,
          value: e.uuid,
          name: e.name
        }
      })
      console.log(this[content][name])
      // if (remoteObject) {
      //   if (selectData.map(item => item.value).includes(remoteObject.value)) {
      //     console.log('方向数据为启用')
      //   } else {
      //     selectData.push(remoteObject)
      //   }
      // }
      this.$set(this[content][name], 'dataSource', selectData)
    },
    // 成分/组合成分下拉框数据
    async getIngredientSearch(data = {}, name) {
      let dataList = []
      await Promise.all([basicApi.ingredientSearch({ enabled: 'Y', ...data }), basicApi.assemblyIngredientSearch({ enabled: 'Y', ...data })]).then(res => {
        console.log(res)
        const firstArr = res[0].data || []
        const secondArr = res[1].data || []
        dataList = [...firstArr, ...secondArr].map(item => {
          return {
            label: item.name,
            value: item.uuid,
            name: item.names || item.name
          }
        })
      })
      console.log(dataList)
      this.$set(this.yarnGradeContent._ingredients, 'dataSource', dataList)
    },

    // 根据数据动态生成规则
    dynamicRulebyData(data) {
      const validator = (rule, value, callback) => {
        const fieldArray = rule.field.split('.')
        const num = fieldArray[1]
        // const ruleRowData = data[num]
        // console.log(allData, this.$refs.popOptions.$children[0].$children[0].$children[0])
        const form = this.$refs.popOptions.$children[0].$children[0].$children[0].form
        // const errors = this.$refs.popOptions.$children[0].$children[0].$children[0].errors
        const allData = this.$refs.popOptions.$children[0].$children[0].$children[0].dynamicValidateFormRuleForm.yarnGradeAttrConfig

        const ruleRowData = allData[num]
        const { gradeA, gradeB, gradeC, gradeD, gradeE } = ruleRowData
        const dataRule = ruleRowData.rule
        switch (dataRule) {
          case 'le': // 小于
            if (gradeE && gradeD && gradeC && gradeB && gradeA) {
              if (gradeA * 1 <= gradeB * 1 && gradeB * 1 <= gradeC * 1 && gradeC * 1 <= gradeD * 1 && gradeD * 1 <= gradeE * 1) {
                console.log('小于等于校验成功')
                callback()
                const resultArray = ['gradeE', 'gradeD', 'gradeC', 'gradeB', 'gradeA'].map(item => 'yarnGradeAttrConfig' + '.' + num + '.' + item)
                form.clearValidate(resultArray)
              } else {
                callback(new Error('≤规则校验失败'))
              }
            } else if (!gradeE && !gradeD && !gradeC && !gradeB && !gradeA) {
              console.log('均没填写')
              callback()
              const resultArray = ['gradeE', 'gradeD', 'gradeC', 'gradeB', 'gradeA'].map(item => 'yarnGradeAttrConfig' + '.' + num + '.' + item)
              form.clearValidate(resultArray)
            } else {
              callback(new Error('同时填写或同时不填写,规则≤'))
            }

            break
          case 'ge': // 大于
            if (gradeE && gradeD && gradeC && gradeB && gradeA) {
              if (gradeE * 1 <= gradeD * 1 && gradeD * 1 <= gradeC * 1 && gradeC * 1 <= gradeB * 1 && gradeB * 1 <= gradeA * 1) {
                console.log('大于等于校验成功')
                callback()
                const resultArray = ['gradeE', 'gradeD', 'gradeC', 'gradeB', 'gradeA'].map(item => 'yarnGradeAttrConfig' + '.' + num + '.' + item)
                form.clearValidate(resultArray)
              } else {
                callback(new Error('≥规则校验失败'))
              }
            } else if (!gradeE && !gradeD && !gradeC && !gradeB && !gradeA) {
              console.log('均没填写')
              callback()
              const resultArray = ['gradeE', 'gradeD', 'gradeC', 'gradeB', 'gradeA'].map(item => 'yarnGradeAttrConfig' + '.' + num + '.' + item)
              form.clearValidate(resultArray)
            } else {
              callback(new Error('同时填写或同时不填写,规则≥'))
            }

            break
          case 'nt': // 无
            if ((gradeE && gradeD && gradeC && gradeB && gradeA) || (!gradeE && !gradeD && !gradeC && !gradeB && !gradeA)) {
              console.log('无规则校验成功')
              callback()
              const resultArray = ['gradeE', 'gradeD', 'gradeC', 'gradeB', 'gradeA'].map(item => 'yarnGradeAttrConfig' + '.' + num + '.' + item)
              form.clearValidate(resultArray)
            } else {
              callback(new Error('同时填写或同时不填写,规则无'))
            }
            break

          default:
            break
        }
      }

      Object.values(this.popColumns).forEach((item, index) => {
        if (index !== 0) {
          item.editOptions.rules.push({ validator, trigger: 'blur' })
        }
      })
      // return { validator, trigger: 'change' }
    }
  }
}
