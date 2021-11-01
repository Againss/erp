<template>
  <el-row>
    <el-form-item
      label="评估部门"
      prop="reviewDepartmentId"
      :rules="[
        {
          validator: evaluationRulls,
          message: '请选择部门！',
          required: true,
          trigger: ['blur']
        }
      ]"
      label-width="100px"
    >
      <el-col :span="10">
        <el-cascader
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
          style="width: 172px"
          placeholder="请选择"
          @change="defaultDepartmentChange"
        />
      </el-col>
      <el-col :span="10">
        <el-form-item
          prop="reviewer"
          :rules="[
            {
              validator: evaluationRulls,
              message: '请选择人员！',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-select
            :value="peopleValue"
            placeholder="请选择"
            style="width: 172px"
            @click.native="dropdownUserList(departmentValue)"
            @change="defaultPeopleChange"
          >
            <template v-if="formDatas.reviewDepartmentId">
              <el-option
                v-for="it in sysUserList"
                :key="it.value"
                :label="it.label"
                :value="it"
              />
            </template>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-button @click="addDepartmentItem()">添加</el-button>
        <!--     <el-button type="primary" @clic="deleteItem()">删除</el-button> -->
      </el-col>
    </el-form-item>
    <!----动态新增---->
    <el-form-item
      v-for="(item, index) in formDatas.addDepartment"
      :key="item.key"
      :prop="'addDepartment.' + index + '.reviewDepartmentId'"
      :rules="[
        {
          ...commonBlurReg,
          message: '请选择部门！',
          trigger: ['blur']
        }
      ]"
      label="评估部门"
      label-width="100px"
    >
      <el-col :span="10">
        <el-cascader
          :ref="'addDepartment' + index"
          :value="addDepartmentValue(index)"
          :options="sysOrgList"
          :show-all-levels="false"
          :props="{
            value: 'orgId',
            label: 'name',
            children: 'child',
            emitPath: false,
            checkStrictly: true
          }"
          style="width: 172px"
          placeholder="请选择"
          @change="(value) => departmentChange(value, index)"
        />
      </el-col>
      <el-col :span="10">
        <el-form-item
          :prop="'addDepartment.' + index + '.reviewer'"
          :rules="[
            {
              ...commonBlurReg,
              message: '请选择人员！',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-select
            :value="addPeopleValue(index)"
            placeholder="请选择"
            style="width: 172px"
            @click.native="dropdownUserList(item.reviewDepartmentId)"
            @change="(value) => peopleChange(value, index)"
          >
            <template
              v-if="
                item.reviewDepartmentId &&
                  item.reviewDepartmentId == sysOrgId &&
                  sysUserList.length > 0
              "
            >
              <el-option
                v-for="it in sysUserList"
                :key="it.value"
                :label="it.label"
                :value="it"
              />
            </template>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-button @click="removeDepartment(item)">删除</el-button>
      </el-col>
    </el-form-item>
  </el-row>
</template>
<script>
import { PublicSrm } from '@/views/srm/public/index'
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
      /* 类别列表 */
      supplierStateList: [
        {
          value: 0,
          label: '采购'
        },
        {
          value: 1,
          label: '服务'
        }],
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
      peopleList: []
    }
  },
  computed: {
    supplierCategoryValue() {
      return this.formDatas.supplierCategory
    },
    supplierTypeValue() {
      return this.formDatas.supplierType
    },
    departmentValue() {
      return this.formDatas.reviewDepartmentId
    },
    peopleValue() {
      return this.formDatas.reviewer
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
  },
  methods: {
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
    pageLoad() {
      this.$set(this.formDatas, 'addDepartment', [])
      this.getSysOrgList()
    },
    addDepartmentValue(index) {
      const addDepartment = this.formDatas.addDepartment
      if (addDepartment && addDepartment.length > 0) {
        return addDepartment[index].reviewDepartmentId
      }
    },
    addDepartmentName(index) {
      const addDepartment = this.formDatas.addDepartment
      if (addDepartment && addDepartment.length > 0) {
        return addDepartment[index].reviewDepartmentId
      }
    },
    addPeopleValue(index) {
      const addDepartment = this.formDatas.addDepartment
      if (addDepartment && addDepartment.length > 0) {
        return addDepartment[index].reviewer
      }
    },
    removeDepartment(item) {
      const addDepartment = this.formDatas.addDepartment
      if (addDepartment && addDepartment.length > 0) {
        var index = addDepartment.indexOf(item);
        (index !== -1) && addDepartment.splice(index, 1)
      }
    },
    supplierCategoryChange(value) {
      this.getSupplierTypeList({ supplierCategory: value }).then((data) => {
        this.setFormDatas({ supplierCategory: value })
        this.supplierTypeList = data
      })
    },
    supplierTypeChange(value) {
      this.setFormDatas({ supplierType: value })
    },
    defaultDepartmentChange(value) {
      // this.getSysUserList({ orglds: value }).then(data => {
      //   this.sysOrgId = value
      this.$set(this.formDatas, 'reviewDepartmentId', value)
      this.$set(this.formDatas, 'reviewer', '')
      //   this.sysUserList = data.map(e => ({
      //     label: e.realName,
      //     value: e.userId
      //   }))
      // })
      // this.setFormDatas({ department: value })
    },
    defaultPeopleChange(value) {
      this.$set(this.formDatas, 'reviewer', value)
      // this.setFormDatas({ people: value })
    },
    addDepartmentItem() {
      if (!this.formDatas.hasOwnProperty('addDepartment')) {
        this.$set(this.formDatas, 'addDepartment', [])
      }
      this.formDatas.addDepartment.push({ key: Date.now(), reviewDepartmentId: '', reviewer: '' })
    },
    departmentChange(id, index) {
      // this.getSysUserList({ orglds: id }).then((data) => {
      this.sysOrgId = id
      const departmentInfo = this.getDepartmentInfo({ id, index, type: 'department' })
      if (departmentInfo && departmentInfo.length > 0) {
        this.$set(this.formDatas, 'addDepartment', departmentInfo)
      }
      //   this.sysUserList = data.map(e => ({
      //     label: e.realName,
      //     value: e.userId
      //   }))
      // })
    },
    getDepartmentInfo(params = {}) {
      const department = this.formDatas.addDepartment
      if (department && department.length > 0) {
        return department.map((value, key) => {
          if (params.index === key) {
            if (params.type === 'department') {
              value.reviewDepartmentId = params.id
              value.reviewer = ''
            }
            if (params.type === 'people') {
              value.reviewer = params.id
            }
          }
          return value
        })
      }
    },
    peopleChange(id, index) {
      const peopleInfo = this.getDepartmentInfo({ id, index, type: 'people' })
      if (peopleInfo && peopleInfo.length > 0) {
        this.$set(this.formDatas, 'addDepartment', peopleInfo)
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
