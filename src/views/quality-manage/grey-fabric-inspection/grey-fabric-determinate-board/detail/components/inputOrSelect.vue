<template>
  <div class="inputOrSelect">
    <div v-if="scope.$index === 0 && componentsOptions.type() === 'select'" class="select">
      <el-select v-model="scope.row.reviewResult" placeholder="请选择" @change="selectChange">
        <el-option
          v-for="item in arrayData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-else-if="scope.$index === 0 && componentsOptions.type() === 'input'" class="input">
      <el-input v-model="scope.row.reviewComments" maxlength="200" placeholder="请输入内容" />
    </div>
    <div v-else class="text">{{ value }}</div>
  </div>
</template>

<script>
export default {
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      value: '',
      arrayData: [
        { label: '通过', value: 1 },
        { label: '不通过', value: 2 },
        { label: '递交工艺员', value: 3 }
      ]
    }
  },
  created() {
    console.log(this.scope, this.componentsOptions)
  },
  methods: {
    selectChange() {}
  }
}
</script>

<style lang="scss">
  .inputOrSelect {
    .el-select, .input {
      width: 100%;
    }
  }
</style>
