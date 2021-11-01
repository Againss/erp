<template>
  <div class="settingPage">
    <!-- tab切换 -->
    <div class="tabs">
      <el-tabs v-model="firstActiveName" :before-leave="beforeLeave" @tab-click="firstHandleClick">
        <el-tab-pane
          v-for="(item, index) in tabData"
          :key="index"
          :label="item.typeName"
          :name="item.typeName"
        />
      </el-tabs>
      <div class="tabs2" style="margin: 0 10px">
        <el-tabs v-if="firstActiveName !== '评价设置'" v-model="activeName" @tab-click="secondHandleClick">
          <el-tab-pane
            v-for="(item, indexs) in secondTabOption"
            :key="`${indexs}${item}${activeName}`"
            :label="item.label"
            :name="item.label"
          />
        </el-tabs>
      </div>
    </div>

    <!-- 新增考核比重 -->
    <div v-if="firstActiveName !== '评价设置'" class="newbButton">
      <el-button
        v-permission="['srm:basicData:assessSpecific:add', 'srm:dimension:add']"
        size="small"
        type="primary"
        @click="addClick"
      >新增</el-button>
    </div>
    <!-- 新增 -->
    <div v-if="firstActiveName !== '评价设置' && activeName === '考核比重'" class="saveButton">
      <el-button
        v-permission="['srm:basicData:assessSpecific:modify']"
        size="small"
        type="primary"
        @click="tabClick"
      >保存</el-button>
    </div>
    <!-- 评价设置的保存和取消 -->
    <!-- 新增 -->
    <!-- style="background: red" -->
    <div v-if="firstActiveName === '评价设置'">
      <div v-if="scoreTrue === false">
        <div class="cancelButton">
          <el-button
            size="small"
            type="primary"
            @click="cencelClick"
          >取消</el-button>
        </div>
        <div class="button">
          <el-button
            size="small"
            type="primary"
            @click="submitClick"
          >保存</el-button>
        </div>
      </div>
      <div v-if="scoreTrue" class="button">
        <el-button
          v-permission="['srm:evaluation:modify']"
          size="small"
          type="primary"
          @click="editClick"
        >编辑</el-button>
      </div>
    </div>

    <div v-if="firstActiveName === '评价设置'">
      <div class="lastPart">
        <p>评价设置必填</p>
        <div v-permission="['srm:evaluation:info']">
          分数小于
          <!-- value=value.replace(/^(0+)|[^\d]+/g,'') -->
          <input
            v-if="scoreTrue === false"
            v-model="score"
            oninput="value=value.replace(/[^\d]+/g,'')"
            placeholder="请输入0~100"
            type="text"
            @input="inputValue"
          >
          <span v-if="scoreTrue">{{ score }}</span>
          分时，评价必填。</div>
      </div>
    </div>
    <div v-else>
      <!-- 表格内容 -->
      <div v-if="activeName === '考核比重'" class="page-table">
        <cs-custom-table
          :columns="weightColumns"
          :table-scrollx="true"
          :data-source="dataSource"
          :operates="assessOperates"
          :pagination="pagination"
          edit-type="pop"
        />
      </div>
      <div v-else-if="activeName === '考核维度'" class="page-table">
        <cs-custom-table
          :columns="dimenColumns"
          :table-scrollx="true"
          :data-source="dimenDataSource"
          :operates="popOperates"
          :pagination="pagination"
          edit-type="pop"
        />
      </div>
    </div>
    <!-- 考核比重pop弹出层 -->
    <div v-if="activeName === '考核比重'" class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
    <!-- 考核维度pop弹出层 -->
    <div v-if="activeName === '考核维度'" class="dimenPop">
      <cs-custom-pop :options="dimenOptions" />
    </div>
  </div>
</template>

<script>
import SwitchStatus from '@/views/srm/public/components/switch-status'
import { weightPage, weightUpdate, weightDetail, dimensionPage, dimensionDelete, dimensionAdd, dimensionUpdate, dimensionDetail, dimensionEnabled, reviewPage, reviewDetail, reviewUpdate } from './api/index.js'
import { PublicSrm } from '@/views/srm/masic-data/appraisal-settings/components/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import newDementpart from './components/newDementpart.vue'
import { fetchLog } from '@/views/srm/public/fetchLog'
import { deepClone } from '@/utils/index.js'
export default {
  name: '',
  mixins: [PublicSrm, fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    var validRule = (rule, value, callback) => {
      console.log('value', value, rule)
      if (!value || value === '0' || value === '.') {
        callback(new Error('请输入最多2位小数的正数'))
      } else if (parseInt(value) > 100) {
        callback(new Error('请输入小于100的正数'))
      }
      return callback()
    }
    var filterVal = (val) => {
      val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      return val
    }
    // 一级页签
    const tabData = [
      { typeName: '针织厂', id: 10003 },
      { typeName: '染整厂', id: 10001 },
      { typeName: '印花厂', id: 10004 },
      { typeName: '染纱厂', id: 10002 },
      { typeName: '梭织厂', id: 10005 },
      { typeName: '评价设置', id: 100005 }
    ]
    // 二级页签内容
    const secondTabOption = [
      { label: '考核比重', value: 0 },
      { label: '考核维度', value: 1 }
    ]
    // 考核比重--表格表头的配置信息
    const weightColumns = {
      _index: {
        prop: 'index',
        label: '序号',
        minWidth: '50',
        formater: (scope) => {
          return (
            scope.$index + 1
          )
        }
      },
      _assessDimension: {
        prop: 'assessDimension',
        label: '考核维度',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row ? scope.row.assessDimension.label ? scope.row.assessDimension.label : scope.row.assessDimension : ''
        }
      },
      _assessDepartmentName: {
        prop: 'assessDepartmentName',
        label: '考核人',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => {
          const labelName = []
          if (scope.row) {
            (scope.row.user || []).forEach(val => {
              labelName.push(val.label)
            })
          }
          return labelName.join('/')
        }
      },
      _specifics: {
        prop: 'specifics',
        label: '考核比重(%)',
        minWidth: '150',
        showOverflowTooltip: true
      }
    }
    // 考核维度--表格表头的配置信息
    const dimenColumns = {
      _index: {
        prop: 'index',
        label: '序号',
        minWidth: '50',
        formater: (scope) => {
          return (
            scope.$index + 1
          )
        }
      },
      _dimension: {
        prop: 'dimension',
        label: '考核维度',
        minWidth: '150',
        showOverflowTooltip: true
      },
      _status: {
        prop: 'status',
        label: '状态',
        components: {
          SwitchStatus
        },
        componentsOptions: {
          formatter: (scope) => scope.row.status === 1 ? '1' : '0',
          changeHandel: (scope) => {
            this.chanStatus({ id: scope.row.id, status: scope.row.status * 1 ? 0 : 1 })
          },
          permission: 'srm:dimension:status'
        }
      }
    }
    // 新增考核比重自定义组件
    const weightContent = [
      {
        components: {
          newDementpart
        }
      }
    ]
    // 新增弹窗中的字段--考核维度的弹框
    const dimenContent = {
      '_dimension': {
        prop: 'dimension',
        itemType: 'input',
        label: '考核维度',
        labelClassName: 'dimenClass',
        clearable: true,
        maxlength: 20
      }
    }
    // 考核比重的操作栏
    const assessOperates = {
      label: '操作',
      width: '120',
      dataSource: [
        {
          label: '编辑',
          permitTag: ['srm:basicData:assessSpecific:modify'],
          isShow: true,
          handle: (scope) => {
            this.type = 'edit'
            this.PopDialogHandle('编辑')
            // 点击编辑时，获取维度下拉的列表
            this.getDimen()
            // // 编辑获取详情内容
            // this.editList({ id: scope.row.id }, scope.row.index)
            this.assessEdit({ ...scope.row }, scope.$index)
          }
        },
        {
          label: '删除',
          permitTag: ['srm:basicData:assessSpecific:delete'],
          isShow: true,
          style: { 'color': '#FE4949' },
          handle: (scope) => {
            this.$confirm('确认删除当前数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              customClass: 'customClass'
            })
              .then(() => {
                this.dataSource.splice(scope.$index, 1)
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          }
        }
      ]
    }
    // 考核维度的操作栏
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['srm:dimension:modify'],
        isShow: true,
        handle: scope => {
          this.type = 'edit'
          this.PopDialogHandle('编辑')
          // 点击编辑时，获取维度下拉的列表
          this.getDimen()
          this.$set(this.dimenOptions, 'content', dimenContent)
          // 编辑获取详情内容
          this.editList({ id: scope.row.id }, scope.row.index)
        }
      },
      {
        label: '删除',
        permitTag: ['srm:dimension:delete'],
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.deleteData(scope.row.id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.getRulePage({ pageNum: this.pagination.pageNum, pageSize: val })
      }
    }
    // 这是考核比重弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增',
      okText: '保存',
      ok: params => {
        this.addOrEdit(params)
      },
      beforeClose: (form, formDatas) => {
        // const params = formDatas()
        // const flag = dataComparision(this.oldForm, params, this.type)
        // this.CompaCallback(flag)
        this.$set(this.popOptions, 'visible', false)
      },
      cancel: (params) => {
        // const flag = dataComparision(this.oldForm, params, this.type)
        // this.CompaCallback(flag)
        this.$set(this.popOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {},
      content: {
        _assessDimension: {
          prop: 'assessDimension',
          itemType: 'select',
          label: '考核维度',
          dataSource: [],
          valueType: 'object',
          clearable: true,
          placeholder: '请选择',
          rules: [{
            ...commonBlurReg,
            message: '此项不能为空！',
            trigger: ['change']
          }]
        },
        _mab: {
          componentsOptions: {
            testId: '',
            testList: []
          },
          components: {
            newDementpart
          }
        },
        // ...weightContent,
        _specifics: {
          prop: 'specifics',
          itemType: 'input',
          label: '考核比重%',
          trim: (val) => {
            return filterVal(val)
          },
          rules: [
            commonBlurReg,
            {
              validator: validRule,
              trigger: ['blur']
            }]
        }
      }
    }
    // 这是考核维度弹出层用的配置信息
    const dimenOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增',
      okText: '保存',
      ok: params => {
        this.addOrEdit(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: dimenContent
    }
    return {
      activeName: '',
      activeIndex: 0,
      firstActiveName: '',
      firstActiveIndex: 0,
      secondTabOption,
      tabData,
      weightColumns,
      dimenColumns,
      pagination,
      assessOperates,
      popOperates,
      dataSource: [], // 考核比重的dataSource
      copyData: [], // 拷贝数据
      dimenDataSource: [], // 考核维度的dataSource
      popOptions,
      dimenOptions,
      getIndex: '',
      weightContent,
      dimenContent, // 考核维度新增弹框
      factoryId: '', // 厂商类型id
      score: '', // input中的内容
      scoreTrue: false, // 判断分数输入框编辑或者是不可编辑
      scoreList: [], // 分数的数组
      pamraskey: [],
      rowInfoMessages: {}, // 日志先后拿到的信息
      oldForm: {} // 旧详情数据
    }
  },
  computed: {
  },
  watch: {},
  created() {
    this.getTabData()
  },
  methods: {
    // 获取纱属性页签数据
    async getTabData() {
      this.firstActiveName = this.tabData[0].typeName || ''
      this.activeName = this.secondTabOption[0].label || ''
      this.factoryId = this.tabData[0].id
      this.getRulePage(this.factoryId)
    },
    // 获取维度下拉
    async getDimen() {
      const res = await dimensionPage({ serviceProviderId: this.factoryId, status: 1 })
      if (res.code === 200) {
        const dimenData = (res.data || []).map((item) => {
          return { value: item.id, label: item.dimension }
        })
        this.$set(this.popOptions.content._assessDimension, 'dataSource', dimenData)
      }
    },
    // 列表数据
    async getRulePage(data = {}) {
      const res = this.activeName === '考核比重' ? await weightPage({ serviceProviderId: data }) : await dimensionPage({ serviceProviderId: data })
      if (this.activeName === '考核比重') {
        this.dataSource = res.data ? res.data.list ? res.data.list : [] : []
        this.copyData = deepClone(this.dataSource)
      } else {
        this.dimenDataSource = res.data ? res.data : []
      }
    },
    // 一级tab切换
    firstHandleClick(e, val, oldval) {
      this.firstActiveIndex = e.index
      this.factoryId = this.tabData[e.index].id
      if (this.tabData[e.index].typeName === '评价设置') {
        this.getReview()
      } else {
        this.activeIndex = 0
        this.activeName = this.secondTabOption[0].label
        this.getRulePage(this.factoryId)
      }
    },
    // 确定两个数组是否相等--另外一种方法
    makeEqu(a, b) {
      if (a.length !== b.length) {
        return false
      } else {
        for (let i = 0; i < a.length; i++) {
          // 必须要判断里面的每个值
          if (a[i] !== b[i]) {
            return false
          }
        }
        return true
      }
    },
    beforeLeave(activeName, oldActiveName) {
      // this.copyData是接口拿到的老数据，，this.dataSource是最新的数据
      const editTrue = JSON.stringify(this.dataSource) === JSON.stringify(this.copyData)
      if (parseInt(activeName) === 0 || oldActiveName === 'undefined' || parseInt(oldActiveName) === 0) {
        return false
      } else if (activeName && oldActiveName && this.dataSource.find(val => !val.hasOwnProperty('id')) || activeName && oldActiveName && !editTrue || activeName && oldActiveName === '评价设置' && !this.scoreTrue) {
        return new Promise((resolve, reject) => {
          this.$confirm('数据还未保存， 确定要离开页面吗？', {
            type: 'warning'
          }).then(e => {
            resolve('确定')
          }).catch(e => {
            let valId = ''
            this.tabData.find(val => {
              if (val.typeName === oldActiveName) {
                valId = val.id
              }
            })
            this.getRulePage(valId)
            reject('取消')
          })
        })
      }
    },
    // 二级tab切换
    secondHandleClick(e) {
      this.activeIndex = e.index
      this.getRulePage(this.factoryId)
    },
    // 走评价设置的列表接口
    async getReview(data = {}) {
      const res = await reviewPage(data)
      if (res.code !== 200) {
        return false
      }
      // 分数接口获取整体数据
      this.scoreList = res.data
      this.score = res.data ? res.data[0].score : ''
      // 如果有值就为true；没值就为false；特殊情况：有时为0时也要为true
      if (this.score || this.score === 0) {
        this.scoreTrue = true
      } else {
        this.scoreTrue = false
      }
    },
    inputValue() {
      // 前端限制只能输入0
      if (this.score === '00') {
        this.score = '0'
      }
      if (parseInt(this.score) > 100) {
        this.$message({
          type: 'info',
          message: '请输入0~100的数值!'
        })
        return false
      }
    },
    // 评价设置走保存接口
    async submitClick() {
      if (this.score === '' || this.score < 0 || this.score > 100) {
        this.$message({
          type: 'info',
          message: '请输入0~100的数值!'
        })
        return false
      }
      const res = await reviewUpdate({ id: this.scoreList ? this.scoreList[0].id : '', score: this.score })
      if (res.code !== 200) {
        return false
      }
      this.scoreTrue = true
    },
    // 评价设置--点击编辑走详情接口
    async editClick() {
      this.scoreTrue = false
      const res = await reviewDetail({ id: this.scoreList ? this.scoreList[0].id : '' })
      if (res.code !== 200) {
        return false
      }
      this.score = res.data ? res.data.score : ''
    },
    // 评价设置走取消接口
    cencelClick() {
      this.$confirm(' 你确认要取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.scoreTrue = true
          this.getReview()
        })
    },
    // 点击新增
    addClick() {
      this.type = 'add'
      this.PopDialogHandle('新增')
      if (this.activeName === '考核比重') {
        // 新增窗口打开获取维度下拉列表
        this.getDimen()
        this.$set(this.popOptions, 'formDatas', {})
      } else if (this.activeName === '考核维度') {
        this.$set(this.dimenOptions, 'content', this.dimenContent)
        this.$set(this.dimenOptions, 'formDatas', {})
      }
    },
    PopDialogHandle(val) {
      if (this.activeName === '考核比重') {
        this.$set(this.popOptions, 'visible', !this.popOptions.visible)
        if (val) {
          this.$set(this.popOptions, 'title', val)
        }
      } else if (this.activeName === '考核维度') {
        this.$set(this.dimenOptions, 'visible', !this.dimenOptions.visible)
        if (val) {
          this.$set(this.dimenOptions, 'title', val)
        }
      }
    },
    addOrEdit(params) {
      if (this.type === 'add') {
        if (this.activeName === '考核维度') {
          const obj = {}
          const pamraskey = ['dimension']
          pamraskey.forEach(v => {
            obj[v] = params[v]
          })
          // 走新增接口
          this.deAdd(obj)
        } else if (this.activeName === '考核比重') {
          const obj = {}
          // departmentTest只是获取部门的下拉数组
          const pamraskey = ['assessDimension', 'department', 'departmentTest', 'user', 'specifics']
          pamraskey.forEach(v => {
            obj[v] = params[v]
          })
          this.addData(obj)
        }
      } else if (this.type === 'edit') {
        if (this.activeName === '考核维度') {
          const obj = {}
          const pamraskey = ['id', 'dimension']
          pamraskey.forEach(v => {
            obj[v] = params[v]
          })
          // 走更新接口
          this.addUpdate(obj)
        } else if (this.activeName === '考核比重') {
          const obj = {}
          const pamraskey = ['id', 'assessDimension', 'department', 'departmentTest', 'user', 'specifics']
          pamraskey.forEach(v => {
            obj[v] = params[v]
          })
          this.updateData(obj)
        }
      }
    },
    // 新增接口--考核比重
    async addData(data) {
      // 把数据存储到前端内存中
      if (parseInt(this.firstActiveIndex) === 0) {
        this.dataSource.push(data)
      } else if (parseInt(this.firstActiveIndex) === 1) {
        this.dataSource.push(data)
      } else if (parseInt(this.firstActiveIndex) === 2) {
        this.dataSource.push(data)
      } else if (parseInt(this.firstActiveIndex) === 3) {
        this.dataSource.push(data)
      } else if (parseInt(this.firstActiveIndex) === 4) {
        this.dataSource.push(data)
      }
      this.$set(this.popOptions, 'visible', false)
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    // 新增接口--考核维度
    async deAdd(data) {
      const res = await dimensionAdd({ serviceProviderId: this.factoryId, ...data })
      if (res.code !== 200) {
        return false
      }
      this.$set(this.dimenOptions, 'visible', false)
      this.getRulePage(this.factoryId)
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      this.fetchLog(this.getLogMessages('INSERT', '/srm/assessSpecific/dimension/add'), data, JSON.stringify({ beforeText: `在'供应商采购管理-考核设置维度页面, 新增一条记录`, beforeCode: data }))
    },
    // 考核比重的保存按钮
    async tabClick() {
      let arrNew = []
      arrNew = this.dataSource
      // 前端做一个限制
      if (this.dataSource && this.dataSource.length === 0) {
        this.$message({
          type: 'info',
          message: '请先增加数据!'
        })
        return false
      }
      var allNum = null
      this.dataSource.forEach((val) => {
        allNum += (Number(val.specifics))
      })
      if (Number(allNum) > 100 || Number(allNum) < 100) {
        this.$message({
          type: 'info',
          message: '考核比重之和必須等于100!'
        })
        return false
      }
      // 需要两个组合--1:如果id值存在的，2：id值不存在的
      const arrData = arrNew.map((item) => {
        if (item.id) {
          return {
            id: item.id,
            department: item.department,
            assessDimension: item.assessDimension,
            user: item.user,
            specifics: item.specifics
          }
        } else {
          return {
            department: item.departmentTest,
            assessDimension: item.assessDimension,
            user: item.user,
            specifics: item.specifics
          }
        }
      })
      const res = await weightUpdate({ serviceProviderId: this.factoryId, dataList: arrData })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '保存成功!'
      })
      // 增加保存的日志
      const { beforeCode, afterCode } = this.compareData(this.dataSource, arrData, 'id')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/srm/assessSpecific/evaluation/modify'), arrData, JSON.stringify({ beforeText: `在'供应商采购管理-考核设置比重页面'`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      // 获取考核比重的列表
      this.getRulePage(this.factoryId)
    },
    // 考核维度的更新的接口
    async addUpdate(data = {}) {
      const res = await dimensionUpdate({ serviceProviderId: this.factoryId, ...data })
      if (!res || res.code !== 200) {
        return false
      }
      this.activeIndex === 0 ? this.$set(this.popOptions, 'visible', false) : this.$set(this.dimenOptions, 'visible', false)
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'id')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/srm/assessSpecific/evaluation/modify'), data, JSON.stringify({ beforeText: `在'供应商采购管理-考核设置维度页面,将${JSON.stringify({ 'id': this.rowInfoMessages.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      this.getRulePage(this.factoryId)
    },
    // 考核比重的更新
    async updateData(data = {}) {
      this.dataSource[this.getIndex] = data
      if (data.departmentTest.length > 0) {
        this.dataSource[this.getIndex].department = data.departmentTest
      }
      this.dataSource = [...this.dataSource]
      this.$set(this.popOptions, 'visible', false)
    },
    // 弹框取消数据比较回调
    CompaCallback(hadInput) {
      if (hadInput) {
        this.$confirm('您已经输入内容，确认退出吗？', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(_ => {
            if (this.activeIndex === 0) {
              this.$set(this.popOptions, 'visible', false)
            } else {
              this.$set(this.dimenOptions, 'visible', false)
            }
          })
          .catch(_ => {
            if (this.activeIndex === 0) {
              this.$set(this.popOptions, 'visible', false)
            } else {
              this.$set(this.dimenOptions, 'visible', false)
            }
          })
      } else {
        this.$set(this.popOptions, 'visible', false)
        this.$set(this.dimenOptions, 'visible', false)
      }
    },
    // 详情接口
    async editList(data = {}, index) {
      const res = await dimensionDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      const editData = res.data || {}
      this.rowInfoMessages = { ...editData }
      // 把获取的值重新赋值给侧弹框中
      this.$set(this.dimenOptions, 'formDatas', editData)
      this.oldForm = { ...editData, index: index }
    },
    // 考核比重的编辑部分
    async assessEdit(data, index) {
      // 记录点击的是哪一条数据
      this.getIndex = index
      // 如果id值存在，，则通过接口查询详情
      if (data.id) {
        const editAssess = data.assessDimension
        const editdepart = data.department
        const editUser = data.user
        const editSpecifics = data.specifics
        const editObj = {
          id: data.id,
          assessDimension: editAssess,
          department: editdepart,
          user: editUser,
          specifics: editSpecifics
        }
        if (data.id) {
          const res = await weightDetail({ id: data.id })
          if (!res || res.code !== 200) {
            return false
          }
          const assData = res.data || {}
          console.log('dayin', res.data, assData)
          console.log('this.popOptions.content', this.popOptions.formDatas)
        }
        this.$set(this.popOptions, 'formDatas', editObj)
        this.$set(this.popOptions.formDatas, 'assessDimension', editObj.assessDimension)
        this.$set(this.popOptions.formDatas, 'department', editObj.department ? parseInt(editObj.department[0].value) : '')
        this.$set(this.popOptions.formDatas, 'departmentTest', editdepart)
        this.popOptions.content._mab.componentsOptions.testId = editObj.department
      } else {
        // 如果id值不存在，，通过当前行拿数据
        this.$set(this.popOptions, 'formDatas', data)
      }
    },
    // 启用禁用-改变状态
    async chanStatus(data) {
      const res = await dimensionEnabled(data)
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '更新成功!'
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/srm/assessSpecific/dimension/status'), data, JSON.stringify({ beforeText: `在'在'供应商采购管理-考核设置维度页面'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
      this.getRulePage(this.factoryId)
    },
    // 删除数据
    async deleteData(id) {
      const res = this.activeName === '考核比重' ? await weightPage({ serviceProviderId: this.factoryId }) : await dimensionDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.fetchLog(this.getLogMessages('DEL', '/srm/assessSpecific/dimension/delete'), { id }, JSON.stringify({ beforeText: `在'供应商采购管理-考核设置维度页面,删除一条记录`, beforeCode: { id }}))
      this.getRulePage(this.factoryId)
    }
  }
}
</script>

<style lang="scss" scoped>
.settingPage {
  position: relative;
  padding: 20px;
  padding-bottom: 0;
  /deep/.el-tabs__nav-wrap {
    padding-left: 26px;
    background: #fff;
    &::after {
      height: 1px;
    }
  }
  /deep/ .el-tabs__header {
    margin-bottom: 1px;
  }
  /deep/ .el-tabs__item {
    height: 60px;
    line-height: 60px;
    padding: 0 26px;
  }
  .newbButton{
    position: absolute;
    right: 40px;
    width: 68px;
    z-index: 8;
    top: 34px;
    button {
      width: 100%;
      background-color: #fff;
      color: #0986FF;
    }
  }
  .button {
    position: absolute;
    right: 40px;
    width: 68px;
    z-index: 8;
    top: 34px;
    button {
      width: 100%;
    }
  }
  .saveButton{
    position: absolute;
    right: 120px;
    width: 68px;
    z-index: 8;
    top: 34px;
    button {
      width: 100%;
    }
  }
  .cancelButton {
    position: absolute;
    right: 120px;
    width: 68px;
    z-index: 8;
    top: 34px;
    button {
      width: 100%;
      background-color: #fff;
      border-color: #DCDFE6;
      color: #666;
    }
  }
  .el-form.el-form-item .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
  /deep/.el-drawer__header {
    padding: 15px 20px;
    border: 1px solid #e9eff2;
    font-size: 18px;
    color: #151222;
  }
  /deep/.el-tabs__nav-next,
  /deep/.el-tabs__nav-prev {
    line-height: 60px;
  }
  // 评价设置的样式
  .lastPart{
    background-color: #fff;
    height: 300px;
    p {
      margin: 0px 20px 20px 20px;
      padding: 20px 0px;
      border-bottom: 1px solid #E9EFF2;
      font-size: 18px;
    }
    div{
      margin-left: 20px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #3C4043;
    }
    input{
      margin: 0px 10px;
      width: 120px;
      height: 30px;
      border: 1px solid #D0D8E0;
      border-radius: 4px;
      padding: 5px 10px;
    }
    span{
      color: #0986FF;
      font-size: 18px;
      margin: 0px 15px;
      padding: 5px 10px;
      border-bottom: 1px solid #BBC2D0;
    }
  }
  .dimenClass{
    width: 100px;
  }
  .tabs{
    background-color: #fff;
    .tabs2 /deep/ .el-tabs__item {
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
