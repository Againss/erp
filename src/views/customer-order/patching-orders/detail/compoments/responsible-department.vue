<!--
 * @Date: 2021-06-29 16:55:14
 * @Author: Againss
 * @LastEditTime: 2021-07-27 17:57:26
 * @LastEditors: OBKoro1
 * @Descripttion: 补布单 - 责任部门
-->
<template>
  <el-form-item
    :style="options.itemStyle"
    :label="options.label"
    :rules="options.rules"
  >
    <el-input v-if="options.itemT()==='input'" :value="getValue" :class="options.className" placeholder="请选择责任部门" @focus="focesHandler" />
    <div v-else :title="getValue">{{ getValue }}</div>
    <el-drawer
      title="责任部门"
      :visible.sync="drawer"
      direction="rtl"
      @close="closeHandler"
    >
      <div class="drawerBody ">
        <div class="customScrollbar ">
          <div class="department-table ">
            <cs-custom-form
              ref="fabricCompositionData"
              class="department-form"
              :data-source="departmentData"
              :options="{ popError: true}"
            />
            <div class="add-btn" @click="addDepartmentData"><i class="el-icon-circle-plus-outline" /> 新增</div>
          </div>
        </div>

      </div>

      <div class="footer">
        <div class="dialog-footer">
          <el-button class="btn" type="primary" @click="okHandler">确 定</el-button>
          <el-button class="btn" @click="closeHandler">取 消</el-button>
        </div>
      </div>
    </el-drawer>

  </el-form-item>

</template>

<script>
import { optionConfigSelect } from '@/views/customer-order/public/api/index'
export default {
  props: {
    options: {
      type: Object
    },
    value: {
      type: [Object, Array]
    },
    formDatas: {
      type: [Object, Array]
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      const res = /^([1-9]\d*)?$/g
      if (!res.test(value)) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    const columns = {
      _department: {
        prop: 'department',
        label: '责任部门',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        showOverflowTooltip: true,
        editOptions: {
          itemType: 'select',
          valueType: 'object',
          labelWidth: '0',
          rules: [
            { required: true, message: '责任部门不能为空', trigger: ['change'] }
          ],
          dataSource: [],
          filterable: true,
          size: 'small',
          change: (value, form, formDatas, setFormDatas, scope) => {
            this.departmentData._tableForm.dataSource[scope.$index].department = value
            // this.componentsOptions && this.componentsOptions.syncMoudleDataHandle('baseInfoData', { responsibiltyDepartment: formDatas.tableForm || [] })
          }
        },
        formater: (scope) => {
          return scope.row.department && scope.row.department.label || ''
        }
      },
      _ratio: {
        prop: 'ratio',
        label: '责任占比',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        showOverflowTooltip: true,
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          rules: [
            { required: true, message: '责任占比不能为空', trigger: ['change'] },
            { validator: validatePass, trigger: 'change' }
          ],
          maxlength: 50,
          size: 'small',
          change: (value, form, formDatas, setFormDatas, scope) => {
            this.departmentData._tableForm.dataSource[scope.$index].ratio = value
            // this.componentsOptions && this.componentsOptions.syncMoudleDataHandle('baseInfoData', { responsibiltyDepartment: formDatas.tableForm || [] })
          }
        }
      }
    }
    const operates = {
      label: '操作',
      width: '100',
      dataSource: [
        {
          label: '删除',
          isShow: true,
          style: { 'color': '#FE4949' },
          handle: (params) => {
            this.$confirm(' 你确认要删除该数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.departmentData._tableForm.dataSource.splice(params.$index, 1)
            })
          }
        }
      ]
    }
    const departmentData = {
      _tableForm: {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns,
        operates,
        border: true,
        size: 'mini',
        headerCellStyle: {
          background: '#F5F7FA!important'
        }
      }
    }
    return {
      departmentData,
      departmentDataSelect: [],
      drawer: false
    }
  },
  computed: {
    getValue() {
      return this.formDatas.responsibiltyDepartment && this.formDatas.responsibiltyDepartment.reduce((str, item) => {
        if (item.department) {
          str += `${str ? ';' : ''}${item.department.label} ${item.ratio}%`
        }
        return str
      }, '') || ''
    }
  },
  watch: {
  },
  mounted() {
    this.getDepartmentData()
  },
  methods: {
    focesHandler() {
      event.target.blur()
      this.drawer = true
      const tempData = this.formDatas.responsibiltyDepartment && this.$utils.deepClone(this.formDatas.responsibiltyDepartment) || []
      this.departmentData._tableForm.dataSource = tempData.map(item => {
        item.edit = true
        return item
      }) || []
    },
    closeHandler() {
      const tempData = this.formDatas.responsibiltyDepartment && this.$utils.deepClone(this.formDatas.responsibiltyDepartment) || []
      this.departmentData._tableForm.dataSource = tempData.map(item => {
        item.edit = true
        return item
      }) || []
      this.drawer = false
    },
    okHandler() {
      this.$refs.fabricCompositionData.form.validate((valid) => {
        if (valid) {
          const data = this.departmentData._tableForm.dataSource.map(item => item.department && item.department.value)
          if (new Set(data).size !== data.length) {
            this.$message({ type: 'warning', message: '不可选择重复的部门' })
            return
          }
          if (this.departmentData._tableForm.dataSource.reduce((str, item) => {
            str -= item.ratio
            return str
          }, 100) !== 0) {
            this.$message({ type: 'warning', message: '责任占比之和必须为100' })
            return
          }
          const tempData = this.departmentData._tableForm.dataSource && this.$utils.deepClone(this.departmentData._tableForm.dataSource) || []
          this.componentsOptions && this.componentsOptions.syncMoudleDataHandle('baseInfoData', { ...this.formDatas, responsibiltyDepartment: tempData })
          this.componentsOptions && this.componentsOptions.setParentDataHandle('baseInfoData', { ...this.formDatas, responsibiltyDepartment: tempData })
          this.drawer = false
        }
      })
    },
    async addDepartmentData() {
      this.departmentData._tableForm.dataSource.push({
        department: null,
        ratio: '',
        edit: true
      })
    },
    async getDepartmentData() {
      const res = await optionConfigSelect({ fieldName: '责任部门' })
      let data = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          data = list.map(item => ({ value: item.fieldValueId + '', label: item.fieldValue }))
        }
      }
      this.departmentData._tableForm.columns._department.editOptions.dataSource = data
    }
  }

}
</script>

<style lang="scss" scoped>
.drawerBody{  flex-direction: column; flex: 1; height: calc(100vh)}
.customScrollbar  {
  height: calc(100% - 150px);
  overflow-y: auto;
}
.department-table {
  margin:0 20px;
  width: 91%;

  .department-form {
    margin: 0!important;
  }
  /deep/.el-form-item--mini.el-form-item {
    margin-bottom: 0;
  }
  /deep/.el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-form-item__content {
    width: 100%;
  }
}

.add-btn {
  width: 100%;
  border:1px solid #e6ebf5;
  border-top: 0;
  color: #0986FF;
  text-align: center;
  line-height: 40px;
  height: 40px;
  cursor: pointer;
}
.footer {
  position:absolute;
  height: 60px;
  bottom: 0;
  line-height: 60px;
  width: 100%;
  background: #fff;
  z-index: 99;
  border-top: 1px solid #e6ebf5;
  .dialog-footer{
    text-align: center;
}
.dialog-footer .btn{ min-width: 90px}
}

</style>
