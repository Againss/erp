<template>
  <el-row>
    <el-form-item
      label="供应商类别"
      prop="supplierCategory"
      label-width="100px"
      :rules="[
        {
          ...commonBlurReg,
          message: '请选择供应商类别！',
          trigger: ['change'],
        },
      ]"
    >
      <el-select
        :value="supplierCategoryValue"
        placeholder="请选择"
        class="select"
        @change="supplierCategoryChange"
      >
        <el-option
          v-for="item in supplierStateList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="供应商类型"
      prop="supplierType"
      label-width="100px"
      :rules="[
        {
          ...commonBlurReg,
          message: '请选择供应商类型！',
          trigger: ['change'],
        },
      ]"
    >
      <el-select
        :value="supplierTypeValue"
        placeholder="请选择"
        class="select"
        @change="supplierTypeChange"
      >
        <el-option
          v-for="item in supplierTypeList"
          :key="item.id"
          :label="item.typeName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="评估部门"
      prop="departmentId"
      :rules="[
        {
          validator: evaluationRulls,
          message: '请选择部门！',
          required: true,
          trigger: ['blur', 'change'],
        },
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
        <!--<el-select
          :value="departmentValue"
          placeholder="请选择"
          style="width: 176px"
          @change="defaultDepartmentChange"
        >
          <el-option
            v-for="it in departmentList"
            :key="it.value"
            :label="it.label"
            :value="it.value"
          />
        </el-select> -->
      </el-col>
      <el-col :span="10">
        <el-form-item
          prop="user"
          :rules="[
            {
              validator: evaluationRulls,
              message: '请选择人员！',
              trigger: ['blur', 'change'],
            },
          ]"
        >
          <!--  <el-cascader
            :value="peopleValue"
            :options="sysUserList"
            :show-all-levels="false"
            :props="{ value: 'userId', label: 'realName', children: 'child' }"
            style="width: 176px"
            placeholder="请选择"
            @change="defaultPeopleChange"
          ></el-cascader> -->
          <el-select
            :value="peopleValue"
            placeholder="请选择"
            style="width: 172px"
            @click.native="dropdownUserList(departmentValue)"
            @change="defaultPeopleChange"
          >
            <template v-if="formDatas.departmentId">
              <el-option
                v-for="it in sysUserList"
                :key="it.value"
                :label="it.label"
                :value="it"
              /></template>
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
      :prop="'addDepartment.' + index + '.departmentId'"
      :rules="[
        {
          ...commonBlurReg,
          message: '请选择部门！',
          trigger: ['blur', 'change'],
        },
      ]"
      label="评估部门"
      label-width="100px"
    >
      <el-col :span="10">
        <!--  <el-select
          :value="getDynamicDepartmentValue(index)"
          placeholder="请选择"
          style="width: 176px"
          @change="(value) => departmentChange(value, index)"
        >
          <el-option
            v-for="it in departmentList"
            :key="it.value"
            :label="it.label"
            :value="it.value"
          />
        </el-select> -->

        <el-cascader
          :ref="'addDepartment' + index"
          :value="getDynamicDepartmentValue(index)"
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
          :prop="'addDepartment.' + index + '.user'"
          :rules="[
            {
              ...commonBlurReg,
              message: '请选择人员！',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-select
            :value="getDynamicPeopleValue(index)"
            placeholder="请选择"
            style="width: 172px"
            @click.native="dropdownUserList(item.departmentId)"
            @change="(value) => peopleChange(value, index)"
          >
            <template
              v-if="item.departmentId && item.departmentId == sysOrgId && sysUserList.length"
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
      return this.formDatas.departmentId
    },
    peopleValue() {
      return this.formDatas.user
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
    pageLoad() {
      this.getSysOrgList()
      this.$set(this.formDatas, 'addDepartment', [])
    },
    getDynamicDepartmentValue(index) {
      const addDepartment = this.formDatas.addDepartment
      if (addDepartment && addDepartment.length > 0) {
        return addDepartment[index].departmentId
      }
    },
    getDynamicPeopleValue(index) {
      const addDepartment = this.formDatas.addDepartment
      if (addDepartment && addDepartment.length > 0) {
        return addDepartment[index].user
      }
    },
    removeDepartment(item) {
      const addDepartment = this.formDatas.addDepartment
      const index = addDepartment.indexOf(item)
      if (index !== -1) {
        addDepartment.splice(index, 1)
      }
    },
    supplierCategoryChange(value) {
      this.getSupplierTypeList({ supplierCategory: value, status: 1 }).then((data) => {
        this.setFormDatas({ supplierCategory: value, supplierType: '' })
        this.supplierTypeList = data
      })
    },
    supplierTypeChange(value) {
      // this.setFormDatas({ supplierType: value })
      value && this.$set(this.formDatas, 'supplierType', value)
    },
    defaultDepartmentChange(value) {
      this.$set(this.formDatas, 'departmentId', value)
      this.$set(this.formDatas, 'user', '')
      // this.getSysUserList({ orglds: value }).then(data => {
      this.sysOrgId = value
      //   this.sysUserList = data.map(e => ({
      //     label: e.realName,
      //     value: e.userId
      //   }))
      // })
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
      this.$set(this.formDatas, 'user', value)
    },
    addDepartmentItem() {
      if (!this.formDatas.hasOwnProperty('addDepartment')) {
        this.$set(this.formDatas, 'addDepartment', [])
      }
      this.formDatas.addDepartment.push({ key: Date.now(), departmentId: '', user: '' })
    },
    departmentChange(id, index) {
      const data = this.refactorDepartment({ departmentId: id, index })
      if (data && data.length > 0) {
        this.$set(this.formDatas, 'addDepartment', data)
      }
      // this.getSysUserList({ orglds: id }).then(data => {
      this.sysOrgId = id
      //   this.sysUserList = data.map(e => ({
      //     label: e.realName,
      //     value: e.userId
      //   }))
      // })
    },
    forEachDepartment(callback) {
      const addDepartment = this.formDatas.addDepartment
      if (addDepartment && addDepartment.length > 0) {
        addDepartment.forEach((value, key) => (callback && callback(value, key)))
      }
    },
    refactorDepartment(params = {}) {
      const departmentData = []
      this.forEachDepartment((item, index) => {
        if (params.index === index) {
          if (params.hasOwnProperty('departmentId')) {
            item.departmentId = params.departmentId
            item.user = ''
          }
          if (params.hasOwnProperty('user')) {
            item.user = params.user
          }
        }
        departmentData.push(item)
      })
      return departmentData
    },
    peopleChange(id, index) {
      const data = this.refactorDepartment({ user: id, index })
      if (data && data.length > 0) {
        this.$set(this.formDatas, 'addDepartment', data)
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
