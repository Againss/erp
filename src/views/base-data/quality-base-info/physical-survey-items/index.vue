<template>
  <div class="physical-survey-items">
    <!-- 纱线等级的搜索 -->
    <div v-if="activeName === '1'" class="search">
      <cs-custom-form ref="searchForm" :data-source="yarnGradeSearchData" :options="formOtions" :form-datas="formDatas" />
    </div>

    <!-- 其余两个的搜索 -->
    <div v-if="activeName !== '1'" class="search otherSearch">
      <cs-custom-form ref="searchForm" :data-source="noYarnGradeSearchData" :options="formOtions" />
    </div>

    <div class="tab-group">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
        <el-tab-pane v-if="$permission(['baseData:qa:yarnGradeConfig:page'])" label="纱线等级" name="1" />
        <el-tab-pane v-if="$permission(['baseData:qa:pysicalSurveyConfig:page'])" label="物测项目" name="2" />
        <el-tab-pane v-if="$permission(['baseData:qa:executivsStandardConfig:page'])" label="执行标准" name="3" />
        <!-- <el-tab-pane v-permission="(['baseData:qa:executivsStandardConfig:page'])" label="执行标准" name="3" /> -->
      </el-tabs>
      <div class="right-button">
        <el-button v-if="activeName === '1' ? $permission(['baseData:qa:yarnGradeConfig:add']) : activeName === '2' ? $permission(['baseData:qa:pysicalSurveyConfig:add']) : $permission(['baseData:qa:executivsStandardConfig:add'])" class="process-button" size="small" type="primary" @click="addHandle">新增</el-button>
        <el-button v-if="activeName === '1' && $permission(['baseData:qa:yarnGradeConfig:modify'])" class="process-button" size="small" @click="editHandle">编辑</el-button>
        <el-button v-if="activeName === '1' && $permission(['baseData:qa:yarnGradeConfig:repeat'])" class="process-button" size="small" @click="copyHandle">复制</el-button>
        <!-- <el-button class="process-button" size="small" type="primary" @click="addHandle">新增</el-button>
        <el-button v-if="activeName === '1'" class="process-button" size="small" @click="editHandle">编辑</el-button>
        <el-button v-if="activeName === '1'" class="process-button" size="small" @click="copyHandle">复制</el-button> -->
      </div>
    </div>

    <!-- 列表 -->
    <div class="page-table" :class="{'yarn-table': activeName === '1'}">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="showPopOperates"
        :pagination="pagination"
        :span-method="spanMethod"
        :header-cell-class-name="handleHeaderClass"
        edit-type="pop"
        :row-class-name="currentRowClassName"
        @sort-change="sortChange"
        @row-click="rowClick"
      />
    </div>

    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popOptions" :options="popOptions" />
    </div>

  </div>
</template>

<script>
import formCustom from './components/form-custom'
import { PhysicalSurveyItems } from './components/index'
import logMethods from './components/log-methods'
import enableSwitch from './components/enableSwitch'
export default {
  mixins: [PhysicalSurveyItems, logMethods],
  data() {
    // 正则验证
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const commonChangeReg = this.$getRules({})
    // 正则0~999整数
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(0|\+?[1-9][0-9]{0,2})$/, message: '0~999的整数', trigger: ['blur'] })
    // 0~99999.99的数字
    const max99999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,4})|(0{1}))(\.\d{1,2})?$/, message: '0~99999.99的数字', trigger: ['blur'] })

    // 动态校验
    // 校验内容
    // const validator = (rule, value, callback) => {
    //   console.log('111', rule, value, callback)
    //   if (!Number.isInteger(value)) {
    //     callback(new Error('请输入数字值'))
    //   }
    // }

    // 纱线等级搜索栏数据配置
    const yarnGradeSearchData = {
      '_ingredientsProportion': {
        prop: 'ingredientsProportion',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '成分比例',
        placeholder: '请输入名称'
      },
      '_yarnCount': {
        prop: 'yarnCount',
        itemType: 'input',
        label: '纱支',
        itemStyle: { width: '25%' },
        placeholder: '请输入名称'
      },
      '_spinningMethod': {
        prop: 'spinningMethod',
        itemType: 'select',
        label: '纺纱方法',
        itemStyle: { width: '25%' },
        valueType: 'object',
        placeholder: '请输入名称',
        filterable: true,
        visibleChange: (value) => {
          if (value) {
            this.getYarnTypeSearch({ categoryId: 2 }, 'yarnGradeSearchData', '_spinningMethod')
          }
        },
        dataSource: []
      },
      '_cardingMethod': {
        prop: 'cardingMethod',
        itemType: 'select',
        label: '梳棉方法',
        itemStyle: { width: '25%' },
        valueType: 'object',
        placeholder: '请输入名称',
        visibleChange: (value) => {
          if (value) {
            this.getYarnTypeSearch({ categoryId: 3 }, 'yarnGradeSearchData', '_cardingMethod')
          }
        },
        filterable: true,
        dataSource: []
      },
      '_yarnGrade': {
        prop: 'yarnGrade',
        itemType: 'select',
        itemStyle: { width: '25%' },
        label: '纱线等级',
        placeholder: '请输入名称',
        // filterable: true,
        // visibleChange: (value) => {
        //   if (value) {
        //     this.getYarnTypeSearch({ categoryId: 2 }, '_yarnGrade')
        //   }
        // },
        dataSource: [
          {
            label: 'A',
            value: 'A'
          },
          {
            label: 'B',
            value: 'B'
          },
          {
            label: 'C',
            value: 'C'
          },
          {
            label: 'D',
            value: 'D'
          },
          {
            label: 'E',
            value: 'E'
          }
        ]
      },
      '_operate': {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          this.yarnGradePage(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    // 非纱线等级搜索栏数据配置
    const noYarnGradeSearchData = {
      '_name': {
        prop: 'name',
        itemType: 'input',
        label: '名称',
        itemStyle: { width: '20%' },
        placeholder: '中文名/英文名'
      },
      '_isEnabled': {
        prop: 'isEnabled',
        itemType: 'select',
        itemStyle: { width: '20%' },
        label: '启用/禁用',
        // placeholder: '请输入名称',
        // filterable: true,
        dataSource: [
          {
            label: ' ',
            value: null
          },
          {
            label: '启用',
            value: 1
          },
          {
            label: '禁用',
            value: 0
          }
        ]
      },
      '_operate': {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          // this.getCustomerPage(params)
          if (this.activeName === '2') {
            this.physicalSurveyItemsPage(params)
          } else {
            this.executiveStandardPage(params)
          }
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }

    // 纱线等级表格表头
    const yarnGradeColumns = {
      '_id': {
        prop: 'id',
        label: '序号',
        minWidth: '60',
        fixed: true,
        formater: (scope) => {
          return this.yarnGradePagination.currentPage && (this.yarnGradePagination.currentPage - 1) * this.yarnGradePagination.pageSize + scope.$index + 1
        }
      },
      '_ingredient': {
        prop: 'ingredient',
        label: '成份比例',
        minWidth: '80',
        fixed: true,
        formater: (scope) => {
          return scope.row.ingredientsProportion
        },
        showOverflowTooltip: true
      },
      '_conversionFactorName': {
        prop: 'conversionFactorName',
        label: '转换系数',
        minWidth: '80',
        fixed: true,
        showOverflowTooltip: true
      },
      '_yarnCountName': {
        prop: 'yarnCountName',
        label: '纱支',
        minWidth: '60',
        fixed: true,
        formater: (scope) => {
          return scope.row.yarnCount ? (scope.row.yarnCount.label || '') : ''
        },
        showOverflowTooltip: true
      },
      '_cardingMethodName': {
        prop: 'cardingMethodName',
        label: '梳棉方法',
        minWidth: '80',
        fixed: true,
        formater: (scope) => {
          return scope.row.cardingMethod ? (scope.row.cardingMethod.label || '') : ''
        },
        showOverflowTooltip: true
      },
      '_spinningMethodName': {
        prop: 'spinningMethodName',
        label: '纺纱方法',
        minWidth: '80',
        fixed: true,
        formater: (scope) => {
          return scope.row.spinningMethod ? (scope.row.spinningMethod.label || '') : ''
        },
        showOverflowTooltip: true
      },
      '_yarnGrade': {
        prop: 'yarnGrade',
        label: '纱线等级',
        minWidth: '80',
        fixed: true,
        showOverflowTooltip: true
      }
    }
    // 物测项目表格表头
    const physicalSurveyItemsColumns = {
      '_id': {
        prop: 'id',
        label: '序号',
        minWidth: '60',
        formater: (scope) => {
          return this.physicalSurveyItemsPagination.currentPage && (this.physicalSurveyItemsPagination.currentPage - 1) * 20 + scope.$index + 1
        }
      },
      '_name': {
        prop: 'name',
        label: '中文名',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_nameEn': {
        prop: 'nameEn',
        label: '英文名',
        minWidth: '70',
        showOverflowTooltip: true
      },
      '_isRelationYarnGrade': {
        prop: 'isRelationYarnGrade',
        label: '关联纱线等级',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.isRelationYarnGrade ? '是' : '否'
        }
      },
      '_gradeRule': {
        prop: 'gradeRule',
        label: '等级规则',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          // return scope.row.gradeRule ? '是' : '否'
          return scope.row.gradeRule ? scope.row.gradeRule === 'le' ? '≤' : scope.row.gradeRule === 'ge' ? '≥' : '' : ''
        }
      },
      '_orders': {
        prop: 'orders',
        label: '顺序',
        minWidth: '80',
        sortable: 'custom',
        showOverflowTooltip: true
      },
      '_remarks': {
        prop: 'remarks',
        label: '备注',
        minWidth: '80',
        showOverflowTooltip: true
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
        minWidth: '100',
        sortable: 'custom',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      '_isEnabled': {
        prop: 'isEnabled',
        label: '启用/禁用',
        minWidth: '90',
        components: { enableSwitch },
        componentsOptions: {
          permitTag: ['baseData:qa:pysicalSurveyConfig:enabled'],
          changeStatus: (scope) => {
            console.log(scope)
            this.enabledPhysicalSurveyItems({ uuid: scope.row.uuid }, scope.row.isEnabled)
          }
        }
        // showOverflowTooltip: true
      },
      '_status': {
        prop: 'status',
        label: '状态',
        minWidth: '60',
        formater: (scope) => {
          return scope.row.status === 'Y' ? `<span style="color: #00BCC5;">${'已审核'}</span>` : `<span style="color: #FF8900;">${'未审核'}</span>`
        }
      }
    }
    // 执行标准表格表头
    const executiveStandardColumns = {
      '_id': {
        prop: 'id',
        label: '序号',
        minWidth: '60',
        formater: (scope) => {
          return this.executiveStandardPagination.currentPage && (this.executiveStandardPagination.currentPage - 1) * 20 + scope.$index + 1
        }
      },
      '_name': {
        prop: 'name',
        label: '中文名',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_nameEn': {
        prop: 'nameEn',
        label: '英文名',
        minWidth: '70',
        showOverflowTooltip: true
      },
      '_remarks': {
        prop: 'remarks',
        label: '备注',
        minWidth: '80',
        showOverflowTooltip: true
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
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      '_isEnabled': {
        prop: 'isEnabled',
        label: '启用/禁用',
        minWidth: '90',
        components: { enableSwitch },
        componentsOptions: {
          permitTag: ['baseData:qa:executivsStandardConfig:enabled'],
          changeStatus: (scope) => {
            console.log(scope)
            this.enabledExecutiveStandard({ uuid: scope.row.uuid }, scope.row.isEnabled)
          }
        }
        // showOverflowTooltip: true
      },
      '_status': {
        prop: 'status',
        label: '状态',
        minWidth: '60',
        formater: (scope) => {
          return scope.row.status === 'Y' ? `<span style="color: #00BCC5;">${'已审核'}</span>` : `<span style="color: #FF8900;">${'未审核'}</span>`
        }
        // showOverflowTooltip: true
      }
    }
    let physicaPopOperatesDataSource = [
      {
        label: '编辑',
        isShow: (params) => {
          return true
        },
        permitTag: this.activeName === '2' ? ['baseData:qa:pysicalSurveyConfig:modify'] : ['baseData:qa:executivsStandardConfig:modify'],
        handle: params => {
          this.type = 'edit'
          console.log(params)
          // this.editHandle(params)
          if (this.activeName === '2') {
            this.PopDialogHandle(this.popOptions, '修改物测项目')
            this.getPhysicalSurveyItemsInfo({ uuid: params.row.uuid })
            if (params.row.status === 'Y') {
              const array = ['name', 'isRelationYarnGrade', 'gradeRule']
              array.forEach(item => {
                this.$set(this.physicalSurveyItemsContent['_' + item], 'disabled', true)
              })
            } else {
              const array = ['name', 'isRelationYarnGrade']
              array.forEach(item => {
                this.$set(this.physicalSurveyItemsContent['_' + item], 'disabled', false)
              })
              this.$set(this.physicalSurveyItemsContent['_' + 'gradeRule'], 'disabled', !params.row.isRelationYarnGrade)
              this.$set(this.physicalSurveyItemsContent['_' + 'gradeRule'], 'rules', params.row.isRelationYarnGrade ? [commonChangeReg] : [])
            }
          } else {
            this.PopDialogHandle(this.popOptions, '修改执行标准')
            this.getExecutiveStandardInfo({ uuid: params.row.uuid })
            if (params.row.status === 'Y') {
              this.$set(this.physicalSurveyItemsContent._name, 'disabled', true)
            }
          }
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: this.activeName === '2' ? ['baseData:qa:pysicalSurveyConfig:delete'] : ['baseData:qa:executivsStandardConfig:delete'],
        isShow: (scope) => {
          return scope.row.status !== 'Y'
        },
        handle: params => {
          this.$confirm(' 你确认要删除该项吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.activeName === '2' ? this.deletePhysicalSurveyItems({ uuid: params.row.uuid }) : this.deleteExecutiveStandard({ uuid: params.row.uuid })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      },
      {
        label: '审核',
        isShow: (scope) => {
          return scope.row.status !== 'Y'
        },
        permitTag: this.activeName === '2' ? ['baseData:qa:pysicalSurveyConfig:audited'] : ['baseData:qa:executivsStandardConfig:audited'],
        handle: params => {
          console.log(params)
          this.$confirm(' 你确认要审核该项吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.activeName === '2' ? this.auditedPhysicalSurveyItems({ uuid: params.row.uuid }) : this.auditedExecutiveStandard({ uuid: params.row.uuid })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消审核'
              })
            })
        }
      }
    ]
    physicaPopOperatesDataSource = this.$filterPermission(physicaPopOperatesDataSource)
    let executivePopOperatesDataSource = [
      {
        label: '编辑',
        isShow: (params) => {
          return true
        },
        permitTag: ['baseData:qa:executivsStandardConfig:modify'],

        handle: params => {
          this.type = 'edit'
          console.log(params)
          // this.editHandle(params)
          if (this.activeName === '2') {
            this.PopDialogHandle(this.popOptions, '修改物测项目')
            this.getPhysicalSurveyItemsInfo({ uuid: params.row.uuid })
            if (params.row.status === 'Y') {
              const array = ['name', 'isRelationYarnGrade', 'gradeRule']
              array.forEach(item => {
                this.$set(this.physicalSurveyItemsContent['_' + item], 'disabled', true)
              })
            } else {
              const array = ['name', 'isRelationYarnGrade']
              array.forEach(item => {
                this.$set(this.physicalSurveyItemsContent['_' + item], 'disabled', false)
              })
              this.$set(this.physicalSurveyItemsContent['_' + 'gradeRule'], 'disabled', !params.row.isRelationYarnGrade)
              this.$set(this.physicalSurveyItemsContent['_' + 'gradeRule'], 'rules', params.row.isRelationYarnGrade ? [commonChangeReg] : [])
            }
          } else {
            this.PopDialogHandle(this.popOptions, '修改执行标准')
            this.getExecutiveStandardInfo({ uuid: params.row.uuid })
            if (params.row.status === 'Y') {
              this.$set(this.physicalSurveyItemsContent._name, 'disabled', true)
            }
          }
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['baseData:qa:executivsStandardConfig:delete'],
        isShow: (scope) => {
          return scope.row.status !== 'Y'
        },
        handle: params => {
          this.$confirm(' 你确认要删除该项吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.activeName === '2' ? this.deletePhysicalSurveyItems({ uuid: params.row.uuid }) : this.deleteExecutiveStandard({ uuid: params.row.uuid })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      },
      {
        label: '审核',
        isShow: (scope) => {
          return scope.row.status !== 'Y'
        },
        permitTag: ['baseData:qa:executivsStandardConfig:audited'],
        handle: params => {
          console.log(params)
          this.$confirm(' 你确认要审核该项吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.activeName === '2' ? this.auditedPhysicalSurveyItems({ uuid: params.row.uuid }) : this.auditedExecutiveStandard({ uuid: params.row.uuid })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消审核'
              })
            })
        }
      }
    ]
    executivePopOperatesDataSource = this.$filterPermission(executivePopOperatesDataSource)
    // 操作栏
    const popOperates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      // moreOptions: {
      //   maxLength: 2// 最大超过多少个显示more功能，默认为2
      // },
      dataSource: []
    }

    // 纱线等级分页
    const yarnGradePagination = {
      currentChange: val => {
        console.log('current', val)
        this.yarnGradePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.yarnGradePage({ pageNum: 1, pageSize: val })
      }
    }
    // 物测项目分页
    const physicalSurveyItemsPagination = {
      currentChange: val => {
        console.log('current', val)
        this.physicalSurveyItemsPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.physicalSurveyItemsPage({ pageNum: 1, pageSize: val })
      }
    }
    // 执行标准分页
    const executiveStandardPagination = {
      currentChange: val => {
        console.log('current', val)
        this.executiveStandardPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.executiveStandardPage({ pageNum: 1, pageSize: val })
      }
    }

    // 纱线等级弹出框表头
    const popColumns = {
      '_pysical': {
        prop: 'pysical',
        label: '项目/等级',
        minWidth: '60',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.pysical.label
        }
      },
      '_gradeA': {
        prop: 'gradeA',
        label: 'A',
        minWidth: '60',
        align: 'center',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 20,
          rules: [max99999Reg]
        }
        // formater: (scope) => {
        //   return scope.$index + 1
        // }
      },
      '_gradeB': {
        prop: 'gradeB',
        label: 'B',
        minWidth: '60',
        align: 'center',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 20,
          rules: [max99999Reg]
        }
      },
      '_gradeC': {
        prop: 'gradeC',
        label: 'C',
        align: 'center',
        minWidth: '60',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 20,
          rules: [max99999Reg]
        }
      },
      '_gradeD': {
        prop: 'gradeD',
        label: 'D',
        align: 'center',
        minWidth: '60',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 20,
          rules: [max99999Reg]
        }
      },
      '_gradeE': {
        prop: 'gradeE',
        label: 'E',
        align: 'center',
        minWidth: '60',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 20,
          rules: [max99999Reg]
        }
      }
    }
    // 纱线等级弹出框内容
    const yarnGradeContent = {
      '_ingredients': {
        prop: 'ingredients',
        itemType: 'select',
        label: '成份/组合成份:',
        filterable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: (value) => {
          if (value) {
            this.getIngredientSearch({})
          }
        },
        change: (value, form, formDatas, setFormDatas) => {
          console.log(value)
          const nameArray = value.name.split('/')
          if (nameArray.length === 1) {
            setFormDatas({ proportion: '100' })
          } else {
            let str = ''
            nameArray.forEach((item, index) => {
              if (index !== nameArray.length - 1) {
                str += ('/' + '')
              }
            })
            console.log(str)
            setFormDatas({ proportion: str })
          }
        },
        // placeholder: '请输入系统类型',
        dataSource: []
      },
      '_proportion': {
        prop: 'proportion',
        itemType: 'input',
        label: '成份比例:',
        rules: [commonBlurReg],
        components: {
          formCustom
        },
        placeholder: '请输入名称'
      },
      '_yarnCount': {
        prop: 'yarnCount',
        itemType: 'select',
        label: '纱支:',
        valueType: 'object',
        filterable: true,
        visibleChange: (value) => {
          if (value) {
            this.getYarnTypeSearch({ categoryId: 9 }, 'yarnGradeContent', '_yarnCount')
          }
        },
        rules: [commonChangeReg],
        // placeholder: '请输入系统类型',
        dataSource: []
      },
      '_cardingMethod': {
        prop: 'cardingMethod',
        itemType: 'select',
        label: '梳棉方法:',
        filterable: true,
        valueType: 'object',
        visibleChange: (value) => {
          if (value) {
            this.getYarnTypeSearch({ categoryId: 3 }, 'yarnGradeContent', '_cardingMethod')
          }
        },
        rules: [commonChangeReg],
        // placeholder: '请输入系统类型',
        dataSource: []
      },
      '_spinningMethod': {
        prop: 'spinningMethod',
        itemType: 'select',
        label: '纺纱方法:',
        valueType: 'object',
        visibleChange: (value) => {
          if (value) {
            this.getYarnTypeSearch({ categoryId: 2 }, 'yarnGradeContent', '_spinningMethod')
          }
        },
        filterable: true,
        rules: [commonChangeReg],
        // placeholder: '请输入系统类型',
        dataSource: []
      },
      '_conversionFactorName': {
        prop: 'conversionFactorName',
        itemType: 'input',
        label: '转换系数:',
        rules: [commonBlurReg, max99999Reg],
        placeholder: '请输入0~99999.99数字'
      },
      _tableForm: {
        prop: 'yarnGradeAttrConfig',
        itemType: 'table-form',
        tooltipEffect: 'light',
        border: true,
        dataSource: [],
        className: 'pop-table',
        // headerCellStyle: {
        //   background: '#F5F7FA!important'
        // },
        size: 'mini',
        columns: popColumns
        // operates: operates,
        // rowKey: 'code',
        // currentRowKey: 0,
        // highlightCurrentRow: true,
        // rowClassName: 'heightRow',
        // rowClick: (scope) => {
        //   this.setDetaiDatas(this.getLeftDataSource, scope.code - 1)
        // }
      }
    }
    // 物测项目弹出框内容
    const physicalSurveyItemsContent = {
      '_name': {
        prop: 'name',
        itemType: 'input',
        label: '中文名:',
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请输入'
      },
      '_nameEn': {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名:',
        maxlength: 50,
        placeholder: '请输入'
      },
      '_isRelationYarnGrade': {
        prop: 'isRelationYarnGrade',
        itemType: 'select',
        label: '关联纱线等级:',
        // filterable: true,
        rules: [commonChangeReg],
        change: (value, form, formDatas, setFormDatas) => {
          console.log(value)
          // this.$set(this.popOptions.formDatas, 'gradeRule', 'nt')
          setFormDatas({ gradeRule: '' })
          this.$set(this.physicalSurveyItemsContent._gradeRule, 'disabled', value !== 1)
          this.$set(this.physicalSurveyItemsContent._gradeRule, 'rules', value !== 1 ? [] : [commonChangeReg])
        },
        dataSource: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]
      },
      '_gradeRule': {
        prop: 'gradeRule',
        itemType: 'select',
        label: '等级规则:',
        disabled: true,
        rules: [],
        // filterable: true,
        dataSource: [
          // {
          //   label: ' ',
          //   value: 'nt'
          // },
          {
            label: '≤',
            value: 'le'
          },
          {
            label: '≥',
            value: 'ge'
          }
        ]
      },
      '_orders': {
        prop: 'orders',
        itemType: 'input',
        label: '顺序:',
        rules: [commonBlurReg, max999Reg],
        placeholder: '请输入0~999的整数'
      },
      '_remarks': {
        prop: 'remarks',
        type: 'textarea',
        itemType: 'input',
        autosize: { minRows: 2, maxRows: 4 },
        label: '备注:',
        maxlength: 200,
        trim: (value) => {
          return value
        },
        // rules: [commonChangeReg],
        placeholder: '请输入'
      }
    }
    // 执行标准弹出框内容
    const executiveStandardContent = {
      '_name': {
        prop: 'name',
        itemType: 'input',
        label: '中文名:',
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请输入,最多50字'
      },
      '_nameEn': {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名:',
        maxlength: 50,
        placeholder: '请输入,最多50字'
      },
      '_remarks': {
        prop: 'remarks',
        type: 'textarea',
        itemType: 'input',
        autosize: { minRows: 2, maxRows: 4 },
        label: '备注:',
        maxlength: 200,
        trim: (value) => {
          return value
        },
        // rules: [commonChangeReg],
        placeholder: '请输入,最多200字'
      }
    }
    // 弹出框配置
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log(params)
        switch (this.activeName) {
          case '1':
            this.addOrEditYarnGrade(params)
            break
          case '2':
            this.addOrEditPhysicalSurveyItems(params)
            break
          case '3':
            this.addOrEditExecutiveStandard(params)
            break

          default:
            break
        }
      },
      okText: '保存',
      cancel: params => {
        this.closePopDialogHandle(this.popOptions)
        // console.log(params)
      },
      formDatas: {
        proportion: '',
        isRelationYarnGrade: 0,
        orders: 0
      },
      formOptions: {
        popError: true,
        getResetErrors: (prop, flag, errmsg, errors) => {
          // console.log(prop, flag, errmsg, errors)
          // errors = {}
          const errorsData = { ...errors }
          const dataArray = prop.split('.')
          if (dataArray.includes('yarnGradeAttrConfig') && flag) {
            // errorsData
            ['gradeE', 'gradeD', 'gradeC', 'gradeB', 'gradeA'].forEach(item => {
              errorsData[dataArray[0] + '.' + dataArray[1] + '.' + item] = undefined
            })
          } else {
            // errorsData[prop] = errmsg
            // this.$nextTick(() => {
            //   errorsData[prop] = errmsg
            // })
          }
          // console.log(errorsData)
          return errorsData
        }
        // : () = {}
      },
      content: yarnGradeContent
    }

    return {
      physicaPopOperatesDataSource,
      executivePopOperatesDataSource,
      // ruleRequire: [{ validator, trigger: 'change' }],

      yarnGradeSearchData,
      noYarnGradeSearchData,
      formDatas: {},
      formOtions: { inline: true, size: 'small', layout: true },
      activeName: '1',

      yarnGradeColumns,
      physicalSurveyItemsColumns,
      executiveStandardColumns,
      columns: yarnGradeColumns,
      dataSource: [],
      popOperates,
      showPopOperates: null,

      yarnGradePagination,
      physicalSurveyItemsPagination,
      executiveStandardPagination,
      pagination: yarnGradePagination,

      popColumns,
      yarnGradeContent,
      physicalSurveyItemsContent,
      executiveStandardContent,
      popOptions,

      searchFormDatas: {},
      type: 'add',

      currentRowKey: '0',
      fiveUuid: '',
      // permissionFlag: false,
      clickHeader: false, // 点击表头
      ordersList: [],

      yarnGradeInfo: '', // 获取纱线等级详情存一份数据
      physicalSurveyItemsInfo: '', // 获取物测项目详情存一份数据
      executiveStandardInfo: '' // 获取执行标准详情存一份数据

      // gradeGroup: []
    }
  },
  computed: {
    // addIsShow() {
    //   const arr = ['baseData:qa:yarnGradeConfig:add', 'baseData:qa:pysicalSurveyConfig:add', 'baseData:qa:executivsStandardConfig:add']
    //   return this.$permission([arr[this.activeName]])
    // }
  },
  watch: {
    type: {
      handler(v) {
        // console.log(v)
        // const obj = { yarnGradeContent: ['ingredients', 'proportion', 'yarnCount', 'cardingMethod', 'spinningMethod'], physicalSurveyItemsContent: ['name', 'isRelationYarnGrade', 'gradeRule'], executiveStandardContent: ['name'] }

        // obj.yarnGradeContent.forEach(item => {
        //   this.$set(this.yarnGradeContent['_' + item], 'disabled', v === 'edit')
        // })

        // obj.physicalSurveyItemsContent.forEach(item => {
        //   this.$set(this.physicalSurveyItemsContent['_' + item], 'disabled', v === 'edit')
        // })

        // obj.executiveStandardContent.forEach(item => {
        //   this.$set(this.executiveStandardContent['_' + item], 'disabled', v === 'edit')
        // })
      }
    }
    // activeName: {
    //   handler(v) {
    //     if (v !== '1') {
    //       const arrData = [
    //         ['baseData:qa:pysicalSurveyConfig:modify', 'baseData:qa:pysicalSurveyConfig:delete', 'baseData:qa:pysicalSurveyConfig:audited'],
    //         ['baseData:qa:executivsStandardConfig:modify', 'baseData:qa:executivsStandardConfig:delete', 'baseData:qa:executivsStandardConfig:audited']
    //       ]
    //       debugger
    //       let popOperatesDataSource = this.$utils.deepClone(this.popOperatesDataSource)
    //       popOperatesDataSource.forEach((item, index) => {
    //         item.permitTag = [arrData[v - 1][index]]
    //       })
    //       popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    //       console.log(popOperatesDataSource)
    //       this.popOperates.dataSource = popOperatesDataSource
    //     }
    //   }
    // }
  },
  created() {
    this.permissionFlag = true
    this.yarnGradePage({})
    this.physicalSurveyItemsList({})
  },
  methods: {
    handleClick() {
      switch (this.activeName) {
        case '1':
          this.showPopOperates = null
          // this.columns = this.yarnGradeColumns
          this.formOtions.layout = true
          this.$set(this.popOptions, 'content', this.yarnGradeContent)
          this.$set(this.popOptions.formOptions, 'labelWidth', '114px')
          this.pagination = this.yarnGradePagination
          this.yarnGradePage({})
          this.physicalSurveyItemsList({})
          break
        case '2':
          this.popOperates.dataSource = this.physicaPopOperatesDataSource
          this.showPopOperates = this.popOperates
          this.columns = this.physicalSurveyItemsColumns
          this.formOtions.layout = false
          this.$set(this.popOptions, 'content', this.physicalSurveyItemsContent)
          this.$set(this.popOptions.formOptions, 'labelWidth', '110px')
          this.pagination = this.physicalSurveyItemsPagination
          this.physicalSurveyItemsPage({})
          break
        case '3':
          this.popOperates.dataSource = this.executivePopOperatesDataSource
          this.showPopOperates = this.popOperates
          this.columns = this.executiveStandardColumns
          this.formOtions.layout = false
          this.$set(this.popOptions, 'content', this.executiveStandardContent)
          this.$set(this.popOptions.formOptions, 'labelWidth', '68px')
          this.pagination = this.executiveStandardPagination
          this.executiveStandardPage({})
          break

        default:
          break
      }
      // this.formDatas = {}
      // console.log(this.$refs.searchForm)
      this.$refs.searchForm.form.resetFields()
      this.searchFormDatas = {}
    },

    // 行点击事件
    rowClick(row, column, event) {
      if (this.activeName === '1') {
        console.log(row, column, event)
        this.fiveUuid = row.uuid
        this.currentRowKey = row.attrMd5
      }
    },
    // 高亮行样式事件
    currentRowClassName({ row, rowIndex }) {
      // console.log(row, rowIndex)
      if (this.currentRowKey === row.attrMd5) {
        return 'currentRowClassName'
        // {
        //   'background-color': '#d8eafd'
        // }
      } else {
        return ''
      }
    },

    // 排序点击事件
    // sortChange({ column, prop, order }) {
    //   console.log(111, column, prop, order)
    // },

    // 表头classname
    // handleHeaderClass({ column }) {
    //   console.log(column)
    //   column.order = column.multiOrder
    // }

    handleOrderChange(orderColumn, orderState) {
      const result = this.ordersList.find(e => e.orderColumn === orderColumn)
      if (result) {
        // result.orderState = orderState
        const index = this.ordersList.findIndex(n => n.orderColumn === result.orderColumn)
        this.ordersList[index].orderState = orderState
      } else { // 第一次没有找到，push点击的字段和排序到orderList
        this.ordersList.push({
          orderColumn: orderColumn,
          orderState: orderState
        })
      }
      this.searchFormDatas.asc = this.ordersList.filter(n => n.orderState === 'ascending').map(n => n.orderColumn === 'orders' ? '1' : '2').join() || '' // 升序
      this.searchFormDatas.desc = this.ordersList.filter(n => n.orderState === 'descending').map(n => n.orderColumn === 'orders' ? '1' : '2').join() || '' // 降序
      // 调接口查询，在传参的时候把ordersList进行处理成后端想要的格式
      // this.load()
      if (this.activeName === '2') {
        this.physicalSurveyItemsPage()
      }
    },
    handleHeaderClass({ column }) {
      console.log(column)
      column.order = column.multiOrder
    },
    /**
     * 排序点击事件
     */
    sortChange({ column, prop, order }) {
      console.log('--changeSort--')
      console.log(column, prop, order)
      // 有些列不需要排序，提前返回
      if (column.sortable !== 'custom') {
        return
      }
      if (!column.multiOrder) {
        column.multiOrder = 'descending'
      } else if (column.multiOrder === 'descending') {
        column.multiOrder = 'ascending'
      } else {
        column.multiOrder = ''
      }
      this.handleOrderChange(column.property, column.multiOrder)
    }
  }
}
</script>

<style lang='scss'>
.physical-survey-items {
  // background-color: #fff;
  padding: 20px;
  .tab-group {
    position: relative;
    padding-bottom: 1px;

    .right-button {
      position: absolute;
      right: 20px;
      top: 13px;
    }
  }

  .otherSearch {
    .el-form-item__label-wrap {
      margin-left: 0!important;
    }
  }

  .commonTabs {
    // position: relative;
    background-color: #fff;
    // flex: 1;
    padding: 20px 0 1px;
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
    // .el-tabs__content {
    //   margin: 0 -40px;
    // }
  }

  .table .el-table .el-table__row.heightRow {
      cursor: pointer;
  }
  .table .el-table .el-table__row.current-row.heightRow {
      > td {
        color: #666;
        background-color: #d8eafd !important;
      }
  }

  .yarn-table {
    thead {
      th {
        height: 40px;
        background-color: #f5f7fa;
      }
    }
    .el-table__body tr {
      cursor: pointer;
    }
    .el-table__body tr.hover-row td {
      background: transparent;
    }
    .el-table__body tr.currentRowClassName td {
      background-color: transparent;
    }
    .el-table__body .currentRowClassName {
      background-color: #d8eafd;
    }
    tr:nth-child(even) {
      background-color: #fff;
    }
    tbody .el-table__row td {
      border-bottom-width: 1px;
    }
  }
  .pop-table {
    .cell {
      padding: 0;
    }
    .el-input__inner{
      border: none;
      height: 30px;
      line-height: 30px;
      border-radius: 0;
    }
    .el-table--mini th, .el-table--mini td{
      padding: 0;
    }
    .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus{
      border:1px solid #ff4949;
    }
  }
  .pop-table .el-table--mini th, .el-table--mini td{
    padding: 0;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td{
    background-color: #FFFFFF;
  }
}
.popOptionsClass {
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }
}
.dynamic-header {
  width:70px;
  word-break:keep-all;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
</style>
