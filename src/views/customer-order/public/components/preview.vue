<!--
 * @Descripttion:
 * @Author: ll
 * @Date: 2020-01-13
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-04-15 17:14:18
 * 点击条纹间距的放大缩小功能 最大值3倍的放大和缩小
-->
<template>
  <div class="preview">
    <el-popover
      placement="top"
      width="320"
      trigger="click"
    >
      <el-row>
        <el-col>
          <div class="title">条纹间距<el-button class="el-icon-zoom-in" size="mini" @click="bigClick" :disabled="ratio >= 3"></el-button><el-button class="el-icon-zoom-out" size="mini" @click="smallClick" :disabled="ratio <= 1"></el-button></div>
          <div class="color-item" v-for="(item, index) in stripeSpacing" :style="{ height: item.height * ratio + 'cm'}">
            <div class="left">
              <div class="color-bar" :key="index" :style="{ 'background-color': item.colorValue, height: item.height * ratio + 'cm'}"></div>
            </div>
            <div class="right" :style="{ height: item.height * ratio + 'cm'}">
              <div class="color-name" :title="item.colorName">{{ item.colorName + item.height + 'cm' }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <span class="colorName" slot="reference" size="small" @click="colorNameClick">{{ getColorName }}</span>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'Preview',
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
      ratio: 1
    }
  },
  computed: {
    stripeSpacing() {
      return this.scope.row[this.componentsOptions.propName]
    },
    getColorName() {
      let stripeSpacing = ''
      const propName = this.componentsOptions.propName
      const arr = []
      this.scope.row[propName] && this.scope.row[propName].length && this.scope.row[propName].forEach(item => {
        arr.push(item.colorName + item.height + 'cm')
      })
      stripeSpacing = arr.join(',')
      return stripeSpacing || ''
    }
  },
  created() {
    // console.log(this.componentsOptions)
  },
  methods: {
    colorNameClick() {
      this.ratio = 1
    },
    bigClick() {
      if (this.ratio < 3) {
        this.ratio += 1
      }
    },
    smallClick() {
      if (this.ratio > 1) {
        this.ratio -= 1
      }
    }
  }
  
}
</script>

<style lang="scss" scoped>
.preview {
  .colorName {
    color: rgb(24, 144, 255);
    cursor: pointer;
  }
}
.title {
  margin-bottom: 10px;
  .el-button {
    margin-left: 10px;
  }
}
.color-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .color-bar {
    width: 200px;
    display: flex;
  }
  .right{
    overflow: hidden;
    .color-name{
      cursor: pointer;
    }
  }
}
</style>