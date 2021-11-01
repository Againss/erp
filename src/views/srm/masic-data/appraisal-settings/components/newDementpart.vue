<template>
  <el-row ref="assessForm">
    <el-form-item
      label="考核部门"
      prop="department"
      :rules="[
        {
          validator: evaluationRulls,
          message: '请选择部门！',
          required: true,
          trigger: ['blur', 'change'],
        },
      ]"
      label-width="90px"
    >
      <el-col :span="24">
        <el-cascader
          ref="cascader"
          :value="departmentValue"
          :options="sysOrgList"
          :show-all-levels="false"
          :props="{
            value: 'orgId',
            label: 'name',
            children: 'child',
            emitPath: false,
            checkStrictly: true
          }"
          clearable
          style="width: 350px"
          placeholder="请选择"
          @change="defaultDepartmentChange"
        />
      </el-col>
    </el-form-item>
    <el-form-item
      label="考核人"
      prop="user"
      label-width="90px"
      :rules="[
        {
          validator: evaluationRulls,
          message: '请选择人员！',
          required: true,
          trigger: ['blur', 'change'],
        },
      ]"
    >
      <el-select
        :value="peopleValue"
        placeholder="请选择"
        style="width: 350px"
        multiple
        clearable
        filterable
        max-length="5"
        @click.native="dropdownUserList(departmentValue)"
        @change="defaultPeopleChange"
      >
        <template v-if="formDatas.department">
          <el-option
            v-for="it in sysUserList"
            :key="it.value"
            :label="it.label"
            :value="it"
          /></template>
      </el-select>
    </el-form-item>
  </el-row>
</template>
<script>
import { PublicSrm } from '@/views/srm/masic-data/appraisal-settings/components/index.js'
import { dimensionPage, factoryTap } from '@/views/srm/masic-data/appraisal-settings/api/index.js'
export default {
  mixins: [PublicSrm],
  props: {
    form: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    /* 部门验证 */
    const evaluationRulls = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(rule.message || '此项不能为空！'))
      }
      return callback()
    }
    return {
      dimenList: [],
      factoryTap: '',
      /* 类型列表 */
      supplierTypeList: [],
      /* 部门列表 */
      sysOrgList: [],
      /* 用户列表 */
      sysUserList: [],
      /* 新增部门 */
      addDepartment: [],
      /* 当前选中的部门id */
      sysOrgId: '',
      commonBlurReg,
      evaluationRulls,
      departmentList: [],
      peopleList: [],
      departList: [{ label: '1', value: 1 }] // 获得label和value的表格
    }
  },
  computed: {
    departmentValue() {
      this.getDepart(this.formDatas.department)
      return this.formDatas.department
    },
    peopleValue() {
      return this.formDatas.user
    },
    weigthValue() {
      return this.formDatas.weigthValue
    }
  },
  watch: {
    formDatas: {
      handler(data) {
        if (JSON.stringify(data) === '{}') {
          this.pageLoad()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.pageLoad()
    // 先获取tap页签
    this.getTabData()
    // 编辑时获取部门id
    // this.getDepart()
  },
  methods: {
    // 获取纱属性页签数据
    async getTabData() {
      const res = await factoryTap({ supplierCategory: 1 })
      this.tabData = [...res.data.list || []]
      this.firstActiveName = this.tabData ? (this.tabData[0].typeName || '') : ''
      this.activeName = this.secondTabOption ? (this.secondTabOption[0].label || '') : ''
      this.factoryTap = this.tabData ? this.tabData[0].id : ''
      // 考核维度获取
      this.dimenChange()
    },
    async getDepart(data) {
      if (this.componentsOptions.testId) {
        this.getSysUserList({ orglds: this.componentsOptions.testId }).then(data => {
          this.sysOrgId = this.componentsOptions.testId
          this.sysUserList = data.map(e => ({
            label: e.realName,
            value: e.userId
          }))
        })
      }
    },
    async dimenChange() {
      const res = await dimensionPage({ serviceProviderId: this.factoryTap, status: 1 })
      if (res.code === 200) {
        this.dimenList = (res.data || []).map((item) => {
          return { value: item.serviceProviderId, label: item.dimension }
        })
      }
    },
    pageLoad() {
      // 获取评估部门
      this.getSysOrgList()
      this.$set(this.formDatas, 'addDepartment', [])
      // 只是把部门的提出来
      this.$set(this.formDatas, 'departmentTest', [])
    },
    defaultDepartmentChange(value) {
      const labelLength = this.$refs['cascader'].getCheckedNodes()[0] ? this.$refs['cascader'].getCheckedNodes()[0].pathLabels.length : 0
      this.departmentList = [{
        label: this.$refs['cascader'].getCheckedNodes()[0] ? this.$refs['cascader'].getCheckedNodes()[0].pathLabels[labelLength - 1] : '',
        value: value
      }]
      this.$set(this.formDatas, 'department', value)
      this.$set(this.formDatas, 'user', '')
      this.$set(this.formDatas, 'departmentTest', this.departmentList)
      this.sysOrgId = value
      this.departmentList = [{
        label: this.$refs['cascader'].getCheckedNodes()[0] ? this.$refs['cascader'].getCheckedNodes()[0].pathLabels[labelLength - 1] : '',
        value: value
      }]
    },
    dropdownUserList(id) {
      this.sysUserList = []
      if (id) {
        this.getSysUserList({ orglds: id }).then(data => {
          this.sysOrgId = id
          this.sysUserList = data.map(e => ({
            label: e.realName,
            value: e.userId
          }))
        })
      }
    },
    defaultPeopleChange(value) {
      if (value.length > 5) {
        return false
      }
      if (value.length === 0) {
        this.$set(this.formDatas, 'user', null)
      } else {
        this.$set(this.formDatas, 'user', value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.select-box {
  padding: 10px 0;
}
.select {
  width: 100%;
}
</style>
