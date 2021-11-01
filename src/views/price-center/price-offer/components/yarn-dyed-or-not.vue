<template>
  <div class="yarn-dyed-or-not">
    <el-select v-model="scope.row.isDyeing" placeholder="请选择" @change="componentsOptions.isDyeingChange(scope, formDatas)">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    scope: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    }
  },
  methods: {
    isDyeingChange(value) {
      this.scope.row.isDyeing = value
      console.log(this.scope, value)
    }
  }
}
</script>

<style lang="scss">
.yarn-dyed-or-not {
    .el-select .el-input .el-select__caret {
        line-height: 28px;
    }
    .el-input--medium .el-input__inner {
      height: 28px;
    }
}
</style>
