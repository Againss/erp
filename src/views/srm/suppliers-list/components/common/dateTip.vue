<template>
  <div class="dateTip">
    <el-form-item label="有效日期" :rules="rule">
      <el-col :span="12">
        <el-form-item prop="start" :rules="rule1">
          <el-date-picker
            v-model="start"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="startChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="end" label-width="10px" :rules="rule2">
          <el-date-picker
            v-model="end"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            @change="endChange"
          />
        </el-form-item>
      </el-col>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    componentsOptions: {
      type: Object
    }
  },
  data() {
    const validatorDate = (rule, value, callback) => {
      if (!this.start && !this.end) {
        callback(new Error('请选择有效日期！'))
      }
      callback()
    }
    const validatorDate1 = (rule, value, callback) => {
      if (!this.start) {
        callback(new Error('请选择开始日期！'))
      }
      callback()
    }
    const validatorDate2 = (rule, value, callback) => {
      if (!this.end) {
        callback(new Error('请选择结束日期！'))
      }
      callback()
    }
    const rule = [{ required: true, trigger: ['change', 'blur'], validator: validatorDate }]
    const rule1 = [{ required: true, trigger: ['change', 'blur'], validator: validatorDate1 }]
    const rule2 = [{ required: true, trigger: ['change', 'blur'], validator: validatorDate2 }]
    return {
      rule,
      rule1,
      rule2,
      start: '',
      end: '',
      pickerOptions: {
        disabledDate: (time) => {
          if (!this.start) return true
          else {
            return time.getTime() < new Date(this.start + ' 00:00:00')
          }
        },
        shortcuts: [{
          text: '长期有效',
          onClick(picker) {
            picker.$emit('pick', '2999-12-31')
          }
        }]
      }
    }
  },
  computed: {
    disabled() {
      return !this.start
    }
  },
  watch: {
    'componentsOptions.defaultDate': {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.length) {
          this.start = val[0]
          this.end = val[1]
        } else {
          this.start = ''
          this.end = ''
        }
      }
    }
  },
  methods: {
    startChange(val) {
      if (new Date(this.start + ' 00:00:00') > new Date(this.end + ' 00:00:00')) { this.end = '' }
      if (val && this.end) {
        this.componentsOptions.change([val, this.end])
      }
    },
    endChange(val) {
      if (val && this.start) {
        this.componentsOptions.change([this.start, val])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dateTip{
  /deep/ .el-date-editor {
    width: 100%;
  }
}
</style>
