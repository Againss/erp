<template>
  <el-row>
    <template>
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
        <el-col :span="12">
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
            style="width: 210px"
            placeholder="请选择"
            @change="departmentChange"
          />
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="reviewer"
            :rules="[
              {
                validator: evaluationRulls,
                message: '请选择人员！',
                trigger: ['blur']
              }
            ]"
          >
            <el-select
              :value="peopleValue"
              placeholder="请选择"
              style="width: 210px"
              @click.native="departmentChange(formDatas.reviewDepartmentId)"
              @change="peopleChange"
            >
              <template v-if="sysUserList.length > 0">
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
      /* 部门列表 */
      sysOrgList: [],
      /* 用户列表 */
      sysUserList: [],
      /* 当前选中的部门id */
      sysOrgId: '',
      commonBlurReg,
      evaluationRulls,
      departmentList: [],
      peopleList: []
    }
  },
  computed: {
    departmentValue() {
      return this.formDatas.reviewDepartmentId
    },
    peopleValue() {
      return this.formDatas.reviewer && this.formDatas.reviewer.label || ''
    }
  },
  async created() {
    await this.getSysOrgList()
    // 如果之前选的部门没有了 就清空部门值
    this.setFormDatasSysOrg(this.formDatas.reviewDepartmentId, res => {
      this.setFormDatas({ 'reviewDepartmentId': res })
    })
  },
  methods: {
    async departmentChange(value) {
      const data = await this.getSysUserList({ orglds: value })
      this.$set(this.formDatas, 'reviewDepartmentId', value)
      this.$set(this.formDatas, 'reviewer', '')
      this.sysUserList = data.map(e => ({
        label: e.realName,
        value: e.userId
      }))
    },
    peopleChange(value) {
      // if (this.sysUserList.length > 0) {
      //   const entity = this.sysUserList.find(it => (it.userId === value))
      //   if (entity && entity.hasOwnProperty('realName')) {
      //     this.$set(this.formDatas, 'reviewer', value)
      //     this.$set(this.formDatas, 'reviewerName', entity.realName)
      this.$set(this.formDatas, 'reviewer', value)
      //   }
      // }
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
