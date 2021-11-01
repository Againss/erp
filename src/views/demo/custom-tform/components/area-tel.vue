/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form-item :rules="[ruleRequire]" prop="areaNum" label="手机">
          <el-select :value="areaNumValue" @change="areaNumChange">
            <el-option v-for="item in dataSource" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="1">
        <div class="solidStyle">-</div>
      </el-col>
      <el-col :span="11">
        <el-form-item :rules="[ruleRequire]" prop="tel" label="" label-width="0">
          <el-input :value="telValue" @input="telChange" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    }
  },
  data() {
    const ruleRequire = this.$getRules({})
    return {
      ruleRequire,
      dataSource: [{ label: '+86', value: 86 }, { label: '+85', value: 85 }]
    }
  },
  computed: {
    telValue() {
      return this.formDatas.tel
    },
    areaNumValue() {
      return this.formDatas.areaNum
    }
  },
  mounted() {
  },
  methods: {
    areaNumChange(value) {
      this.setFormDatas({ areaNum: value })
    },
    telChange(value) {
      this.setFormDatas({ tel: value })
    }
  }
}
</script>

<style lang="scss" scoped>
    .solidStyle{
        display: flex;justify-content: center;align-items: center; height: 100%;padding-top: 7px
    }
</style>
