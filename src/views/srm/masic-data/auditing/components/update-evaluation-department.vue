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
          trigger: ['blur', 'change']
        }
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
          trigger: ['blur', 'change']
        }
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
    <template v-if="formDatas.dataList.length > 0">
      <el-form-item
        v-for="(item, index) in formDatas.dataList"
        :key="item.key"
        :prop="'dataList.' + index + '.departmentId'"
        :rules="[
          {
            ...commonBlurReg,
            message: '请选择部门！',
            trigger: ['blur', 'change']
          }
        ]"
        label="评估部门"
        label-width="100px"
      >
        <el-col :span="10">
          <el-cascader
            :value="getDepartmentValue(index)"
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
            :prop="'dataList.' + index + '.user'"
            :rules="[
              {
                ...commonBlurReg,
                message: '请选择人员！',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-select
              :value="departmentUserName(index)"
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
          <el-button
            v-if="index == 0"
            @click="addDepartmentItem()"
          >添加</el-button>
          <el-button v-else @click="removeDepartment(item)">删除</el-button>
        </el-col>
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item
        label="评估部门"
        prop="departmentId"
        :rules="[
          {
            validator: evaluationRulls,
            message: '请选择部门！',
            required: true,
            trigger: ['blur', 'change']
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
            prop="user"
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
              @click.native="dropdownUserList(item.departmentId)"
              @change="defaultPeopleChange"
            >
              <template v-if="formDatas.departmentId && sysUserList.length > 0">
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
        </el-col>
      </el-form-item>
    </template>
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
  created() {
    this.pageLoad()
  },
  methods: {
    async pageLoad() {
      this.getSupplierTypeList({
        supplierCategory: this.formDatas.supplierCategory
      }).then((data) => {
        if (data && data.length > 0) {
          this.supplierTypeList = data
        }
      })
      await this.getSysOrgList()
      // 如果之前选的部门没有了 就清空部门值
      this.setFormDatasSysOrg(this.formDatas.dataList, res => {
        this.setFormDatas({ 'dataList': res })
      })
    },
    addDepartmentItem() {
      if (!this.formDatas.hasOwnProperty('dataList')) {
        this.$set(this.formDatas, 'addDepartment', [])
      }
      this.formDatas.dataList.push({ key: Date.now(), departmentId: '', user: '' })
    },
    removeDepartment(item) {
      if (!item) return
      const index = this.formDatas.dataList.indexOf(item);
      (index !== -1) && this.formDatas.dataList.splice(index, 1)
    },
    getDepartmentValue(index) {
      const dataList = this.formDatas.dataList
      if (dataList && dataList.length > 0) {
        return dataList[index].departmentId
      }
    },
    departmentUserName(index) {
      const dataList = this.formDatas.dataList
      if (dataList && dataList.length > 0) {
        return dataList[index].user && dataList[index].user.label || ''
      }
    },
    addPeopleValue(index) {
      const dataList = this.formDatas.dataList
      if (dataList && dataList.length > 0) {
        return dataList[index].user
      }
    },
    supplierCategoryChange(value) {
      this.getSupplierTypeList({ supplierCategory: value }).then(data => {
        if (data && data.length > 0) {
          this.setFormDatas({ supplierCategory: value, supplierType: '' })
          this.supplierTypeList = data
        }
      })
    },
    supplierTypeChange(value) {
      this.setFormDatas({ supplierType: value })
    },
    defaultDepartmentChange(value) {
      this.getSysUserList({ orglds: value }).then(data => {
        this.sysOrgId = value
        this.$set(this.formDatas, 'departmentId', value)
        this.sysUserList = data.map(e => ({
          label: e.realName,
          value: e.userId
        }))
      })
    },
    defaultPeopleChange(value) {
      this.$set(this.formDatas, 'user', value)
    },
    dropdownUserList(ids) {
      if (!ids) return
      this.getSysUserList({ orglds: ids }).then(data => {
        this.sysOrgId = ids
        this.sysUserList = data.map(e => ({
          label: e.realName,
          value: e.userId
        }))
      })
    },
    departmentChange(id, index) {
      const dataList = this.formDatas.dataList
      if (dataList && dataList.length > 0) {
        dataList[index].user = ''
        dataList[index].userName = ''
        dataList[index].departmentId = id
        this.getSysUserList({ orglds: id }).then(data => {
          this.sysOrgId = id
          this.sysUserList = data.map(e => ({
            label: e.realName,
            value: e.userId
          }))
        })
      }
    },
    convertArray() {
      const newArr = []
      if (this.sysOrgList.length > 0) {
        for (let i = 0; i < this.sysOrgList.length; i++) {
          const item = this.sysOrgList[i]
          newArr.push(item)
          if (item.child && item.child.length > 0) {
            this.convertArray(item.child)
          }
        }
      }
      return newArr
    },
    peopleChange(id, index) {
      const dataList = { ...this.formDatas }
      // const entity = this.sysUserList.find(it => it.userId === id.value)
      // if (entity && dataList && dataList.length) {
      // dataList[index].userName = entity.realName
      dataList.dataList[index].user = id
      this.setFormDatas({ 'dataList': dataList.dataList })
      // }
      // this.$set(this, 'formDatas', dataList)
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
