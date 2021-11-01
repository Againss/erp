<!--
 * @Descripttion: 选项配置
 * @Author: admin
 * @Date: 2021-03-02 14:37:25
 * @LastEditors: admin
 * @LastEditTime: 2021-03-27 10:51:39
-->
<template>
  <div class="config-list">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
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
  sysOptionConfigList,
  sysOptionConfigInfo,
  sysOptionConfigModify

} from './api/index.js'
import enableSwitch from './components/configEnabled'
import moreShow from './components/moreShow'
import { dataComparision } from '@/views/basic-data/common/index'
export default {
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 查询表单配置信息
    const searchData = {
      _page: {
        prop: 'pageName',
        itemType: 'input',
        label: '页面'
      },
      _name: {
        prop: 'fieldName',
        itemType: 'input',
        label: '字段名'
      },
      _operate: {
        itemType: 'operate',
        submitHandle: params => {
          this.getGroupPage(params)
          this.searchFormDatas = params
        },
        submitText: '查询',
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    // 表格表头信息
    const columns = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '60'
      },
      _page: {
        prop: 'pageName',
        label: '页面',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _name: {
        prop: 'fieldName',
        label: '字段名',
        minWidth: '120',
        showOverflowTooltip: true
      },
      // _fieldValue: {
      //   prop: 'fieldValue',
      //   label: '字段取值',
      //   minWidth: '120',
      //   showOverflowTooltip: true
      // },
      _fieldValue: {
        prop: 'fieldValue',
        label: '字段取值',
        minWidth: '150',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'fieldValue'
        }
      },
      _operator: {
        prop: 'updatedBy',
        label: '操作人',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _operatetime: {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '120',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.updatedTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        },
        showOverflowTooltip: true
      }
    }
    const popOperatesList = [
      {
        label: '编辑',
        // permitTag: ['basic:hsCode:update'],
        isShow: true,
        handle: async scope => {
          this.PopDialogHandle('编辑选项配置')
          this.$set(this.popOptions, 'content', this.ownDepartment)
          await this.getGroupInfo({ optionId: scope.row.optionId }, scope)
          // this.$set(this.popOptions, 'content', this.ownDepartment)
        }
      }
    ]
    // 表格操作信息
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
          pageNum: val
        })
      },
      sizeChange: (val) => {
        // console.log('size', val)
        this.getGroupPage({
          pageNum: this.pagination.page || 1,
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
        console.log('params', params)
        if (!this.checkValue(params.tableForm)) {
          this.$message({
            message: '同一个字段名的字段取值不能重复！',
            type: 'warning'
          })
        } else {
          params.optionFieldValueConfig = params.tableForm
          this.editGroup(params)
        }
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {
        // labelWidth: '140px'
      },
      content: ownDepartment
    }
    // 弹框表格数据
    const popTableData = [
      {
        fieldValue: '',
        status: '',
        edit: false
      }
    ]
    const popTableColumns = [
      {
        prop: 'fieldValue',
        label: '字段取值',
        className: 'ruleTip',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 20,
          rules: [
            {
              required: true,
              message: '字段取值不能为空',
              trigger: ['blur']
            }
          ]
        }
      },
      {
        prop: 'status',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          // permitTag: 'basic:hsCode:enabled',
          changeStatus: (scope, formDatas, setFormDatas, status) => {
            // console.log(scope)
            // console.log(status)
            // console.log(scope, formDatas, setFormDatas, status,  '207')
            const data = [...formDatas.tableForm]
            // console.log(data);
            // console.log(data[scope.$index])
            data[scope.$index].status = status
            this.$set(this.popOptions.formDatas, 'tableForm', data)
          }
        }
      }
    ]
    // 弹出框表格操作信息
    const configPopOperates = [
      {
        label: '增加',
        isShow: true,
        handle: (params, form, formDatas, setformdatas) => {
          const popTableParams = {
            // namevalue: '',
            status: 1,
            enabled: 'Y',
            disabled: false,
            edit: true
          }
          const data = [...formDatas['tableForm']]
          // data.splice(params.$index + 1, 0, popTableParams)
          data.push(popTableParams)
          if (this.popOptions.visible) {
            this.$set(this.popOptions.content[3], 'dataSource', data)
          }
        }
      },
      {
        label: '删除',
        isShow: (scope) => {
          // console.log(scope);
          if (scope.row.disabled === false) {
            return true
          } else {
            return false
          }
        },
        style: { 'color': '#FE4949' },
        handle: (params, form, formDatas, setformdatas) => {
          this.$confirm('确认删除该条字段取值？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              const data = [...formDatas['tableForm']]
              data.splice(params.$index, 1)
              if (this.popOptions.visible) {
                this.$set(this.popOptions.content[3], 'dataSource', data)
              }
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    // 弹出框内容
    const ownDepartment = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'pageName',
        itemType: 'input',
        label: '页面',
        rules: [commonBlurReg],
        disabled: true
      },
      {
        prop: 'fieldName',
        itemType: 'input',
        label: '字段名',
        rules: [commonBlurReg],
        disabled: true
      },
      {
        prop: 'tableForm',
        itemType: 'table-form',
        // label: '表格表单',
        className: 'popTableForm',
        props: { edit: 'edit' },
        border: true,
        // dataSource: popTableData,
        dataSource: [],
        columns: popTableColumns,
        operates: {
          label: '操作',
          dataSource: configPopOperates
        }
      }
    ]

    return {
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {},
      searchData,
      columns,
      dataSource: [],
      popOperates,
      pagination,
      popOptions,
      ownDepartment,
      type: 'edit',
      searchFormDatas: {},
      dataList: {}, // 编辑详情数据
      oldForm: {}, // 旧详情数据
      popTableData,
      popTableColumns
    }
  },
  created() {
    this.getGroupPage()
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 弹框取消数据比较回调
    CompaCallback(hadInput) {
      if (hadInput) {
        // this.$confirm('您已经输入内容，确认退出吗？', '提示', {
        //   type: 'warning',
        //   cancelButtonClass: 'btn-cancel'
        // })
        //   .then(_ => {
        //     this.$set(this.popOptions, 'visible', false)
        //   })
        //   .catch(_ => {
        //     this.$set(this.popOptions, 'visible', true)
        //   })
        this.$set(this.popOptions, 'visible', false)
      } else {
        this.$set(this.popOptions, 'visible', false)
      }
    },
    // 修改按钮
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 启用/禁用
    EnableStatus(scope) {
      console.log(scope)
    },
    // async EnableStatus(data = {}, scope) {
    //   const res = await sysDataGroupEnable(data)
    //   if (res.code === 200) {
    //     this.$message({
    //       message: res.message ? res.message : '更新状态成功',
    //       type: 'success'
    //     })
    //   } else {
    //     this.$message({
    //       message: res.message ? res.message : '更新状态失败',
    //       type: 'error'
    //     })
    //   }
    // },

    // 获取列表数据
    async getGroupPage(data = {}) {
      const res = await sysOptionConfigList({ ...this.searchFormDatas, ...data })
      if (res.data && res.data.list) {
        res.data.list &&
          res.data.list.map((item, index) => {
            // item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index)
            item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1
          })
      }
      const dataList = res.data.list || []
      this.dataSource = dataList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageNum: res.data.pageNum
      }
    },
    // 根据id获取详情
    async getGroupInfo(data = {}, scope) {
      const res = await sysOptionConfigInfo(data)
      if (res.code !== 200) {
        return false
      }
      this.dataList = res.data || {}
      this.popTableData = res.data.optionFieldValueConfig || []
      this.popTableData && this.popTableData.map((item, index) => {
        item.disabled = true
      })
      if (this.popTableData.length === 0) {
        this.popTableData = [
          {
            namevalue: '',
            status: 1,
            enabled: 'Y',
            disabled: false,
            edit: true
          }
        ]
      }
      // this.$set(this.ownDepartment[3], 'dataSource', this.popTableData)
      this.$set(this.popOptions.content[3], 'dataSource', this.popTableData)
      this.dataList.code = scope.row.code

      this.oldForm = this.dataList
      this.setFormDatas({ ...this.dataList })
      // console.log(this.popTableData)
    },

    // 编辑保存
    async editGroup(data = {}) {
      const res = await sysOptionConfigModify(data)
      if (res.code !== 200) {
        return false
      }

      this.$set(this.popOptions, 'visible', false)
      this.$message.success('编辑成功')
      this.getGroupPage()
    },
    // 同一个字段名的字段取值唯一性验证
    checkValue(data) {
      console.log(data)
      const obj = {}
      const flag = data.every(item => {
        const isRepeat = obj[item.fieldValue] ? false : obj[item.fieldValue] = true
        return isRepeat
      })
      return flag

      // return data.length && data.every(item, index => {
      //   console.log(item)
      //   // return item.fieldValue[index] === item.fieldValue[index + 1]
      // })

      // if (!flag) {
      //   this.$message({
      //     message: '同一个字段名的字段取值不能重复！',
      //     type: 'warning'
      //   })
      //   return false
      // } else {
      //   return true
      // }
    }
  }
}
</script>
<style lang='scss'>
.config-list {
  padding: 20px;
  padding-bottom: 0;

  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}

</style>
<style lang='scss'>
.config-list{
  .popTableForm {
    .el-table--medium td {
      padding: 10px 0 0;
    }
    .el-table__body-wrapper .cell {
      padding-bottom: 16px;
    }
    .el-table__header .ruleTip .cell::before {
      display: block;
      content: '*';
      position: absolute;
      left: 4px;
      color: #FE4949;
    }
  }
  .popTableForm th.is-leaf {
    border-bottom: 1px solid #dfe6ec!important;
  }
}
</style>
