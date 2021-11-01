<!--
 * @Date: 2021-07-01 10:36:15
 * @Author: Againss
 * @LastEditTime: 2021-07-13 20:27:42
 * @LastEditors: Againss
 * @Descripttion: 面料成份弹窗 单选加文字
-->
<template>
  <div>
    <ul class="ul-item">
      <li class="li-item title">
        <div class="item1">选项</div>
        <div class="item">成分分类</div>
        <div class="item">单一成分</div>
      </li>
      <li v-for="(item,index) in data" :key="index" class="li-item">
        <div class="item1">选项{{ index+1 }}</div>
        <el-radio-group v-model="item.type" @change="handleChange">
          <el-radio class="item" :label="2" :title="item.name">{{ item.name }}</el-radio>
          <el-radio class="item" :label="1" :title="getEleInfo(item)">{{ getEleInfo(item) }}</el-radio>
        </el-radio-group>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      data: []
    }
  },
  watch: {
    'formDatas.data': function(val) {
      this.data = val.length && this.$utils.deepClone(val) || []
    }
  },
  mounted() {
    this.data = this.formDatas.data && this.$utils.deepClone(this.formDatas.data) || []
  },
  methods: {
    handleChange(val) {
      this.componentsOptions && this.componentsOptions.change(this.data)
    },
    getEleInfo(item) {
      return item.ingredients && item.ingredients.reduce((str, cru) => {
        str += `${str ? ',' : ''}${cru.name}`
        return str
      }, '') || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.ul-item {
  width: 100%;
  padding: 0;
}
.li-item {
   width: 100%;
  border-bottom: 1px solid #e6ebf5;
  height: 50px;
  line-height: 50px;
  display: flex;
  .el-radio-group {
    width: 70%;
    .item {
      width: 50%;
    }
  }
  .item {
    width: 35%;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 0;
  }
  .item1 {
    width:20%;
  }
}
.title {
  font-weight: 700;
  color: #151222;
}
</style>
