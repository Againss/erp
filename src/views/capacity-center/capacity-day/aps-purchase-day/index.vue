<template>
  <div class="wrap-data-list">
    <!-- 搜索页面 -->
    <!-- <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div> -->
    <!-- 新增按钮 -->
    <div v-show="activeIdx !== '1' || activeIdx2 !== 'heather'" class="wrap-btns">
      <div class="button">
        <!-- 依次是 短纤常规 短纤纱类 -->
        <el-button
          v-if="(activeIdx === '1' && activeIdx2 === 'general' && $permission(['bmpAps:apsPurchaseDay:general:add']))
            || (activeIdx === '1' && activeIdx2 === 'yarn' && $permission(['bmpAps:apsPurchaseDay:yarn:add']))
            || (activeIdx === 'longFiber' && $permission(['bmpAps:apsPurchaseDay:longFiber:add']))"
          type="primary"
          size="small"
          @click="handleAdd"
        >新建</el-button>
      </div>
    </div>
    <div class="wrap-tabs">
      <div class="tabs">
        <el-tabs
          v-model="activeIdx"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="短纤"
            name="1"
          />
          <el-tab-pane
            label="长丝"
            name="longFiber"
          />
        </el-tabs>
      </div>
      <div
        v-show="activeIdx === '1'"
        class="tabs"
        style="margin: 0 10px"
      >
        <!-- @tab-click="" -->
        <el-tabs
          v-model="activeIdx2"
          class="tabs2"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="常规"
            name="general"
          />
          <el-tab-pane
            label="花灰"
            name="heather"
          />
          <el-tab-pane
            label="纱类"
            name="yarn"
          />
        </el-tabs>
      </div>
    </div>
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 分组编辑pop弹出层 -->
    <div class="pop">
      <cs-custom-pop
        ref="popForm"
        :options="popOptions"
      />
    </div>
  </div>
</template>

<script>
import { fetchLog } from '@/views/capacity-center/common/fetchLog'
import { checkNum } from '@/views/capacity-center/common/index'
import enableSwitch from '../components/enableSwitch'
import formCustom from '../components/form-custom.vue'
import * as api from './api/index'
import {
  getYarnTypes,
  combinedList,
  componentList
} from '../api/selectData'
export default {
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const checkNum2 = (rule, value, callback) => {
      if (parseInt(value) < parseInt(this.formModel.ltTenDays)) {
        return callback(new Error('数据要大于等于<=10T天数'))
      } else {
        callback()
      }
    }
    const checkNum3 = (rule, value, callback) => {
      let sum = 0
      let notNull = true
      for (let i = 0; i < this.elementLength; i++) {
        if (this.formModel['elementRatio' + i] || this.formModel['elementRatio' + i] === 0) {
          sum += parseInt(this.formModel['elementRatio' + i])
        } else notNull = false
      }
      if (notNull && sum !== 100) {
        return callback(new Error('比例之和须等于100'))
      } else {
        callback()
      }
    }
    // 表格表头的配置信息
    const columns = [
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'general' },
        prop: 'param',
        label: '纱支',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => { return scope.row.param && scope.row.param.label }
      },
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'heather' },
        prop: 'param',
        label: '染色适应性',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => { return scope.row.param && scope.row.param.label }
      },
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'yarn' },
        prop: 'param',
        label: '纱类',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => { return scope.row.param && scope.row.param.label }
      },
      {
        isShow: () => { return this.activeIdx === 'longFiber' },
        prop: 'param',
        label: '细度',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => { return scope.row.param && scope.row.param.label }
      },
      {
        isShow: () => { return this.activeIdx === 'longFiber' || this.activeIdx2 === 'general' },
        prop: 'element',
        label: '成份',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => { return scope.row.element && scope.row.element.label }
      },
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'general' },
        prop: 'elementRatio',
        label: '比例',
        minWidth: '120',
        showOverflowTooltip: true
        // formater: scope => { return scope.row.element.type }
      },
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'general' },
        prop: 'spinningMethod',
        label: '纺纱方法',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => { return scope.row.spinningMethod && scope.row.spinningMethod.label }
      },
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'general' },
        prop: 'cardingMethod',
        label: '梳棉方式',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => { return scope.row.cardingMethod && scope.row.cardingMethod.label }
      },
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'general' },
        prop: 'dyeingAdaptability',
        label: '染色适应性',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => { return scope.row.dyeingAdaptability && scope.row.dyeingAdaptability.label }
      },
      {
        prop: 'children',
        label: '大货天数',
        minWidth: '100',
        child: [
          {
            prop: 'ltTenDays',
            label: '<=10T',
            showOverflowTooltip: true
          },
          {
            prop: 'gtTenDays',
            label: '>10T',
            showOverflowTooltip: true
          }
        ]
      },
      {
        prop: 'sampleDays',
        label: '样板天数',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '100',
        showOverflowTooltip: true,
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'bmpAps:apsPurchaseDay:status',
          changeStatus: (scope) => {
            console.log(scope.row)
            this.enableStatus({ id: scope.row.id, status: scope.row.status })
          }
        }
      }
    ]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['bmpAps:apsPurchaseDay:general:modify'],
        isShow: true,
        handle: (scope) => {
          this.editFn(scope.row)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['bmpAps:apsPurchaseDay:delete'],
        isShow: () => {
          return this.activeIdx === '1' && this.activeIdx2 === 'general'
        },
        handle: (scope) => {
          this.deleteFn(scope.row)
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '200',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getRulePage({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getRulePage({ page: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const commont = [
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'general' },
        prop: 'param',
        itemType: 'select',
        label: '纱支',
        valueType: 'object',
        filterable: true,
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请选择纱支',
        dataSource: [],
        // change: (value) => {
        //   this.setName(value, 0, 'paramId', 'paramName')
        // },
        visibleChange: (value) => { value && this.selectDatasource(0, { categoryId: 9 }) }
      },
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'yarn' },
        prop: 'param',
        itemType: 'select',
        label: '纱类',
        filterable: true,
        valueType: 'object',
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请选择纱类',
        dataSource: [],
        // change: (value) => {
        // this.setName(value, 1, 'paramId', 'paramName')
        // },
        visibleChange: (value) => { value && this.selectDatasource(1, { categoryId: 1 }) }
      },
      {
        isShow: () => { return this.activeIdx === 'longFiber' },
        prop: 'param',
        itemType: 'select',
        valueType: 'object',
        label: '细度',
        filterable: true,
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请选择细度',
        dataSource: [],
        // change: (value) => {
        // this.setName(value, 2, 'paramId', 'paramName')
        // },
        visibleChange: (value) => { value && this.selectDatasource(2, { categoryId: 12 }) }
      },
      {
        isShow: () => { return this.activeIdx === 'longFiber' || this.activeIdx2 === 'general' },
        prop: 'element',
        valueType: 'object',
        valueKey: 'value',
        itemType: 'select',
        label: '成份',
        filterable: true,
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请选择成份',
        dataSource: [],
        change: (value) => {
          // this.setName(value, 3, 'elementId', 'elementName')
          console.log('成份', this.popOptions.formDatas)
          this.setElementRatio()
          this.$set(this.popOptions.formDatas, 'element', value)
        },
        visibleChange: (value) => { value && this.selectDatasource(3, {}) }
      },
      // {
      //   isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'general' },
      //   prop: 'elementRatio',
      //   itemType: 'input',
      //   label: '比例',
      //   maxlength: 10,
      //   rules: [commonBlurReg, { validator: checkNum, trigger: 'blur' }],
      //   placeholder: '请输入比例',
      //   children: [
      //     {
      //       prop: 'elementRatio0',
      //       itemType: 'input',
      //       label: '比例',
      //       maxlength: 10,
      //       span: 24,
      //       placeholder: '请输入'
      //     }
      //   ]
      // },
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'general' },
        prop: 'elementRatio',
        popoverOptions: {
          // placement: 'bottom'
        },
        // showMessage: false,
        itemType: 'input',
        label: '比例',
        require: true,
        rules: [commonBlurReg],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value.join('/')
        },
        components: [formCustom]
      },
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'general' },
        prop: 'spinningMethod',
        valueType: 'object',
        itemType: 'select',
        label: '纺纱方法',
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请选择纺纱方法',
        dataSource: [],
        // change: (value) => {
        // this.setName(value, 5, 'spinningMethod', 'spinningMethodId')
        // },
        visibleChange: (value) => { value && this.selectDatasource(5, { categoryId: 2 }) }
      },
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'general' },
        prop: 'cardingMethod',
        valueType: 'object',
        itemType: 'select',
        label: '梳棉方式',
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请选择梳棉方式',
        dataSource: [],
        // change: (value) => {
        // this.setName(value, 6, 'cardingMethodsId', 'cardingMethods')
        // },
        visibleChange: (value) => { value && this.selectDatasource(6, { categoryId: 3 }) }
      },
      {
        isShow: () => { return this.activeIdx === '1' && this.activeIdx2 === 'general' },
        prop: 'dyeingAdaptability',
        valueType: 'object',
        itemType: 'select',
        label: '染色适应性',
        filterable: true,
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请选择染色适应性',
        dataSource: [],
        // change: (value) => {
        // this.setName(value, 7, 'dyeingAdaptabilityId', 'dyeingAdaptability')
        // },
        visibleChange: (value) => { value && this.selectDatasource(7, { categoryId: 6 }) }
      },
      {
        prop: 'ltTenDays',
        itemType: 'input',
        label: '<=10T',
        clearable: true,
        maxlength: 4,
        rules: [commonBlurReg, { validator: checkNum, trigger: 'blur' }],
        placeholder: '请输入小于等于十吨天数'
      },
      {
        prop: 'gtTenDays',
        itemType: 'input',
        label: '>10T',
        clearable: true,
        maxlength: 4,
        rules: [commonBlurReg, { validator: checkNum, trigger: 'blur' }, { validator: checkNum2, trigger: 'blur' }],
        placeholder: '请输入大于十吨天数'
      },
      {
        prop: 'sampleDays',
        itemType: 'input',
        label: '样板天数',
        clearable: true,
        maxlength: 4,
        rules: [commonBlurReg, { validator: checkNum, trigger: 'blur' }],
        placeholder: '请输入样板天数'
      }
    ]
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新建',
      okText: '保存',
      cancelText: '取消',
      // saveAndaddText: "保存并继续",
      ok: (params) => {
        this.addOrEdit(params)
      },
      cancel: (params) => {
        this.$set(this.popOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {},
      content: commont
    }
    return {
      formOtions: {
        size: 'small',
        inline: true,
        layout: true
      },
      // formDatas: {},
      columns,
      commont,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      // editData: {},
      activeIdx: '1',
      activeIdx2: 'general',
      actions: {
        longFiber: {
          list: api.apsPurchaseDayLongFiberList,
          add: api.addApsPurchaseDayLongFiber,
          modify: api.modifyApsPurchaseDayLongFiber
        },
        general: {
          list: api.apsPurchaseDayGeneralList,
          add: api.addApsPurchaseDayGeneral,
          modify: api.modifyApsPurchaseDayGeneral
        },
        heather: {
          list: api.apsPurchaseDayHeatherList,
          modify: api.modifyApsPurchaseDayHeather
        },
        yarn: {
          list: api.apsPurchaseDayYarnList,
          add: api.addApsPurchaseDayYarn,
          modify: api.modifyApsPurchaseDayYarn
        }
      },
      getSelectData: {
        0: getYarnTypes,
        3: [componentList, combinedList]
      },
      commonBlurReg,
      elementLength: 1,
      checkNum3,
      objectKeys: ['param', 'element', 'spinningMethod', 'cardingMethod', 'dyeingAdaptability']
    }
  },
  computed: {
    // scrollWrapper() {
    //   return this.$refs.tabsScrollContainer.$refs.wrap
    // }
    formModel() {
      return this.$refs.popForm.$refs.popComponents.form.model
    }
  },
  mounted() { },
  created() {
    this.getRulePage()
  },
  methods: {
    // 修改
    editFn(row) {
      this.type = 'edit'
      // if (this.activeIdx === '1' && this.activeIdx2 === 'general') {
      //   row.elementRatio = row.element.type
      // }
      const data = this.$utils.deepClone(row)
      this.oldForm = row
      data.updatedBy ? delete data.updatedBy : ''
      data.updatedTime ? delete data.updatedTime : ''
      // data.elementName = 'A/B/C/D/A'
      for (let i = 0; i < this.objectKeys.length; i++) {
        if (data[this.objectKeys[i]]) {
          // data[this.objectKeys[i]] = {
          //   label: data[this.objectKeys[i]],
          //   value: data[this.objectKeys[i].replace('Name', '') + 'Id']
          // }
          for (let j = 0; j < this.popOptions.content.length; j++) {
            if (this.popOptions.content[j].prop === this.objectKeys[i]) {
              this.popOptions.content[j].dataSource = [data[this.objectKeys[i]]]
            }
          }
        }
      }
      this.$set(this.popOptions, 'formDatas', data)
      this.PopDialogHandle('编辑')
    },
    async enableStatus(data) {
      const res = await api.changeApsPurchaseDay(data)
      if (res.code === 200) {
        this.$message({
          message: '更新状态成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message ? res.message : '更新状态失败',
          type: 'error'
        })
      }
      this.fetchLog(this.getLogMessages('UPDATE', '/baseData/apsPurchaseDay/status'), data, JSON.stringify({ beforeText: `在'产能中心-生产天数设置-采购'${data.status === 0 ? '启用' : '停用'}一条数据`, beforeCode: data }))
      this.getRulePage({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      })
    },
    addOrEdit(submitData = {}, go) {
      let params = { ...submitData }
      console.log('submit', params)
      this.$refs.popForm.$refs.popComponents.form.validate(async(valid) => {
        if (valid) {
          // if (this.activeIdx === '1' && this.activeIdx2 === 'general') {
          //   params = this.insElementRatio(params)
          // }
          // params = this.insObject(params)
          if (this.activeIdx === '1' && this.activeIdx2 === 'general' && typeof params.elementRatio !== 'string') {
            params.elementRatio = params.elementRatio.join('/')
          }
          if (this.activeIdx === '1' && this.activeIdx2 === 'heather') {
            params = {
              gtTenDays: params.gtTenDays,
              ltTenDays: params.ltTenDays,
              sampleDays: params.sampleDays
            }
          }
          const pagetype = this.activeIdx === '1' ? this.activeIdx2 : this.activeIdx
          if (this.type === 'edit') {
            await this.actions[pagetype].modify(params)
            const { beforeCode, afterCode } = this.compareData(
              this.oldForm,
              params,
              'id'
            )
            const flag =
              JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag &&
              this.fetchLog(
                this.getLogMessages('UPDATE', '/baseData/apsPurchaseDay/modify'),
                params,
                JSON.stringify({
                  beforeText: `在'产能中心-生产天数设置-采购,将${JSON.stringify(
                    { id: params.id }
                  )}`,
                  afterText: '修改为',
                  ...{ beforeCode, afterCode }
                })
              )
            this.getRulePage({
              pageNum: this.pagination.currentPage,
              pageSize: this.pagination.pageSize
            })
          } else {
            await this.actions[pagetype].add(params)
            this.fetchLog(
              this.getLogMessages('INSERT', '/baseData/apsPurchaseDay/add'),
              params,
              JSON.stringify({
                beforeText: `在'产能中心-生产天数设置-采购,新增一条记录`,
                beforeCode: params
              })
            )
            this.getRulePage()
          }
          this.$set(this.popOptions, 'formDatas', {})
          this.$set(this.popOptions, 'visible', false)
          this.$message.success('保存成功')
          // this.getRulePage()
        }
      })
    },
    deleteFn(params) {
      this.$confirm(
        `确认删除当前数据吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.deleteList(params)
      }
      ).catch((_) => { })
    },
    async deleteList(data) {
      const res = await api.deleteApsPurchaseDay({ id: data.id })
      if (res.code === 200) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message ? res.message : '删除失败',
          type: 'error'
        })
      }
      this.fetchLog(this.getLogMessages('DELETE', '/baseData/apsPurchaseDay/delete'), data, JSON.stringify({ beforeText: `在'产能中心-生产天数设置-织布'删除一条数据`, beforeCode: data }))
      this.getRulePage()
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.popOptions.visible) {
        // this.setSelectData();
        if (this.type === 'edit') this.setElementRatio(this.popOptions.formDatas.elementRatio || '')
      }
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 列表查询
    async getRulePage(data = {}, isSearch) {
      const pagetype = this.activeIdx === '1' ? this.activeIdx2 : this.activeIdx
      const res = await this.actions[pagetype].list({
        ...data
      })
      this.dataSource = (res.data && res.data.list) || []
      this.pagination = {
        ...this.pagination,
        dataTotal: (res.data && res.data.total) || 0,
        ...data,
        currentPage: (res.data && res.data.pageNum) || 1,
        pageSize: (res.data && res.data.pageSize) || 20
      }
      if (!isSearch) {
        // this.setSearchSelect();
      }
    },
    // 新建
    handleAdd() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.PopDialogHandle('新建')
    },
    handleClick() {
      this.getRulePage()
    },
    async selectDatasource(index, data) {
      let resultList = []
      if (this.popOptions.content[index].dataSource.length <= 1) {
        if (index === 3) {
          const res1 = await this.getSelectData[index][0]()

          const res2 = await this.getSelectData[index][1]()
          const list1 = (res1.data && res1.data.list) || []
          const list2 = (res2.data && res2.data.list) || []
          resultList = list1.concat(list2)
          this.popOptions.content[index].dataSource = resultList.map(item => {
            return {
              label: item.name,
              value: item.uuid,
              names: item.names || item.name
            }
          })
        } else {
          const res = await this.getSelectData[0](data)
          resultList = (res.data && res.data.list) || []
          this.popOptions.content[index].dataSource = resultList.map(item => {
            return {
              label: item.name,
              value: item.uuid
            }
          })
        }
      }
    },
    setElementRatio(v) {
      let res = ''
      if (v || v === '') {
        if (v.includes('/')) {
          res = v.split('/')
        } else res = v
      } else {
        const model = this.formModel
        const elementList = model.element.names ? model.element.names.split('/') : model.element.label.split('/')
        if (elementList.length > 1) {
          res = new Array(elementList.length).fill('')
        } else res = '100'
      }
      this.$set(this.popOptions.formDatas, 'elementRatio', res)
    }
  }
}
</script>

<style lang='scss' scoped>
.wrap-data-list {
  padding: 20px;
  padding-bottom: 0px;
  .wrap-tabs {
    position: relative;
    padding-bottom: 0;
    min-height: 60px;
    background-color: #fff;
    .tabs {
      padding-bottom: 1px;
      border-bottom: 1px solid #dfe6ec;
      display: flex;
      // width: 100%;
      flex: 2;
      overflow-x: auto;
      overflow-y: hidden;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #3c4043;
      text-align: center;
      /deep/ .el-tabs__header {
        margin-bottom: 0px;
      }
      /deep/ .el-tabs__nav-wrap::after {
        height: 0px !important;
      }
      /deep/ .el-tabs__item {
        height: 60px;
        line-height: 60px;
        padding: 0 26px;
      }
      .tabs2 /deep/ .el-tabs__item {
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
      }
    }
  }
  .page-table /deep/ .el-table {
    border-top: none;
  }
  .page-table {
    margin-top: -1px;
  }
}
</style>

<style lang="scss">

</style>
