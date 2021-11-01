<template>
  <el-row style="width: 50%; margin-right: 0px;">
    <el-col>
      <el-form-item :prop="componentsOptions.prop" :label="componentsOptions.label">
        <span v-if="componentsOptions.notUse || !propValue" class="lineJumpText2">{{ propValue }}</span>
        <span v-else class="lineJumpText" @click="lineJumpClick">{{ propValue }}</span>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    // scope: {
    //     type: Object
    // },
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  computed: {
    propValue() {
      // console.log(this.formDatas, this.componentsOptions)
      return this.formDatas[this.componentsOptions.prop]
    }
  },
  methods: {
    lineJumpClick() {
      // console.log(this.componentsOptions)
      // this.$router.push(this.componentsOptions.url)
    }
  }
}
</script>

<style lang='scss'>
.lineJumpText {
    padding-left: 8px;
    cursor: pointer;
    color: #1890ff,
}
.lineJumpText2 {
    padding-left: 8px;
}
</style>
