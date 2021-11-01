<!--
 * @Descripttion: HS Code
 * @version:
 * @Author: shujing
 * @Date: 2020-09-23 11:20:10
 * @LastEditors: anthony
 * @LastEditTime: 2021-03-19 14:15:55
-->

<template>
  <div class="hscode">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增角色按钮 -->
    <div class="button">
      <el-button
        v-permission="['basic:hsCode:store']"
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="addRange"
      >新增</el-button>
    </div>
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
        table-scrollx
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="hscodePop" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import {
  sysDataGroupIndex,
  sysDataGroupEnable,
  sysDataGroupAdd,
  sysDataGroupModify,
  sysDataGroupDelete,
  sysDataGroupExam,
  sysDataGroupInfo
} from './api/index.js'
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import { dataComparision } from '@/views/basic-data/common/index'
// import { filterOptions } from '@/views/basic-data/common/index'

export default {
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const validFormat = (rule, value, callback) => {
      if (!/^(\d{8}.\d{2})$/.test(value)) {
        callback(new Error('请输入8位数字，2位小数'))
      } else {
        callback()
      }
    }
    // 公共弹出框内容
    const commonContent = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'hsCode',
        itemType: 'input',
        label: 'HS Code',
        maxlength: 20,
        clearable: true,
        rules: [commonBlurReg, { validator: validFormat, trigger: 'change' }]
      },
      {
        prop: 'categoryId',
        itemType: 'select',
        label: '商品类别',
        clearable: true,
        dataSource: [
          {
            label: '抓毛或毛巾布',
            value: 'CH'
          },
          {
            label: '辅料',
            value: 'IN'
          },
          {
            label: '氨纶≥5%',
            value: 'SP'
          },
          {
            label: '不抓毛且氨纶<5%',
            value: 'DF'
          }
        ],
        rules: [{ required: true, message: '请选择商品类别' }]
      },
      {
        prop: 'componentId',
        itemType: 'select',
        label: '成份比例',
        clearable: true,
        dataSource: [
          {
            label: '棉>涤纶',
            value: 'CO'
          },
          {
            label: '棉<=涤纶',
            value: 'PO'
          },
          {
            label: '人造纤维>=棉或者涤纶',
            value: 'SO'
          }
        ],
        rules: [{ message: '请选择成份比例' }]
      },
      {
        prop: 'dyeMethod',
        itemType: 'select',
        label: '染整方法',
        clearable: true,
        // multiple: true,
        // props: { label: 'name', value: 'id' },
        rules: [{ message: '请选择染整方法', trigger: 'blur' }],
        // visibleChange: (value) => {
        //   if (value) {
        //     this.getdown()
        //   }
        // },
        dataSource: [
          {
            label: '漂白或半漂或未漂白',
            value: 'BL'
          },
          {
            label: '染色',
            value: 'DY'
          },
          {
            label: '色织',
            value: 'DK'
          },
          {
            label: '印花',
            value: 'PR'
          }
        ]
      },
      // {
      //   prop: 'isPrinting',
      //   itemType: 'radio-group',
      //   label: '是否印花',
      //   dataSource: [
      //     {
      //       label: '是',
      //       value: 'Y'
      //     },
      //     {
      //       label: '否',
      //       value: 'N'
      //     }
      //   ]
      // },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    // 查看弹出框内容
    const ownDepartment = [
      ...commonContent
    ]

    // 表格表头配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        width: '60'
      },
      {
        prop: 'hsCode',
        label: 'HS Code',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'category',
        label: '商品类别',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'component',
        label: '成份比例',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'knit',
        label: '染整方法',
        minWidth: '120',
        showOverflowTooltip: true
      },
      // {
      //   prop: 'printing',
      //   label: '是否印花',
      //   minWidth: '120',
      //   showOverflowTooltip: true
      // },
      {
        prop: 'remark',
        label: '备注',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'enabled',
        label: '禁用/启用',
        minWidth: '120',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:hsCode:enabled',
          changeStatus: (scope) => {
            // console.log(scope, 'scope')
            this.EnableStatus({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'statu',
        label: '状态',
        minWidth: '120',
        showOverflowTooltip: true
      }

    ]

    // 查询表单配置信息
    const searchData = [
      {
        prop: 'hsCode',
        itemType: 'input',
        clearable: true,
        label: 'HS Code:'
      },
      {
        prop: 'category',
        itemType: 'select',
        label: '商品类别:',
        clearable: true,
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '抓毛或毛巾布',
            value: 'CH'
          },
          {
            label: '辅料',
            value: 'FL'
          },
          {
            label: '氨纶≥5%',
            value: 'SP'
          },
          {
            label: '不抓毛且氨纶<5%',
            value: 'DF'
          }
        ]
      },
      {
        prop: 'component',
        itemType: 'select',
        label: '成份比例:',
        clearable: true,
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '棉>涤纶',
            value: 'CO'
          },
          {
            label: '棉<=涤纶',
            value: 'PO'
          },
          {
            label: '人造纤维>=棉或者涤纶',
            value: 'EG'
          }
        ]
      },
      {
        prop: 'enabled',
        itemType: 'select',
        label: '启用/禁用:',
        clearable: true,
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
            value: 'Y'
          },
          {
            label: '禁用',
            value: 'N'
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          // console.log('查询', params)
          this.getGroupPage(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          // console.log('重置')
        }
      }
    ]
    let popOperatesList = [
      {
        label: '审核',
        permitTag: ['basic:hsCode:approve'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: scope => {
          this.$confirm('确认审核当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'

          })
            .then(() => {
              this.examGroup({ id: scope.row.id })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消审核'
              })
            })
        }
      },
      {
        label: '编辑',
        permitTag: ['basic:hsCode:update'],
        isShow: true,
        handle: scope => {
          if (scope.row.status.code === 'P') {
            this.$set(this.ownDepartment[1], 'disabled', true)
          } else {
            this.$set(this.ownDepartment[1], 'disabled', false)
          }
          // const knitids = scope.row.knitDye.id || ''
          // this.ids = knitids.split('/')
          // this.ids = this.ids.map((i) => {
          //   // console.log(i);
          //   return parseInt(i)
          // })
          // console.log(this.ids);
          this.$set(this.popOptions, 'content', ownDepartment)
          // this.getdown()
          this.getGroupInfo({ id: scope.row.id }, scope)
          this.PopDialogHandle('编辑HS Code')
          this.type = 'edit'
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:hsCode:destroy'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'

          })
            .then(() => {
              this.deleteGroup({ id: scope.row.id })
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
    popOperatesList = this.$filterPermission(popOperatesList)
    const popOperates = {
      label: '操作',
      width: '240',
      dataSource: popOperatesList

    }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getGroupPage({
          pageSize: this.pagination.pageSize || 20,
          page: val
        })
      },
      sizeChange: (val) => {
        // console.log('size', val)
        this.getGroupPage({
          page: this.pagination.page || 1,
          pageSize: val
        })
      }
    }
    // 弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      size: '540px',
      okText: '保存',
      ok: (params) => {
        // console.log('params', params)
        this.addOrModifyGroup(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
        // this.cancelPop(params)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
        // this.cancelPop(params)
      },
      formDatas: {},
      formOptions: {
        // labelWidth: '140px'
      },
      content: ownDepartment
      // component: PopDialog
    }
    return {
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        category: '',
        component: '',
        enabled: ''
      },
      searchData,
      columns,
      numId: 1,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      ownDepartment,
      searchFormDatas: {},
      type: 'add',
      dataFormList: [],
      codeData: [],
      rowInfoMessages: {},
      dataList: {}, // 编辑详情数据
      oldForm: {}, // 旧详情数据
      ids: []
    }
  },
  computed: {

  },
  created() {
    this.getGroupPage()
    // this.getdown()
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },

    // 修改按钮
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 新增角色
    addRange() {
      this.type = 'add'
      this.oldForm = this.ownDepartment.formDatas || {}
      this.$set(this.ownDepartment[1], 'disabled', false)
      this.PopDialogHandle('新增HS Code')
      this.$set(this.popOptions, 'content', this.ownDepartment)
      this.$set(this.popOptions, 'formDatas', {})
    },

    // 获取数据
    async getGroupPage(data = {}) {
      const res = await sysDataGroupIndex({ ...this.searchFormDatas, ...data })
      if (res.data && res.data.list) {
        res.data.list &&
          res.data.list.map((item, index) => {
            item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index)
            item.statu = item.status.describe
            item.category = (item.categoryId === 'CH' ? '抓毛或毛巾布' : item.categoryId === 'IN' ? '辅料' : item.categoryId === 'SP' ? '氨纶≥5%' : item.categoryId === 'DF' ? '不抓毛且氨纶<5%' : '')
            item.component = (item.componentId === 'CO' ? '棉>涤纶' : item.componentId === 'PO' ? '棉<=涤纶' : item.componentId === 'SO' ? '人造纤维>=棉或者涤纶' : '')
            item.knit = (item.dyeMethod === 'BL' ? '漂白或半漂或未漂白' : item.dyeMethod === 'DY' ? '染色' : item.dyeMethod === 'DK' ? '色织' : item.dyeMethod === 'PR' ? '印花' : '')
            // item.knit = item.knitDye.name
            item.printing = (item.isPrinting === 'Y' ? '是' : item.isPrinting === 'N' ? '否' : '')
          })
        const dataList = res.data.list || []
        this.dataSource = dataList
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data ? res.data.total : 0,
          ...data,
          currentPage: res.data.page,
          pageSize: res.data.pageSize,
          page: res.data.page
        }
      }
    },

    // 启用/禁用
    async EnableStatus(data = {}, scope) {
      const res = await sysDataGroupEnable(data)
      if (res.code === 200) {
        this.$message({
          message: res.message ? res.message : '更新状态成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message ? res.message : '更新状态失败',
          type: 'error'
        })
      }
    },
    // 新增或者编辑
    addOrModifyGroup(params) {
      // params.knitDyeId = Array.isArray(params.knitDyeId) && params.knitDyeId.join(',') || ''
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = ['hsCode', 'categoryId', 'componentId', 'dyeMethod', 'isPrinting', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addGroup(obj)
      } else if (this.type === 'edit') {
        const obj = {}
        const pamraskey = ['id', 'hsCode', 'categoryId', 'componentId', 'dyeMethod', 'isPrinting', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.editGroup(obj)
      }
    },
    // 新增保存
    async addGroup(data = {}) {
      const res = await sysDataGroupAdd(data)
      if (res.code !== 200) {
        return false
      }

      this.$set(this.popOptions, 'visible', false)
      this.$message.success('添加成功')
      this.getGroupPage()
    },
    // 编辑保存
    async editGroup(data = {}) {
      const res = await sysDataGroupModify(data)
      if (res.code !== 200) {
        return false
      }

      this.$set(this.popOptions, 'visible', false)
      this.$message.success('编辑成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 删除
    async deleteGroup(data = {}) {
      const res = await sysDataGroupDelete(data)
      if (res.code !== 200) {
        return false
      }

      this.$message.success('删除成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 审核
    async examGroup(data = {}) {
      const res = await sysDataGroupExam(data)
      if (res.code !== 200) {
        return false
      }

      this.$message.success('审核成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },

    // 织染方式是否禁用
    // isDisable(dataList) {
    //   if (dataList) {
    //     // console.log(dataList,"dataList");

    //     let TEMP_ID = (dataList.knitDye.id || []).split('/')
    //     const TEMP_NAME = (dataList.knitDye.name || []).split('/')

    //     let LEN = TEMP_ID.length
    //     const disabledName = []

    //     TEMP_ID = Array.isArray(TEMP_ID) &&
    //     TEMP_ID.map((i) => {
    //       return parseInt(i)
    //     })

    //     for (let i = 0; i < LEN; i++) {
    //       if (this.codeData.findIndex(item => item.id === TEMP_ID[i]) === -1) {
    //         TEMP_ID.splice(i, 1)
    //         disabledName.push(TEMP_NAME[i])
    //         i--
    //         // 记得重新计算length, 不然会导致死循环
    //         LEN = TEMP_ID.length
    //       }
    //     }

    //     dataList.knitDyeId = TEMP_ID

    //     return disabledName
    //   }
    // },

    // 根据id获取详情
    async getGroupInfo(data = {}, scope) {
      const res = await sysDataGroupInfo(data)
      if (res.code !== 200) {
        return false
      }
      this.dataList = res.data || {}

      // const DISABLED_RESULT = this.isDisable(this.dataList)
      // if (DISABLED_RESULT && DISABLED_RESULT.length) {
      //   this.$message({
      //     title: '警告',
      //     message: `织染方式引用的[${DISABLED_RESULT.join('/')}]被禁用，请重新选择织染方式`,
      //     type: 'warning',
      //     duration: 2000,
      //     customClass: 'knitWarn'
      //   })
      // }

      this.dataList.code = scope.row.code
      this.oldForm = this.dataList
      // console.log(this.dataList,"111");
      // this.dataList.knitDyeId = this.dataList.knitDye && this.dataList.knitDye.id.split('/') || []
      // this.dataList.knitDyeId = Array.isArray(this.dataList.knitDyeId) &&
      // this.dataList.knitDyeId.map((i) => {
      //   return parseInt(i)
      // })
      this.setFormDatas({ ...this.dataList })
    },

    // 染整方法下拉数据
    // async getdown() {
    //   const res = await sysSelectHscode({})
    //   if (res.code !== 200) {
    //     return false
    //   }
    //   this.codeData = res.data
    //   this.codeData.forEach((item, index) => {
    //     item.label = item.name
    //     item.value = item.id
    //     item.disabled = item.enabled !== 'Y'
    //   })
    //   this.codeData = filterOptions(this.ids, this.codeData, this.type)
    //   this.$set(this.ownDepartment[4], 'dataSource', this.codeData)
    // },

    // 弹框取消数据比较回调
    CompaCallback(hadInput) {
      if (hadInput) {
        this.$confirm('您已经输入内容，确认退出吗？', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(_ => {
            this.$set(this.popOptions, 'visible', false)
          })
          .catch(_ => {
            this.$set(this.popOptions, 'visible', true)
          })
      } else {
        this.$set(this.popOptions, 'visible', false)
      }
    }

  }
}
</script>

<style lang='scss'>
.hscode {
  padding: 20px;
  padding-bottom: 0;

  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}

</style>

